// Live ZAMERIA licensing checkout.
//
// Every paid license is created by the licensing service after Paystack confirms
// the payment. Nothing in the browser ever mints, guesses or stores a key.

export const ZAMERIA_API_BASE = (
  (import.meta as any).env?.VITE_ZAMERIA_API_URL ||
  'https://scoreflip-go-hwsgspeycq-uc.a.run.app/api/v1/zameria'
).replace(/\/$/, '');

export type ZameriaPlan = 'starter' | 'business';

export const PAYMENT_COMPLETE_PATH = '/payment/complete';

export const ZAMERIA_PLANS: Record<ZameriaPlan, { label: string; price: string; amountKobo: number }> = {
  starter: { label: 'Starter', price: '₦200,000 / year', amountKobo: 20000000 },
  business: { label: 'Business', price: '₦300,000 / year', amountKobo: 30000000 },
};

export interface CheckoutResult {
  reference: string;
  authorization_url: string;
  access_code: string;
  amount_kobo: number;
  currency: string;
}

export interface VerifiedCheckout {
  licenseKey: string;
  plan: string;
  email: string;
  storeUrl: string;
  raw: Record<string, unknown>;
}

/** Thrown while Paystack has taken the payment but the service has not finished confirming it. */
export class CheckoutPendingError extends Error {}

const REFERENCE_STORAGE_KEY = 'zameria.checkout.reference';

/** Accepts `mystore.com` as readily as `https://mystore.com/`. */
export const normalizeStoreUrl = (value: string): string => {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const rememberCheckoutReference = (reference: string) => {
  try {
    window.sessionStorage.setItem(REFERENCE_STORAGE_KEY, reference);
    window.localStorage.setItem(REFERENCE_STORAGE_KEY, reference);
  } catch {
    /* storage unavailable — the Paystack callback still carries the reference */
  }
};

export const recallCheckoutReference = (): string => {
  try {
    return (
      window.sessionStorage.getItem(REFERENCE_STORAGE_KEY) ||
      window.localStorage.getItem(REFERENCE_STORAGE_KEY) ||
      ''
    );
  } catch {
    return '';
  }
};

export const forgetCheckoutReference = () => {
  try {
    window.sessionStorage.removeItem(REFERENCE_STORAGE_KEY);
    window.localStorage.removeItem(REFERENCE_STORAGE_KEY);
  } catch {
    /* nothing to clean up */
  }
};

/** Where Paystack returns the buyer once the payment is done. */
export const checkoutCallbackUrl = (): string => `${window.location.origin}${PAYMENT_COMPLETE_PATH}`;

/**
 * Opens a real Paystack transaction for the chosen plan. The licensing service
 * owns the amount; the browser supplies who is buying, which store the license
 * is for, and where Paystack should return them afterwards.
 */
export async function startZameriaCheckout(input: {
  plan: ZameriaPlan;
  email: string;
  businessName?: string;
  storeUrl: string;
  callbackUrl?: string;
}): Promise<CheckoutResult> {
  const body: Record<string, string> = {
    plan: input.plan,
    email: input.email.trim(),
    store_url: normalizeStoreUrl(input.storeUrl),
    callback_url: input.callbackUrl || checkoutCallbackUrl(),
  };
  if (input.businessName && input.businessName.trim()) {
    body.business_name = input.businessName.trim();
  }

  let response: Response;
  try {
    response = await fetch(`${ZAMERIA_API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We could not reach the ZAMERIA payment service. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({} as any));
  if (!response.ok || !data.authorization_url) {
    throw new Error(data.error || 'Unable to start the secure payment. Please try again.');
  }

  rememberCheckoutReference(data.reference);
  return data as CheckoutResult;
}

const pickString = (source: Record<string, unknown>, ...keys: string[]): string => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

/** One verification attempt. Throws CheckoutPendingError while Paystack is still settling. */
export async function verifyZameriaCheckout(reference: string): Promise<VerifiedCheckout> {
  let response: Response;
  try {
    response = await fetch(`${ZAMERIA_API_BASE}/checkout/verify?reference=${encodeURIComponent(reference)}`);
  } catch {
    throw new CheckoutPendingError('We could not reach the ZAMERIA licensing service. Retrying…');
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (response.status === 409 || response.status === 202) {
    throw new CheckoutPendingError(
      (typeof data.error === 'string' && data.error) || 'Paystack has not confirmed this payment yet.',
    );
  }
  if (!response.ok) {
    throw new Error((typeof data.error === 'string' && data.error) || 'We could not verify this payment.');
  }

  const licenseKey = pickString(data, 'license_key', 'licenseKey', 'license');
  if (!licenseKey) {
    throw new CheckoutPendingError('Your payment is confirmed. The license key is still being issued…');
  }

  return {
    licenseKey,
    plan: pickString(data, 'plan'),
    email: pickString(data, 'email'),
    storeUrl: pickString(data, 'store_url', 'storeUrl'),
    raw: data,
  };
}

/**
 * Verifies with retries, because Paystack returns the buyer to the site a moment
 * before the webhook that finalizes the license has been processed.
 */
export async function pollZameriaCheckout(
  reference: string,
  options: { attempts?: number; intervalMs?: number; signal?: { cancelled: boolean } } = {},
): Promise<VerifiedCheckout> {
  const attempts = options.attempts ?? 10;
  const intervalMs = options.intervalMs ?? 3000;
  let lastPending: Error | null = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (options.signal?.cancelled) throw new CheckoutPendingError('Verification cancelled.');
    try {
      return await verifyZameriaCheckout(reference);
    } catch (error) {
      if (!(error instanceof CheckoutPendingError)) throw error;
      lastPending = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  throw lastPending || new CheckoutPendingError('Paystack has not confirmed this payment yet.');
}

export interface TrialResult {
  trialCode: string;
  trialDays: number;
  storeDomain: string;
}

/**
 * Asks the licensing service for a 7-day trial code for a store. The code is
 * issued dormant: the week starts when the plugin redeems it, so a merchant can
 * get their code now and install WooCommerce side later.
 */
export async function requestZameriaTrial(input: {
  email: string;
  businessName: string;
  storeUrl: string;
}): Promise<TrialResult> {
  let response: Response;
  try {
    response = await fetch(`${ZAMERIA_API_BASE}/trial/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: input.email.trim(),
        business_name: input.businessName.trim(),
        store_url: normalizeStoreUrl(input.storeUrl),
      }),
    });
  } catch {
    throw new Error('We could not reach the ZAMERIA trial service. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({} as any));
  if (!response.ok || !data.trial_code) {
    throw new Error(data.error || 'We could not start a trial for this store.');
  }
  return { trialCode: data.trial_code, trialDays: data.trial_days, storeDomain: data.store_domain };
}

export type StoreEntitlementState = 'issued' | 'active' | 'expired';

export interface StoreEntitlement {
  status: StoreEntitlementState;
  expiresAt: string;
  daysRemaining: number;
  plan?: string;
}

export interface StoreStatus {
  storeDomain: string;
  trial: StoreEntitlement | null;
  license: StoreEntitlement | null;
}

const toEntitlement = (raw: any): StoreEntitlement | null =>
  raw && typeof raw.status === 'string'
    ? {
        status: raw.status as StoreEntitlementState,
        expiresAt: typeof raw.expires_at === 'string' ? raw.expires_at : '',
        daysRemaining: typeof raw.days_remaining === 'number' ? raw.days_remaining : 0,
        plan: typeof raw.plan === 'string' ? raw.plan : undefined,
      }
    : null;

/**
 * What the plugin has done with this store: whether a trial code is waiting to
 * be redeemed, a trial is running, or a paid licence is in force. This is how
 * the account page stays in step with the WooCommerce side of the flow.
 */
export async function fetchZameriaStoreStatus(input: {
  email: string;
  storeUrl: string;
}): Promise<StoreStatus> {
  const query = new URLSearchParams({
    email: input.email.trim(),
    store_url: normalizeStoreUrl(input.storeUrl),
  });
  const response = await fetch(`${ZAMERIA_API_BASE}/store/status?${query.toString()}`);
  const data = await response.json().catch(() => ({} as any));
  if (!response.ok) {
    throw new Error(data.error || 'We could not check this store.');
  }
  return {
    storeDomain: typeof data.store_domain === 'string' ? data.store_domain : '',
    trial: toEntitlement(data.trial),
    license: toEntitlement(data.license),
  };
}
