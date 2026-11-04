import { useState, useEffect } from 'react';
import { INTERNATIONAL_PRICING, resolveGeoPricing } from '../lib/geoPricing.js';
import type { GeoPricingConfig } from '../lib/geoPricing.js';

// v2 invalidates the old cache, which could silently keep Nigerian fallback prices.
const GEO_STORAGE_KEY = 'zameria_detected_geo_v2';
const GEO_EVENT_NAME = 'zameria_geopricing_change';
const DETECTION_TTL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 2500;

let activeGeoConfig: GeoPricingConfig = INTERNATIONAL_PRICING;
let hasInitialized = false;
let initPromise: Promise<GeoPricingConfig> | null = null;
let manualRevision = 0;

/** Accept the detected region, but always use our current fixed plan prices. */
function normalizePricing(value: unknown): GeoPricingConfig | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  if (typeof data.countryCode !== 'string' || !data.countryCode.trim()) return null;
  const pricing = resolveGeoPricing(data.countryCode);
  return data.currency === pricing.currency ? pricing : null;
}

function publish(pricing: GeoPricingConfig): GeoPricingConfig {
  activeGeoConfig = pricing;
  hasInitialized = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GEO_EVENT_NAME, { detail: pricing }));
  }
  return pricing;
}

function cache(pricing: GeoPricingConfig, manual = false) {
  try {
    sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify({
      countryCode: pricing.countryCode,
      currency: pricing.currency,
      manual,
      expiresAt: manual ? null : Date.now() + DETECTION_TTL_MS,
    }));
  } catch {
    // Pricing still updates if browser storage is blocked or full.
  }
}

export async function initializeGeoPricing(): Promise<GeoPricingConfig> {
  if (hasInitialized) return activeGeoConfig;
  if (initPromise) return initPromise;
  const revision = manualRevision;

  initPromise = (async () => {
    if (typeof window !== 'undefined') {
      try {
        const cached = JSON.parse(sessionStorage.getItem(GEO_STORAGE_KEY) || 'null');
        const pricing = normalizePricing(cached);
        if (pricing && (cached.manual === true || cached.expiresAt > Date.now())) {
          return publish(pricing);
        }
      } catch {
        // An absent or invalid cache must not block country detection.
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const response = await fetch('/api/pricing', { cache: 'no-store', signal: controller.signal });
        if (response.ok) {
          const pricing = normalizePricing(await response.json());
          if (manualRevision !== revision) return activeGeoConfig;
          if (pricing) {
            cache(pricing);
            return publish(pricing);
          }
        }
      }
    } catch {
      // Offline, timeout, HTML and malformed responses use international prices.
    } finally {
      clearTimeout(timeout);
    }

    if (manualRevision !== revision) return activeGeoConfig;
    // Do not persist a failed detection as if it were an authoritative location.
    return publish(INTERNATIONAL_PRICING);
  })();
  return initPromise;
}

/** Keep an explicit choice for this browser tab, including during a pending fetch. */
export function setCountryOverride(countryCodeOrName: string): GeoPricingConfig {
  manualRevision++;
  const pricing = resolveGeoPricing(countryCodeOrName);
  cache(pricing, true);
  return publish(pricing);
}

export function getCurrentGeoPricing(): GeoPricingConfig {
  return activeGeoConfig;
}

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
    const handleGeoChange = (event: Event) => {
      const detail = (event as CustomEvent<GeoPricingConfig>).detail;
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
    setCountry: code => setGeo(setCountryOverride(code)),
  };
}
