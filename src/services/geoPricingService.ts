import { useState, useEffect } from 'react';
import {
  GeoPricingConfig,
  NIGERIA_PRICING,
  INTERNATIONAL_PRICING,
  resolveGeoPricing,
  isNigerianCountry,
  PlanId,
  PlanTier,
} from '../lib/geoPricing';

const GEO_STORAGE_KEY = 'zameria_detected_geo_v1';
const GEO_EVENT_NAME = 'zameria_geopricing_change';

// In-memory singleton state
let activeGeoConfig: GeoPricingConfig = NIGERIA_PRICING;
let hasInitialized = false;
let initPromise: Promise<GeoPricingConfig> | null = null;

/**
 * Attempts to detect country from client runtime clues if API is offline
 */
function getClientFallbackCountry(): string {
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && (tz === 'Africa/Lagos' || tz.includes('Lagos'))) {
        return 'NG';
      }
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().includes('ng')) {
        return 'NG';
      }
    }
  } catch {
    // Ignore error
  }
  // Default to Nigeria for existing baseline
  return 'NG';
}

/**
 * Authoritatively initializes geo pricing from the backend /api/pricing endpoint
 */
export async function initializeGeoPricing(): Promise<GeoPricingConfig> {
  if (hasInitialized) return activeGeoConfig;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // 1. Check session storage cache
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(GEO_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.currency && parsed.plans) {
            activeGeoConfig = parsed;
            hasInitialized = true;
            return activeGeoConfig;
          }
        }
      } catch {
        // Continue to network fetch
      }
    }

    // 2. Fetch authoritative server-side geo detection
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/pricing', { cache: 'no-store' });
        if (res.ok) {
          const data: GeoPricingConfig = await res.json();
          if (data && data.currency && data.plans) {
            activeGeoConfig = data;
            hasInitialized = true;
            try {
              sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(data));
            } catch {
              // Ignore session storage quota
            }
            window.dispatchEvent(new CustomEvent(GEO_EVENT_NAME, { detail: data }));
            return activeGeoConfig;
          }
        }
      }
    } catch {
      // Offline or pre-render fallback
    }

    // 3. Fallback to locale heuristics if backend is unreachable
    const fallbackCode = getClientFallbackCountry();
    activeGeoConfig = resolveGeoPricing(fallbackCode);
    hasInitialized = true;
    return activeGeoConfig;
  })();

  return initPromise;
}

/**
 * Manually switch country for testing or user preference
 */
export function setCountryOverride(countryCodeOrName: string): GeoPricingConfig {
  activeGeoConfig = resolveGeoPricing(countryCodeOrName);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(activeGeoConfig));
      window.dispatchEvent(new CustomEvent(GEO_EVENT_NAME, { detail: activeGeoConfig }));
    } catch {
      // Ignore error
    }
  }
  return activeGeoConfig;
}

/**
 * Synchronously returns current active geo pricing
 */
export function getCurrentGeoPricing(): GeoPricingConfig {
  return activeGeoConfig;
}

/**
 * React hook for consuming live geo pricing
 */
export function useGeoPricing(): {
  geo: GeoPricingConfig;
  isNigeria: boolean;
  currency: string;
  currencySymbol: string;
  setCountry: (code: string) => void;
} {
  const [geo, setGeo] = useState<GeoPricingConfig>(activeGeoConfig);

  useEffect(() => {
    initializeGeoPricing().then(setGeo);

    const handleGeoChange = (e: Event) => {
      const detail = (e as CustomEvent<GeoPricingConfig>).detail;
      if (detail) setGeo(detail);
    };

    window.addEventListener(GEO_EVENT_NAME, handleGeoChange);
    return () => window.removeEventListener(GEO_EVENT_NAME, handleGeoChange);
  }, []);

  return {
    geo,
    isNigeria: geo.isNigeria,
    currency: geo.currency,
    currencySymbol: geo.currencySymbol,
    setCountry: (code: string) => setGeo(setCountryOverride(code)),
  };
}
