import { useCallback, useEffect, useState } from 'react';
import { fetchZameriaStoreStatus, normalizeStoreUrl, requestZameriaTrial, StoreEntitlement } from './zameriaCheckout';

/**
 * Keeps the account page and the WooCommerce plugin in step over one store.
 *
 * The code has to come from the licensing service: it is the key the plugin
 * redeems, and only the service can issue one. Once issued, the service is also
 * the only place that knows whether the merchant has redeemed it, so this polls
 * it rather than guessing from anything held in the browser.
 */

const storageKey = (email: string) => `zameria.trial.${email.trim().toLowerCase()}`;

interface Remembered {
  code: string;
  storeUrl: string;
}

const remember = (email: string, value: Remembered) => {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(value));
  } catch {
    /* the code is still on screen; storage is a convenience */
  }
};

const recall = (email: string): Remembered | null => {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? (JSON.parse(raw) as Remembered) : null;
  } catch {
    return null;
  }
};

export function useTrialCode(input: { email: string; businessName: string; storeUrl: string }) {
  const remembered = recall(input.email);

  const [code, setCode] = useState(remembered?.code || '');
  const [storeUrl, setStoreUrl] = useState(input.storeUrl || remembered?.storeUrl || '');
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [trial, setTrial] = useState<StoreEntitlement | null>(null);
  const [license, setLicense] = useState<StoreEntitlement | null>(null);

  /** Asks the service what the plugin has done with this store. */
  const refresh = useCallback(
    async (url = storeUrl) => {
      if (!url.trim() || !input.email.trim()) return;
      try {
        const status = await fetchZameriaStoreStatus({ email: input.email, storeUrl: url });
        setTrial(status.trial);
        setLicense(status.license);
      } catch {
        /* a failed check leaves the last known state on screen */
      }
    },
    [input.email, storeUrl],
  );

  // Check on load, then keep checking while the merchant is on this page: the
  // redemption happens in WordPress, in another tab or on another machine.
  useEffect(() => {
    if (!storeUrl.trim()) return;
    void refresh(storeUrl);
    const timer = window.setInterval(() => void refresh(storeUrl), 20000);
    return () => window.clearInterval(timer);
  }, [storeUrl, refresh]);

  const request = async () => {
    setError(null);
    const url = storeUrl.trim();
    if (!url) {
      setError('Enter your WooCommerce store address first.');
      return;
    }
    setIsRequesting(true);
    try {
      const issued = await requestZameriaTrial({ email: input.email, businessName: input.businessName, storeUrl: url });
      setCode(issued.trialCode);
      setStoreUrl(normalizeStoreUrl(url));
      remember(input.email, { code: issued.trialCode, storeUrl: normalizeStoreUrl(url) });
      void refresh(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not issue a trial code.');
    } finally {
      setIsRequesting(false);
    }
  };

  const isRedeemed = trial?.status === 'active' || trial?.status === 'expired';

  return {
    code,
    storeUrl,
    setStoreUrl: (value: string) => {
      setStoreUrl(value);
      setError(null);
    },
    /** The store address is asked for inline when the account has none on file. */
    needsStoreUrl: !input.storeUrl.trim(),
    error,
    isRequesting,
    request,
    refresh,
    trial,
    license,
    isRedeemed,
  };
}
