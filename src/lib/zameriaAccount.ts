import { ZAMERIA_API_BASE } from './zameriaCheckout';

/**
 * Merchant accounts, held by the licensing service rather than by the browser.
 *
 * They used to live in localStorage alone, so an account existed only on the
 * device that created it: signing in elsewhere reported that it did not exist,
 * and the same address could be registered over and over.
 */

const TOKEN_KEY = 'zameria.account.token';

export interface ZameriaAccount {
  email: string;
  fullName: string;
  businessName: string;
  phone: string;
  createdAt: string;
}

export class AccountUnavailableError extends Error {}

const toAccount = (raw: any): ZameriaAccount => ({
  email: typeof raw?.email === 'string' ? raw.email : '',
  fullName: typeof raw?.full_name === 'string' ? raw.full_name : '',
  businessName: typeof raw?.business_name === 'string' ? raw.business_name : '',
  phone: typeof raw?.phone === 'string' ? raw.phone : '',
  createdAt: typeof raw?.created_at === 'string' ? raw.created_at : '',
});

export const storedAccountToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const rememberAccountToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* the session simply will not survive a reload */
  }
};

export const forgetAccountToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing to forget */
  }
};

async function post(path: string, body: unknown): Promise<any> {
  let response: Response;
  try {
    response = await fetch(`${ZAMERIA_API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AccountUnavailableError('We could not reach ZAMERIA. Check your connection and try again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export async function registerZameriaAccount(input: {
  fullName: string;
  businessName: string;
  phone?: string;
  email: string;
  password: string;
}): Promise<ZameriaAccount> {
  const data = await post('/account/register', {
    full_name: input.fullName,
    business_name: input.businessName,
    phone: input.phone || '',
    email: input.email,
    password: input.password,
  });
  if (data.token) rememberAccountToken(data.token);
  return toAccount(data.account);
}

export async function loginZameriaAccount(input: { email: string; password: string }): Promise<ZameriaAccount> {
  const data = await post('/account/login', { email: input.email, password: input.password });
  if (data.token) rememberAccountToken(data.token);
  return toAccount(data.account);
}

/** Confirms a stored session on load; null means it is gone or expired. */
export async function fetchZameriaAccount(): Promise<ZameriaAccount | null> {
  const token = storedAccountToken();
  if (!token) return null;
  try {
    const response = await fetch(`${ZAMERIA_API_BASE}/account/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) {
      forgetAccountToken();
      return null;
    }
    if (!response.ok) return null;
    const data = await response.json();
    return toAccount(data.account);
  } catch {
    // Offline: keep the session and let the cached profile stand.
    return null;
  }
}

export interface AccountLicense {
  code: string;
  plan: string;
  isTrial: boolean;
  status: 'issued' | 'active' | 'expired';
  storeDomain: string;
  activatedAt: string;
  expiresAt: string;
  daysRemaining: number;
}

const authHeaders = (): HeadersInit => ({ Authorization: `Bearer ${storedAccountToken()}` });

/**
 * Every trial and licence on the account, with its code. Read on each visit so
 * the code is there whenever the merchant needs to enter it again, and so a
 * redeemed trial shows its remaining days rather than reading as new.
 */
export async function fetchAccountLicenses(): Promise<AccountLicense[]> {
  if (!storedAccountToken()) return [];
  const response = await fetch(`${ZAMERIA_API_BASE}/account/licenses`, { headers: authHeaders() });
  if (!response.ok) {
    if (response.status === 401) forgetAccountToken();
    return [];
  }
  const data = await response.json().catch(() => ({}));
  return (Array.isArray(data.licenses) ? data.licenses : []).map((raw: any) => ({
    code: typeof raw?.code === 'string' ? raw.code : '',
    plan: typeof raw?.plan === 'string' ? raw.plan : '',
    isTrial: Boolean(raw?.is_trial),
    status: raw?.status === 'active' || raw?.status === 'expired' ? raw.status : 'issued',
    storeDomain: typeof raw?.store_domain === 'string' ? raw.store_domain : '',
    activatedAt: typeof raw?.activated_at === 'string' ? raw.activated_at : '',
    expiresAt: typeof raw?.expires_at === 'string' ? raw.expires_at : '',
    daysRemaining: typeof raw?.days_remaining === 'number' ? raw.days_remaining : 0,
  }));
}

/** Starts a trial for a store. The service takes the owner from the session. */
export async function requestAccountTrial(input: { businessName: string; storeUrl: string }): Promise<AccountLicense[]> {
  if (!storedAccountToken()) {
    throw new Error('Please sign in to start your trial.');
  }
  let response: Response;
  try {
    response = await fetch(`${ZAMERIA_API_BASE}/trial/request`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_name: input.businessName, store_url: input.storeUrl }),
    });
  } catch {
    throw new AccountUnavailableError('We could not reach ZAMERIA. Check your connection and try again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'We could not start a trial for this store.');
  }
  return fetchAccountLicenses();
}

/**
 * Clears trials whose code was never stored, so the store can start again with
 * one that stays in the account. The service refuses any trial it can show.
 */
export async function resetStuckTrials(storeUrl?: string): Promise<{ cleared: number; kept: number }> {
  if (!storedAccountToken()) throw new Error('Please sign in first.');
  const response = await fetch(`${ZAMERIA_API_BASE}/account/trial/reset`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ store_url: storeUrl || '' }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Could not reset this store.');
  return { cleared: Number(data.cleared) || 0, kept: Number(data.kept) || 0 };
}
