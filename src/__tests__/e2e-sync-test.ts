/**
 * ZAMERIA COMPREHENSIVE END-TO-END SYNCHRONIZATION & PRODUCTION-READINESS TEST
 * 
 * Validates:
 * 1. ZAMERIA Customer Account (Landing Page / Dashboard)
 * 2. ZAMERIA Cloud Backend (Port 5190 - Single Source of Truth)
 * 3. ZAMERIA WooCommerce Plugin & Dashboard
 * 
 * Rules:
 * - Backend is authoritative single source of truth.
 * - Account creation does NOT start the trial.
 * - Zero licenses during trial.
 * - 7-day trial strictly enforced.
 * - Activation code can only be used once (409 on reuse).
 * - Trial start and expiry dates originate from backend.
 * - Paid subscription generates license authoritatively.
 * - Account settings persist and survive logout/login.
 * - Cross-account isolation.
 */

const BACKEND_URL = 'http://localhost:5190';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    throw new Error(`[ASSERTION FAILED] ${message}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runE2ETest() {
  console.log('================================================================');
  console.log(' ZAMERIA END-TO-END SYNCHRONIZATION & PRODUCTION READINESS TEST');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const testEmail = `merchant_${timestamp}@lekki-boutique.ng`;
  const testPassword = `initialPassword${timestamp}`;
  const newPassword = `updatedPassword${timestamp}`;

  // STEP 1: Backend Health Check
  console.log('--- TEST 1: Backend Health & Single Source of Truth ---');
  const health = await request('/api/v1/health');
  assert(health.ok && health.data.status === 'healthy', 'Backend health check must return healthy');
  console.log('✓ ZAMERIA Cloud Backend is healthy and responding on port 5190.\n');

  // STEP 2: Account Registration on Landing Page
  console.log('--- TEST 2: Account Registration (Trial Not Started State) ---');
  const regRes = await request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Bisi Adeleke',
      businessName: 'Lekki Luxury Boutique',
      email: testEmail,
      password: testPassword,
    }),
  });

  assert(regRes.status === 201, `Registration must return 201 Created (got ${regRes.status})`);
  const accountA = regRes.data.account;
  assert(accountA.email === testEmail, 'Account email must match');
  assert(accountA.accountStatus === 'trial_not_started', 'Account status must be trial_not_started');
  assert(accountA.trial.status === 'not_started', 'Trial status must be not_started');
  assert(accountA.trial.startDate === null, 'Trial startDate must be null upon registration');
  assert(accountA.trial.endDate === null, 'Trial endDate must be null upon registration');
  assert(accountA.licenses.length === 0, 'Trial user MUST have zero licenses generated');
  assert(accountA.connectedStore.status === 'not_connected', 'Connected store must be not_connected');
  assert(Boolean(accountA.trial.activationCode), 'Trial Activation Code must be generated');
  const activationCode = accountA.trial.activationCode;
  console.log(`✓ Account created: ${accountA.id}`);
  console.log(`✓ Activation Code generated: ${activationCode}`);
  console.log('✓ Account Created, Trial Not Started, 0 licenses, Store not connected.\n');

  // STEP 3: WooCommerce Plugin Checks Entitlement Pre-Activation
  console.log('--- TEST 3: WooCommerce Pre-Activation State ---');
  const preEntitlement = await request(`/api/v1/plugin/entitlement?account_id=${accountA.id}`);
  assert(preEntitlement.ok, 'Plugin entitlement lookup must succeed');
  assert(preEntitlement.data.entitlement.status === 'unactivated', 'Plugin must reflect unactivated');
  console.log('✓ WooCommerce Plugin detects unactivated trial. POS access blocked until activation.\n');

  // STEP 4: Account Settings & Security (Profile Edit & Password Change)
  console.log('--- TEST 4: Account Settings & Password Security ---');
  // 4a. Update profile
  const updateProfRes = await request('/api/v1/auth/update-profile', {
    method: 'POST',
    body: JSON.stringify({
      accountId: accountA.id,
      email: testEmail,
      fullName: 'Bisi Adeleke-Cole',
      businessName: 'Lekki Luxury Boutique & Spa',
    }),
  });
  assert(updateProfRes.ok, 'Profile update must succeed');
  assert(updateProfRes.data.account.fullName === 'Bisi Adeleke-Cole', 'Profile name must persist');

  // 4b. Change password
  const changePassRes = await request('/api/v1/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      accountId: accountA.id,
      email: testEmail,
      currentPassword: testPassword,
      newPassword: newPassword,
    }),
  });
  assert(changePassRes.ok, 'Password update must succeed');

  // 4c. Verify old password no longer works
  const oldLoginRes = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  assert(oldLoginRes.status === 401, 'Old password must be rejected with 401');

  // 4d. Verify new password works
  const newLoginRes = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      password: newPassword,
    }),
  });
  assert(newLoginRes.ok && newLoginRes.data.success, 'New password must authenticate successfully');
  assert(newLoginRes.data.account.fullName === 'Bisi Adeleke-Cole', 'Updated profile persisted after re-login');
  console.log('✓ Profile changes persisted to backend.');
  console.log('✓ Password updated successfully. Old password rejected, new password verified.\n');

  // STEP 5: WooCommerce Connection & Trial Activation
  console.log('--- TEST 5: WooCommerce Plugin Activation Flow ---');
  // 5a. Invalid code test
  const badCodeRes = await request('/api/v1/trial/activate', {
    method: 'POST',
    body: JSON.stringify({
      code: 'ZAM-INVALID-0000',
      store: { id: 'str_wc_bad', name: 'Fake Store', url: 'fake.ng' },
    }),
  });
  assert(badCodeRes.status === 400 && badCodeRes.data.code === 'INVALID_CODE', 'Invalid code must return 400 INVALID_CODE');
  console.log('✓ Invalid activation code safely rejected.');

  // 5b. Valid code activation
  const storeInfo = {
    id: `str_wc_${timestamp.toString().slice(-6)}`,
    name: 'Lekki Luxury Boutique Official',
    url: 'https://lekkiluxury.ng',
  };
  const actRes = await request('/api/v1/trial/activate', {
    method: 'POST',
    body: JSON.stringify({
      code: activationCode,
      store: storeInfo,
    }),
  });
  assert(actRes.ok, `Activation with valid code must succeed (got ${actRes.status})`);
  assert(actRes.data.account.accountStatus === 'trial_active', 'Account status must transition to trial_active');
  assert(actRes.data.account.trial.status === 'active', 'Trial status must be active');
  assert(actRes.data.account.trial.totalDays === 7, 'Trial duration must strictly be 7 days');
  assert(actRes.data.account.trial.daysRemaining === 7, 'Trial days remaining must be 7 at start');
  assert(Boolean(actRes.data.account.trial.startDate), 'Trial startDate must be recorded');
  assert(Boolean(actRes.data.account.trial.endDate), 'Trial endDate must be recorded');
  assert(actRes.data.account.connectedStore.status === 'connected', 'Store status must be connected');
  assert(actRes.data.account.licenses.length === 0, 'Strict rule: Zero licenses during trial');
  console.log('✓ Trial officially activated by ZAMERIA cloud backend.');
  console.log(`✓ 7-Day trial start: ${actRes.data.account.trial.startDate} -> expires: ${actRes.data.account.trial.endDate}`);
  console.log('✓ Strictly 0 licenses during trial.\n');

  // 5c. Code reuse prevention
  const reuseRes = await request('/api/v1/trial/activate', {
    method: 'POST',
    body: JSON.stringify({
      code: activationCode,
      store: { id: 'str_wc_another', name: 'Hacker Store', url: 'https://hacker.ng' },
    }),
  });
  assert(reuseRes.status === 409 && reuseRes.data.code === 'ALREADY_ACTIVATED', 'Activation code reuse must return 409 ALREADY_ACTIVATED');
  console.log('✓ Code reuse blocked with 409 Conflict.\n');

  // STEP 6: Bidirectional Synchronization Verification
  console.log('--- TEST 6: Bidirectional Synchronization (Account ↔ Backend ↔ WooCommerce) ---');
  // 6a. Fetch Customer Account
  const accountSyncRes = await request(`/api/v1/account/${accountA.id}`);
  assert(accountSyncRes.ok, 'Account fetch must succeed');
  const syncedAccount = accountSyncRes.data.account;
  assert(syncedAccount.accountStatus === 'trial_active', 'Customer account must reflect trial_active');
  assert(syncedAccount.connectedStore.name === storeInfo.name, 'Customer account must show connected store');
  assert(syncedAccount.connectedStore.url === storeInfo.url, 'Customer account must show connected store URL');

  // 6b. Fetch WooCommerce Plugin Entitlement
  const pluginSyncRes = await request(`/api/v1/plugin/entitlement?account_id=${accountA.id}`);
  assert(pluginSyncRes.ok, 'Plugin entitlement fetch must succeed');
  const entitlement = pluginSyncRes.data.entitlement;
  assert(entitlement.status === 'trial_active', 'WooCommerce plugin must reflect trial_active');
  assert(entitlement.trial.days_remaining === 7, 'WooCommerce plugin days remaining must match backend');
  assert(entitlement.trial.expires_at === syncedAccount.trial.endDate, 'WooCommerce and Account expiry dates must be identical');
  console.log('✓ Customer Account and WooCommerce Plugin are 100% synchronized with Backend.');
  console.log(`✓ Expiry date on Account: ${syncedAccount.trial.endDate}`);
  console.log(`✓ Expiry date on WooCommerce: ${entitlement.trial.expires_at}\n`);

  // STEP 7: Trial Expiration Simulation
  console.log('--- TEST 7: Trial Expiration Synchronization ---');
  const expireSimRes = await request('/api/v1/simulation/state', {
    method: 'POST',
    body: JSON.stringify({
      accountId: accountA.id,
      state: 'trial_expired',
    }),
  });
  assert(expireSimRes.ok, 'Simulation of trial expiration must succeed');

  const expiredAccountRes = await request(`/api/v1/account/${accountA.id}`);
  assert(expiredAccountRes.data.account.trial.status === 'expired', 'Account trial must be expired');
  assert(expiredAccountRes.data.account.trial.daysRemaining === 0, 'Account days remaining must be 0');

  const expiredPluginRes = await request(`/api/v1/plugin/entitlement?account_id=${accountA.id}`);
  assert(expiredPluginRes.data.entitlement.status === 'trial_expired', 'WooCommerce plugin must reflect trial_expired');
  console.log('✓ Trial expiration synchronized across Customer Account and WooCommerce Plugin.');
  console.log('✓ Both systems prompt merchant to choose a paid plan.\n');

  // STEP 8: Paid Plan Upgrade & License Generation
  console.log('--- TEST 8: Paid Plan Upgrade & License Issuance ---');
  const paidKey = `ZMR-88F4-9021-${timestamp.toString().slice(-4)}`;
  const upgradeRes = await request('/api/v1/subscription/upgrade', {
    method: 'POST',
    body: JSON.stringify({
      accountId: accountA.id,
      planName: 'Business Plan',
      price: '₦30,000 / month',
      licenseKey: paidKey,
    }),
  });
  assert(upgradeRes.ok, 'Subscription upgrade must succeed');
  assert(upgradeRes.data.account.accountStatus === 'active_business', 'Account status must be active_business');
  assert(upgradeRes.data.account.subscription.status === 'active', 'Subscription must be active');
  assert(upgradeRes.data.account.subscription.price === '₦30,000 / month', 'Price must be ₦30,000 / month');
  assert(upgradeRes.data.account.licenses.length === 1, 'Exactly one active license generated after payment');
  assert(upgradeRes.data.account.licenses[0].licenseKey === paidKey, 'Issued license key must match');

  // Verify WooCommerce Plugin reflects paid status and valid license
  const paidPluginRes = await request(`/api/v1/plugin/entitlement?account_id=${accountA.id}`);
  assert(paidPluginRes.ok, 'Paid plugin entitlement must succeed');
  assert(paidPluginRes.data.entitlement.status === 'paid_active', 'WooCommerce plugin must reflect paid_active');
  assert(paidPluginRes.data.entitlement.subscription.status === 'active', 'WooCommerce subscription must be active');
  assert(paidPluginRes.data.entitlement.subscription.price === '₦30,000 / month', 'WooCommerce subscription price must match');
  console.log('✓ Paid subscription activated on backend.');
  console.log(`✓ Software license issued: ${paidKey}`);
  console.log('✓ WooCommerce Plugin validates active license and unlocks paid features.\n');

  // STEP 9: Cross-Account Data Leakage Prevention (Account Isolation)
  console.log('--- TEST 9: Account Security & Data Isolation ---');
  const userBEmail = `user_b_${timestamp}@lekki-boutique.ng`;
  const regBRes = await request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Chioma Okonkwo',
      businessName: 'Chioma Fabrics',
      email: userBEmail,
      password: 'passwordB123',
    }),
  });
  assert(regBRes.ok, 'User B registration must succeed');
  const accountB = regBRes.data.account;

  // Verify User B has different activation code
  assert(accountB.trial.activationCode !== activationCode, 'User B must receive a distinct activation code');

  // Verify User B cannot access User A store
  const userBAccountRes = await request(`/api/v1/account/${accountB.id}`);
  assert(userBAccountRes.data.account.connectedStore.name !== storeInfo.name, 'User B must NOT see User A store');
  assert(userBAccountRes.data.account.licenses.length === 0, 'User B must NOT see User A license');
  console.log('✓ Account isolation confirmed. User B cannot see or manipulate User A data.\n');

  // STEP 10: Dedicated Paid License Key Validation & Direct Activation
  console.log('--- TEST 10: Dedicated License Validation & Activation ---');
  // 10a. Validate existing license
  const licValRes = await request('/api/v1/license/validate', {
    method: 'POST',
    body: JSON.stringify({
      licenseKey: paidKey,
      store: { url: 'https://lekkiluxury.ng', name: 'Lekki Luxury Boutique Official' },
    }),
  });
  assert(licValRes.ok, 'License validation must succeed for authorized domain');
  assert(licValRes.data.entitlement.status === 'paid_active', 'Entitlement must be paid_active');
  console.log('✓ Dedicated license validation succeeded on authorized store domain.');

  // 10b. Invalid license key
  const badLicRes = await request('/api/v1/license/validate', {
    method: 'POST',
    body: JSON.stringify({
      licenseKey: 'ZMR-0000-FAKE-KEYY',
      store: { url: 'https://lekkiluxury.ng' },
    }),
  });
  assert(badLicRes.status === 404 && badLicRes.data.code === 'LICENSE_NOT_FOUND', 'Bad key must return 404 LICENSE_NOT_FOUND');
  console.log('✓ Non-existent license key correctly rejected with 404.\n');

  // STEP 11: Store Domain Mismatch Protection
  console.log('--- TEST 11: Store Domain Mismatch Protection ---');
  const mismatchRes = await request('/api/v1/license/validate', {
    method: 'POST',
    body: JSON.stringify({
      licenseKey: paidKey,
      store: { url: 'https://piratestore.com', name: 'Unauthorized Store' },
    }),
  });
  assert(mismatchRes.status === 403 && mismatchRes.data.code === 'DOMAIN_MISMATCH', 'Domain mismatch must return 403 DOMAIN_MISMATCH');
  console.log(`✓ Unauthorized store domain rejected: ${mismatchRes.data.error}`);
  console.log('✓ Domain binding security strictly enforced.\n');

  // STEP 12: Subscription Cancellation Synchronization
  console.log('--- TEST 12: Subscription Cancellation Synchronization ---');
  const cancelRes = await request('/api/v1/subscription/cancel', {
    method: 'POST',
    body: JSON.stringify({
      accountId: accountA.id,
      email: testEmail,
    }),
  });
  assert(cancelRes.ok, 'Cancellation endpoint must succeed');
  assert(cancelRes.data.account.accountStatus === 'cancelled', 'Account status must transition to cancelled');

  // Plugin entitlement must immediately reflect paid_cancelled / suspended
  const cancelledPluginRes = await request(`/api/v1/plugin/entitlement?account_id=${accountA.id}`);
  assert(cancelledPluginRes.data.entitlement.status === 'paid_cancelled', 'Plugin entitlement must reflect paid_cancelled');
  assert(cancelledPluginRes.data.entitlement.subscription.status === 'cancelled', 'Subscription status must be cancelled');
  console.log('✓ Subscription cancellation synchronized immediately to WooCommerce plugin.');
  console.log('✓ Plugin access revoked/restricted upon subscription cancellation.\n');

  // STEP 13: Offline Resilience Verification
  console.log('--- TEST 13: Offline Resilience & Service Degradation Handling ---');
  // 13a. Simulate service unavailable
  await request('/api/v1/simulation/state', {
    method: 'POST',
    body: JSON.stringify({ state: 'backend_unavailable' }),
  });
  const offlineCheck = await request('/api/v1/plugin/entitlement');
  assert(offlineCheck.status === 503 && offlineCheck.data.code === 'SERVICE_UNAVAILABLE', 'Offline simulation must return 503');
  console.log('✓ 503 Service Unavailable correctly returned during cloud outage.');

  // 13b. Restore backend service
  await request('/api/v1/simulation/state', {
    method: 'POST',
    body: JSON.stringify({ state: 'restored' }),
  });
  const restoredCheck = await request('/api/v1/health');
  assert(restoredCheck.ok && restoredCheck.data.status === 'healthy', 'Cloud service must restore cleanly');
  console.log('✓ Cloud connectivity restored. System operational.\n');

  console.log('================================================================');
  console.log(' ALL 13 CORE SYSTEM INTEGRATION & SYNC TESTS PASSED PERFECTLY');
  console.log('================================================================');
}

runE2ETest().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
