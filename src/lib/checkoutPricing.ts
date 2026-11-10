import { resolveGeoPricing, type GeoPricingConfig, type PlanId } from './geoPricing';

interface PricingCustomer {
  country?: string;
  currency?: string;
  billingAddress?: { country?: string };
}

/** Preserve an explicit quote, then use the account region or detected location. */
export function checkoutPricing(customer: PricingCustomer | null | undefined, country: string | null | undefined, currency: string | null | undefined, fallback: GeoPricingConfig): GeoPricingConfig {
  // A restored account must not change the price/currency the buyer just selected.
  // This only resolves a new checkout; existing subscription prices stay unchanged.
  if (country?.trim()) return resolveGeoPricing(country);
  if (currency === 'NGN' || currency === 'USD') return resolveGeoPricing(currency === 'NGN' ? 'NG' : 'US');
  const accountCountry = customer?.country || customer?.billingAddress?.country;
  if (accountCountry) return resolveGeoPricing(accountCountry);
  if (customer?.currency) return resolveGeoPricing(customer.currency === 'NGN' ? 'NG' : 'US');
  return fallback;
}

export function planCheckoutUrl(plan: PlanId, pricing: GeoPricingConfig): string {
  return `/subscribe?${new URLSearchParams({ plan, country: pricing.isNigeria ? 'NG' : pricing.countryCode === 'INT' ? 'US' : pricing.countryCode, currency: pricing.currency })}`;
}
