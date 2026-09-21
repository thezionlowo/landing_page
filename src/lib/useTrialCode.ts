import { useCallback, useEffect, useState } from 'react';
import { AccountLicense, fetchAccountLicenses, requestAccountTrial } from './zameriaAccount';

/**
 * The merchant's trials and licences, read from their ZAMERIA account.
 *
 * Codes are held by the service, not by this browser, so they are still here
 * after signing out, on another device, or a year later when a store is being
 * set up again — and a trial that has been redeemed reports the days it has
 * left rather than reading as though it were new.
 */
export function useTrialCode(input: { email: string; businessName: string; storeUrl: string }) {
  const [licenses, setLicenses] = useState<AccountLicense[]>([]);
  const [storeUrl, setStoreUrl] = useState(input.storeUrl || '');
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLicenses(await fetchAccountLicenses());
    } catch {
      /* leave the last known list on screen */
    } finally {
      setLoaded(true);
    }
  }, []);

  // Read on arrival, then keep watching: the redemption happens in WordPress,
  // in another tab or on another machine entirely.
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 20000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  // Prefer the trial for the store on file, otherwise the newest one.
  const trial =
    licenses.find((l) => l.isTrial && storeUrl && l.storeDomain && storeUrl.includes(l.storeDomain)) ||
    licenses.find((l) => l.isTrial) ||
    null;
  const license = licenses.find((l) => !l.isTrial) || null;

  const request = async () => {
    setError(null);
    const url = storeUrl.trim();
    if (!url) {
      setError('Enter your WooCommerce store address first.');
      return;
    }
    setIsRequesting(true);
    try {
      setLicenses(await requestAccountTrial({ businessName: input.businessName, storeUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not issue a trial code.');
      void refresh();
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    code: trial?.code || '',
    storeUrl,
    setStoreUrl: (value: string) => {
      setStoreUrl(value);
      setError(null);
    },
    /** The store address is asked for here, in the dashboard, not at sign-up. */
    needsStoreUrl: !input.storeUrl.trim(),
    error,
    isRequesting,
    loaded,
    request,
    refresh,
    licenses,
    trial,
    license,
    isRedeemed: trial?.status === 'active' || trial?.status === 'expired',
  };
}
