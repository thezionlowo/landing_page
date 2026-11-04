import { resolveGeoPricing, type GeoPricingConfig, type PlanId } from './geoPricing';

interface PricingCustomer {
  country?: string;
  currency?: string;
  billingAddress?: { country?: string };
}

/** Keep a customer's billing region; otherwise preserve the region they chose. */
export function checkoutPricing(customer: PricingCustomer | null | undefined, country: string | null | undefined, currency: string | null | undefined, fallback: GeoPricingConfig): GeoPricingConfig {
  const lockedCountry = customer?.country || customer?.billingAddress?.country;
  if (lockedCountry) return resolveGeoPricing(lockedCountry);
  if (customer?.currency) return resolveGeoPricing(customer.currency === 'NGN' ? 'NG' : 'US');
  if (country?.trim()) return resolveGeoPricing(country);
  if (currency === 'NGN' || currency === 'USD') return resolveGeoPricing(currency === 'NGN' ? 'NG' : 'US');
  return fallback;
}

export function planCheckoutUrl(plan: PlanId, pricing: GeoPricingConfig): string {
  return `/subscribe?${new URLSearchParams({ plan, country: pricing.isNigeria ? 'NG' : pricing.countryCode === 'INT' ? 'US' : pricing.countryCode, currency: pricing.currency })}`;
}
