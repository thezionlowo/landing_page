const configuredApiBase = (import.meta as any).env?.VITE_ZAMERIA_API_URL as string | undefined;

export const ZAMERIA_API_BASE = (configuredApiBase || 'https://scoreflip-go-hwsgspeycq-uc.a.run.app/api/v1/zameria').replace(/\/$/, '');

export type ZameriaPlan = 'starter' | 'business';

export interface VerifiedCheckout {
  status?: string;
  license_key: string;
  plan: ZameriaPlan;
  expires_at: string;
  store_domain?: string;
  payment_reference?: string;
  country?: string;
  currency?: 'NGN' | 'USD';
  amount?: number;
  price?: string;
  provider?: 'paddle' | 'paystack';
  auto_renews?: boolean;
  next_billed_at?: string;
  tax_minor?: number;
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

export async function verifyZameriaCheckout(reference: string): Promise<VerifiedCheckout> {
  const response = await fetch(`${ZAMERIA_API_BASE}/checkout/verify?reference=${encodeURIComponent(reference)}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.license_key) {
    throw new Error(data.error || 'Payment has not completed yet.');
  }
  if (data.status && data.status !== 'active') throw new Error('This payment was verified, but licence access is not active. Check Plan & billing or contact support before paying again.');
  return data;
}

export interface CheckoutConfig {
  usd_provider: 'paddle' | 'paystack'; usd_available: boolean; usd_auto_renews: boolean;
  paddle_environment?: 'sandbox' | 'live'; paddle_client_token?: string;
}
export async function getCheckoutConfig(): Promise<CheckoutConfig> {
  const response = await fetch(`${ZAMERIA_API_BASE}/checkout/config`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  // An older deployed backend keeps its original Paystack checkout behaviour.
  if (response.status === 404) return { usd_provider: 'paystack', usd_available: true, usd_auto_renews: false };
  const data = await response.json();
  if (!response.ok || !['paystack', 'paddle'].includes(data.usd_provider) || typeof data.usd_available !== 'boolean') throw new Error('Could not confirm USD payment availability. Please reload.');
  return data;
}
