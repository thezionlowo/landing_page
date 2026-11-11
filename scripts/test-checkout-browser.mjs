// Run after npm run build. Uses installed Chrome or CHROME_EXECUTABLE_PATH.
// All APIs are intercepted; this test cannot initiate a real payment.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
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
  NGN: { country: 'NG', name: 'Nigeria NGN', starter: '₦200,000', business: '₦350,000', amounts: { starter: 200000, business: 350000 } },
};
const opposite = currency => currency === 'USD' ? 'NGN' : 'USD';
const title = plan => plan === 'starter' ? 'Starter' : 'Business';
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }

async function fixture({ accountCurrency, detectedCurrency = 'NGN', delayAccount = false, delayGeo = false, invalidSession = false, mobile = false, receipt, pending = 0, verificationError, staleAccountResponse = false } = {}) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  const accountGate = deferred(), geoGate = deferred(), staleGate = deferred(), staleStarted = deferred();
  const state = { sessions: 0, geoRequests: 0, payloads: [], errors: [], verifications: 0, receiptRequests: 0, addressUpdates: 0, authenticated: !!accountCurrency && !invalidSession };
  const profile = {
    id: 'qa-currency', email: 'currency@example.invalid', fullName: 'Currency QA', businessName: 'Test Store',
    country: prices[accountCurrency || 'NGN'].country, currency: accountCurrency,
    billingAddress: { country: prices[accountCurrency || 'NGN'].country },
    orders: [], licenses: [], subscription: { status: 'none' }, trial: { status: 'not_started' }, connectedStore: { status: 'not_connected', url: '' },
  };
  const syncReceipt = () => {
    if (!state.fulfilled || !receipt || receipt.email !== profile.email) return;
    profile.currency = receipt.currency;
    profile.country = receipt.country;
    profile.licenses = [{ ...receipt, id: receipt.license_id, store_domain: '', requested_domain: receipt.store_domain }];
    profile.billing = [{ reference: receipt.payment_reference, license_id: receipt.license_id, plan: receipt.plan, currency: receipt.currency, amount_minor: Math.round(receipt.amount * 100), paid_at: new Date().toISOString(), invoice_number: 'QA-ANNUAL-RECEIPT' }];
  };
  if (accountCurrency) await context.addInitScript(profile => localStorage.setItem('zameria_customer_session_v3', JSON.stringify(profile)), profile);
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname === '/api/pricing') {
      state.geoRequests++;
      if (delayGeo) await geoGate.promise;
      return route.fulfill({ json: { countryCode: prices[detectedCurrency].country, currency: detectedCurrency } });
    }
    if (url.pathname.endsWith('/zameria/checkout/verify')) {
      state.verifications++;
      if (verificationError) return route.fulfill({ status: verificationError, json: { error: 'Payment not completed. Contact support before paying again.' } });
      if (state.verifications <= pending) return route.fulfill({ status: 409, json: { error: 'Payment pending' } });
      if (staleAccountResponse) await staleStarted.promise;
      state.fulfilled = true; syncReceipt();
      return route.fulfill({ json: receipt });
    }
    if (url.pathname.startsWith('/api/account/')) {
      if (url.pathname === '/api/account/receipt') {
        state.receiptRequests++;
        assert.equal(url.searchParams.get('reference'), receipt.payment_reference);
        return route.fulfill({ contentType: 'application/pdf', body: '%PDF-1.4\n% Isolated regression receipt fixture\n%%EOF' });
      }
      if (url.pathname === '/api/account/profile') {
        state.addressUpdates++;
        profile.billing_address = request.postDataJSON().billingAddress;
        return route.fulfill({ json: { account: profile } });
      }

      if (url.pathname === '/api/account/login' || url.pathname === '/api/account/register') {
        state.authenticated = true;
        profile.email = request.postDataJSON().email; syncReceipt();
        return route.fulfill({ json: { authenticated: true, account: profile } });
      }
      if (url.pathname === '/api/account/logout') { state.authenticated = false; return route.fulfill({ json: { success: true } }); }

      if (url.pathname === '/api/account/session') {
        state.sessions++;
        if (staleAccountResponse && state.sessions === 2) {
          const snapshot = structuredClone(profile);
          staleStarted.resolve();
          await staleGate.promise;
          return route.fulfill({ json: { account: snapshot } });
        }
        if (delayAccount) await accountGate.promise;
        return route.fulfill({ status: state.authenticated ? 200 : 401, json: state.authenticated ? { account: profile } : { error: 'Not signed in' } });
      }
      return route.fulfill({ json: { licenses: profile.licenses, orders: [] } });
    }
    if (url.pathname.endsWith('/zameria/checkout') && request.method() === 'POST') {
      state.payloads.push(request.postDataJSON());
      return route.fulfill({ status: 503, json: { error: 'QA intercepted checkout. No payment created.' } });
    }
    if (url.origin !== origin) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', error => state.errors.push(error.message));
  return { context, page, state, accountGate, geoGate, staleGate };
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
  const email = test.page.getByLabel('Email address', { exact: true });
  if (await email.isEditable()) await email.fill('currency@example.invalid');
  else assert.equal(await email.inputValue(), 'currency@example.invalid');
  await test.page.getByLabel('WooCommerce store URL', { exact: true }).fill('https://currency.example.invalid');
  await test.page.getByRole('button', { name: /Continue to checkout/ }).click();
  await test.page.getByRole('alert').filter({ hasText: 'QA intercepted checkout' }).waitFor();
  const payload = test.state.payloads.at(-1);
  assert.equal(payload.currency, currency);
  assert.equal(payload.plan, plan);
  assert.equal(payload.amount, prices[currency].amounts[plan]);
  assert.equal(payload.country === 'Nigeria', currency === 'NGN');
}
async function expectAccountFlow(page) {
  const html = await page.locator('#root').innerHTML();
  assert(!html.includes('ZMR-QA-ANNUAL'), 'Internal credentials must not be rendered in customer markup');
  assert.equal(await page.getByRole('button', { name: /copy.*(?:key|licen[cs]e)/i }).count(), 0);
  assert(!/\b(?:licen[cs]e|activation) key\b/i.test(await page.locator('main').innerText()), 'Customer guidance must use account connection');
}
async function run(name, options, check) {
  if (process.env.ZAMERIA_CHECKOUT_FILTER && !new RegExp(process.env.ZAMERIA_CHECKOUT_FILTER).test(name)) return;
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
    test.accountGate.resolve(); test.geoGate.resolve(); test.staleGate.resolve();
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
          await page.goto(origin, { waitUntil: 'load' });
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
          await page.reload({ waitUntil: 'load' });
          await expectCheckout(page, currency, other);
          await submitAndCheck(test, currency, other);
          await page.goBack({ waitUntil: 'load' });
          await expectCheckout(page, currency, plan);
        });
      }
    }
  }
  for (const currency of ['USD', 'NGN']) {
    for (const plan of ['starter', 'business']) {
      await run(`currency-only link / ${currency} / ${plan}`, { accountCurrency: opposite(currency), detectedCurrency: opposite(currency) }, async test => {
        await test.page.goto(`${origin}/subscribe?plan=${plan}&currency=${currency}`, { waitUntil: 'load' });
        await expectCheckout(test.page, currency, plan);
        await submitAndCheck(test, currency, plan);
      });
    }
    await run(`account-region fallback / ${currency}`, { accountCurrency: currency, detectedCurrency: opposite(currency) }, async test => {
      await test.page.goto(`${origin}/subscribe?plan=starter`, { waitUntil: 'load' });
      await expectCheckout(test.page, currency, 'starter');
      await submitAndCheck(test, currency, 'starter');
    });
    for (const delayed of ['account', 'geo']) {
      await run(`delayed ${delayed} / ${currency}`, { accountCurrency: opposite(currency), detectedCurrency: opposite(currency), delayAccount: delayed === 'account', delayGeo: delayed === 'geo' }, async test => {
        await test.page.goto(origin, { waitUntil: 'domcontentloaded' });
        await test.page.getByRole('button', { name: prices[currency].name, exact: true }).click();
        await test.page.getByRole('link', { name: 'Choose Starter', exact: true }).click();
        await expectCheckout(test.page, currency, 'starter');
        const restoredSession = delayed === 'account' ? test.page.waitForResponse(response => new URL(response.url()).pathname === '/api/account/session' && response.status() === 200) : null;
        test.accountGate.resolve(); test.geoGate.resolve();
        await test.page.waitForLoadState('load');
        if (restoredSession) {
          assert.equal((await (await restoredSession).json()).account.email, 'currency@example.invalid', 'The delayed authenticated session must actually restore');
          await test.page.waitForFunction(() => !document.querySelector('button[type=submit]')?.disabled);
        }
        await expectCheckout(test.page, currency, 'starter');
        await submitAndCheck(test, currency, 'starter');
      });
    }
  }
  await run('expired session with cached Nigerian profile / USD', { accountCurrency: 'NGN', invalidSession: true }, async test => {
    await test.page.goto(`${origin}/subscribe?plan=business&country=US&currency=USD`, { waitUntil: 'load' });
    await expectCheckout(test.page, 'USD', 'business');
    await submitAndCheck(test, 'USD', 'business');
  });
  // The route marker must preserve normal marketing/auth hydration as well as
  // fresh checkout mounts when Vercel rewrites /subscribe to the homepage shell.
  for (const route of ['/', '/login', '/get-started', '/forgot-password', '/terms', '/privacy', '/refunds', '/pricing', '/woocommerce-pos']) {
    await run(`prerender hydration / ${route}`, {}, async test => {
      await test.page.goto(`${origin}${route}`, { waitUntil: 'load' });
      await test.page.locator('h1').first().waitFor();
      assert.equal(await test.page.locator('#root').getAttribute('data-prerender-path'), route);
    });
  }
  for (const currency of ['NGN', 'USD']) {
    await run(`back to pricing preserves ${currency}`, { detectedCurrency: opposite(currency) }, async test => {
      await test.page.goto(`${origin}/subscribe?plan=starter&currency=${currency}`, { waitUntil: 'load' });
      await expectCheckout(test.page, currency, 'starter');
      await test.page.getByRole('link', { name: 'Back to plans' }).click();
      await test.page.waitForFunction(price => document.querySelector('.saas-plan-price')?.textContent.includes(price), prices[currency].starter);
      assert.equal(new URL(await test.page.getByRole('link', { name: 'Choose Starter', exact: true }).getAttribute('href'), origin).searchParams.get('currency'), currency);
      await test.page.getByRole('button', { name: prices[opposite(currency)].name, exact: true }).click();
      await test.page.waitForFunction(price => document.querySelector('.saas-plan-price')?.textContent.includes(price), prices[opposite(currency)].starter);
    });
  }
  const reference = 'zmr_' + 'a'.repeat(48);
  const paidReceipt = (plan = 'starter', currency = 'USD', email = 'currency@example.invalid') => ({ status: 'active', payment_verified: true, license_id: reference, license_key: 'ZMR-QA-ANNUAL', payment_reference: reference, plan, currency, country: prices[currency].country, amount: prices[currency].amounts[plan], store_domain: 'currency.example.invalid', expires_at: new Date(Date.now() + 365 * 86400000).toISOString(), email, business_name: 'Paid Store' });
  for (const currency of ['USD', 'NGN']) for (const plan of ['starter', 'business']) {
    await run(`verified licence / ${plan} / ${currency}`, { accountCurrency: opposite(currency), receipt: paidReceipt(plan, currency), mobile: plan === 'business' }, async test => {
      await test.page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
      await test.page.getByRole('heading', { name: 'Congratulations. You’re ready to go.' }).waitFor();
      assert((await test.page.locator('.payment-details').innerText()).includes('currency.example.invalid'));
      await expectAccountFlow(test.page);
      assert.equal(test.state.verifications, 1, 'Recording a receipt must not restart verification');
      await test.page.waitForFunction(() => JSON.parse(localStorage.getItem('zameria_customer_session_v3'))?.licenses?.length === 1);
      const cached = await test.page.evaluate(() => JSON.parse(localStorage.getItem('zameria_customer_session_v3')));
      assert.equal(cached.plan, title(plan));
      assert.equal(cached.staffAllowance, plan === 'starter' ? 5 : 999);
      assert.equal(cached.accountStatus, plan === 'starter' ? 'active_starter' : 'active_business');
      assert.equal(cached.currency, currency, 'Verified payment currency must win over previous account region');
      assert.equal(cached.licenses[0].licenseKey, 'ZMR-QA-ANNUAL');
      assert.equal(cached.licenses[0].requestedDomain, 'currency.example.invalid');
      assert.equal(cached.licenses.length, 1);
      await test.page.getByRole('button', { name: 'Open your dashboard' }).click();
      await test.page.waitForURL('**/account?tab=billing');
      await test.page.getByRole('heading', { name: 'Plan & billing', exact: true }).waitFor();
      await expectAccountFlow(test.page);
      assert((await test.page.locator('.site-account-page').innerText()).includes('currency.example.invalid'));
      if (process.env.ZAMERIA_CHECKOUT_SCREENSHOTS) {
        await mkdir(process.env.ZAMERIA_CHECKOUT_SCREENSHOTS, { recursive: true });
        await test.page.screenshot({ path: path.join(process.env.ZAMERIA_CHECKOUT_SCREENSHOTS, `billing-${plan}-${currency}.png`), fullPage: true });
      }
      if (plan === 'starter') {
        assert((await test.page.locator('main').innerText()).includes('up to five staff accounts'));
        await test.page.goto(`${origin}/account?tab=team`, { waitUntil: 'load' });
        await test.page.getByRole('heading', { name: 'Team access', exact: true }).waitFor();
        assert((await test.page.locator('main').innerText()).includes('up to five staff members'));
        await test.page.goto(`${origin}/account?tab=devices`, { waitUntil: 'load' });
        await test.page.getByRole('heading', { name: 'Devices & hardware', exact: true }).waitFor();
        assert((await test.page.locator('main').innerText()).includes('five active staff sessions'));
      }
      assert.equal(test.state.payloads.length, 0);
    });
  }
  await run('legacy Business receipt retained while renewal uses current NGN price', { accountCurrency: 'NGN', receipt: { ...paidReceipt('business', 'NGN'), amount: 300000 } }, async test => {
    const { page } = test;
    await page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Open your dashboard' }).click();
    await page.getByRole('heading', { name: 'Plan & billing', exact: true }).waitFor();
    assert.match(await page.getByRole('region', { name: 'Payment receipts' }).innerText(), /(?:₦|NGN)\s*300,000(?:\.00)?/, 'Historical receipt keeps its currency and the amount paid');
    await page.getByRole('button', { name: 'View plans', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    assert((await page.getByRole('dialog').innerText()).includes('₦350,000'), 'New purchase uses current Business price');
    await page.getByRole('button', { name: 'Keep Business', exact: true }).click();
    await expectCheckout(page, 'NGN', 'business');
    assert.equal(test.state.payloads.length, 0);
  });
  await run('account billing keeps receipts, address editing and legacy links', { accountCurrency: 'USD', receipt: paidReceipt('business') }, async test => {
    const { page } = test;
    await page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Open your dashboard' }).click();
    await page.getByRole('heading', { name: 'Plan & billing', exact: true }).waitFor();
    for (const alias of ['licenses', 'orders', 'plan']) {
      await page.goto(`${origin}/account?tab=${alias}`, { waitUntil: 'load' });
      await page.getByRole('heading', { name: 'Plan & billing', exact: true }).waitFor();
      await expectAccountFlow(page);
    }
    await page.getByRole('button', { name: 'View plans', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button', { name: 'Close plan comparison' }).click();
    await page.getByRole('button', { name: 'Edit address' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('First name', { exact: true }).fill('Paid');
    await dialog.getByLabel('Street address', { exact: true }).fill('1 Checkout Road');
    await dialog.getByLabel('City', { exact: true }).fill('Test City');
    await dialog.getByLabel('Country', { exact: true }).fill('US');
    await dialog.getByRole('button', { name: 'Save address', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Billing address saved.' }).waitFor();
    assert.equal(test.state.addressUpdates, 1);
    await page.getByRole('button', { name: 'Download receipt QA-ANNUAL-RECEIPT', exact: true }).waitFor();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download receipt QA-ANNUAL-RECEIPT', exact: true }).click();
    assert.equal((await download).suggestedFilename(), `zameria-${reference}.pdf`);
    assert.equal(test.state.receiptRequests, 1);
    await page.getByRole('link', { name: 'Connect your store', exact: true }).click();
    await page.getByRole('heading', { name: 'Your store', exact: true }).waitFor();
    await expectAccountFlow(page);
    assert((await page.locator('main').innerText()).includes('log in with your existing account'));
    assert(!(await page.locator('main').innerText()).includes('Your eligible seven-day trial starts'));
    assert.equal(test.state.payloads.length, 0);
  });
  await run('verified payment survives an older account response', { accountCurrency: 'NGN', receipt: paidReceipt(), staleAccountResponse: true }, async test => {
    await test.page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
    await test.page.getByRole('button', { name: 'Open your dashboard' }).waitFor();
    await test.page.waitForFunction(() => JSON.parse(localStorage.getItem('zameria_customer_session_v3'))?.licenses?.length === 1);
    test.staleGate.resolve();
    await test.page.waitForTimeout(200);
    const cached = await test.page.evaluate(() => JSON.parse(localStorage.getItem('zameria_customer_session_v3')));
    assert.equal(cached.licenses.length, 1, 'Late pre-payment account data must not erase the purchase');
    assert.equal(cached.currency, 'USD');
    assert.equal(test.state.verifications, 1);
  });
  await run('pending payment recovers without a second checkout', { receipt: paidReceipt(), pending: 1 }, async test => {
    await test.page.goto(`${origin}/payment/complete?trxref=${reference}`);
    await test.page.getByRole('heading', { name: 'Congratulations. You’re ready to go.' }).waitFor();
    assert.equal(test.state.verifications, 2);
    assert.equal(test.state.payloads.length, 0);
  });
  await run('verification failure offers safe recovery', { verificationError: 403 }, async test => {
    await test.page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
    await test.page.getByRole('button', { name: 'Check payment again' }).click();
    await test.page.waitForTimeout(150);
    assert.equal(test.state.verifications, 2);
    assert.equal(await test.page.locator('a[href*="/subscribe"]').count(), 0);
    assert.equal(test.state.payloads.length, 0);
  });
  for (const create of [false, true]) {
    await run(`guest purchase / ${create ? 'create account' : 'sign in'} / dashboard`, { receipt: paidReceipt() }, async test => {
      const { page } = test;
      await page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
      await page.getByRole('heading', { name: 'Congratulations. You’re ready to go.' }).waitFor();
      if (create) await page.getByRole('link', { name: 'Create your ZAMERIA account' }).click();
      else await page.getByRole('button', { name: 'Continue to your dashboard' }).click();
      await page.getByLabel('Email address', { exact: true }).waitFor();
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('input[type=email]')?.value === 'currency@example.invalid');
      assert.equal(await page.getByLabel('Email address', { exact: true }).inputValue(), 'currency@example.invalid');
      if (create) await page.getByLabel('Business name', { exact: true }).fill('Paid Store');
      await page.getByLabel('Password', { exact: true }).fill('qa-fixture-password');
      await page.getByRole('button', { name: create ? 'Create account' : 'Log in', exact: true }).click();
      await page.getByRole('button', { name: 'Open your dashboard' }).waitFor();
      assert(new URL(page.url()).searchParams.get('reference') === reference);
      await page.getByRole('button', { name: 'Open your dashboard' }).click();
      await page.waitForURL('**/account?tab=billing');
      await page.getByRole('heading', { name: 'Plan & billing', exact: true }).waitFor();
      await expectAccountFlow(page);
      assert.equal(test.state.payloads.length, 0);
    });
  }
  await run('another account cannot cache a buyer licence', { accountCurrency: 'NGN', receipt: paidReceipt('business','USD','buyer@example.invalid') }, async test => {
    await test.page.goto(`${origin}/payment/complete?reference=${reference}`, { waitUntil: 'load' });
    await test.page.getByRole('button', { name: 'Sign in with the purchase email' }).waitFor();
    const cached = await test.page.evaluate(() => JSON.parse(localStorage.getItem('zameria_customer_session_v3')));
    assert.equal(cached.licenses.length, 0);
    await test.page.getByRole('button', { name: 'Sign in with the purchase email' }).click();
    await test.page.getByLabel('Email address', { exact: true }).waitFor();
    assert.equal(await test.page.getByLabel('Email address', { exact: true }).inputValue(), 'buyer@example.invalid');
  });
  await run('combined device images and interactive hero', {}, async test => {
    await test.page.goto(origin, { waitUntil: 'load' });
    await test.page.locator('.saas-device-stage').scrollIntoViewIfNeeded();
    assert.equal(await test.page.locator('.saas-device-stage iframe').count(), 0);
    assert.equal(await test.page.locator('.saas-device-stage img').count(), 4);
    await test.page.waitForFunction(() => [...document.querySelectorAll('.saas-device-stage img')].every(image => image.complete && image.naturalWidth > 0));
    assert.equal(await test.page.locator('.saas-pos-demo iframe').count(), 1);
    await test.page.waitForFunction(() => document.querySelector('.saas-pos-demo iframe')?.style.opacity === '1');
  });
  for (const mobile of [false, true]) {
    await run(`responsive checkout and public pages / ${mobile ? 'mobile' : 'desktop'}`, { mobile, receipt: paidReceipt('business') }, async test => {
      const { page } = test;
      for (const route of ['/subscribe?plan=business&currency=USD', '/payment/complete?reference=' + reference, '/pricing', '/terms', '/privacy', '/refunds', '/']) {
        await page.goto(origin + route, { waitUntil: 'load' });
        await page.locator('h1').first().waitFor();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page must not overflow horizontally: ' + route);
        if (route.startsWith('/subscribe')) {
          const back = await page.getByRole('link', { name: 'Back to plans' }).boundingBox();
          const heading = await page.getByRole('heading', { name: 'Checkout', exact: true }).boundingBox();
          assert(back.y < heading.y && back.x <= heading.x, 'Back link belongs above the form at its left edge');
          assert.equal(await page.locator('.checkout-header a').filter({ hasText: /^Back$/ }).count(), 0);
        }
        if (process.env.ZAMERIA_CHECKOUT_SCREENSHOTS) {
          await mkdir(process.env.ZAMERIA_CHECKOUT_SCREENSHOTS, { recursive: true });
          if (route === '/') {
            await page.locator('.saas-device-stage').scrollIntoViewIfNeeded();
            await page.waitForFunction(() => [...document.querySelectorAll('.saas-device-stage img')].every(image => image.complete && image.naturalWidth > 0));
          }
          const name = route.split('?')[0].replaceAll('/', '-') || '-home';
          await page.screenshot({ path: path.join(process.env.ZAMERIA_CHECKOUT_SCREENSHOTS, `${mobile ? 'mobile' : 'desktop'}${name}.png`), fullPage: true });
          if (route === '/') await page.locator('.saas-device-stage').screenshot({ path: path.join(process.env.ZAMERIA_CHECKOUT_SCREENSHOTS, `${mobile ? 'mobile' : 'desktop'}-devices.png`) });
        }
      }
    });
  }
  console.log(JSON.stringify({ passed: results.length, failed: 0, paymentRequestsIntercepted: results.reduce((sum, result) => sum + result.paymentRequestsIntercepted, 0), realPayments: 0 }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
