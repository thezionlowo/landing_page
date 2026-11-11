import assert from 'node:assert/strict';
import { DEMO_PAID_CUSTOMER, normalizeCustomerProfile } from '../context/CustomerAuthContext';
import { resolveGeoPricing, getAuthoritativePlanAmount, getAuthoritativePlanPrice } from '../lib/geoPricing';
import { resolveGeoPricing as adminPricing } from '../../../zameria_admin_dashboard/src/services/pricing';

for (const [country, currency, starter, business] of [['NG', 'NGN', 200000, 350000], ['US', 'USD', 250, 400]] as const) {
 const pricing = resolveGeoPricing(country);
 const admin = adminPricing(country);
 assert.equal(pricing.currency, currency);
 assert.equal(pricing.plans.starter.amount, starter);
 assert.equal(pricing.plans.business.amount, business);
 assert.equal(admin.plans.Starter.amount, starter);
 assert.equal(admin.plans.Business.amount, business);
 assert(pricing.plans.starter.features.includes('Up to 5 staff members'));
 const original = structuredClone(DEMO_PAID_CUSTOMER);
 original.plan = 'Starter'; original.currency = currency; original.staffAllowance = 2;
 original.subscription.planId = 'Starter'; original.subscription.planName = 'Starter Plan';
 original.licenses = original.licenses.map(license => ({ ...license, plan: 'Starter', planName: 'Starter Plan' }));
 const migrated = normalizeCustomerProfile(original)!;
 assert.equal(migrated.staffAllowance, 5, 'Existing cached Starter profiles receive the new allowance');
 assert.deepEqual(migrated.orders, original.orders, 'Normalization must never reprice historical receipts');
 assert.equal(migrated.licenses[0].expiresAt, original.licenses[0].expiresAt);
 assert.equal(migrated.licenses[0].licenseKey, original.licenses[0].licenseKey);
 assert.equal(migrated.licenses[0].connectedDomain, original.licenses[0].connectedDomain);
}
assert.equal(getAuthoritativePlanAmount('NG', 'Business', 300000), 300000, 'Stored historical amounts remain authoritative');
assert.equal(getAuthoritativePlanPrice('NG', 'Business', '₦300,000 / year'), '₦300,000 / year');
assert.equal(getAuthoritativePlanAmount('NG', 'Business'), 350000, 'New quotes use the current price');
assert.equal(normalizeCustomerProfile(structuredClone(DEMO_PAID_CUSTOMER))!.staffAllowance, 999, 'Business keeps unlimited staff');
console.log('Plan policy regression passed: website/admin catalogue parity, NGN/USD prices, five staff on existing Starter accounts, unchanged keys/domains/expiry and historical receipts.');
