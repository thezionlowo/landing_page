import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import pricingHandler from './api/pricing.js';
import accountHandler from './api/account/[...path].js';
import webhookHandler from './api/webhook/paystack.js';
import { NIGERIA_PRICING, INTERNATIONAL_PRICING } from './src/lib/geoPricing.js';

let count = 0;
function pass() { count++; }
async function invoke(handler, headers = {}, url = '/api/pricing', method = 'GET') {
  const result = { status: 0, headers: {}, body: '' };
  const response = {
    set statusCode(value) { result.status = value; },
    setHeader(key, value) { result.headers[key.toLowerCase()] = value; },
    end(value) { result.body = value || ''; },
  };
  await handler({ method, headers, url }, response);
  return result;
}
for (const country of ['NG', 'NGA', 'Nigeria', 'ng', 'US', 'GB', 'GH', 'ZA', 'KE', 'DE', 'CA', 'AE']) {
  const result = await invoke(pricingHandler, { 'x-vercel-ip-country': country });
  const data = JSON.parse(result.body);
  const nigeria = ['NG', 'NGA', 'NIGERIA'].includes(country.toUpperCase());
  assert.equal(result.status, 200);
  assert.match(result.headers['content-type'], /application\/json/);
  assert.match(result.headers['cache-control'], /private.*no-store/);
  assert.equal(data.currency, nigeria ? 'NGN' : 'USD');
  assert.equal(data.plans.starter.amount, nigeria ? 200000 : 250);
  assert.equal(data.plans.business.amount, nigeria ? 300000 : 400);
  assert.equal('detectedIp' in data, false);
  pass();
}
for (const [headers, url, expected] of [
  [{}, '/api/pricing', 'USD'],
  [{ 'x-vercel-ip-country': '   ' }, '/api/pricing?country=%20', 'USD'],
  [{ 'x-vercel-ip-country': '  ', 'cf-ipcountry': 'NG' }, '/api/pricing', 'NGN'],
  [{ 'x-vercel-ip-country': ['NG', 'US'] }, '/api/pricing', 'NGN'],
  [{ 'x-vercel-ip-country': 'US', 'cf-ipcountry': 'NG' }, '/api/pricing', 'USD'],
  [{ 'x-vercel-ip-country': 'US' }, '/api/pricing?country=NG', 'NGN'],
  [{ 'x-vercel-ip-country': 'NG', host: 'invalid host' }, '/api/pricing?country=US', 'USD'],
  [{ 'x-country-code': 'KE' }, '/api/pricing', 'USD'],
]) {
  const result = await invoke(pricingHandler, headers, url);
  assert.equal(result.status, 200);
  assert.equal(JSON.parse(result.body).currency, expected);
  pass();
}
const head = await invoke(pricingHandler, { 'x-vercel-ip-country': 'NG' }, '/api/pricing', 'HEAD');
assert.equal(head.status, 200); assert.equal(head.body, ''); pass();
const post = await invoke(pricingHandler, {}, '/api/pricing', 'POST');
assert.equal(post.status, 405); pass();
process.env.ZAMERIA_SESSION_SECRET = 'local-pricing-regression-secret-at-least-32-characters';
globalThis.fetch = async () => { throw Error('Unexpected network call'); };
const session = await invoke(accountHandler, {}, '/api/account/session');
assert.equal(session.status, 401); pass();
const webhook = await invoke(webhookHandler, {}, '/api/webhook/paystack');
assert.equal(webhook.status, 405); pass();

const actualDateTimeFormat = Intl.DateTimeFormat;
let revision = 0;
async function browser({ timezone = 'Europe/London', cached, fetch, blockedStorage = false, legacy = false } = {}) {
  const values = new Map();
  if (cached) values.set('zameria_detected_geo_v2', JSON.stringify(cached));
  if (legacy) values.set('zameria_detected_geo_v1', JSON.stringify(NIGERIA_PRICING));
  globalThis.sessionStorage = {
    getItem: key => { if (blockedStorage) throw Error('Storage blocked'); return values.get(key) || null; },
    setItem: (key, value) => { if (blockedStorage) throw Error('Storage blocked'); values.set(key, value); },
  };
  Intl.DateTimeFormat = function () { return { resolvedOptions: () => ({ timeZone: timezone }) }; };
  globalThis.window = new EventTarget();
  globalThis.fetch = window.fetch = fetch || (async () => Response.json(INTERNATIONAL_PRICING));
  const module = await import(pathToFileURL(path.join(process.cwd(), 'src/services/geoPricingService.js')).href + '?case=' + revision++);
  return { module, values };
}
try {
  for (const [data, timezone, expected] of [
    [NIGERIA_PRICING, 'Europe/London', 'NGN'],
    [INTERNATIONAL_PRICING, 'Africa/Lagos', 'USD'],
  ]) {
    const { module } = await browser({ timezone, fetch: async () => Response.json(data) });
    assert.equal((await module.initializeGeoPricing()).currency, expected); pass();
  }
  for (const timezone of ['Europe/London', 'America/New_York', 'Africa/Accra', 'Africa/Nairobi', 'Asia/Dubai', undefined, 'Africa/Lagos']) {
    const { module, values } = await browser({ timezone: timezone || 'unknown', fetch: async () => new Response('Server error', { status: 500 }) });
    assert.equal((await module.initializeGeoPricing()).currency, 'USD', 'Timezone alone must not classify a visitor as Nigerian');
    assert.equal(values.size, 0, 'A failed lookup is never persisted as a detected country'); pass();
  }
  for (const response of [
    () => new Response('<html>Home</html>'),
    () => Response.json(null),
    () => Response.json({ countryCode: 'US', currency: 'NGN' }),
    () => Response.json({ currency: 'NGN', plans: {} }),
  ]) {
    const { module } = await browser({ fetch: async () => response() });
    assert.equal((await module.initializeGeoPricing()).currency, 'USD'); pass();
  }
  for (const [cached, expected, callsExpected] of [
    [{ countryCode: 'NG', currency: 'NGN', expiresAt: Date.now() + 60000 }, 'NGN', 0],
    [{ countryCode: 'NG', currency: 'NGN', expiresAt: Date.now() - 1 }, 'USD', 1],
    [{ countryCode: 'NG', currency: 'NGN', manual: true, expiresAt: null }, 'NGN', 0],
    [{ countryCode: 'US', currency: 'NGN', manual: true }, 'USD', 1],
  ]) {
    let calls = 0;
    const { module } = await browser({ cached, fetch: async () => { calls++; return Response.json(INTERNATIONAL_PRICING); } });
    assert.equal((await module.initializeGeoPricing()).currency, expected);
    assert.equal(calls, callsExpected); pass();
  }
  const legacy = await browser({ legacy: true });
  assert.equal((await legacy.module.initializeGeoPricing()).currency, 'USD'); pass();
  let eventCount = 0;
  const blocked = await browser({ blockedStorage: true, fetch: async () => Response.json(NIGERIA_PRICING) });
  window.addEventListener('zameria_geopricing_change', () => eventCount++);
  assert.equal((await blocked.module.initializeGeoPricing()).currency, 'NGN');
  blocked.module.setCountryOverride('US');
  assert.equal(blocked.module.getCurrentGeoPricing().currency, 'USD');
  assert.equal(eventCount, 2); pass();
  let finish;
  const pending = await browser({ fetch: () => new Promise(resolve => { finish = resolve; }) });
  const initialization = pending.module.initializeGeoPricing();
  pending.module.setCountryOverride('US');
  finish(Response.json(NIGERIA_PRICING));
  assert.equal((await initialization).currency, 'USD');
  assert.equal(pending.module.getCurrentGeoPricing().currency, 'USD'); pass();
  let calls = 0;
  const singleton = await browser({ fetch: async () => { calls++; return Response.json(INTERNATIONAL_PRICING); } });
  await Promise.all([singleton.module.initializeGeoPricing(), singleton.module.initializeGeoPricing()]);
  assert.equal(calls, 1); pass();
  const deadline = await browser({ fetch: (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true });
  }) });
  const start = Date.now();
  assert.equal((await deadline.module.initializeGeoPricing()).currency, 'USD');
  assert(Date.now() - start < 5000); pass();
} finally {
  Intl.DateTimeFormat = actualDateTimeFormat;
}
console.log(`PASS: ${count} compiled-runtime pricing, country, cache, fallback, timeout, override and server-import scenarios. No network or payment calls.`);
