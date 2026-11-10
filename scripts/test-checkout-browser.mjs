// Run after npm run build. Uses installed Chrome or CHROME_EXECUTABLE_PATH.
// All APIs are intercepted; this test cannot initiate a real payment.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const rewrites = new Map(config.rewrites.filter(rule => !rule.source.includes('(')).map(rule => [rule.source, rule.destination]));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relative = (rewrites.get(pathname) || (pathname === '/' ? '/index.html' : pathname)).slice(1);
  const file = path.resolve(root, relative);
  if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const results = [];
const prices = {
  USD: { country: 'US', name: 'International USD', starter: '$250', business: '$400', amounts: { starter: 250, business: 400 } },
  NGN: { country: 'NG', name: 'Nigeria NGN', starter: '₦200,000', business: '₦300,000', amounts: { starter: 200000, business: 300000 } },
};
const opposite = currency => currency === 'USD' ? 'NGN' : 'USD';
const title = plan => plan === 'starter' ? 'Starter' : 'Business';
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }

async function fixture({ accountCurrency, detectedCurrency = 'NGN', delayAccount = false, delayGeo = false, invalidSession = false, mobile = false, usdProvider = 'paystack', usdAvailable = true, paddleCustomerID = null, paddleSDK = false } = {}) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  const accountGate = deferred(), geoGate = deferred();
  const state = { sessions: 0, geoRequests: 0, payloads: [], errors: [] };
  const profile = {
    id: 'qa-currency', email: 'currency@example.invalid', fullName: 'Currency QA', businessName: 'Test Store',
    country: prices[accountCurrency || 'NGN'].country, currency: accountCurrency,
    billingAddress: { country: prices[accountCurrency || 'NGN'].country },
    orders: [], licenses: [], subscription: { status: 'none' }, trial: { status: 'not_started' }, connectedStore: { status: 'not_connected', url: '' },
  };
  if (accountCurrency) await context.addInitScript(profile => localStorage.setItem('zameria_customer_session_v3', JSON.stringify(profile)), profile);
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname === '/api/pricing') {
      state.geoRequests++;
      if (delayGeo) await geoGate.promise;
      return route.fulfill({ json: { countryCode: prices[detectedCurrency].country, currency: detectedCurrency } });
    }
    if (url.pathname === '/api/account/paddle/customer') return route.fulfill({ status: paddleCustomerID ? 200 : 401, json: paddleCustomerID ? { paddle_customer_id: paddleCustomerID } : { error: 'Sign in' } });
    if (url.pathname.startsWith('/api/account/')) {
      if (url.pathname === '/api/account/session') {
        state.sessions++;
        if (delayAccount) await accountGate.promise;
        return route.fulfill({ status: accountCurrency && !invalidSession ? 200 : 401, json: accountCurrency && !invalidSession ? { account: profile } : { error: 'Not signed in' } });
      }
      return route.fulfill({ json: { licenses: [], orders: [] } });
    }
    if (url.pathname.endsWith('/zameria/checkout/config')) return route.fulfill({ json: { usd_provider: usdProvider, usd_available: usdAvailable, usd_auto_renews: usdProvider === 'paddle' } });
    if (url.pathname.endsWith('/zameria/checkout/paddle')) return route.fulfill({ json: { environment: 'sandbox', client_token: 'test_public_fixture', transaction_id: 'txn_' + 'a'.repeat(26), plan: 'starter' } });
    if (url.pathname.endsWith('/zameria/checkout') && request.method() === 'POST') {
      state.payloads.push(request.postDataJSON());
      return route.fulfill({ status: 503, json: { error: 'QA intercepted checkout. No payment created.' } });
    }
    if (url.origin !== origin) return route.abort();
    return route.continue();
  });
  if (paddleSDK) await context.addInitScript(() => {
    window.PaddleBillingV1 = { Initialized: false, Environment: { set: value => { window.qaPaddleEnvironment = value; } }, Initialize(options) { window.qaPaddleInit = options; this.Initialized = true; }, Update(options) { window.qaPaddleInit = options; }, Checkout: { open(options) { window.qaPaddleOpen = options; } } };
  });
  const page = await context.newPage();
  page.on('pageerror', error => state.errors.push(error.message));
  return { context, page, state, accountGate, geoGate };
}
async function expectCheckout(page, currency, plan) {
  const selection = page.locator('.site-checkout-selection');
  await page.getByRole('heading', { name: 'Checkout', exact: true }).waitFor();
  await page.waitForFunction(({ currencyPrice, planName }) => {
    const selection = document.querySelector('.site-checkout-selection');
    return selection?.textContent.includes(currencyPrice) && selection.querySelector('strong')?.textContent === planName;
  }, { currencyPrice: prices[currency][plan], planName: title(plan) });
  assert(!(await selection.innerText()).includes(currency === 'USD' ? '₦' : '$'), 'Checkout must not mix currencies');
}
async function submitAndCheck(test, currency, plan) {
  await test.page.getByLabel('Business name', { exact: true }).fill('Currency QA');
  await test.page.getByLabel('Email address', { exact: true }).fill('currency@example.invalid');
  await test.page.getByLabel('WooCommerce store URL', { exact: true }).fill('https://currency.example.invalid');
  await test.page.getByRole('button', { name: /Continue to checkout/ }).click();
  await test.page.getByRole('alert').filter({ hasText: 'QA intercepted checkout' }).waitFor();
  const payload = test.state.payloads.at(-1);
  assert.equal(payload.currency, currency);
  assert.equal(payload.plan, plan);
  assert.equal(payload.amount, prices[currency].amounts[plan]);
  assert.equal(payload.country === 'Nigeria', currency === 'NGN');
}
async function run(name, options, check) {
  const test = await fixture(options);
  try {
    await check(test);
    assert.deepEqual(test.state.errors, [], 'Browser must not report uncaught errors');
    results.push({ name, passed: true, paymentRequestsIntercepted: test.state.payloads.length });
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(JSON.stringify({ name, url: test.page.url(), errors: test.state.errors, body: (await test.page.locator('body').innerText()).slice(0, 2500) }, null, 2));
    throw error;
  } finally {
    test.accountGate.resolve(); test.geoGate.resolve();
    await test.context.close();
  }
}
try {
  browser = await chromium.launch({ channel: 'chrome', ...(process.env.CHROME_EXECUTABLE_PATH ? { executablePath: process.env.CHROME_EXECUTABLE_PATH } : {}), headless: true });
  for (const accountCurrency of [undefined, 'NGN', 'USD']) {
    for (const currency of ['USD', 'NGN']) {
      for (const plan of ['starter', 'business']) {
        await run(`${accountCurrency || 'anonymous'} account / ${currency} / ${plan}`, { accountCurrency, detectedCurrency: opposite(currency), mobile: plan === 'business' }, async test => {
          const { page } = test;
          await page.goto(origin, { waitUntil: 'networkidle' });
          await page.getByRole('button', { name: prices[currency].name, exact: true }).click();
          const link = page.getByRole('link', { name: `Choose ${title(plan)}`, exact: true });
          const url = new URL(await link.getAttribute('href'), origin);
          assert.equal(url.searchParams.get('currency'), currency);
          await link.click();
          await expectCheckout(page, currency, plan);
          await submitAndCheck(test, currency, plan);
          await page.getByRole('button', { name: 'Compare plans', exact: true }).click();
          const dialog = page.getByRole('dialog');
          await dialog.waitFor();
          const text = await dialog.innerText();
          assert(text.includes(prices[currency].starter) && text.includes(prices[currency].business));
          const other = plan === 'starter' ? 'business' : 'starter';
          await dialog.getByRole('button', { name: `Choose ${title(other)}`, exact: true }).click();
          await expectCheckout(page, currency, other);
          assert.equal(new URL(page.url()).searchParams.get('currency'), currency);
          await page.reload({ waitUntil: 'networkidle' });
          await expectCheckout(page, currency, other);
          await submitAndCheck(test, currency, other);
          await page.goBack({ waitUntil: 'networkidle' });
          await expectCheckout(page, currency, plan);
        });
      }
    }
  }
  for (const currency of ['USD', 'NGN']) {
    for (const plan of ['starter', 'business']) {
      await run(`currency-only link / ${currency} / ${plan}`, { accountCurrency: opposite(currency), detectedCurrency: opposite(currency) }, async test => {
        await test.page.goto(`${origin}/subscribe?plan=${plan}&currency=${currency}`, { waitUntil: 'networkidle' });
        await expectCheckout(test.page, currency, plan);
        await submitAndCheck(test, currency, plan);
      });
    }
    await run(`account-region fallback / ${currency}`, { accountCurrency: currency, detectedCurrency: opposite(currency) }, async test => {
      await test.page.goto(`${origin}/subscribe?plan=starter`, { waitUntil: 'networkidle' });
      await expectCheckout(test.page, currency, 'starter');
      await submitAndCheck(test, currency, 'starter');
    });
    for (const delayed of ['account', 'geo']) {
      await run(`delayed ${delayed} / ${currency}`, { accountCurrency: opposite(currency), detectedCurrency: opposite(currency), delayAccount: delayed === 'account', delayGeo: delayed === 'geo' }, async test => {
        await test.page.goto(origin, { waitUntil: 'domcontentloaded' });
        await test.page.getByRole('button', { name: prices[currency].name, exact: true }).click();
        await test.page.getByRole('link', { name: 'Choose Starter', exact: true }).click();
        await expectCheckout(test.page, currency, 'starter');
        test.accountGate.resolve(); test.geoGate.resolve();
        await test.page.waitForLoadState('networkidle');
        if (delayed === 'account') assert(test.state.sessions >= 2, 'The account must actually restore before the final assertion');
        await expectCheckout(test.page, currency, 'starter');
        await submitAndCheck(test, currency, 'starter');
      });
    }
  }
  await run('expired session with cached Nigerian profile / USD', { accountCurrency: 'NGN', invalidSession: true }, async test => {
    await test.page.goto(`${origin}/subscribe?plan=business&country=US&currency=USD`, { waitUntil: 'networkidle' });
    await expectCheckout(test.page, 'USD', 'business');
    await submitAndCheck(test, 'USD', 'business');
  });
  await run('Paddle USD annual disclosure and payload', { usdProvider: 'paddle' }, async test => {
    await test.page.goto(`${origin}/subscribe?plan=starter&country=US&currency=USD`, { waitUntil: 'networkidle' });
    assert((await test.page.locator('form').innerText()).includes('Renews automatically every year'));
    await submitAndCheck(test, 'USD', 'starter');
  });
  await run('unapproved Paddle USD blocked while NGN still submits', { usdProvider: 'paddle', usdAvailable: false }, async test => {
    await test.page.goto(`${origin}/subscribe?plan=starter&country=US&currency=USD`, { waitUntil: 'networkidle' });
    assert(await test.page.getByRole('button', { name: /Continue to checkout/ }).isDisabled());
    assert.equal(test.state.payloads.length, 0);
    await test.page.goto(`${origin}/subscribe?plan=starter&country=NG&currency=NGN`, { waitUntil: 'networkidle' });
    await submitAndCheck(test, 'NGN', 'starter');
  });
  for (const paddleCustomerID of [null, 'ctm_' + 'c'.repeat(26)]) {
    await run(`Paddle server transaction and ${paddleCustomerID ? 'owned customer' : 'anonymous checkout'}`, { accountCurrency: 'USD', invalidSession: !paddleCustomerID, paddleSDK: true, paddleCustomerID }, async test => {
      await test.page.goto(`${origin}/paddle-checkout?reference=zmr_${'a'.repeat(48)}`, { waitUntil: 'networkidle' });
      await test.page.waitForFunction(() => !!window.qaPaddleOpen);
      const state = await test.page.evaluate(() => ({ environment: window.qaPaddleEnvironment, customer: window.qaPaddleInit.pwCustomer, transactionID: window.qaPaddleOpen.transactionId, successURL: window.qaPaddleOpen.settings.successUrl }));
      assert.equal(state.environment, 'sandbox'); assert.equal(state.transactionID, 'txn_' + 'a'.repeat(26));
      assert.equal(state.customer?.id, paddleCustomerID || undefined); assert(new URL(state.successURL).pathname === '/payment/complete');
    });
  }
  // The route marker must preserve normal marketing/auth hydration as well as
  // fresh checkout mounts when Vercel rewrites /subscribe to the homepage shell.
  for (const route of ['/', '/login', '/get-started', '/forgot-password', '/terms', '/privacy', '/refunds', '/woocommerce-pos']) {
    await run(`prerender hydration / ${route}`, {}, async test => {
      await test.page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
      await test.page.locator('h1').first().waitFor();
      assert.equal(await test.page.locator('#root').getAttribute('data-prerender-path'), route);
    });
  }
  console.log(JSON.stringify({ passed: results.length, failed: 0, paymentRequestsIntercepted: results.reduce((sum, result) => sum + result.paymentRequestsIntercepted, 0), realPayments: 0 }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
