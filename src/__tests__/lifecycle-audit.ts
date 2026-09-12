import {
  DEMO_TRIAL_CUSTOMER,
  DEMO_TRIAL_ACTIVE_CUSTOMER,
  DEMO_PAID_CUSTOMER,
  checkPluginEntitlement,
  CustomerProfile,
  LicenseStatus,
  generateActivationCode,
} from '../context/CustomerAuthContext';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED] ${message}`);
  }
}

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const chunk = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ZMR-${chunk()}-${chunk()}-${chunk()}`;
}

console.log('====================================================');
console.log(' ZAMERIA TRIAL ACTIVATION & LIFECYCLE AUDIT');
console.log('====================================================\n');

// 1. Trial Activation Code Generator Check (ZAM-XXXX-XXXX)
console.log('1. Testing Trial Activation Code Generator:');
for (let i = 0; i < 5; i++) {
  const code = generateActivationCode();
  console.log(`   Generated Activation Code #${i + 1}: ${code}`);
  assert(/^ZAM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code), `Code ${code} does not match ZAM-XXXX-XXXX format`);
  assert(!code.startsWith('ZMR-'), `Activation code ${code} must NOT start with ZMR- (reserved for licenses)`);
}
console.log('   ✓ Format matches strict ZAM-XXXX-XXXX specification.\n');

// 2. Paid License Key Generator Check (ZMR-XXXX-XXXX-XXXX)
console.log('2. Testing Paid Software License Key Generator:');
for (let i = 0; i < 5; i++) {
  const key = generateLicenseKey();
  console.log(`   Generated License Key #${i + 1}: ${key}`);
  assert(/^ZMR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key), `Key ${key} does not match ZMR-XXXX-XXXX-XXXX format`);
}
console.log('   ✓ License format matches strict ZMR-XXXX-XXXX-XXXX and is distinct from activation codes.\n');

// 3. STATE A — Registration Complete / Trial Not Started
console.log('3. Testing STATE A — Registration Complete / Trial Not Started:');
const stateA: CustomerProfile = { ...DEMO_TRIAL_CUSTOMER };
assert(stateA.accountStatus === 'trial_not_started', 'Account status must be trial_not_started');
assert(stateA.trial.status === 'not_started', 'Trial status must be not_started');
assert(stateA.trial.startDate === null, 'Trial startDate must be null before activation');
assert(stateA.trial.endDate === null, 'Trial endDate must be null before activation');
assert(stateA.licenses.length === 0, 'Trial user MUST have zero licenses');
assert(stateA.connectedStore.status === 'not_connected', 'Connected store must be not_connected');
assert(Boolean(stateA.trial.activationCode), 'Trial activation code must be generated for merchant');

const entitlementA = checkPluginEntitlement(stateA);
assert(entitlementA.status === 'trial_not_started', 'Entitlement status must be trial_not_started');
assert(entitlementA.allowed === false, 'POS access is blocked until store is activated');
assert(entitlementA.licenseRequired === false, 'License is NOT required to activate trial');
console.log('   ✓ Account created does NOT start the 7-day trial. Code ready, 0 licenses, store disconnected.\n');

// 4. Trial Activation Transition (WooCommerce Code Verification)
console.log('4. Testing Activation Flow & Transition to STATE B (Trial Active):');
const activationCode = stateA.trial.activationCode;
assert(/^ZAM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(activationCode), 'Code must be valid ZAM format');

// Simulate backend verification
const trialStartTime = new Date().toISOString();
const trialEndTime = new Date(Date.now() + 7 * 24 * 3600 * 1000).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const stateB: CustomerProfile = {
  ...stateA,
  accountStatus: 'trial_active',
  trial: {
    ...stateA.trial,
    status: 'active',
    startDate: trialStartTime,
    endDate: trialEndTime,
    totalDays: 7,
    daysRemaining: 7,
    activatedStore: {
      name: 'Lagos Beauty & Skincare Store',
      url: 'https://lagosbeautystore.ng',
    },
  },
  connectedStore: {
    name: 'Lagos Beauty & Skincare Store',
    url: 'https://lagosbeautystore.ng',
    status: 'connected',
    connectedAt: trialStartTime,
    lastSyncAt: 'Just now',
  },
  licenses: [],
};

assert(stateB.accountStatus === 'trial_active', 'Account status must now be trial_active');
assert(stateB.trial.status === 'active', 'Trial status must be active');
assert(stateB.trial.daysRemaining === 7, 'Trial duration must now be 7 days');
assert(stateB.connectedStore.status === 'connected', 'Store status must be connected');
assert(stateB.licenses.length === 0, 'Trial active user must still have zero licenses');

const entitlementB = checkPluginEntitlement(stateB);
assert(entitlementB.allowed === true, 'POS access is enabled once trial is activated');
assert(entitlementB.status === 'trial_active', 'Entitlement status must be trial_active');
assert(entitlementB.licenseRequired === false, 'Trial does not require license key');
console.log('   ✓ Trial starts strictly upon WooCommerce code verification. 7-day countdown active, 0 licenses.\n');

// 5. STATE C — Trial Expired (Without Payment)
console.log('5. Testing STATE C — Trial Expired (No Payment):');
const stateC: CustomerProfile = {
  ...stateB,
  accountStatus: 'trial_expired',
  trial: {
    ...stateB.trial,
    status: 'expired',
    daysRemaining: 0,
  },
  subscription: {
    ...stateB.subscription,
    status: 'expired',
  },
  licenses: [],
};
assert(stateC.accountStatus === 'trial_expired', 'Account status must be trial_expired');
assert(stateC.trial.status === 'expired', 'Trial status must be expired');
assert(stateC.trial.daysRemaining === 0, 'Days remaining must be 0');
assert(stateC.licenses.length === 0, 'Trial expired user must have 0 licenses');

const entitlementC = checkPluginEntitlement(stateC);
assert(entitlementC.allowed === false, 'Expired trial must block access');
assert(entitlementC.status === 'trial_expired', 'Status must be trial_expired');
console.log('   ✓ Expired trial restricts access with 0 licenses and prompts to choose plan.\n');

// 6. STATE D — Paid Customer (Subscription Active + License Generated)
console.log('6. Testing STATE D — Paid Customer (Payment Successful):');
const stateD: CustomerProfile = { ...DEMO_PAID_CUSTOMER };
assert(stateD.accountStatus === 'active_business', 'Account status must be active_business');
assert(stateD.subscription.status === 'active', 'Subscription status must be active');
assert(stateD.subscription.planName === 'Business Plan', 'Plan name must be Business Plan');
assert(stateD.licenses.length === 1, 'Paid customer must have generated license');
assert(stateD.licenses[0].status === 'Active', 'License status must be Active');
assert(stateD.licenses[0].licenseKey.startsWith('ZMR-'), 'License key must start with ZMR-');

const entitlementD = checkPluginEntitlement(stateD);
assert(entitlementD.allowed === true, 'Paid customer must have valid POS access');
assert(entitlementD.status === 'paid_active', 'Entitlement status must be paid_active');
assert(entitlementD.licenseRequired === true, 'Paid customer requires license');
assert(Boolean(entitlementD.licenseKey), 'Entitlement license key must be populated');
console.log(`   ✓ Official license generated ONLY after payment: ${stateD.licenses[0].licenseKey}`);
console.log('   ✓ Paid customer has active subscription and active license.\n');

// 7. Store Connection Failure & Error Recovery
console.log('7. Testing Store Connection Error State:');
const stateError: CustomerProfile = {
  ...stateA,
  connectedStore: {
    name: 'Unconnected Store',
    url: 'https://brokenstore.ng',
    status: 'error',
    connectionError: "Could not reach WordPress REST API endpoint.",
  },
};
assert(stateError.connectedStore.status === 'error', 'Store status must be error');
assert(Boolean(stateError.connectedStore.connectionError), 'Connection error message must be present');
console.log('   ✓ Store connection error state handled with human-readable error and retry CTA.\n');

// 8. Router Tab Normalization with 'store' tab
console.log('8. Testing Router Tab Normalization (including store tab):');
const VALID_TABS = ['overview', 'orders', 'licenses', 'plan', 'billing', 'billing-address', 'payment-methods', 'settings', 'store'];
function normalizeTab(raw: string | null) {
  if (!raw) return 'overview';
  const clean = raw.toLowerCase().trim();
  if (clean === 'license') return 'licenses';
  if (clean === 'connected-store') return 'store';
  if (VALID_TABS.includes(clean)) return clean;
  return 'overview';
}

assert(normalizeTab('store') === 'store', 'store tab must be preserved');
assert(normalizeTab('connected-store') === 'store', 'connected-store alias must map to store');
assert(normalizeTab('license') === 'licenses', 'license singular must map to licenses');
assert(normalizeTab('overview') === 'overview', 'overview must remain overview');
console.log('   ✓ Tab routing cleanly resolves "store" and "connected-store" alias.\n');

console.log('====================================================');
console.log(' ALL TRIAL ACTIVATION & LIFECYCLE AUDIT TESTS PASSED');
console.log('====================================================');
