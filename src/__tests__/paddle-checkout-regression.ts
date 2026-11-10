import assert from 'node:assert/strict';
import { getCheckoutConfig, verifyZameriaCheckout } from '../lib/zameriaCheckout';

const original = globalThis.fetch;
try {
  globalThis.fetch = async () => new Response('{}', { status: 404 });
  assert.deepEqual(await getCheckoutConfig(), { usd_provider: 'paystack', usd_available: true, usd_auto_renews: false });
  globalThis.fetch = async () => new Response(JSON.stringify({ usd_provider: 'paddle', usd_available: false, usd_auto_renews: true }));
  assert.equal((await getCheckoutConfig()).usd_available, false, 'Unapproved Paddle must stay unavailable');
  globalThis.fetch = async () => new Response('{}', { status: 503 });
  await assert.rejects(getCheckoutConfig(), /confirm USD payment availability/);
  globalThis.fetch = async () => new Response(JSON.stringify({ status: 'revoked', license_key: 'local-fixture', provider: 'paddle' }));
  await assert.rejects(verifyZameriaCheckout('fixture'), /licence access is not active/, 'Refunded/revoked access must not appear activated');
  globalThis.fetch = async () => new Response(JSON.stringify({ status: 'active', license_key: 'local-fixture', provider: 'paddle', currency: 'USD', amount: 272.19, tax_minor: 2219 }));
  const receipt = await verifyZameriaCheckout('fixture');
  assert.equal(receipt.amount, 272.19); assert.equal(receipt.tax_minor, 2219); assert.equal(receipt.provider, 'paddle');
  console.log('PASS: legacy provider fallback, Paddle approval gate, unavailable configuration, revoked access rejection and verified tax-inclusive receipt. No payments initiated.');
} finally { globalThis.fetch = original; }
