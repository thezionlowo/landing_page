import { useState } from 'react';
import { requestZameriaTrial } from './zameriaCheckout';

/**
 * Supplies the store's real trial activation code.
 *
 * The code has to come from the licensing service: it is the key the plugin
 * redeems, and only the service can issue one. A code invented in the browser
 * looks plausible and fails at activation with "license not found".
 */
export function useTrialCode(input: { email: string; businessName: string; storeUrl: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const request = async () => {
    setError(null);
    if (!input.storeUrl.trim()) {
      setError('Connect your WooCommerce store first — a trial code is issued per store.');
      return;
    }
    setIsRequesting(true);
    try {
      const trial = await requestZameriaTrial(input);
      setCode(trial.trialCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not issue a trial code.');
    } finally {
      setIsRequesting(false);
    }
  };

  return { code, error, isRequesting, request };
}
