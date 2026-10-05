import type { IncomingMessage, ServerResponse } from 'http';
import { resolveGeoPricing, isNigerianCountry } from '../src/lib/geoPricing';

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
 * Route: GET /api/pricing or GET /api/geo
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
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const explicitQueryCountry = url.searchParams.get('country');
  
  const vercelCountry = req.headers['x-vercel-ip-country'] as string | undefined;
  const cfCountry = req.headers['cf-ipcountry'] as string | undefined;
  const clientCountry = req.headers['client-country'] as string | undefined;
  const customCountryHeader = req.headers['x-country-code'] as string | undefined;

  const rawCountryCode = (
    explicitQueryCountry ||
    vercelCountry ||
    cfCountry ||
    clientCountry ||
    customCountryHeader ||
    'NG' // Default baseline for existing regional deployments
  ).trim();

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
    detectedIp: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1',
    serverTimestamp: new Date().toISOString(),
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.end(JSON.stringify(responseData));
}
