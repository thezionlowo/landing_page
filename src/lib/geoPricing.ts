/**
 * ZAMERIA AUTHORITATIVE GEO-PRICING SERVICE & ENGINE
 * Single source of truth for all country, currency, plan, and price definitions.
 *
 * Rules:
 * 1. Nigeria (NG): Starter ₦200,000/year; Business ₦300,000/year.
 * 2. All countries outside Nigeria: Starter $250/year; Business $400/year.
 * 3. These are fixed prices — currencies are NEVER converted via FX rates.
 * 4. Subscriptions lock their currency and amount upon creation.
 */

export type PlanId = 'starter' | 'business';
export type PlanTier = 'Starter' | 'Business';
export type CurrencyCode = 'NGN' | 'USD';
export type CurrencySymbol = '₦' | '$';

export interface PlanPricing {
  id: PlanId;
  plan: PlanTier;
  planName: string;
  amount: number;
  currency: CurrencyCode;
  currencySymbol: CurrencySymbol;
  priceFormatted: string; // e.g. "₦200,000 / year" or "$250 / year"
  displayPrice: string; // e.g. "₦200,000" or "$250"
  priceFormattedWithInterval: string; // e.g. "₦200,000 / year" or "$250 / year"
  billingCycle: 'yearly';
  features: string[];
}

export interface GeoPricingConfig {
  country: string; // e.g. "Nigeria", "United States", "United Kingdom"
  countryCode: string; // "NG", "US", "GB", etc.
  isNigeria: boolean;
  currency: CurrencyCode;
  currencySymbol: CurrencySymbol;
  plans: {
    starter: PlanPricing;
    business: PlanPricing;
    Starter: PlanPricing;
    Business: PlanPricing;
  };
}

export const STARTER_FEATURES = [
  '1 WooCommerce store',
  '1 physical store/location',
  'Up to 500 products',
  'Up to 2 staff members',
  'Point of Sale and inventory synchronization',
];

export const BUSINESS_FEATURES = [
  '1 WooCommerce store',
  '1 physical store/location',
  'Unlimited products',
  'Unlimited staff members',
  'Point of Sale and real-time inventory synchronization',
];

const ngStarterPlan: PlanPricing = {
  id: 'starter',
  plan: 'Starter',
  planName: 'Starter Plan',
  amount: 200000,
  currency: 'NGN',
  currencySymbol: '₦',
  displayPrice: '₦200,000',
  priceFormatted: '₦200,000 / year',
  priceFormattedWithInterval: '₦200,000 / year',
  billingCycle: 'yearly',
  features: STARTER_FEATURES,
};

const ngBusinessPlan: PlanPricing = {
  id: 'business',
  plan: 'Business',
  planName: 'Business Plan',
  amount: 300000,
  currency: 'NGN',
  currencySymbol: '₦',
  displayPrice: '₦300,000',
  priceFormatted: '₦300,000 / year',
  priceFormattedWithInterval: '₦300,000 / year',
  billingCycle: 'yearly',
  features: BUSINESS_FEATURES,
};

export const NIGERIA_PRICING: GeoPricingConfig = {
  country: 'Nigeria',
  countryCode: 'NG',
  isNigeria: true,
  currency: 'NGN',
  currencySymbol: '₦',
  plans: {
    starter: ngStarterPlan,
    business: ngBusinessPlan,
    Starter: ngStarterPlan,
    Business: ngBusinessPlan,
  },
};

const intlStarterPlan: PlanPricing = {
  id: 'starter',
  plan: 'Starter',
  planName: 'Starter Plan',
  amount: 250,
  currency: 'USD',
  currencySymbol: '$',
  displayPrice: '$250',
  priceFormatted: '$250 / year',
  priceFormattedWithInterval: '$250 / year',
  billingCycle: 'yearly',
  features: STARTER_FEATURES,
};

const intlBusinessPlan: PlanPricing = {
  id: 'business',
  plan: 'Business',
  planName: 'Business Plan',
  amount: 400,
  currency: 'USD',
  currencySymbol: '$',
  displayPrice: '$400',
  priceFormatted: '$400 / year',
  priceFormattedWithInterval: '$400 / year',
  billingCycle: 'yearly',
  features: BUSINESS_FEATURES,
};

export const INTERNATIONAL_PRICING: GeoPricingConfig = {
  country: 'International',
  countryCode: 'INT',
  isNigeria: false,
  currency: 'USD',
  currencySymbol: '$',
  plans: {
    starter: intlStarterPlan,
    business: intlBusinessPlan,
    Starter: intlStarterPlan,
    Business: intlBusinessPlan,
  },
};

/**
 * Checks if a country name or code refers to Nigeria.
 * If empty or undefined, defaults to Nigeria to preserve existing Nigerian operations.
 */
export function isNigerianCountry(countryOrCode?: string | null): boolean {
  if (!countryOrCode || !countryOrCode.trim()) return true;
  const clean = countryOrCode.trim().toUpperCase();
  return clean === 'NG' || clean === 'NGA' || clean === 'NIGERIA';
}

/**
 * Resolves authoritative geo pricing configuration for a given country or code.
 * Non-Nigerian countries strictly map to USD International fixed pricing.
 */
export function resolveGeoPricing(countryOrCode?: string | null): GeoPricingConfig {
  if (isNigerianCountry(countryOrCode)) {
    return NIGERIA_PRICING;
  }
  const clean = countryOrCode?.trim() || 'International';
  return {
    ...INTERNATIONAL_PRICING,
    country: clean,
    countryCode: clean.length === 2 ? clean.toUpperCase() : 'INT',
  };
}

/**
 * Resolves plan pricing from locked customer details or current country.
 * Flexible signature accepting either (country, plan) or (plan, country).
 * If lockedPrice is provided, it ALWAYS takes precedence to preserve currency locking.
 */
export function getAuthoritativePlanPrice(
  a?: string | null,
  b?: string | null,
  lockedPrice?: string | null
): string {
  if (lockedPrice && (lockedPrice.includes('₦') || lockedPrice.includes('$') || lockedPrice.includes('Gifted'))) {
    return lockedPrice;
  }
  const strA = String(a || '').trim().toLowerCase();
  const strB = String(b || '').trim().toLowerCase();

  const isPlanA = strA === 'starter' || strA === 'business';
  const planStr = isPlanA ? strA : strB;
  const countryOrCurrency = isPlanA ? b : a;

  const isBusiness = planStr.includes('business');
  const isNigeria = isNigerianCountry(countryOrCurrency) || (countryOrCurrency && countryOrCurrency.toUpperCase() === 'NGN');

  if (isNigeria) {
    return isBusiness ? '₦300,000 / year' : '₦200,000 / year';
  }
  return isBusiness ? '$400 / year' : '$250 / year';
}

/**
 * Resolves raw plan amount in major currency units (200000 or 250).
 * Flexible signature accepting either (country, plan) or (plan, country).
 */
export function getAuthoritativePlanAmount(
  a?: string | null,
  b?: string | null,
  lockedAmount?: number | null
): number {
  if (typeof lockedAmount === 'number' && lockedAmount > 0) {
    return lockedAmount;
  }
  const strA = String(a || '').trim().toLowerCase();
  const strB = String(b || '').trim().toLowerCase();

  const isPlanA = strA === 'starter' || strA === 'business';
  const planStr = isPlanA ? strA : strB;
  const countryOrCurrency = isPlanA ? b : a;

  const isBusiness = planStr.includes('business');
  const isNigeria = isNigerianCountry(countryOrCurrency) || (countryOrCurrency && countryOrCurrency.toUpperCase() === 'NGN');

  if (isNigeria) {
    return isBusiness ? 300000 : 200000;
  }
  return isBusiness ? 400 : 250;
}

/**
 * Resolves currency symbol ('₦' or '$') from country or currency code.
 */
export function getCurrencySymbol(countryOrCurrency?: string | null): CurrencySymbol {
  if (isNigerianCountry(countryOrCurrency) || countryOrCurrency?.toUpperCase() === 'NGN') {
    return '₦';
  }
  return '$';
}

/**
 * Resolves currency code ('NGN' or 'USD') from country or currency code.
 */
export function getCurrencyCode(countryOrCurrency?: string | null): CurrencyCode {
  if (isNigerianCountry(countryOrCurrency) || countryOrCurrency?.toUpperCase() === 'NGN') {
    return 'NGN';
  }
  return 'USD';
}
