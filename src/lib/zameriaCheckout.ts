const configuredApiBase = (import.meta as any).env?.VITE_ZAMERIA_API_URL as string | undefined;

export const ZAMERIA_API_BASE = (configuredApiBase || 'https://scoreflip-go-hwsgspeycq-uc.a.run.app/api/v1/zameria').replace(/\/$/, '');

export type ZameriaPlan = 'starter' | 'business';

export interface VerifiedCheckout {
  status?: string;
  license_id?: string;
  email?: string;
  business_name?: string;
  license_key: string;
  plan: ZameriaPlan;
  expires_at: string;
  store_domain?: string;
  payment_reference?: string;
  country?: string;
  currency?: 'NGN' | 'USD';
  amount?: number;
  price?: string;
}

export async function startZameriaCheckout(input: {
  plan: ZameriaPlan;
  email: string;
  businessName: string;
  storeUrl: string;
  callbackUrl: string;
  country?: string;
  currency?: 'NGN' | 'USD';
  amount?: number;
}): Promise<{ authorization_url: string; reference: string }> {
  const response = await fetch(`${ZAMERIA_API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: input.plan,
      email: input.email,
      business_name: input.businessName,
      store_url: input.storeUrl,
      callback_url: input.callbackUrl,
      country: input.country,
      currency: input.currency,
      amount: input.amount,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.authorization_url || !data.reference) {
    throw new Error(data.error || 'Unable to start secure checkout. Please try again.');
  }
  return data;
}

export class CheckoutVerificationError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function verifyZameriaCheckout(reference: string, signal?: AbortSignal): Promise<VerifiedCheckout> {
  const timeout = AbortSignal.timeout(12000);
  const response = await fetch(`${ZAMERIA_API_BASE}/checkout/verify?reference=${encodeURIComponent(reference)}`, { cache: 'no-store', signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.license_key) {
    throw new CheckoutVerificationError(data.error || 'Payment has not completed yet.', response.status);
  }
  if (!['starter', 'business'].includes(data.plan) || !data.store_domain || !Number.isFinite(Date.parse(data.expires_at))) throw new CheckoutVerificationError('We could not confirm the licence details. Contact support with your payment reference.', 502);
  if (Date.parse(data.expires_at) <= Date.now()) throw new CheckoutVerificationError('This licence has expired. Open your account to review your plan or contact support.', 403);
  if (data.status && data.status !== 'active') throw new CheckoutVerificationError('Your payment is recorded, but licence access is not active. Contact support before making another payment.', 403);
  return data;
}
