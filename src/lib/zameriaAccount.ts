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
  createdAt: string;
}

export class AccountUnavailableError extends Error {}

const toAccount = (raw: any): ZameriaAccount => ({
  email: typeof raw?.email === 'string' ? raw.email : '',
  fullName: typeof raw?.full_name === 'string' ? raw.full_name : '',
  businessName: typeof raw?.business_name === 'string' ? raw.business_name : '',
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
  email: string;
  password: string;
}): Promise<ZameriaAccount> {
  const data = await post('/account/register', {
    full_name: input.fullName,
    business_name: input.businessName,
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
