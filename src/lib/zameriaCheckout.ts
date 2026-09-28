const configuredApiBase = (import.meta as any).env?.VITE_ZAMERIA_API_URL as string | undefined;

export const ZAMERIA_API_BASE = (configuredApiBase || 'https://scoreflip-go-hwsgspeycq-uc.a.run.app/api/v1/zameria').replace(/\/$/, '');

export type ZameriaPlan = 'starter' | 'business';

export interface VerifiedCheckout {
  license_key: string;
  plan: ZameriaPlan;
  expires_at: string;
  store_domain?: string;
  payment_reference?: string;
}

export async function startZameriaCheckout(input: {
  plan: ZameriaPlan;
  email: string;
  businessName: string;
  storeUrl: string;
  callbackUrl: string;
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
  return data;
}
