import { mapBilling } from '../lib/billing';
import { confirmedStore } from '../lib/storeSetup';
import { accountRequest, migrateAccountCaches, withoutCredentials } from '../lib/accountClient';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { leadCaptureClient, LeadSource, ReferralPartnerInfo } from '../services/leadCaptureClient';
import {
  isNigerianCountry,
  resolveGeoPricing,
  getAuthoritativePlanPrice,
  getAuthoritativePlanAmount,
} from '../lib/geoPricing';

export type LicenseStatus = 'Active' | 'Not Activated' | 'Expired' | 'Suspended' | 'Revoked';

export type AccountStatus =
  | 'trial_not_started'
  | 'trial_active'
  | 'trial_expiring'
  | 'trial_expired'
  | 'active_business'
  | 'active_starter'
  | 'payment_failed'
  | 'cancelled'
  | 'expired';

export type SubscriptionStatus =
  | 'none'
  | 'trial'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export type TrialStatus = 'not_started' | 'active' | 'expiring' | 'expired';

export interface TrialInfo {
  status: TrialStatus;
  activationCode: string;
  startDate: string | null;
  endDate: string | null;
  totalDays: number;
  daysRemaining: number;
  activatedStore?: {
    name: string;
    url: string;
  } | null;
}

export interface ConnectedStore {
  name: string;
  url: string;
  status: 'not_connected' | 'pending' | 'connected' | 'error';
  connectedAt?: string | null;
  lastSyncAt?: string | null;
  errorMessage?: string | null;
  connectionError?: string | null;
}

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  planId: 'Starter' | 'Business' | null;
  planName: string;
  price: string;
  currency?: 'NGN' | 'USD';
  currencySymbol?: '₦' | '$';
  amountNumber?: number;
  billingCycle: 'monthly' | 'yearly';
  startDate: string | null;
  renewsAt: string | null;
  cancelledAt?: string | null;
  gracePeriodEndsAt?: string | null;
}

export interface LicenseItem {
  id: string;
  licenseKey: string;
  plan: 'Starter' | 'Business';
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  price: string;
  currency?: 'NGN' | 'USD';
  currencySymbol?: '₦' | '$';
  amountNumber?: number;
  status: LicenseStatus;
  connectedDomain: string | null;
  // Store URL supplied at checkout. This is not an activation confirmation;
  // connectedDomain is populated only by the WooCommerce plugin.
  requestedDomain?: string | null;
  activationStatus: 'Activated' | 'Not Activated';
  activatedAt: string | null;
  expiresAt: string;
  orderId: string;
  orderNumber: string;
  features: string[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Failed';
  plan: string;
  total: string;
  currency?: 'NGN' | 'USD';
  currencySymbol?: '₦' | '$';
  amountNumber: number;
  invoiceNumber: string;
  paymentMethod: string;
  billingName: string;
  billingEmail: string;
  items: string[];
  licenseId?: string;
  licenseKey?: string;
  licenseStatus?: LicenseStatus;
  connectedDomain?: string | null;
  transactionRef?: string;
}


export interface PaymentMethodItem {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Verve';
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country?: string;
  currency?: 'NGN' | 'USD';
  currencySymbol?: '₦' | '$';
  password?: string;
  accountStatus: AccountStatus;


  // Modern Structured Models
  trial: TrialInfo;
  subscription: SubscriptionInfo;
  connectedStore: ConnectedStore;
  activationCode: string;

  // Direct backwards-compatible aliases
  trialDaysRemaining: number;
  trialEndsAt: string;
  plan: 'Starter' | 'Business' | null;
  planPrice: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;

  storesCount: number;
  staffAllowance: number;
  billingAddress: BillingAddress;
  paymentMethods: PaymentMethodItem[];
  orders: OrderItem[];
  licenses: LicenseItem[]; // Strictly empty [] for trial/unpaid accounts!
  accessType?: 'Trial' | 'Paid' | 'Gifted' | 'Complimentary';
  giftedDetails?: {
    plan: 'Starter' | 'Business';
    accessType: 'Gifted';
    grantedBy: string;
    grantedAt: string;
    expiresAt: string;
    reason: string;
  };
}

export type LifecycleScenario =
  | 'state_a_trial_not_started'
  | 'state_b_trial_active'
  | 'state_c_trial_expired'
  | 'state_d_paid_business'
  | 'state_e_cancelled_business'
  | 'state_f_expired_subscription'
  | 'test1_new_trial'
  | 'test2_active_trial'
  | 'test3_paid_business'
  | 'test4_cancelled_business'
  | 'test5_expired_subscription'
  | 'test6_renewed_business'
  | 'test7_duplicate_webhook'
  | 'test8_expired_trial';

/**
 * SECTION 10: PLUGIN ACTIVATION ENTITLEMENT STATUS
 * Rules:
 * 1. Trial user: Account active, Trial active -> Allow trial access, NO license required.
 * 2. Paid user: Account active, Subscription active, License exists -> Full plugin activation.
 * 3. Expired trial: Block paid functionality -> Show upgrade screen.
 * 4. Expired paid: Subscription expired -> Block paid functionality, show renewal screen.
 * 5. Past due: Grace period active -> Temporary access with payment update prompt.
 */
export interface PluginEntitlementStatus {
  allowed: boolean;
  status: 'trial_not_started' | 'trial_active' | 'paid_active' | 'trial_expired' | 'paid_expired' | 'past_due' | 'unauthorized';
  planName: string;
  licenseRequired: boolean;
  message: string;
  daysRemaining?: number;
  licenseKey?: string;
  activationCode?: string;
}

// This is the only ordering used to decide what a merchant sees. A historical
// trial record is retained for audit purposes, but can never outrank a current
// paid entitlement.
export type SubscriptionDisplayState =
  | 'paid_active'
  | 'trial_active'
  | 'trial_expired'
  | 'no_active_plan'
  | 'paid_expired'
  | 'past_due';

export const resolveSubscriptionState = (
  profile: CustomerProfile | null,
  currentTimeMs: number = Date.now(),
): SubscriptionDisplayState => {
  if (!profile) return 'no_active_plan';

  const unexpired=(value?:string|null)=>Boolean(value && Number.isFinite(Date.parse(value)) && Date.parse(value)>currentTimeMs);
  const activeLicense=profile.licenses?.some(l=>l.status==='Active' && unexpired(l.expiresAt)) ?? false;
  if ((profile.subscription?.status === 'active' && unexpired(profile.subscription.renewsAt)) || activeLicense) {
    return 'paid_active';
  }
  if (profile.subscription?.status === 'past_due' || profile.accountStatus === 'payment_failed') return 'past_due';

  const hasPaidHistory = Boolean(profile.subscription?.planId) || Boolean(profile.licenses?.length);
  if (hasPaidHistory && (profile.subscription?.status === 'expired' || profile.accountStatus === 'expired')) {
    return 'paid_expired';
  }

  if (profile.trial?.status === 'active' || profile.accountStatus === 'trial_active') {
    const endMs = profile.trial?.endDate ? new Date(profile.trial.endDate).getTime() : NaN;
    if (!Number.isNaN(endMs) && endMs <= currentTimeMs) return 'trial_expired';
    return 'trial_active';
  }
  if (profile.trial?.status === 'expired' || profile.accountStatus === 'trial_expired') return 'trial_expired';
  return 'no_active_plan';
};

// Calculate mathematically exact remaining days from trial end date
export const calculateTrialDaysRemaining = (profile: CustomerProfile | null, currentTimeMs: number = Date.now()): number => {
  if (!profile) return 0;
  if (resolveSubscriptionState(profile, currentTimeMs) !== 'trial_active') return 0;

  if (profile.trial?.endDate) {
    const endMs = new Date(profile.trial.endDate).getTime();
    if (!isNaN(endMs)) {
      const diffMs = endMs - currentTimeMs;
      if (diffMs <= 0) return 0;
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return profile.trial.totalDays ? Math.min(days, Math.max(days, profile.trial.totalDays)) : days;
    }
  }

  return profile.trial?.daysRemaining ?? profile.trialDaysRemaining ?? 0;
};

export const checkPluginEntitlement = (profile: CustomerProfile | null, domain?: string): PluginEntitlementStatus => {
  if (!profile) {
    return {
      allowed: false,
      status: 'unauthorized',
      planName: 'None',
      licenseRequired: false,
      message: 'No ZAMERIA merchant account found. Please register or log in.',
    };
  }

  const state = resolveSubscriptionState(profile);

  // 1. Paid entitlement always wins, even when the historical trial says active or expired.
  if (state === 'paid_active') {
    const activeLicense = profile.licenses?.find(l => l.status === 'Active' && Date.parse(l.expiresAt)>Date.now() && (!domain || !l.connectedDomain || l.connectedDomain === domain));
    if (domain && !activeLicense) return {allowed:false,status:'unauthorized',planName:'None',licenseRequired:true,message:'No current license was verified for this store.'};
    const resolvedPlanTitle = profile.subscription?.planName || (profile.plan ? `${profile.plan} Plan` : profile.licenses?.[0]?.plan ? `${profile.licenses[0].plan} Plan` : 'Starter Plan');
    return {
      allowed: true,
      status: 'paid_active',
      planName: resolvedPlanTitle,
      licenseRequired: true,
      licenseKey: activeLicense?.licenseKey || profile.licenses?.[0]?.licenseKey,
      message: (profile.accessType === 'Gifted' || profile.accessType === 'Complimentary')
        ? 'Gifted complimentary plan verified. Full WooCommerce plugin access active.'
        : 'Active subscription and license verified. Full WooCommerce plugin access active.',
    };
  }

  // 2. Past due / Grace period
  if (state === 'past_due') {
    return {
      allowed: true,
      status: 'past_due',
      planName: profile.subscription.planName,
      licenseRequired: true,
      message: 'Subscription payment past due. Grace period active. Please update your payment method.',
    };
  }

  // 3. Paid subscription expired (Evaluated for accounts that actually held a paid subscription or license)
  if (state === 'paid_expired') {
    return {
      allowed: false,
      status: 'paid_expired',
      planName: profile.subscription?.planName || (profile.licenses && profile.licenses[0]?.planName) || 'Business Plan',
      licenseRequired: true,
      message: 'Subscription and license have expired. Please renew your plan to restore plugin functionality.',
    };
  }

  // 4. Trial not started (State A)
  if (state === 'no_active_plan' && (profile.trial?.status === 'not_started' || profile.accountStatus === 'trial_not_started')) {
    return {
      allowed: false,
      status: 'trial_not_started',
      planName: 'None (Trial Eligible)',
      licenseRequired: false,
      activationCode: profile.trial?.activationCode || profile.activationCode,
      message: 'Your ZAMERIA trial has not started yet. Enter your Trial Activation Code in your WooCommerce plugin to activate your 7-day trial.',
    };
  }

  // 5. Time-evaluated trial check
  const daysLeft = calculateTrialDaysRemaining(profile);

  // 5a. Trial active (NO license needed!)
  if (state === 'trial_active' && daysLeft > 0) {
    return {
      allowed: true,
      status: 'trial_active',
      planName: 'Free Trial',
      licenseRequired: false,
      daysRemaining: daysLeft,
      message: `7-Day Free Trial active (${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining). No license key required.`,
    };
  }

  // 6. Trial expired
  if (state === 'trial_expired') {
    return {
      allowed: false,
      status: 'trial_expired',
      planName: 'Free Trial',
      licenseRequired: false,
      message: 'Your 7-day free trial has ended. Choose a paid plan to continue using ZAMERIA.',
    };
  }

  return {
    allowed: false,
    status: 'unauthorized',
    planName: 'None',
    licenseRequired: false,
    message: 'Account not active.',
  };
};

interface CustomerAuthContextType {
  isRestoringSession: boolean;
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  isTrial: boolean;
  isTrialNotStarted: boolean;
  isPaid: boolean;
  daysRemaining: number;
  planLabel: string;
  verifyPluginAccess: (domain?: string) => PluginEntitlementStatus;
  activateTrial: (code?: string, storeData?: { name?: string; url?: string }) => Promise<{ success: boolean; error?: string }>;
  retryStoreConnection: () => Promise<{ success: boolean; error?: string }>;
  disconnectStore: () => Promise<{success:boolean;error?:string}>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName?: string;
    businessName: string;
    email: string;
    password: string;
    phone?: string;
    source?: LeadSource;
    campaign?: string;
    referralPartner?: ReferralPartnerInfo;
    plan?: string;
    storeUrl?: string;
    storeAddress?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { fullName: string; email: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateBillingAddress: (address: BillingAddress) => Promise<{success:boolean;error?:string}>;
  addPaymentMethod: (card: Omit<PaymentMethodItem, 'id' | 'isDefault'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  changePlan: (newPlan: 'Starter' | 'Business', cycle?: 'monthly' | 'yearly') => void;
  cancelSubscription: () => void;
  resumeSubscription: () => void;
  subscribeToPlan: (data: {
    plan: 'Starter' | 'Business';
    billingCycle?: 'monthly' | 'yearly';
    paymentMethodId?: string;
    transactionRef?: string;
  }) => Promise<{ success: boolean; license: LicenseItem; order: OrderItem; isDuplicate?: boolean }>;
  recordVerifiedPayment: (receipt: { license_key: string; plan: 'starter' | 'business'; expires_at: string; store_domain?: string; payment_reference?: string }) => void;
  purchaseNewLicense: (data: {
    plan: 'Starter' | 'Business';
    billingCycle?: 'monthly' | 'yearly';
    paymentMethodId?: string;
    transactionRef?: string;
  }) => Promise<{ success: boolean; license: LicenseItem; order: OrderItem; isDuplicate?: boolean }>;
  activateLicenseDomain: (licenseId: string, domain: string) => { success: boolean; error?: string };
  renewLicense: (licenseId: string) => { success: boolean; error?: string };
  renewExpiredSubscription: () => Promise<{ success: boolean }>;
  simulateLifecycleScenario: (scenario: LifecycleScenario) => void;
}

// Generate strict ZMR-XXXX-XXXX-XXXX license keys
export const generateLicenseKey = (): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const getSeg = () => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint8Array(4);
      crypto.getRandomValues(buf);
      return Array.from(buf).map((b) => chars[b % chars.length]).join('');
    }
    return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  return `ZMR-${getSeg()}-${getSeg()}-${getSeg()}`;
};

// Generate strict ZAM-XXXX-XXXX Trial Activation Codes
export const generateActivationCode = (): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ZAM-${seg()}-${seg()}`;
};

// 1. Fresh Trial Customer (STATE A: Account Created, Trial Not Started, NO license!)
export const DEMO_TRIAL_CUSTOMER: CustomerProfile = {
  id: 'zm_cust_trial_101',
  fullName: 'Zion Lowo',
  businessName: 'Zion Business Ltd.',
  email: 'zion@business.ng',
  phone: '+234 802 345 6789',
  password: 'password123',
  accountStatus: 'trial_not_started',
  trial: {
    status: 'not_started',
    activationCode: 'ZAM-7F4K-92XP',
    startDate: null,
    endDate: null,
    totalDays: 7,
    daysRemaining: 7,
    activatedStore: null,
  },
  connectedStore: {
    name: 'No store connected',
    url: '',
    status: 'not_connected',
    connectedAt: null,
    lastSyncAt: null,
  },
  subscription: {
    status: 'none',
    planId: null,
    planName: 'None (Trial Eligible)',
    price: '₦0',
    billingCycle: 'monthly',
    startDate: null,
    renewsAt: null,
  },
  activationCode: 'ZAM-7F4K-92XP',
  trialDaysRemaining: 7,
  trialEndsAt: '',
  plan: null,
  planPrice: 'Free Trial (₦0)',
  billingCycle: 'monthly',
  nextBillingDate: '',
  storesCount: 0,
  staffAllowance: 2,
  billingAddress: {
    firstName: 'Zion',
    lastName: 'Lowo',
    company: 'Zion Business Ltd.',
    address: 'Plot 14B Admiralty Way, Lekki Phase 1',
    city: '',
    state: '',
    country: 'Nigeria',
    phone: '+234 802 345 6789',
  },
  paymentMethods: [],
  orders: [],
  licenses: [], // NO LICENSE ASSIGNED!
};

// 1b. Active Trial Customer (STATE B: Plugin Verified, 7-Day Countdown Running)
export const DEMO_TRIAL_ACTIVE_CUSTOMER: CustomerProfile = {
  ...DEMO_TRIAL_CUSTOMER,
  accountStatus: 'trial_active',
  trial: {
    status: 'active',
    activationCode: 'ZAM-7F4K-92XP',
    startDate: 'September 12, 2026',
    endDate: 'September 19, 2026',
    totalDays: 7,
    daysRemaining: 6,
    activatedStore: {
      name: 'Lagos Skincare Lab',
      url: 'https://skincarelab.ng',
    },
  },
  connectedStore: {
    name: 'Lagos Skincare Lab',
    url: 'https://skincarelab.ng',
    status: 'connected',
    connectedAt: 'September 12, 2026',
    lastSyncAt: 'Just now',
  },
  subscription: {
    status: 'trial',
    planId: null,
    planName: 'Free Trial',
    price: '₦0',
    billingCycle: 'monthly',
    startDate: 'September 12, 2026',
    renewsAt: null,
  },
  trialDaysRemaining: 6,
  trialEndsAt: 'September 19, 2026',
  storesCount: 1,
};

// 2. Active Paid Customer (STATE D: Post-payment state with genuine ZMR license)
export const DEMO_PAID_CUSTOMER: CustomerProfile = {
  id: 'zm_cust_paid_9421',
  fullName: 'Zion Lowo',
  businessName: 'Zion Business Ltd. / Lagos Skincare Lab',
  email: 'zion@skincarelab.ng',
  phone: '+234 802 345 6789',
  password: 'password123',
  accountStatus: 'active_business',
  trial: {
    status: 'expired',
    activationCode: 'ZAM-7F4K-92XP',
    startDate: 'September 5, 2026',
    endDate: 'September 12, 2026',
    totalDays: 7,
    daysRemaining: 0,
    activatedStore: {
      name: 'Lagos Skincare Lab',
      url: 'https://skincarelab.ng',
    },
  },
  connectedStore: {
    name: 'Lagos Skincare Lab',
    url: 'https://skincarelab.ng',
    status: 'connected',
    connectedAt: 'September 5, 2026',
    lastSyncAt: 'Just now',
  },
  subscription: {
    status: 'active',
    planId: 'Business',
    planName: 'Business Plan',
    price: '₦300,000 / year',
    billingCycle: 'yearly',
    startDate: 'September 12, 2026',
    renewsAt: 'September 12, 2027',
  },
  activationCode: 'ZAM-7F4K-92XP',
  trialDaysRemaining: 0,
  trialEndsAt: 'September 12, 2026',
  plan: 'Business',
  planPrice: '₦300,000 / year',
  billingCycle: 'yearly',
  nextBillingDate: 'September 12, 2027',
  storesCount: 1,
  staffAllowance: 999,
  billingAddress: {
    firstName: 'Zion',
    lastName: 'Lowo',
    company: 'Zion Business Ltd.',
    address: 'Plot 14B Admiralty Way, Lekki Phase 1',
    city: '',
    state: '',
    country: 'Nigeria',
    phone: '+234 802 345 6789',
  },
  paymentMethods: [
    {
      id: 'pm_4092',
      brand: 'Mastercard',
      last4: '4092',
      expMonth: '09',
      expYear: '28',
      isDefault: true,
    },
  ],
  licenses: [
    {
      id: 'lic_8821',
      licenseKey: 'ZMR-88F4-9021-BC44',
      plan: 'Business',
      planName: 'Business Plan',
      billingCycle: 'yearly',
      price: '₦300,000 / year',
      status: 'Active',
      connectedDomain: 'brandone.com',
      activationStatus: 'Activated',
      activatedAt: 'September 12, 2026',
      expiresAt: 'September 12, 2027',
      orderId: 'ord_1024',
      orderNumber: '#ZM-1024',
      features: ['1 WooCommerce Store', '1 Physical Location', 'Unlimited Products', 'Unlimited Staff Members', 'Real-time WooCommerce Sync'],
    },
  ],
  orders: [
    {
      id: 'ord_1024',
      orderNumber: '#ZM-1024',
      date: 'Sep 12, 2026',
      status: 'Completed',
      plan: 'Business Plan (Annual)',
      total: '₦300,000',
      amountNumber: 300000,
      invoiceNumber: 'INV-2026-0941',
      paymentMethod: 'Mastercard ending in 4092',
      billingName: 'Zion Lowo • Zion Business Ltd.',
      billingEmail: 'zion@skincarelab.ng',
      licenseId: 'lic_8821',
      licenseKey: 'ZMR-88F4-9021-BC44',
      licenseStatus: 'Active',
      connectedDomain: 'brandone.com',
      transactionRef: 'txn_init_1024',
      items: [
        'ZAMERIA Business Plan (Annual Subscription)',
        'WooCommerce Real-time Sync Entitlement',
        'License Key ZMR-88F4-9021-BC44 (Active)',
      ],
    },
  ],
};

const displayPlanPrice = (plan: 'Starter' | 'Business', currency?: string) => getAuthoritativePlanPrice(currency === 'USD' ? 'US' : 'NG', plan);

const STORAGE_KEY_AUTH = 'zameria_customer_session_v3';
const STORAGE_KEY_USERS = 'zameria_registered_customers_v3';

// Helper: strictly enforce authoritative plan resolution, annual pricing, and store connection truth
export function activeMerchantLicense(licenses: any[]): any | undefined {
  const active=licenses.filter(l=>!l.is_trial && String(l.plan).toLowerCase()!=='trial' && String(l.status).toLowerCase()==='active' && (Number.isFinite(Date.parse(l.expires_at)) && Date.parse(l.expires_at)>Date.now()));
  return active.find(l=>!l.gifted && String(l.access_type).toLowerCase()!=='gifted') || active[0];
}
const giftedLicense = (license:any) => Boolean(license && (license.gifted || String(license.access_type).toLowerCase()==='gifted' || license.price==='Gifted Plan'));

export function normalizeCustomerProfile(profile: CustomerProfile | null): CustomerProfile | null {
  if (!profile) return null;
  profile = withoutCredentials(profile);

  const giftedPlan = String(profile.giftedDetails?.plan || (profile as any).gifted_details?.plan || '').toLowerCase();
  const rawLicenses = Array.isArray(profile.licenses) ? profile.licenses : [];
  const licensePlans = rawLicenses.map((l) => `${l.plan || ''} ${l.licenseKey || ''}`).join(' ').toLowerCase();

  // Determine effective plan (Starter or Business)
  const rawPlanStr = String(
    giftedPlan ||
    profile.plan ||
    profile.subscription?.planId ||
    profile.subscription?.planName ||
    licensePlans ||
    ''
  ).toLowerCase();

  const isStarter = rawPlanStr.includes('starter') || rawPlanStr.includes('zm-str') || (!rawPlanStr.includes('business') && giftedPlan === 'starter');
  const isBusiness = rawPlanStr.includes('business') && !isStarter;
  const resolvedPlan: 'Starter' | 'Business' | null = isStarter ? 'Starter' : isBusiness ? 'Business' : null;

  const isGifted=rawLicenses.some(l=>String(l.status).toLowerCase()==='active' && giftedLicense(l) && (Number.isFinite(Date.parse(l.expiresAt)) && Date.parse(l.expiresAt)>Date.now()));

  // Normalize licenses: enforce authoritative pricing and 1-year expiry, filter out trials and deduplicate
  const filteredRawLicenses = rawLicenses.filter(
    (lic: any) => !lic.is_trial && (lic.plan || '').toLowerCase() !== 'trial'
  );

  const seenLicenseKeys = new Set<string>();
  const normalizedLicenses: LicenseItem[] = [];

  for (let idx = 0; idx < filteredRawLicenses.length; idx++) {
    const lic = filteredRawLicenses[idx];
    const key = String(lic.licenseKey || (lic as any).code || lic.id || '').trim().toUpperCase();
    if (key && seenLicenseKeys.has(key)) {
      continue;
    }
    if (key) {
      seenLicenseKeys.add(key);
    }

    const rawLicStr = String(lic.plan || lic.licenseKey || resolvedPlan || '').toLowerCase();
    const licPlan: 'Starter' | 'Business' = rawLicStr.includes('starter') || rawLicStr.includes('zm-str') ? 'Starter' : (rawLicStr.includes('business') ? 'Business' : (resolvedPlan || 'Starter'));
    const isLicGifted = giftedLicense(lic);
    const licPrice = isLicGifted ? 'Gifted Plan' : displayPlanPrice(licPlan, lic.currency || profile.currency);

    const exp = lic.expiresAt || ''; // Dates come from the server; never invent another year of access.

    normalizedLicenses.push({
      ...lic,
      plan: licPlan,
      planName: `${licPlan} Plan`,
      price: licPrice,
      billingCycle: 'yearly' as const,
      expiresAt: exp,
      orderNumber: lic.orderNumber || `#ZM-LIC-${idx + 1}`,
      features: licPlan === 'Business'
        ? ['Unlimited products', 'Unlimited POS registers', 'Multi-staff permissions', 'Priority support']
        : ['Up to 500 products', '2 POS registers', 'Basic staff roles', 'Standard support'],
    });
  }

  const isPaid = resolveSubscriptionState({...profile,licenses:normalizedLicenses}) === 'paid_active';

  let renewsAt = profile.subscription?.renewsAt || profile.nextBillingDate || normalizedLicenses[0]?.expiresAt;
  // Never fall back to 'Business' when a plan is unknown; default to 'Starter' as lowest tier if paid
  const finalPlan = isPaid ? (resolvedPlan || 'Starter') : resolvedPlan;
  const finalPrice = isGifted
    ? 'Gifted Plan'
    : isPaid && finalPlan
      ? displayPlanPrice(finalPlan, profile.currency)
      : profile.planPrice;

  let finalAccountStatus = profile.accountStatus;
  if (isPaid) {
    finalAccountStatus = finalPlan === 'Business' ? 'active_business' : 'active_starter';
  }

  // Authoritative Store Connection: strictly bound to active domain or active trial
  const boundLicense = normalizedLicenses.find((l) => Boolean(l.connectedDomain));
  const trialHasStore = Boolean(profile.trial?.activatedStore?.url);
  const isStoreActuallyConnected = Boolean(boundLicense?.connectedDomain || (profile.trial?.status === 'active' && trialHasStore));

  const resolvedStoreName = boundLicense?.connectedDomain
    ? boundLicense.connectedDomain
    : (profile.connectedStore?.name && profile.connectedStore.name !== 'No store connected'
      ? profile.connectedStore.name
      : (profile.trial?.activatedStore?.name || (isStoreActuallyConnected ? (profile.businessName || 'WooCommerce Store') : 'No store connected')));

  const resolvedStoreUrl = boundLicense?.connectedDomain
    ? (boundLicense.connectedDomain.startsWith('http') ? boundLicense.connectedDomain : `https://${boundLicense.connectedDomain}`)
    : (profile.connectedStore?.url || profile.trial?.activatedStore?.url || '');

  return {
    ...profile,
    accessType: isGifted ? 'Gifted' : isPaid ? 'Paid' : 'Trial',
    giftedDetails: isGifted ? profile.giftedDetails : undefined,
    accountStatus: finalAccountStatus,
    plan: finalPlan,
    planPrice: finalPrice || 'None (Trial Eligible)',
    billingCycle: 'yearly',
    nextBillingDate: renewsAt || profile.nextBillingDate || '',
    connectedStore: {
      ...profile.connectedStore,
      name: resolvedStoreName,
      url: resolvedStoreUrl,
      status: isStoreActuallyConnected ? 'connected' : 'not_connected',
      connectedAt: boundLicense?.activatedAt || profile.connectedStore?.connectedAt || (isStoreActuallyConnected ? 'Active' : null),
    },
    subscription: {
      ...profile.subscription,
      status: isPaid ? 'active' : profile.subscription?.status || 'none',
      planId: finalPlan,
      planName: finalPlan ? `${finalPlan} Plan` : (profile.subscription?.planName || 'None (Trial Eligible)'),
      price: isGifted ? '₦0 (Gifted)' : (isPaid && finalPlan ? displayPlanPrice(finalPlan, profile.currency) : profile.subscription?.price || '₦0'),
      billingCycle: 'yearly',
      renewsAt: renewsAt || profile.subscription?.renewsAt || null,
    },
    licenses: normalizedLicenses,
  };
}

// Configurable external Scoreflip backend URL (provided via environment variables)
const SCOREFLIP_BACKEND_URL: string =
  (typeof import.meta !== 'undefined' &&
    ((import.meta as any).env?.VITE_SCOREFLIP_BACKEND_URL || (import.meta as any).env?.VITE_BACKEND_URL)) ||
  'https://scoreflip-go-hwsgspeycq-uc.a.run.app';

// Merchant accounts are owned by the ZAMERIA service.  The legacy generic
// ScoreFlip /auth routes are not registered by the live Cloud Run service.
const ZAMERIA_ACCOUNT_API_BASE = `${SCOREFLIP_BACKEND_URL.replace(/\/$/, '')}/api/v1/zameria`;

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessionGeneration = useRef(0);
  const [sessionEpoch, setSessionEpoch] = useState(0);
  const invalidateAccountRequests = () => { sessionGeneration.current += 1; setSessionEpoch(value => value + 1); };
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    try {
      migrateAccountCaches();
      // Check current key or legacy storage keys
      const saved =
        localStorage.getItem(STORAGE_KEY_AUTH) ||
        localStorage.getItem('zameria_customer_session_v2') ||
        localStorage.getItem('zameria_customer_session');

      if (saved) {
        const parsed = JSON.parse(saved);
        const normalized = normalizeCustomerProfile(parsed);
        if (normalized) {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(normalized));
          // Clean up old legacy keys that may contain stale mock pricing
          try {
            localStorage.removeItem('zameria_customer_session_v2');
            localStorage.removeItem('zameria_customer_session');
          } catch {}
        }
        return null; // Cached profiles alone never establish authentication.
      }
    } catch {
      // ignore
    }
    // Default session: unauthenticated (null) unless a valid session exists
    return null;
  });

  useEffect(() => {
    let active = true;
    migrateAccountCaches();
    void accountRequest('session').then(data => {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH);
      const cached = raw ? normalizeCustomerProfile(JSON.parse(raw)) : null;
      if (active && cached && data.account?.email?.toLowerCase() === cached.email.toLowerCase()) {
        const confirmed = confirmedStore(data.account);
        setCustomer({ ...cached, id: String(data.account.id), connectedStore: { ...cached.connectedStore, ...(confirmed || {}), status: confirmed ? 'connected' : 'not_connected' } });
      }
    }).catch(() => { /* A fresh sign-in is required when no server session can be validated. */ })
      .finally(() => { if (active) setIsRestoringSession(false); });
    return () => { active = false; };
  }, []);

  const persistSession = (c: CustomerProfile | null) => {
    if (c === null) invalidateAccountRequests();
    const normalized = normalizeCustomerProfile(c);
    setCustomer(normalized);
    try {
      if (normalized) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(normalized));
        const existing = localStorage.getItem(STORAGE_KEY_USERS) || localStorage.getItem('zameria_registered_customers_v2');
        let users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
        const index = users.findIndex((u) => u.email.toLowerCase() === normalized.email.toLowerCase());
        if (index >= 0) {
          users[index] = normalized;
        } else {
          users.push(normalized);
        }
        // Normalize all stored users to purge any legacy mock price
        const cleanedUsers = users.map((u) => normalizeCustomerProfile(u)).filter(Boolean) as CustomerProfile[];
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(cleanedUsers));
        try {
          localStorage.removeItem('zameria_registered_customers_v2');
        } catch {}
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch {
      // ignore
    }
  };

  // Real-time synchronization with Scoreflip backend if URL is configured
  useEffect(() => {
    if (!customer?.email || !SCOREFLIP_BACKEND_URL) return;

    let active = true;
    let inFlight = false;
    const generation = sessionGeneration.current;
    const syncWithBackend = async () => {
      if (!active || inFlight || generation !== sessionGeneration.current) return;
      inFlight = true;
      try {
        const queryId = customer.id || customer.email;
        const sessionData = await accountRequest('session');
        if (!active || generation !== sessionGeneration.current) return;
        const res = { ok: true, json: async () => sessionData };
        if (res.ok) {
          const data = await res.json();
          if (data.account) {
            const acc = data.account;
            setCustomer((prev) => {
              if (!active || generation !== sessionGeneration.current || !prev || prev.id !== customer.id || prev.email !== customer.email) return prev;
              const isCancelled = acc.accountStatus === 'cancelled' || acc.subscription?.status === 'cancelled';
              const isTrialActive = acc.trial?.status === 'active';
              const isExpired = acc.trial?.status === 'expired' || acc.accountStatus === 'expired';
              const rawLicenses: any[] = Array.isArray(acc.licenses) ? acc.licenses : [];
              const activePaidLicense = activeMerchantLicense(rawLicenses);
              const isGifted = giftedLicense(activePaidLicense);
              const giftedDetails = isGifted ? {plan: activePaidLicense.plan, expiresAt:activePaidLicense.expires_at, reason:activePaidLicense.gift_reason} as CustomerProfile['giftedDetails'] : undefined;
              const isPaid = Boolean(activePaidLicense);

              // Authoritative plan resolution: Starter (₦200,000/yr) or Business (₦300,000/yr)
              const rawGiftedPlan = String(giftedDetails?.plan || '').toLowerCase();
              const detectedPlanStr = String(rawGiftedPlan || acc.plan || activePaidLicense?.plan || prev.plan || '').toLowerCase();
              const isStarter = detectedPlanStr.includes('starter') || (!detectedPlanStr.includes('business') && rawGiftedPlan === 'starter');
              const isBusiness = detectedPlanStr.includes('business') && !isStarter;
              const activePlan: 'Starter' | 'Business' = isStarter ? 'Starter' : isBusiness ? 'Business' : (prev.plan || 'Starter');
              const activePrice = isGifted ? 'Gifted Plan' : displayPlanPrice(activePlan, acc.currency || activePaidLicense?.currency || prev.currency);

              let accountStatus: AccountStatus = rawLicenses.length ? 'expired' : 'trial_not_started';
              if (isCancelled) accountStatus = 'cancelled';
              else if (isPaid) accountStatus = activePlan === 'Business' ? 'active_business' : 'active_starter';
              else if (isExpired) accountStatus = 'trial_expired';
              else if (isTrialActive) accountStatus = 'trial_active';
              else if (acc.accountStatus === 'trial_not_started') accountStatus = 'trial_not_started';

              // Normalize licenses with strict 1-year expiry and authoritative pricing
              const normalizedLicenses: LicenseItem[] = rawLicenses
                .filter((lic: any) => (lic.plan || '').toLowerCase() !== 'trial')
                .map((lic: any, idx: number) => {
                  const rawLicPlan = String(lic.plan || '').toLowerCase();
                  const isLicStarter = rawLicPlan.includes('starter') || (!rawLicPlan.includes('business') && activePlan === 'Starter');
                  const isLicBusiness = rawLicPlan.includes('business') && !isLicStarter;
                  const licPlan: 'Starter' | 'Business' = isLicStarter ? 'Starter' : isLicBusiness ? 'Business' : activePlan;
                  const isLicGifted = giftedLicense(lic);
                  const licPrice = isLicGifted ? 'Gifted Plan' : displayPlanPrice(licPlan, lic.currency || acc.currency || prev.currency);

                  // Calculate 1-year expiration accurately
                  let formattedExpiry = '';
                  const rawExp = lic.expires_at || lic.expiresAt;
                  const rawAct = lic.activated_at || lic.activatedAt || lic.created_at || lic.createdAt || acc.created_at;

                  if (rawExp) {
                    const d = new Date(rawExp);
                    if (!isNaN(d.getTime())) {
                      formattedExpiry = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    } else {
                      formattedExpiry = String(rawExp);
                    }
                  }

                  const licenseId = String(lic.id || `lic_${(lic.license_key || lic.licenseKey || lic.code || '').replace(/[^a-z0-9]/gi, '').slice(-8) || idx}`);
                  const licenseKey = String(lic.license_key || lic.licenseKey || lic.code || '');
                  const rawStatus = String(lic.status || '').toLowerCase();
                  const status: LicenseStatus = rawStatus === 'active' ? 'Active' : rawStatus === 'suspended' ? 'Suspended' : rawStatus === 'revoked' ? 'Revoked' : rawStatus === 'issued' ? 'Not Activated' : 'Expired';
                  const domain = lic.store_domain || lic.connectedDomain || null;
                  const reqDomain = lic.requested_domain || lic.requestedDomain || null;
                  const paymentRef = lic.payment_reference || lic.orderNumber || lic.orderId || '';

                  return {
                    id: licenseId,
                    licenseKey,
                    plan: licPlan,
                    planName: `${licPlan} Plan`,
                    billingCycle: 'yearly' as const,
                    price: licPrice,
                    status,
                    connectedDomain: domain,
                    requestedDomain: reqDomain,
                    activationStatus: domain || lic.activated_at ? 'Activated' : 'Not Activated',
                    activatedAt: lic.activated_at || lic.activatedAt || null,
                    expiresAt: formattedExpiry,
                    orderId: lic.orderId || `ord_${paymentRef || licenseId}`,
                    orderNumber: lic.orderNumber || (paymentRef ? `#ZM-${paymentRef.slice(-8).toUpperCase()}` : `#ZM-LIC-${idx + 1}`),
                    features: licPlan === 'Business'
                      ? ['Unlimited products', 'Unlimited POS registers', 'Multi-staff permissions', 'Priority support']
                      : ['Up to 500 products', '2 POS registers', 'Basic staff roles', 'Standard support'],
                  };
                });

              // Primary expiry date from license or 1-year future timestamp
              const primaryExpiry = normalizedLicenses[0]?.expiresAt || (activePaidLicense?.expires_at ? new Date(activePaidLicense.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null);

              // Authoritative store connection resolution
              const boundLicense = normalizedLicenses.find((l) => Boolean(l.connectedDomain));
              const confirmation = confirmedStore(acc);
              const isStoreActuallyConnected = Boolean(confirmation);
              const storeName = confirmation?.name || 'No store connected';
              const storeUrl = confirmation?.url || '';

              const next: CustomerProfile = {
                ...prev,
                id: acc.id || prev.id,
                currency: acc.currency || activePaidLicense?.currency || prev.currency,
                country: acc.country || prev.country,
                fullName: acc.full_name || acc.fullName || prev.fullName,
                accessType: isGifted ? 'Gifted' : isPaid ? 'Paid' : 'Trial',
                giftedDetails,
                accountStatus,
                plan: isPaid ? activePlan : null,
                planPrice: isPaid ? activePrice : prev.planPrice,
                billingCycle: 'yearly',
                nextBillingDate: primaryExpiry || prev.nextBillingDate,
                trial: {
                  ...prev.trial,
                  status: acc.trial?.status || prev.trial.status,
                  activationCode: acc.trial?.activationCode || prev.trial.activationCode,
                  startDate: acc.trial?.startDate || prev.trial.startDate,
                  endDate: acc.trial?.endDate || prev.trial.endDate,
                  daysRemaining: acc.trial?.daysRemaining ?? prev.trial.daysRemaining,
                  activatedStore: acc.trial?.activatedStore || (isStoreActuallyConnected && isTrialActive ? { name: storeName, url: storeUrl } : null),
                },
                connectedStore: {
                  ...prev.connectedStore,
                  name: storeName,
                  url: storeUrl,
                  status: isStoreActuallyConnected ? 'connected' : 'not_connected',
                  connectedAt: boundLicense?.activatedAt || acc.connectedStore?.connectedAt || prev.connectedStore.connectedAt,
                },
                subscription: {
                  ...prev.subscription,
                  status: isPaid ? 'active' : isTrialActive ? 'trial' : rawLicenses.length ? 'expired' : 'none',
                  planId: isPaid ? activePlan : null,
                  planName: isPaid ? `${activePlan} Plan` : prev.subscription.planName,
                  price: isGifted ? '₦0 (Gifted)' : isPaid ? activePrice : prev.subscription.price,
                  billingCycle: 'yearly',
                  renewsAt: primaryExpiry || prev.subscription.renewsAt,
                },
                licenses: normalizedLicenses,
                orders: Array.isArray(acc.billing) ? mapBilling(acc.billing) : [],
                billingAddress: acc.billing_address || prev.billingAddress,
              };

              // Persist synchronized state so refreshes and re-logins retain backend state
              try {
                localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(next));
                const existing = localStorage.getItem(STORAGE_KEY_USERS);
                let users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
                const idx = users.findIndex((u) => u.email.toLowerCase() === next.email.toLowerCase());
                if (idx >= 0) users[idx] = next;
                else users.push(next);
                localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
              } catch {
                // Ignore storage errors
              }

              return next;
            });
          }
        }
      } catch (error) {
        if (active && generation === sessionGeneration.current && ((error as any)?.status === 401 || (error as any)?.status === 403)) persistSession(null);
      } finally { inFlight = false; }
    };

    syncWithBackend();
    const timer = setInterval(syncWithBackend, 3000);
    return () => { active = false; clearInterval(timer); };
  }, [customer?.id, customer?.email, sessionEpoch]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    invalidateAccountRequests();
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!pass) {
      return { success: false, error: 'Please enter your password.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // ZAMERIA accounts are authoritative. Do not use the legacy ScoreFlip
    // login route or fall back to browser-only accounts when the API rejects.
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: pass }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data.error || (res.status === 401
          ? 'We could not find an account with that email and password.'
          : 'We could not sign you in right now. Please try again.') };
      }
      if (!data.account || !data.authenticated) {
        return { success: false, error: 'The sign-in service returned an invalid response. Please try again.' };
      }

      const acc = data.account;
      const existing = localStorage.getItem(STORAGE_KEY_USERS);
      const users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
      const localMatch = users.find((u) => u.email.toLowerCase() === trimmedEmail);
      let backendLicenses: any[] = Array.isArray(acc.licenses) ? acc.licenses : [];
      try {
        const licensesRes = await fetch('/api/account/licenses', { credentials: 'same-origin', cache: 'no-store' });
        if (licensesRes.ok) {
          const licensesData = await licensesRes.json();
          backendLicenses = Array.isArray(licensesData.licenses) ? licensesData.licenses : [];
        }
      } catch {
        // Account sign-in remains valid if the optional licence list is unavailable.
      }
      const activePaidLicense = activeMerchantLicense(backendLicenses);
      const activeTrialLicense = backendLicenses.find((license) => (license.is_trial || (license.plan || '').toLowerCase() === 'trial') && license.status === 'active');
      const issuedTrialLicense = backendLicenses.find((license) => (license.is_trial || (license.plan || '').toLowerCase() === 'trial') && license.status === 'issued');
      const trialEnd = activeTrialLicense?.expires_at || issuedTrialLicense?.expires_at || null;
      const parsedTrialEnd = trialEnd ? new Date(trialEnd).getTime() : NaN;
      const trialDaysRemaining = activeTrialLicense
        ? Math.max(0, Number(activeTrialLicense.days_remaining) || (Number.isNaN(parsedTrialEnd) ? 0 : Math.ceil((parsedTrialEnd - Date.now()) / 86400000)))
        : issuedTrialLicense ? 7 : 0;
      const isGifted = giftedLicense(activePaidLicense);
      const giftedDetails = isGifted ? {plan: activePaidLicense.plan, expiresAt:activePaidLicense.expires_at, reason:activePaidLicense.gift_reason} as CustomerProfile['giftedDetails'] : undefined;
      const isPaid = Boolean(activePaidLicense) || isGifted;
      const isTrialActive = !isPaid && Boolean(activeTrialLicense) && trialDaysRemaining > 0;
      const isTrialExpired = !isPaid && Boolean(issuedTrialLicense || activeTrialLicense) && !isTrialActive;
      const trialCode = activeTrialLicense?.code || issuedTrialLicense?.code || '';
      const storeName = acc.business_name || localMatch?.businessName || 'ZAMERIA Store';
      const storeUrl = acc.store_url || localMatch?.connectedStore.url || '';
      const fullName = acc.full_name || localMatch?.fullName || 'Store Owner';
      const phone = acc.phone || localMatch?.phone || '';
      const rawPlanStr = String(giftedDetails?.plan || activePaidLicense?.plan || acc.plan || localMatch?.plan || '').toLowerCase();
      const paidPlan = rawPlanStr.includes('starter') ? 'Starter' : rawPlanStr.includes('business') ? 'Business' : 'Starter';

      const accountStatus: AccountStatus = isPaid
        ? (paidPlan === 'Starter' ? 'active_starter' : 'active_business')
        : isTrialActive ? 'trial_active'
          : isTrialExpired ? 'trial_expired' : 'trial_not_started';

      const nonTrialLicenses = backendLicenses.filter((lic) => !lic.is_trial && (lic.plan || '').toLowerCase() !== 'trial');
      const seenLoginKeys = new Set<string>();
      const licenseItems: LicenseItem[] = [];

      for (let index = 0; index < nonTrialLicenses.length; index++) {
        const license = nonTrialLicenses[index];
        const rawCode = license.code || license.license_key || license.licenseKey || '';
        const normKey = rawCode.trim().toUpperCase();
        if (normKey && seenLoginKeys.has(normKey)) continue;
        if (normKey) seenLoginKeys.add(normKey);

        const rawLicPlan = String(license.plan || '').toLowerCase();
        const plan: 'Starter' | 'Business' = rawLicPlan.includes('starter')
          ? 'Starter'
          : rawLicPlan.includes('business')
            ? 'Business'
            : paidPlan;
        const status = license.status === 'active' ? 'Active'
          : license.status === 'issued' ? 'Not Activated'
            : license.status === 'suspended' ? 'Suspended'
              : license.status === 'revoked' ? 'Revoked' : 'Expired';

        // Calculate 1-year expiration accurately
        let formattedExpiry = '';
        const rawExp = license.expires_at || license.expiresAt;
        const rawAct = license.activated_at || license.activatedAt || license.created_at || license.createdAt;

        if (rawExp) {
          const d = new Date(rawExp);
          if (!isNaN(d.getTime())) {
            formattedExpiry = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          } else {
            formattedExpiry = String(rawExp);
          }
        }

        const isLicGifted = giftedLicense(license);

        licenseItems.push({
          id: String(license.id || `${trimmedEmail}-${index}`),
          licenseKey: rawCode,
          plan,
          planName: `${plan} Plan`,
          billingCycle: 'yearly',
          price: isLicGifted ? 'Gifted Plan' : displayPlanPrice(plan, license.currency || acc.currency),
          currency: license.currency || acc.currency || 'NGN',
          status,
          connectedDomain: license.activated_domain || license.store_domain || null,
          requestedDomain: license.requested_domain || null,
          activationStatus: license.activated_domain || license.store_domain ? 'Activated' : 'Not Activated',
          activatedAt: license.activated_at || null,
          expiresAt: formattedExpiry,
          orderId: '',
          orderNumber: '',
          features: plan === 'Business'
            ? ['Unlimited products', 'Unlimited POS registers', 'Multi-staff permissions', 'Priority support']
            : ['Up to 500 products', '2 POS registers', 'Basic staff roles', 'Standard support'],
        });
      }

      const boundLicense = licenseItems.find((license) => Boolean(license.connectedDomain));
      const isActuallyConnected = Boolean(boundLicense?.connectedDomain || (isTrialActive && Boolean(acc.trial?.activatedStore?.url)));
      const storeStatus: 'connected' | 'not_connected' = isActuallyConnected ? 'connected' : 'not_connected';
      const resolvedStoreName = boundLicense?.connectedDomain || (isActuallyConnected ? storeName : 'No store connected');
      const resolvedStoreUrl = boundLicense?.connectedDomain
        ? (boundLicense.connectedDomain.startsWith('http') ? boundLicense.connectedDomain : `https://${boundLicense.connectedDomain}`)
        : (isActuallyConnected ? storeUrl : '');

      const profile: CustomerProfile = {
              id: String(acc.id),
              currency: acc.currency || activePaidLicense?.currency || localMatch?.currency || 'NGN',
              country: acc.country || localMatch?.country || 'Nigeria',
              fullName,
              businessName: storeName,
              email: trimmedEmail,
              phone,
              accessType: isGifted ? 'Gifted' : (isPaid ? 'Paid' : 'Trial'),
              giftedDetails,
              accountStatus,
              trial: {
                status: isTrialActive ? 'active' : isTrialExpired ? 'expired' : 'not_started',
                activationCode: trialCode || localMatch?.trial.activationCode || '',
                startDate: activeTrialLicense?.activated_at || localMatch?.trial.startDate || null,
                endDate: trialEnd || localMatch?.trial.endDate || null,
                totalDays: 7,
                daysRemaining: isTrialActive ? trialDaysRemaining : 0,
                activatedStore: isTrialActive && isActuallyConnected ? { name: resolvedStoreName, url: resolvedStoreUrl } : null,
              },
              connectedStore: {
                name: resolvedStoreName,
                url: resolvedStoreUrl,
                status: storeStatus,
                connectedAt: boundLicense?.activatedAt || localMatch?.connectedStore.connectedAt || (isActuallyConnected ? 'Active' : null),
                lastSyncAt: isActuallyConnected ? 'Just now' : null,
                errorMessage: null,
              },
              subscription: {
                status: isPaid ? 'active' : isTrialActive ? 'trial' : 'none',
                planId: paidPlan,
                planName: paidPlan ? `${paidPlan} Plan` : isTrialActive ? 'Free Trial' : 'None (Trial Eligible)',
                price: isGifted ? '₦0 (Gifted)' : (paidPlan ? displayPlanPrice(paidPlan, acc.currency || activePaidLicense?.currency) : '₦0'),
                billingCycle: 'yearly',
                startDate: activePaidLicense?.activated_at || activeTrialLicense?.activated_at || null,
                renewsAt: activePaidLicense?.expires_at || (activePaidLicense ? (() => {
                  const d = new Date(activePaidLicense.activated_at || Date.now());
                  d.setFullYear(d.getFullYear() + 1);
                  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                })() : activeTrialLicense?.expires_at || null),
              },
              activationCode: trialCode || localMatch?.activationCode || '',
              trialDaysRemaining: isTrialActive ? trialDaysRemaining : 0,
              trialEndsAt: trialEnd || '',
              plan: paidPlan,
              planPrice: isGifted ? 'Gifted Plan' : (paidPlan ? displayPlanPrice(paidPlan, acc.currency || activePaidLicense?.currency) : 'None (Trial Eligible)'),
              billingCycle: 'yearly',
              nextBillingDate: activePaidLicense?.expires_at || (activePaidLicense ? (() => {
                const d = new Date(activePaidLicense.activated_at || Date.now());
                d.setFullYear(d.getFullYear() + 1);
                return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              })() : ''),
              storesCount: storeUrl ? 1 : 0,
              staffAllowance: paidPlan === 'Starter' ? 2 : 999,
              billingAddress: acc.billing_address || {
                firstName: fullName.split(' ')[0] || 'Store',
                lastName: fullName.split(' ').slice(1).join(' ') || 'Owner',
                company: storeName || 'Business',
                address: '',
                city: '',
                state: '',
                country: 'Nigeria',
                phone,
              },
              paymentMethods: [],
              orders: Array.isArray(acc.billing) ? mapBilling(acc.billing) : [],
              licenses: licenseItems,
            };

      invalidateAccountRequests();
      persistSession(profile);
      return { success: true };
    } catch {
      return {
        success: false,
        error: 'ZAMERIA authentication service is temporarily undergoing maintenance. Please try again shortly or contact support@zameria.co.',
      };
    }
  };

  // --- STATE 1: Account Created / Trial Not Started ---
  const register = async (data: {
    fullName?: string;
    businessName: string;
    email: string;
    password: string;
    phone?: string;
    country?: string;
    currency?: 'NGN' | 'USD';
    source?: LeadSource;
    campaign?: string;
    referralPartner?: ReferralPartnerInfo;
    plan?: string;
    storeUrl?: string;
    storeAddress?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    invalidateAccountRequests();
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trimmedEmail = data.email.trim().toLowerCase();
    try {
      const existing = localStorage.getItem(STORAGE_KEY_USERS);
      const users: CustomerProfile[] = existing ? JSON.parse(existing) : [];

      const resolvedName = (data.fullName || data.businessName || 'Store Owner').trim();
      const nameParts = resolvedName.split(' ');
      const firstName = nameParts[0] || 'Store';
      const lastName = nameParts.slice(1).join(' ') || 'Owner';

      let activationCode = '';
      let accountId = '';

      // Register with the live ZAMERIA account service if configured.
      if (SCOREFLIP_BACKEND_URL) {
        try {
          const backendRes = await fetch('/api/account/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              full_name: resolvedName,
              business_name: data.businessName.trim(),
              email: trimmedEmail,
              password: data.password,
              phone: data.phone?.trim() || '',
              store_url: data.storeUrl?.trim() || '',
              store_address: data.storeAddress?.trim() || '',
              campaign: data.campaign || '',
            }),
          });
          if (backendRes.ok) {
            const backendData = await backendRes.json();
            if (!backendData.account?.id || !backendData.authenticated) return { success: false, error: 'Invalid registration service response.' };
            if (backendData.account) {
              accountId = String(backendData.account.id);
              activationCode = backendData.account.trial?.activationCode || activationCode;
              try {
              const trialRes = await fetch('/api/account/trial/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ business_name: data.businessName.trim(), store_url: data.storeUrl?.trim() || '' }),
              });
              const trialData = await trialRes.json().catch(() => ({}));
              if (!trialRes.ok || !trialData.trial_code) {
                // Account creation succeeded. A trial code can be requested again on connection.
                activationCode = '';
              } else {
                activationCode = trialData.trial_code;
              }
              } catch { /* The account is created; retry requesting its code when connecting the store. */ }
            }
          } else {
            const errData = await backendRes.json().catch(() => ({}));
            if (backendRes.status === 409) {
              return { success: false, error: errData.error || 'An account with this email already exists. Please log in instead.' };
            }
            return { success: false, error: errData.error || 'We could not create your account right now. Please try again.' };
          }
        } catch {
          return { success: false, error: 'ZAMERIA registration service is temporarily undergoing scheduled maintenance. Please try again shortly.' };
        }
      }

      const userPhone = data.phone?.trim() || '';
      const isNigeria = data.currency === 'NGN' || isNigerianCountry(data.country || 'Nigeria');
      const userCountry = isNigeria ? 'Nigeria' : (data.country || 'International');
      const userCurrency: 'NGN' | 'USD' = isNigeria ? 'NGN' : 'USD';
      const userCurrencySymbol: '₦' | '$' = isNigeria ? '₦' : '$';

      // STATE A: Account Created, Trial Not Started, NO license, NO subscription!
      const newCustomer: CustomerProfile = {
        id: accountId,
        fullName: resolvedName,
        businessName: data.businessName.trim(),
        email: trimmedEmail,
        phone: userPhone,
        country: userCountry,
        currency: userCurrency,
        currencySymbol: userCurrencySymbol,
        accountStatus: 'trial_not_started',
        trial: {
          status: 'not_started',
          activationCode,
          startDate: null,
          endDate: null,
          totalDays: 7,
          daysRemaining: 7,
          activatedStore: null,
        },
        connectedStore: {
          name: data.businessName.trim() || 'No store connected',
          url: data.storeUrl || '',
          status: 'not_connected',
          connectedAt: null,
          lastSyncAt: null,
          errorMessage: null,
        },
        subscription: {
          status: 'none',
          planId: null,
          planName: 'None (Trial Eligible)',
          price: userCurrencySymbol + '0',
          currency: userCurrency,
          currencySymbol: userCurrencySymbol,
          amountNumber: 0,
          billingCycle: 'monthly',
          startDate: null,
          renewsAt: null,
        },
        activationCode,
        trialDaysRemaining: 7,
        trialEndsAt: '',
        plan: null,
        planPrice: 'None (Trial Eligible)',
        billingCycle: 'monthly',
        nextBillingDate: '',
        storesCount: 0,
        staffAllowance: 2,
        billingAddress: {
          firstName,
          lastName,
          company: data.businessName.trim(),
          address: data.storeAddress?.trim() || (isNigeria ? 'Victoria Island' : 'Commercial Suite'),
          city: isNigeria ? 'Lagos' : 'Metro City',
          state: isNigeria ? 'Lagos State' : 'State',
          country: userCountry,
          phone: userPhone,
        },
        paymentMethods: [],
        orders: [],
        licenses: [], // NO LICENSE CREATED!
      };


      users.push(newCustomer);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      invalidateAccountRequests();
      persistSession(newCustomer);

      // Signup attribution and lead capture happen in the authenticated server gateway.

      return { success: true };
    } catch {
      return { success: false, error: 'Could not create account. Please try again.' };
    }
  };

  // --- TRIAL ACTIVATION VIA PLUGIN ---
  const activateTrial = async (
    code?: string,
    storeData?: { name?: string; url?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (!customer) return { success: false, error: 'No authenticated customer profile.' };

    const expectedCode = (code || customer.trial?.activationCode || customer.activationCode || '').toUpperCase().trim();
    const storeName = storeData?.name || customer.businessName || 'My WooCommerce Store';
    const storeUrl = storeData?.url || 'https://mystore.ng';

    // 1. Authoritative Scoreflip Backend Activation if configured
    if (SCOREFLIP_BACKEND_URL) {
      try {
        const res = await fetch('/api/account/trial/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: expectedCode,
            store: {
              id: `str_wc_${Date.now().toString().slice(-6)}`,
              name: storeName,
              url: storeUrl,
            },
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { success: false, error: err.error || 'Failed to activate trial.' };
        }

        const data = await res.json();
        if (data.account?.trial?.endDate && Date.parse(data.account.trial.endDate) > Date.now()) {
          const acc = data.account;
          const updated: CustomerProfile = {
            ...customer,
            accountStatus: 'trial_active',
            trial: {
              status: 'active',
              activationCode: expectedCode,
              startDate: acc.trial?.startDate,
              endDate: acc.trial?.endDate,
              totalDays: 7,
              daysRemaining: acc.trial?.daysRemaining ?? 7,
              activatedStore: acc.trial?.activatedStore,
            },
            connectedStore: {
              name: acc.connectedStore?.name || storeName,
              url: acc.connectedStore?.url || storeUrl,
              status: 'connected',
              connectedAt: acc.connectedStore?.connectedAt,
              lastSyncAt: 'Just now',
              errorMessage: null,
            },
            subscription: {
              status: 'trial',
              planId: null,
              planName: 'Free Trial',
              price: '₦0',
              billingCycle: 'monthly',
              startDate: acc.trial?.startDate,
              renewsAt: null,
            },
            trialDaysRemaining: acc.trial?.daysRemaining ?? 7,
            trialEndsAt: acc.trial?.endDate || '',
            plan: null,
            planPrice: 'Free Trial (₦0)',
            nextBillingDate: acc.trial?.endDate || '',
            storesCount: 1,
          };
          persistSession(updated);

          // AUTOMATIC LEAD TRIAL ACTIVATION INTEGRATION
          try {
            leadCaptureClient.recordTrialStarted({
              accountId: updated.id,
              email: updated.email,
              startDate: acc.trial?.startDate || undefined,
              endDate: acc.trial?.endDate || undefined,
              storeName: acc.connectedStore?.name || storeName,
              storeUrl: acc.connectedStore?.url || storeUrl,
              activationCode: expectedCode,
            });
          } catch (err) {
            console.warn('[ZAMERIA Auth] Lead trial activation sync error:', err);
          }

          return { success: true };
        }
      } catch {
        // Scoreflip backend offline fallback
      }
    }

    return { success: false, error: 'Could not verify trial activation with ZAMERIA. Please retry online.' };
  };

  const retryStoreConnection = async (): Promise<{ success: boolean; error?: string }> => {
    if (!customer) return { success: false, error: 'No customer profile.' };
    try {
      const data = await accountRequest('session');
      if (String(data.account?.id) !== String(customer.id)) throw new Error('Your account session has changed. Please sign in again.');
      const confirmed = confirmedStore(data.account);
      // Use a functional update: an in-flight refresh must not restore a signed-out account.
      setCustomer(previous => {
        if (!previous || previous.id !== customer.id) return previous;
        const updated: CustomerProfile = { ...previous, connectedStore: {
          ...previous.connectedStore,
          ...(confirmed || {}),
          status: confirmed ? 'connected' : 'not_connected',
          lastSyncAt: previous.connectedStore.lastSyncAt,
          errorMessage: confirmed ? null : 'Connect ZAMERIA inside your WordPress dashboard first.',
        } };
        try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated)); } catch {}
        return updated;
      });
      return confirmed ? { success: true } : { success: false, error: 'No store connection confirmed yet. Install and connect the plugin in WordPress, then check again.' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Could not check your store connection. Please retry online.' };
    }
  };

  const disconnectStore = async (): Promise<{success:boolean;error?:string}> => {
    if(!customer)return {success:false,error:'Sign in again'};
    try { const data=await accountRequest('store/disconnect',{store_url:customer.connectedStore.url});
      if(data.success!==true)throw Error('Store disconnect was not confirmed');
      setCustomer(previous=>{if(!previous || previous.id!==customer.id)return previous;const updated={...previous,connectedStore:{...previous.connectedStore,status:'not_connected' as const,url:'',name:'No store connected',connectedAt:null}};localStorage.setItem(STORAGE_KEY_AUTH,JSON.stringify(updated));return updated});return {success:true};
    }catch(e){return {success:false,error:e instanceof Error?e.message:'Could not disconnect store'}}
  };

  const logout = () => {
    persistSession(null);
    void accountRequest('logout', {}).catch(() => {});
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try { const data = await accountRequest('forgot-password', { email: email.trim().toLowerCase() });
      if (data.success !== true) throw new Error('Recovery request was not confirmed'); return { success: true };
    } catch (error) { return { success: false, error: error instanceof Error ? error.message : 'Could not request recovery' }; }
  };
  const updateProfile = async (data: { fullName: string; email: string }): Promise<{ success: boolean; error?: string }> => {
    if (!customer) return { success: false, error: 'Please sign in again' };
    if (data.email.trim().toLowerCase() !== customer.email.toLowerCase()) return { success: false, error: 'Email changes require verification. Your login email has not been changed.' };
    try { const response = await accountRequest('profile', { fullName: data.fullName.trim() });
      if (String(response.account?.id) !== String(customer.id) || response.account?.email?.toLowerCase() !== customer.email.toLowerCase()) throw new Error('Profile update was not confirmed');
      setCustomer(previous => {
        if (!previous || previous.id !== customer.id) return previous;
        const updated = { ...previous, fullName: response.account.full_name || previous.fullName };
        try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated)); } catch {}
        return updated;
      }); return { success: true };
    } catch (error) { return { success: false, error: error instanceof Error ? error.message : 'Could not save profile' }; }
  };

  const changePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!customer) return { success: false, error: 'Not authenticated' };
    if (!currentPass) return { success: false, error: 'Current password is required.' };
    if (newPass.length < 8) return { success: false, error: 'New password must be at least 8 characters.' };
    try {
      const confirmation = await accountRequest('change-password', { currentPassword: currentPass, newPassword: newPass });
      if (confirmation.success !== true) throw new Error('Password change was not confirmed. Please try again.');
      persistSession(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Could not change password' };
    }
  };

  const updateBillingAddress = async (address: BillingAddress): Promise<{success:boolean;error?:string}> => {
    if(!customer)return {success:false,error:'Sign in again'};
    try{const data=await accountRequest('profile',{billingAddress:address});if(String(data.account?.id)!==customer.id || !data.account?.billing_address)throw Error('Billing address was not confirmed');
      setCustomer(previous=>{if(!previous||previous.id!==customer.id)return previous;const updated={...previous,billingAddress:data.account.billing_address};localStorage.setItem(STORAGE_KEY_AUTH,JSON.stringify(updated));return updated});return {success:true};
    }catch(e){return {success:false,error:e instanceof Error?e.message:'Could not save billing address'}}
  };

  const addPaymentMethod = (card: Omit<PaymentMethodItem, 'id' | 'isDefault'>) => {
    if (!customer) return;
    const newPm: PaymentMethodItem = {
      ...card,
      id: `pm_${Date.now().toString().slice(-4)}`,
      isDefault: customer.paymentMethods.length === 0,
    };
    persistSession({
      ...customer,
      paymentMethods: [...customer.paymentMethods, newPm],
    });
  };

  const removePaymentMethod = (id: string) => {
    if (!customer) return;
    let nextList = customer.paymentMethods.filter((pm) => pm.id !== id);
    if (nextList.length > 0 && !nextList.some((pm) => pm.isDefault)) {
      nextList[0].isDefault = true;
    }
    persistSession({ ...customer, paymentMethods: nextList });
  };

  const setDefaultPaymentMethod = (id: string) => {
    if (!customer) return;
    const nextList = customer.paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }));
    persistSession({ ...customer, paymentMethods: nextList });
  };

  // Billing management resolves the authenticated provider on the server.
  const cancelSubscription = () => { if (typeof window !== 'undefined') window.location.assign('/account?tab=billing'); };
  const resumeSubscription = cancelSubscription;
  const changePlan = (newPlan: 'Starter' | 'Business', _cycle: 'monthly' | 'yearly' = 'yearly') => {
    if(typeof window!=='undefined')window.location.assign(`/subscribe?plan=${newPlan.toLowerCase()}`);
  };

  // The dashboard only changes after the server has verified the provider receipt.
  // This deliberately does not create a payment, order, or license in the browser.
  const recordVerifiedPayment = (receipt: {
    license_key: string;
    plan: 'starter' | 'business';
    expires_at: string;
    store_domain?: string;
    payment_reference?: string;
    country?: string;
    currency?: 'NGN' | 'USD';
    amount?: number;
    price?: string;
    provider?: 'paddle' | 'paystack';
  }) => {
    if (!customer || !receipt.license_key) return;
    if (customer.licenses.some((license) => license.licenseKey === receipt.license_key)) return;
    const plan: 'Starter' | 'Business' = receipt.plan === 'starter' ? 'Starter' : 'Business';

    const isUsd = receipt.currency === 'USD'
      || (receipt.country && !isNigerianCountry(receipt.country))
      || customer.currency === 'USD'
      || (customer.country && !isNigerianCountry(customer.country))
      || (typeof receipt.amount === 'number' && receipt.amount < 1000)
      || receipt.price?.includes('$');

    const currency: 'NGN' | 'USD' = isUsd ? 'USD' : 'NGN';
    const currencySymbol: '₦' | '$' = isUsd ? '$' : '₦';
    const country = receipt.country || customer.country || (isUsd ? 'International' : 'Nigeria');

    const price = receipt.price || (isUsd
      ? (plan === 'Starter' ? '$250 / year' : '$400 / year')
      : (plan === 'Starter' ? '₦200,000 / year' : '₦300,000 / year'));

    const amountNumber = typeof receipt.amount === 'number'
      ? receipt.amount
      : (isUsd ? (plan === 'Starter' ? 250 : 400) : (plan === 'Starter' ? 200000 : 300000));

    const total = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amountNumber);

    const expiresAt = new Date(receipt.expires_at);
    const expiryLabel = Number.isNaN(expiresAt.getTime()) ? receipt.expires_at : expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const now = new Date();
    const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const idSuffix = receipt.license_key.replace(/[^a-z0-9]/gi, '').slice(-12).toLowerCase();
    const licenseId = `lic_${idSuffix}`;
    const orderId = `ord_${receipt.payment_reference || idSuffix}`;
    const orderNumber = `#ZM-${(receipt.payment_reference || idSuffix).slice(-8).toUpperCase()}`;

    const license: LicenseItem = {
      id: licenseId,
      licenseKey: receipt.license_key,
      plan,
      planName: `${plan} Plan`,
      billingCycle: 'yearly',
      price,
      currency,
      currencySymbol,
      amountNumber,
      status: 'Active',
      connectedDomain: null,
      requestedDomain: receipt.store_domain || null,
      activationStatus: 'Not Activated',
      activatedAt: null,
      expiresAt: expiryLabel,
      orderId,
      orderNumber,
      features: [],
    };

    const order: OrderItem = {
      id: orderId,
      orderNumber,
      date: dateLabel,
      status: 'Completed',
      plan: `${plan} Plan (Annual)`,
      total,
      currency,
      currencySymbol,
      amountNumber,
      invoiceNumber: `${receipt.provider === 'paddle' ? 'PADDLE' : 'PAYSTACK'}-${(receipt.payment_reference || idSuffix).slice(-10).toUpperCase()}`,
      paymentMethod: receipt.provider === 'paddle' ? 'Paddle' : 'Paystack',
      billingName: `${customer.fullName} • ${customer.businessName}`,
      billingEmail: customer.email,
      items: [`ZAMERIA ${plan} Plan Subscription`, `License Key ${receipt.license_key}`],
      licenseId,
      licenseKey: receipt.license_key,
      licenseStatus: 'Active',
      connectedDomain: receipt.store_domain || null,
      transactionRef: receipt.payment_reference,
    };

    persistSession({
      ...customer,
      accountStatus: 'active_business',
      plan,
      planPrice: price,
      country,
      currency,
      currencySymbol,
      billingCycle: 'yearly',
      nextBillingDate: expiryLabel,
      trial: { ...customer.trial, status: 'expired', daysRemaining: 0 },
      trialDaysRemaining: 0,
      subscription: {
        ...customer.subscription,
        status: 'active',
        planId: plan,
        planName: `${plan} Plan`,
        price,
        currency,
        currencySymbol,
        amountNumber,
        billingCycle: 'yearly',
        startDate: dateLabel,
        renewsAt: expiryLabel,
        cancelledAt: null,
      },
      licenses: [license, ...customer.licenses],
      orders: [order, ...customer.orders],
    });
  };

  // --- STATE 4: Paid Subscription & License Generation ---
  // A license is ONLY created after successful payment for a paid plan.
  // Idempotent: checks transactionRef to prevent duplicate subscriptions or licenses.
  const subscribeToPlan = async (_data: any): Promise<{ success: boolean; license: LicenseItem; order: OrderItem; isDuplicate?: boolean }> => {
    throw new Error('Use secure checkout. Subscriptions require a verified server payment.');
  };
  const purchaseNewLicense = subscribeToPlan;
  const activateLicenseDomain = (_licenseId: string, _domain: string) => ({ success: false, error: 'Connect and activate the plugin inside WordPress.' });
  const renewLicense = (_licenseId: string) => ({ success: false, error: 'Use secure checkout to renew this licence.' });
  const renewExpiredSubscription = async () => ({ success: false });

  // --- Scenario Quick-Tester (Validating all 8 Lifecycle Tests) ---
  const simulateLifecycleScenario = (scenario: LifecycleScenario) => {
    if (!(import.meta as any).env?.DEV) return;
    if (!customer) return;

    switch (scenario) {
      case 'state_a_trial_not_started':
      case 'test1_new_trial': {
        // State A: Account Created, Trial Not Started, 0 licenses, Activation Code ready.
        persistSession(DEMO_TRIAL_CUSTOMER);
        break;
      }

      case 'state_b_trial_active':
      case 'test2_active_trial': {
        // State B: Plugin Verified, 7-Day Countdown Running, Store Connected, 0 licenses!
        persistSession(DEMO_TRIAL_ACTIVE_CUSTOMER);
        break;
      }

      case 'state_c_trial_expired':
      case 'test8_expired_trial': {
        // State C: Trial ended without subscribing. 0 licenses, Choose Plan prompt.
        const c: CustomerProfile = {
          ...DEMO_TRIAL_ACTIVE_CUSTOMER,
          accountStatus: 'trial_expired',
          trial: {
            status: 'expired',
            activationCode: 'ZAM-7F4K-92XP',
            startDate: 'September 5, 2026',
            endDate: 'September 12, 2026',
            totalDays: 7,
            daysRemaining: 0,
            activatedStore: {
              name: 'Lagos Skincare Lab',
              url: 'https://skincarelab.ng',
            },
          },
          subscription: {
            status: 'expired',
            planId: null,
            planName: 'Expired Trial',
            price: '₦0',
            billingCycle: 'monthly',
            startDate: 'September 5, 2026',
            renewsAt: null,
          },
          trialDaysRemaining: 0,
          trialEndsAt: 'September 12, 2026',
          plan: null,
          planPrice: 'Expired',
          licenses: [], // NO LICENSE CREATED!
          orders: [],
        };
        persistSession(c);
        break;
      }

      case 'state_d_paid_business':
      case 'test3_paid_business': {
        // State D: Upgraded to Business. Active subscription, generated ZMR license!
        persistSession(DEMO_PAID_CUSTOMER);
        break;
      }

      case 'state_e_cancelled_business':
      case 'test4_cancelled_business': {
        // State E: Cancelled subscription. Access and license remain active until renewsAt date!
        const c: CustomerProfile = {
          ...DEMO_PAID_CUSTOMER,
          accountStatus: 'cancelled',
          subscription: {
            ...DEMO_PAID_CUSTOMER.subscription,
            status: 'cancelled',
            cancelledAt: 'September 12, 2026',
          },
        };
        persistSession(c);
        break;
      }

      case 'state_f_expired_subscription':
      case 'test5_expired_subscription': {
        // State F: Subscription expired. License marked expired, renewal CTA shown.
        const c: CustomerProfile = {
          ...DEMO_PAID_CUSTOMER,
          accountStatus: 'expired',
          subscription: {
            ...DEMO_PAID_CUSTOMER.subscription,
            status: 'expired',
          },
          licenses: DEMO_PAID_CUSTOMER.licenses.map((l) => ({ ...l, status: 'Expired' as LicenseStatus })),
        };
        persistSession(c);
        break;
      }

      case 'test6_renewed_business': {
        // Test 6: Renewed after expiration.
        persistSession({
          ...DEMO_PAID_CUSTOMER,
          accountStatus: 'active_business',
          subscription: {
            ...DEMO_PAID_CUSTOMER.subscription,
            status: 'active',
            renewsAt: 'November 12, 2026',
          },
        });
        break;
      }

      case 'test7_duplicate_webhook': {
        // Test 7: Duplicate webhook arrival (idempotency demonstrated via subscribeToPlan)
        // Ensure no duplicates exist in state
        const uniqueLicenses = Array.from(new Map(DEMO_PAID_CUSTOMER.licenses.map((l) => [l.id, l])).values());
        persistSession({
          ...DEMO_PAID_CUSTOMER,
          licenses: uniqueLicenses,
        });
        break;
      }
    }
  };

  const subscriptionState = resolveSubscriptionState(customer);
  const isTrialNotStarted = customer
    ? subscriptionState === 'no_active_plan' && (customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started')
    : false;
  const isTrial = subscriptionState === 'trial_active' || isTrialNotStarted;
  const isPaid = subscriptionState === 'paid_active';
  const daysRemaining = calculateTrialDaysRemaining(customer);
  const planLabel = customer?.subscription?.planName || customer?.plan || 'Business';

  const verifyPluginAccess = (domain?: string) => checkPluginEntitlement(customer, domain);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isRestoringSession,
        isTrial,
        isTrialNotStarted,
        isPaid,
        daysRemaining,
        planLabel,
        verifyPluginAccess,
        activateTrial,
        retryStoreConnection,
        disconnectStore,
        login,
        register,
        logout,
        requestPasswordReset,
        updateProfile,
        changePassword,
        updateBillingAddress,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        changePlan,
        cancelSubscription,
        resumeSubscription,
        subscribeToPlan,
        recordVerifiedPayment,
        purchaseNewLicense,
        activateLicenseDomain,
        renewLicense,
        renewExpiredSubscription,
        simulateLifecycleScenario,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export default CustomerAuthContext;
