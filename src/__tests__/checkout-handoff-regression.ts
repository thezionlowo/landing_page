import assert from 'node:assert/strict';
import { authDestination, authSwitchURL, checkoutAccountHint, rememberCheckoutAccount } from '../lib/checkoutAccount';
import { verifyZameriaCheckout, CheckoutVerificationError } from '../lib/zameriaCheckout';

const reference = 'zmr_' + 'a'.repeat(48);
const next = '/payment/complete?reference=' + reference;
const search = '?next=' + encodeURIComponent(next);
assert.equal(authDestination(search), next);
assert.equal(authSwitchURL('/get-started', search), '/get-started' + search);
for (const target of ['https://other.example/account', '//other.example/account', '/admin', '/account/../admin', 'javascript:alert(1)']) {
  assert.equal(authDestination('?next=' + encodeURIComponent(target)), '/account');
}
const values = new Map<string, string>();
Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: { getItem: (key: string) => values.get(key), setItem: (key: string, value: string) => values.set(key, value) } });
rememberCheckoutAccount(reference, 'buyer@example.invalid', 'Paid Store');
assert.equal(checkoutAccountHint(search).email, 'buyer@example.invalid');
assert.deepEqual(checkoutAccountHint('?next=' + encodeURIComponent(next.replace(/a/g, 'b'))), {});

const originalFetch = globalThis.fetch;
const good = { license_key: 'fixture-key', plan: 'starter', status: 'active', store_domain: 'store.example.invalid', expires_at: new Date(Date.now() + 86400000).toISOString() };
let response: any = good;
let status = 200;
globalThis.fetch = async (_input, init) => {
  assert.equal(init?.cache, 'no-store');
  assert(init?.signal, 'Verification requires a bounded request');
  return new Response(JSON.stringify(response), { status, headers: { 'Content-Type': 'application/json' } });
};
try {
  assert.equal((await verifyZameriaCheckout(reference)).store_domain, good.store_domain);
  for (const bad of [{ ...good, expires_at: 'not-a-date' }, { ...good, expires_at: '2020-01-01' }, { ...good, status: 'revoked' }, { ...good, plan: 'other' }, { ...good, store_domain: '' }]) {
    response = bad;
    await assert.rejects(verifyZameriaCheckout(reference), CheckoutVerificationError);
  }
  status = 409; response = { error: 'Payment pending' };
  await assert.rejects(verifyZameriaCheckout(reference), (error: CheckoutVerificationError) => error.status === 409);
} finally { globalThis.fetch = originalFetch; }
console.log('PASS: safe authentication return paths, purchase-only prefills, verified licence details, expiry/revocation and pending-payment handling.');
