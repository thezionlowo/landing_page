import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AccountUnavailableError,
  forgetAccountToken,
  loginZameriaAccount,
  registerZameriaAccount,
} from '../lib/zameriaAccount';

export type LicenseStatus = 'Active' | 'Not Activated' | 'Expired' | 'Suspended' | 'Revoked';

export type AccountStatus =
  | 'trial_not_started'
  | 'trial_active'
  | 'trial_expiring'
  | 'trial_expired'
  | 'active_business'
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
  status: LicenseStatus;
  connectedDomain: string | null;
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

// Calculate mathematically exact remaining days from trial end date
export const calculateTrialDaysRemaining = (profile: CustomerProfile | null, currentTimeMs: number = Date.now()): number => {
  if (!profile) return 0;
  if (profile.subscription?.status === 'active' || profile.accountStatus === 'active_business') return 0;
  if (profile.accountStatus === 'trial_expired' || profile.trial?.status === 'expired') return 0;
  if (profile.accountStatus === 'trial_not_started' || profile.trial?.status === 'not_started') return 0;

  if (profile.trial?.endDate) {
    const endMs = new Date(profile.trial.endDate).getTime();
    if (!isNaN(endMs)) {
      const diffMs = endMs - currentTimeMs;
      if (diffMs <= 0) return 0;
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return Math.min(days, profile.trial.totalDays || 7);
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

  // 1. Paid active user
  if (profile.subscription?.status === 'active' || (profile.licenses && profile.licenses.some(l => l.status === 'Active'))) {
    const activeLicense = profile.licenses.find(l => l.status === 'Active' && (!domain || !l.connectedDomain || l.connectedDomain === domain));
    return {
      allowed: true,
      status: 'paid_active',
      planName: profile.subscription?.planName || 'Business Plan',
      licenseRequired: true,
      licenseKey: activeLicense?.licenseKey || profile.licenses[0]?.licenseKey,
      message: 'Active subscription and license verified. Full WooCommerce plugin access active.',
    };
  }

  // 2. Past due / Grace period
  if (profile.subscription?.status === 'past_due') {
    return {
      allowed: true,
      status: 'past_due',
      planName: profile.subscription.planName,
      licenseRequired: true,
      message: 'Subscription payment past due. Grace period active. Please update your payment method.',
    };
  }

  // 3. Paid subscription expired (Evaluated before trial to avoid misclassifying paid users)
  if (
    profile.subscription?.status === 'expired' ||
    profile.accountStatus === 'expired' ||
    (profile.licenses && profile.licenses.length > 0 && profile.licenses.every((l) => l.status === 'Expired'))
  ) {
    return {
      allowed: false,
      status: 'paid_expired',
      planName: profile.subscription?.planName || (profile.licenses && profile.licenses[0]?.planName) || 'Business Plan',
      licenseRequired: true,
      message: 'Subscription and license have expired. Please renew your plan to restore plugin functionality.',
    };
  }

  // 4. Trial not started (State A)
  if (profile.trial?.status === 'not_started' || profile.accountStatus === 'trial_not_started') {
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
  if (profile.trial?.status === 'active' && daysLeft > 0) {
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
  if (profile.accountStatus === 'trial_expired' || profile.trial?.status === 'expired' || (profile.trial?.status === 'active' && daysLeft <= 0)) {
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
  disconnectStore: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    businessName: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { fullName: string; email: string }) => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; error?: string };
  updateBillingAddress: (address: BillingAddress) => void;
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
  const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZMR-${seg()}-${seg()}-${seg()}`;
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
    city: 'Lagos',
    state: 'Lagos State',
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
    city: 'Lagos',
    state: 'Lagos State',
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

const STORAGE_KEY_AUTH = 'zameria_customer_session_v2';
const STORAGE_KEY_USERS = 'zameria_registered_customers_v2';

// Configurable external Scoreflip backend URL (provided via environment variables)
const SCOREFLIP_BACKEND_URL: string =
  (typeof import.meta !== 'undefined' &&
    ((import.meta as any).env?.VITE_SCOREFLIP_BACKEND_URL || (import.meta as any).env?.VITE_BACKEND_URL)) ||
  '';

/**
 * The local shape of a freshly signed-in account. ZAMERIA holds the account
 * itself; everything below is the browser's working copy of it, rebuilt from
 * scratch when someone signs in on a device that has never seen them.
 */
const blankProfile = (fullName: string, businessName: string, email: string, password?: string): CustomerProfile => {
  const parts = fullName.trim().split(' ');
  return {
    id: `acc_zm_${hashEmailForId(email)}`,
    fullName: fullName.trim(),
    businessName: businessName.trim(),
    email: email.trim().toLowerCase(),
    phone: '',
    password,
    accountStatus: 'trial_not_started',
    trial: { status: 'not_started', activationCode: '', startDate: null, endDate: null, totalDays: 7, daysRemaining: 7, activatedStore: null },
    connectedStore: { name: 'No store connected', url: '', status: 'not_connected', connectedAt: null, lastSyncAt: null },
    subscription: { status: 'none', planId: null, planName: 'None (Trial Eligible)', price: '₦0', billingCycle: 'yearly', startDate: null, renewsAt: null },
    activationCode: '',
    trialDaysRemaining: 7,
    trialEndsAt: '',
    plan: null,
    planPrice: 'None (Trial Eligible)',
    billingCycle: 'yearly',
    nextBillingDate: '',
    storesCount: 0,
    staffAllowance: 2,
    billingAddress: {
      firstName: parts[0] || 'Store',
      lastName: parts.slice(1).join(' ') || 'Owner',
      company: businessName.trim(),
      address: '',
      city: '',
      state: '',
      country: 'Nigeria',
      phone: '',
    },
    paymentMethods: [],
    orders: [],
    licenses: [],
  };
};

/** A stable local id for an account, so the same person keeps one record. */
function hashEmailForId(email: string): string {
  let hash = 0;
  const value = email.trim().toLowerCase();
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default session: unauthenticated (null) unless a valid session exists
    return null;
  });

  const persistSession = (c: CustomerProfile | null) => {
    setCustomer(c);
    try {
      if (c) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(c));
        const existing = localStorage.getItem(STORAGE_KEY_USERS);
        let users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
        const index = users.findIndex((u) => u.email.toLowerCase() === c.email.toLowerCase());
        if (index >= 0) {
          users[index] = c;
        } else {
          users.push(c);
        }
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
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

    const syncWithBackend = async () => {
      try {
        const queryId = customer.id || customer.email;
        const res = await fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/account/${encodeURIComponent(queryId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.account) {
            const acc = data.account;
            setCustomer((prev) => {
              if (!prev) return prev;
              const isCancelled = acc.accountStatus === 'cancelled' || acc.subscription?.status === 'cancelled';
              const isTrialActive = acc.trial?.status === 'active';
              const isExpired = acc.trial?.status === 'expired' || acc.accountStatus === 'expired';
              const isPaid = !isCancelled && !isExpired && (acc.subscription?.status === 'active' || (acc.licenses && acc.licenses.length > 0));

              let accountStatus = prev.accountStatus;
              if (isCancelled) accountStatus = 'cancelled';
              else if (isPaid) accountStatus = 'active_business';
              else if (isExpired) accountStatus = 'trial_expired';
              else if (isTrialActive) accountStatus = 'trial_active';
              else if (acc.accountStatus === 'trial_not_started') accountStatus = 'trial_not_started';

              // Only update if something changed
              const storeName = acc.connectedStore?.name || prev.connectedStore.name;
              const storeUrl = acc.connectedStore?.url || prev.connectedStore.url;
              const storeStatus = acc.connectedStore?.status || prev.connectedStore.status;

              const next: CustomerProfile = {
                ...prev,
                id: acc.id || prev.id,
                fullName: acc.fullName || prev.fullName,
                accountStatus,
                trial: {
                  ...prev.trial,
                  status: acc.trial?.status || prev.trial.status,
                  activationCode: acc.trial?.activationCode || prev.trial.activationCode,
                  startDate: acc.trial?.startDate || prev.trial.startDate,
                  endDate: acc.trial?.endDate || prev.trial.endDate,
                  daysRemaining: acc.trial?.daysRemaining ?? prev.trial.daysRemaining,
                  activatedStore: acc.trial?.activatedStore || (storeStatus === 'connected' ? { name: storeName, url: storeUrl } : null),
                },
                connectedStore: {
                  ...prev.connectedStore,
                  name: storeName,
                  url: storeUrl,
                  status: storeStatus,
                  connectedAt: acc.connectedStore?.connectedAt || prev.connectedStore.connectedAt,
                },
                subscription: {
                  ...prev.subscription,
                  status: acc.subscription?.status || prev.subscription.status,
                  planName: acc.subscription?.planName || prev.subscription.planName,
                  price: acc.subscription?.price || prev.subscription.price,
                  renewsAt: acc.subscription?.renewsAt || prev.subscription.renewsAt,
                },
                licenses: acc.licenses && acc.licenses.length > 0 ? acc.licenses : prev.licenses,
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
      } catch {
        // ZAMERIA cloud offline
      }
    };

    syncWithBackend();
    const timer = setInterval(syncWithBackend, 3000);
    return () => clearInterval(timer);
  }, [customer?.id, customer?.email]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!pass) {
      return { success: false, error: 'Please enter your password.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 0. The ZAMERIA licensing service holds the account. It is the only copy
    //    that exists on more than one device, so it decides whether the sign-in
    //    succeeds; the local record below is a cache of the richer profile.
    try {
      const account = await loginZameriaAccount({ email: trimmedEmail, password: pass });
      const existing = localStorage.getItem(STORAGE_KEY_USERS);
      const users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
      const cached = users.find((u) => u.email.toLowerCase() === account.email.toLowerCase());
      persistSession(
        cached
          ? { ...cached, fullName: account.fullName || cached.fullName, businessName: account.businessName || cached.businessName }
          : blankProfile(account.fullName, account.businessName, account.email, pass),
      );
      return { success: true };
    } catch (err) {
      // Only fall through when ZAMERIA itself could not be reached; a refused
      // sign-in is an answer, not a reason to consult the browser's own copy.
      if (!(err instanceof AccountUnavailableError)) {
        return { success: false, error: err instanceof Error ? err.message : 'Could not sign you in.' };
      }
    }

    // 1. Try Authoritative Scoreflip Backend if configured
    if (SCOREFLIP_BACKEND_URL) {
      try {
        const res = await fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password: pass }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.account) {
            const acc = data.account;
            const existing = localStorage.getItem(STORAGE_KEY_USERS);
            const users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
            const localMatch = users.find((u) => u.email.toLowerCase() === trimmedEmail);

            const isTrialActive = acc.trial?.status === 'active';
            const isExpired = acc.trial?.status === 'expired';
            const isPaid = acc.subscription?.status === 'active' || (acc.licenses && acc.licenses.length > 0);

            let accountStatus: AccountStatus = 'trial_not_started';
            if (isPaid) accountStatus = 'active_business';
            else if (isExpired) accountStatus = 'trial_expired';
            else if (isTrialActive) accountStatus = 'trial_active';

            const storeName = acc.connectedStore?.name || localMatch?.connectedStore.name || 'No store connected';
            const storeUrl = acc.connectedStore?.url || localMatch?.connectedStore.url || '';
            const storeStatus = acc.connectedStore?.status || localMatch?.connectedStore.status || 'not_connected';

            const profile: CustomerProfile = {
              id: acc.id || localMatch?.id || `acc_${Date.now()}`,
              fullName: acc.fullName || localMatch?.fullName || 'Store Owner',
              businessName: acc.businessName || localMatch?.businessName || 'ZAMERIA Store',
              email: trimmedEmail,
              phone: acc.phone || localMatch?.phone || '+234 800 000 0000',
              password: pass,
              accountStatus,
              trial: {
                status: acc.trial?.status || localMatch?.trial.status || 'not_started',
                activationCode: acc.trial?.activationCode || localMatch?.trial.activationCode || generateActivationCode(),
                startDate: acc.trial?.startDate || localMatch?.trial.startDate || null,
                endDate: acc.trial?.endDate || localMatch?.trial.endDate || null,
                totalDays: 7,
                daysRemaining: acc.trial?.daysRemaining ?? localMatch?.trial.daysRemaining ?? 7,
                activatedStore: acc.trial?.activatedStore || (storeStatus === 'connected' ? { name: storeName, url: storeUrl } : null),
              },
              connectedStore: {
                name: storeName,
                url: storeUrl,
                status: storeStatus,
                connectedAt: acc.connectedStore?.connectedAt || localMatch?.connectedStore.connectedAt || null,
                lastSyncAt: acc.connectedStore?.lastSyncAt || localMatch?.connectedStore.lastSyncAt || null,
                errorMessage: null,
              },
              subscription: {
                status: acc.subscription?.status || localMatch?.subscription.status || 'none',
                planId: acc.subscription?.planId || localMatch?.subscription.planId || null,
                planName: acc.subscription?.planName || localMatch?.subscription.planName || 'None (Trial Eligible)',
                price: acc.subscription?.price || localMatch?.subscription.price || '₦0',
                billingCycle: acc.subscription?.billingCycle || localMatch?.subscription.billingCycle || 'monthly',
                startDate: acc.subscription?.startDate || localMatch?.subscription.startDate || null,
                renewsAt: acc.subscription?.renewsAt || localMatch?.subscription.renewsAt || null,
              },
              activationCode: acc.trial?.activationCode || localMatch?.activationCode || generateActivationCode(),
              trialDaysRemaining: acc.trial?.daysRemaining ?? localMatch?.trialDaysRemaining ?? 7,
              trialEndsAt: acc.trial?.endDate || localMatch?.trialEndsAt || '',
              plan: acc.subscription?.planId || localMatch?.plan || null,
              planPrice: acc.subscription?.price || localMatch?.planPrice || 'None (Trial Eligible)',
              billingCycle: acc.subscription?.billingCycle || localMatch?.billingCycle || 'monthly',
              nextBillingDate: acc.subscription?.renewsAt || localMatch?.nextBillingDate || '',
              storesCount: storeStatus === 'connected' ? 1 : 0,
              staffAllowance: acc.subscription?.planId === 'Starter' ? 2 : 999,
              billingAddress: localMatch?.billingAddress || {
                firstName: (acc.fullName || '').split(' ')[0] || 'Store',
                lastName: (acc.fullName || '').split(' ').slice(1).join(' ') || 'Owner',
                company: acc.businessName || 'Business',
                address: 'Lekki Phase 1',
                city: 'Lagos',
                state: 'Lagos State',
                country: 'Nigeria',
                phone: '+234 800 000 0000',
              },
              paymentMethods: localMatch?.paymentMethods || [],
              orders: localMatch?.orders || [],
              licenses: acc.licenses || localMatch?.licenses || [],
            };

            persistSession(profile);
            return { success: true };
          }
        } else if (res.status === 401) {
          const errData = await res.json().catch(() => ({}));
          return { success: false, error: errData.error || 'Incorrect password. Please try again.' };
        }
      } catch {
        // Scoreflip backend offline, fallback to local storage
      }
    }

    // 2. Fallback to localStorage
    try {
      const existing = localStorage.getItem(STORAGE_KEY_USERS);
      const users: CustomerProfile[] = existing ? JSON.parse(existing) : [DEMO_TRIAL_CUSTOMER, DEMO_PAID_CUSTOMER];
      const match = users.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (!match) {
        if (trimmedEmail === DEMO_TRIAL_CUSTOMER.email.toLowerCase()) {
          persistSession(DEMO_TRIAL_CUSTOMER);
          return { success: true };
        }
        if (trimmedEmail === DEMO_PAID_CUSTOMER.email.toLowerCase()) {
          persistSession(DEMO_PAID_CUSTOMER);
          return { success: true };
        }
        return {
          success: false,
          error: 'No ZAMERIA customer account found with this email. Please click Get Started to start your 7-day free trial.',
        };
      }

      if (match.password && match.password !== pass) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      persistSession(match);
      return { success: true };
    } catch {
      persistSession(DEMO_TRIAL_CUSTOMER);
      return { success: true };
    }
  };

  // --- STATE 1: Account Created / Trial Not Started ---
  const register = async (data: {
    fullName: string;
    businessName: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trimmedEmail = data.email.trim().toLowerCase();

    // Register with ZAMERIA first. The browser's own list cannot tell whether
    // this email already has an account, because it only ever sees the accounts
    // made on this device — which is how one person ended up with several.
    try {
      const account = await registerZameriaAccount({
        fullName: data.fullName,
        businessName: data.businessName,
        email: trimmedEmail,
        password: data.password,
      });
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      const known: CustomerProfile[] = stored ? JSON.parse(stored) : [];
      const profile = blankProfile(account.fullName, account.businessName, account.email, data.password);
      localStorage.setItem(
        STORAGE_KEY_USERS,
        JSON.stringify([...known.filter((u) => u.email.toLowerCase() !== account.email.toLowerCase()), profile]),
      );
      persistSession(profile);
      return { success: true };
    } catch (err) {
      if (!(err instanceof AccountUnavailableError)) {
        return { success: false, error: err instanceof Error ? err.message : 'Could not create your account.' };
      }
      // ZAMERIA unreachable: fall through and keep the person moving locally.
    }

    try {
      const existing = localStorage.getItem(STORAGE_KEY_USERS);
      const users: CustomerProfile[] = existing ? JSON.parse(existing) : [];
      if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        return {
          success: false,
          error: 'A ZAMERIA account with this email already exists. Please log in instead.',
        };
      }

      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || 'Store';
      const lastName = nameParts.slice(1).join(' ') || 'Owner';

      let activationCode = generateActivationCode();
      let accountId = `acc_zm_${Date.now().toString().slice(-6)}`;

      // Register with Scoreflip backend if URL is configured
      if (SCOREFLIP_BACKEND_URL) {
        try {
          const backendRes = await fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: data.fullName.trim(),
              businessName: data.businessName.trim(),
              email: trimmedEmail,
              password: data.password,
            }),
          });
          if (backendRes.ok) {
            const backendData = await backendRes.json();
            if (backendData.account) {
              accountId = backendData.account.id;
              activationCode = backendData.account.trial?.activationCode || activationCode;
            }
          } else {
            const errData = await backendRes.json().catch(() => ({}));
            return {
              success: false,
              error: errData.error || 'An account with this email address already exists in ZAMERIA Cloud.',
            };
          }
        } catch {
          // Fallback to local storage if server is unreachable
        }
      }

      // STATE A: Account Created, Trial Not Started, NO license, NO subscription!
      const newCustomer: CustomerProfile = {
        id: accountId,
        fullName: data.fullName.trim(),
        businessName: data.businessName.trim(),
        email: trimmedEmail,
        phone: '+234 800 000 0000',
        password: data.password,
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
          name: 'No store connected',
          url: '',
          status: 'not_connected',
          connectedAt: null,
          lastSyncAt: null,
          errorMessage: null,
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
          address: 'Victoria Island',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
          phone: '+234 800 000 0000',
        },
        paymentMethods: [],
        orders: [],
        licenses: [], // NO LICENSE CREATED!
      };

      users.push(newCustomer);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      persistSession(newCustomer);
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
        const res = await fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/trial/activate`, {
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
        if (data.account) {
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
          return { success: true };
        }
      } catch {
        // Scoreflip backend offline fallback
      }
    }

    if (code && expectedCode && code.trim().toUpperCase() !== expectedCode) {
      return { success: false, error: 'Invalid Trial Activation Code. Please check the code and try again.' };
    }

    if (customer.subscription?.status === 'active' || (customer.licenses && customer.licenses.length > 0)) {
      return { success: false, error: 'This account already has an active paid subscription.' };
    }

    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const startStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const endStr = trialEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const updated: CustomerProfile = {
      ...customer,
      accountStatus: 'trial_active',
      trial: {
        status: 'active',
        activationCode: expectedCode || generateActivationCode(),
        startDate: startStr,
        endDate: endStr,
        totalDays: 7,
        daysRemaining: 7,
        activatedStore: {
          name: storeName,
          url: storeUrl,
        },
      },
      connectedStore: {
        name: storeName,
        url: storeUrl,
        status: 'connected',
        connectedAt: startStr,
        lastSyncAt: 'Just now',
        errorMessage: null,
      },
      subscription: {
        status: 'trial',
        planId: null,
        planName: 'Free Trial',
        price: '₦0',
        billingCycle: 'monthly',
        startDate: startStr,
        renewsAt: null,
      },
      trialDaysRemaining: 7,
      trialEndsAt: endStr,
      plan: null,
      planPrice: 'Free Trial (₦0)',
      nextBillingDate: endStr,
      storesCount: 1,
    };

    persistSession(updated);
    return { success: true };
  };

  const retryStoreConnection = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!customer) return { success: false, error: 'No customer profile.' };

    const updated: CustomerProfile = {
      ...customer,
      connectedStore: {
        ...customer.connectedStore,
        status: 'connected',
        lastSyncAt: 'Just now',
        errorMessage: null,
      },
    };
    persistSession(updated);
    return { success: true };
  };

  const disconnectStore = () => {
    if (!customer) return;
    const updated: CustomerProfile = {
      ...customer,
      connectedStore: {
        name: 'No store connected',
        url: '',
        status: 'not_connected',
        connectedAt: null,
        lastSyncAt: null,
        errorMessage: null,
      },
    };
    persistSession(updated);
  };

  const logout = () => {
    forgetAccountToken();
    persistSession(null);
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (!email || !email.trim() || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    return { success: true };
  };

  const updateProfile = (data: { fullName: string; email: string }) => {
    if (!customer) return;
    const updated = {
      ...customer,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
    };
    persistSession(updated);

    // Sync profile to Scoreflip backend if configured
    if (SCOREFLIP_BACKEND_URL) {
      fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/auth/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: customer.id,
          email: customer.email,
          fullName: data.fullName,
          businessName: customer.businessName,
        }),
      }).catch(() => {});
    }
  };

  const changePassword = (currentPass: string, newPass: string): { success: boolean; error?: string } => {
    if (!customer) return { success: false, error: 'Not authenticated' };
    if (!currentPass) {
      return { success: false, error: 'Current password is required.' };
    }
    if (customer.password && customer.password !== currentPass) {
      return { success: false, error: 'Current password does not match.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    persistSession({ ...customer, password: newPass });

    // Sync updated password to Scoreflip backend if configured
    if (SCOREFLIP_BACKEND_URL) {
      fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: customer.id,
          email: customer.email,
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      }).catch(() => {});
    }

    return { success: true };
  };

  const updateBillingAddress = (address: BillingAddress) => {
    if (!customer) return;
    persistSession({ ...customer, billingAddress: address });
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

  // --- Cancel Paid Subscription ---
  // Access & license stay active until end of current billing period!
  const cancelSubscription = () => {
    if (!customer) return;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const updated: CustomerProfile = {
      ...customer,
      accountStatus: 'cancelled',
      subscription: {
        ...customer.subscription,
        status: 'cancelled',
        cancelledAt: nowStr,
      },
    };
    persistSession(updated);

    if (SCOREFLIP_BACKEND_URL) {
      try {
        fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/subscription/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: customer.id,
            email: customer.email,
          }),
        }).catch(() => {});
      } catch {
        // Ignore network errors
      }
    }
  };

  const resumeSubscription = () => {
    if (!customer) return;
    const updated: CustomerProfile = {
      ...customer,
      accountStatus: 'active_business',
      subscription: {
        ...customer.subscription,
        status: 'active',
        cancelledAt: null,
      },
    };
    persistSession(updated);
  };

  const changePlan = (newPlan: 'Starter' | 'Business', cycle: 'monthly' | 'yearly' = 'yearly') => {
    if (!customer) return;
    const price = newPlan === 'Starter' ? '₦200,000 / year' : '₦300,000 / year';
    const updated: CustomerProfile = {
      ...customer,
      plan: newPlan,
      planPrice: price,
      billingCycle: 'yearly',
      subscription: {
        ...customer.subscription,
        planId: newPlan,
        planName: `${newPlan} Plan`,
        price,
        billingCycle: 'yearly',
        status: 'active',
      },
      accountStatus: 'active_business',
    };
    persistSession(updated);
  };

  // --- STATE 4: Paid Subscription & License Generation ---
  // A license is ONLY created after successful payment for a paid plan.
  // Idempotent: checks transactionRef to prevent duplicate subscriptions or licenses.
  const subscribeToPlan = async (data: {
    plan: 'Starter' | 'Business';
    billingCycle?: 'monthly' | 'yearly';
    paymentMethodId?: string;
    transactionRef?: string;
  }): Promise<{ success: boolean; license: LicenseItem; order: OrderItem; isDuplicate?: boolean }> => {
    if (!customer) throw new Error('Not authenticated');

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Idempotency check: if transactionRef already exists, return existing record
    if (data.transactionRef) {
      const existingOrder = customer.orders.find((o) => o.transactionRef === data.transactionRef);
      if (existingOrder && existingOrder.licenseId) {
        const existingLic = customer.licenses.find((l) => l.id === existingOrder.licenseId);
        if (existingLic) {
          return { success: true, license: existingLic, order: existingOrder, isDuplicate: true };
        }
      }
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const startStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const renewStr = periodEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const orderDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let priceStr = '₦300,000 / year';
    let amountNumber = 300000;
    let totalStr = '₦300,000';

    if (data.plan === 'Starter') {
      priceStr = '₦200,000 / year';
      amountNumber = 200000;
      totalStr = '₦200,000';
    } else {
      priceStr = '₦300,000 / year';
      amountNumber = 300000;
      totalStr = '₦300,000';
    }

    // Generate strict ZMR-XXXX-XXXX-XXXX key
    const newLicenseKey = generateLicenseKey();
    const orderNum = `#ZM-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord_${Date.now().toString().slice(-5)}`;
    const licenseId = `lic_${Date.now().toString().slice(-5)}`;

    const defaultPm = customer.paymentMethods.find((p) => p.isDefault) || customer.paymentMethods[0];
    const paymentMethodDesc = defaultPm
      ? `${defaultPm.brand} ending in ${defaultPm.last4}`
      : 'Card Payment (Mastercard ending in 4092)';

    // Ensure a default card exists on account after payment
    let updatedPaymentMethods = customer.paymentMethods;
    if (updatedPaymentMethods.length === 0) {
      updatedPaymentMethods = [
        {
          id: 'pm_4092',
          brand: 'Mastercard',
          last4: '4092',
          expMonth: '09',
          expYear: '28',
          isDefault: true,
        },
      ];
    }

    const newLicense: LicenseItem = {
      id: licenseId,
      licenseKey: newLicenseKey,
      plan: data.plan,
      planName: `${data.plan} Plan`,
      billingCycle: 'yearly',
      price: priceStr,
      status: 'Active',
      connectedDomain: null,
      activationStatus: 'Not Activated',
      activatedAt: null,
      expiresAt: renewStr,
      orderId,
      orderNumber: orderNum,
      features:
        data.plan === 'Starter'
          ? [
              '1 WooCommerce store',
              '1 physical store/location',
              'Up to 500 products',
              'Up to 2 staff members',
              'Point of Sale and inventory synchronization',
            ]
          : [
              '1 WooCommerce store',
              '1 physical store/location',
              'Unlimited products',
              'Unlimited staff members',
              'Point of Sale and real-time inventory synchronization',
            ],
    };

    const newOrder: OrderItem = {
      id: orderId,
      orderNumber: orderNum,
      date: orderDateStr,
      status: 'Completed',
      plan: `${data.plan} Plan (${data.billingCycle === 'yearly' ? 'Annual' : 'Monthly'})`,
      total: totalStr,
      amountNumber,
      invoiceNumber: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: paymentMethodDesc,
      billingName: `${customer.fullName} • ${customer.businessName}`,
      billingEmail: customer.email,
      licenseId,
      licenseKey: newLicenseKey,
      licenseStatus: 'Active',
      connectedDomain: null,
      transactionRef: data.transactionRef || `txn_${Date.now()}`,
      items: [
        `ZAMERIA ${data.plan} Plan Subscription`,
        'WooCommerce Real-time Sync Entitlement',
        `License Key ${newLicenseKey} (Generated & Active)`,
      ],
    };

    const updatedCustomer: CustomerProfile = {
      ...customer,
      accountStatus: 'active_business',
      plan: data.plan,
      planPrice: priceStr,
      billingCycle: data.billingCycle || 'yearly',
      nextBillingDate: renewStr,
      paymentMethods: updatedPaymentMethods,
      trial: {
        ...customer.trial,
        status: 'expired',
        daysRemaining: 0,
      },
      trialDaysRemaining: 0,
      subscription: {
        status: 'active',
        planId: data.plan,
        planName: `${data.plan} Plan`,
        price: priceStr,
        billingCycle: data.billingCycle || 'yearly',
        startDate: startStr,
        renewsAt: renewStr,
        cancelledAt: null,
      },
      licenses: [newLicense, ...(customer.licenses || [])],
      orders: [newOrder, ...(customer.orders || [])],
    };

    // Synchronize upgrade with authoritative Scoreflip backend if configured
    if (SCOREFLIP_BACKEND_URL) {
      try {
        fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/subscription/upgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: customer.id,
            email: customer.email,
            planName: `${data.plan} Plan`,
            price: priceStr,
            licenseKey: newLicenseKey,
          }),
        }).catch(() => {});
      } catch {
        // Ignore network errors
      }
    }

    persistSession(updatedCustomer);
    return { success: true, license: newLicense, order: newOrder, isDuplicate: false };
  };

  // Re-use subscribeToPlan for purchasing additional licenses
  const purchaseNewLicense = subscribeToPlan;

  // Domain activation simulator
  const activateLicenseDomain = (licenseId: string, domain: string): { success: boolean; error?: string } => {
    if (!customer) return { success: false, error: 'Not authenticated' };
    if (!domain || !domain.trim()) {
      return { success: false, error: 'Please enter a store domain (e.g. brandone.com).' };
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const now = new Date();
    const activatedAtStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const updatedLicenses = customer.licenses.map((lic) => {
      if (lic.id === licenseId) {
        return {
          ...lic,
          connectedDomain: cleanDomain,
          status: 'Active' as LicenseStatus,
          activationStatus: 'Activated' as const,
          activatedAt: activatedAtStr,
        };
      }
      return lic;
    });

    const updatedOrders = customer.orders.map((ord) => {
      if (ord.licenseId === licenseId) {
        return {
          ...ord,
          connectedDomain: cleanDomain,
          licenseStatus: 'Active' as LicenseStatus,
        };
      }
      return ord;
    });

    persistSession({
      ...customer,
      licenses: updatedLicenses,
      orders: updatedOrders,
    });

    if (SCOREFLIP_BACKEND_URL) {
      try {
        fetch(`${SCOREFLIP_BACKEND_URL}/api/v1/license/bind`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: customer.id,
            licenseId,
            domain: cleanDomain,
          }),
        }).catch(() => {});
      } catch {
        // Ignore network errors
      }
    }

    return { success: true };
  };

  const renewLicense = (licenseId: string): { success: boolean; error?: string } => {
    if (!customer) return { success: false, error: 'Not authenticated' };

    const updatedLicenses = customer.licenses.map((lic) => {
      if (lic.id === licenseId) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const expiresAtStr = nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return {
          ...lic,
          status: 'Active' as LicenseStatus,
          expiresAt: expiresAtStr,
        };
      }
      return lic;
    });

    persistSession({
      ...customer,
      licenses: updatedLicenses,
    });

    return { success: true };
  };

  const renewExpiredSubscription = async (): Promise<{ success: boolean }> => {
    if (!customer) return { success: false };
    const plan = (customer.subscription.planId as 'Starter' | 'Business') || 'Business';
    const res = await subscribeToPlan({
      plan,
      billingCycle: customer.billingCycle || 'yearly',
      transactionRef: `renew_${Date.now()}`,
    });
    return { success: res.success };
  };

  // --- Scenario Quick-Tester (Validating all 8 Lifecycle Tests) ---
  const simulateLifecycleScenario = (scenario: LifecycleScenario) => {
    if (!customer) return;

    const baseInfo = {
      fullName: customer.fullName || 'Zion Lowo',
      businessName: customer.businessName || 'Zion Business Ltd.',
      email: customer.email || 'zion@business.ng',
      phone: customer.phone || '+234 802 345 6789',
      billingAddress: customer.billingAddress,
    };

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

  const isTrialNotStarted = customer
    ? customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started'
    : false;
  const isTrial = customer
    ? customer.subscription?.status === 'trial' ||
      customer.accountStatus === 'trial_active' ||
      customer.accountStatus === 'trial_not_started' ||
      customer.trial?.status === 'active' ||
      customer.trial?.status === 'not_started'
    : false;
  const isPaid = customer
    ? customer.subscription?.status === 'active' ||
      customer.subscription?.status === 'cancelled' ||
      customer.subscription?.status === 'past_due' ||
      (customer.licenses && customer.licenses.length > 0)
    : false;
  const daysRemaining = calculateTrialDaysRemaining(customer);
  const planLabel = customer?.subscription?.planName || customer?.plan || 'Business';

  const verifyPluginAccess = (domain?: string) => checkPluginEntitlement(customer, domain);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
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
