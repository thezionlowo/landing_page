import type { IncomingMessage, ServerResponse } from 'http';
import { resolveGeoPricing, isNigerianCountry } from '../src/lib/geoPricing.js';

const COUNTRY_NAMES: Record<string, string> = {
  NG: 'Nigeria',
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  ZA: 'South Africa',
  GH: 'Ghana',
  KE: 'Kenya',
  DE: 'Germany',
  FR: 'France',
  IE: 'Ireland',
  NL: 'Netherlands',
  AE: 'United Arab Emirates',
};

/**
 * Serverless API handler for Server-Side Geo Detection & Pricing
 * Route: GET /api/pricing
 *
 * Backend is the single source of truth for country, currency, plan, and price.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // 1. Detect Country Server-Side from Edge & Proxy Headers
  const url = new URL(req.url || '/', 'http://localhost');
  const explicitQueryCountry = url.searchParams.get('country');
  const countryHeader = (name: string) => {
    const value = req.headers[name];
    return (Array.isArray(value) ? value[0] : value)?.trim();
  };

  const rawCountryCode = [
    explicitQueryCountry,
    countryHeader('x-vercel-ip-country'),
    countryHeader('cf-ipcountry'),
    countryHeader('client-country'),
    countryHeader('x-country-code'),
  ].map(value => value?.trim()).find(Boolean) || 'INT';

  const codeUpper = rawCountryCode.toUpperCase();
  const isNigeria = isNigerianCountry(codeUpper);

  const countryName = isNigeria
    ? 'Nigeria'
    : COUNTRY_NAMES[codeUpper] || (rawCountryCode.length > 2 ? rawCountryCode : 'International');

  // 2. Resolve Authoritative Fixed Geo Pricing (No FX Conversions)
  const pricing = resolveGeoPricing(isNigeria ? 'NG' : codeUpper);
  const responseData = {
    ...pricing,
    country: countryName,
    countryCode: isNigeria ? 'NG' : (codeUpper.length === 2 ? codeUpper : 'INT'),
    serverTimestamp: new Date().toISOString(),
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify(responseData));
}
