import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { useRouter } from '../router/Router';
import {
  CheckoutPendingError,
  VerifiedCheckout,
  forgetCheckoutReference,
  pollZameriaCheckout,
  recallCheckoutReference,
} from '../lib/zameriaCheckout';

export const PaymentCompletePage: React.FC = () => {
  const { search, navigate } = useRouter();
  const params = new URLSearchParams(search);
  // Paystack returns the buyer with `reference` (and `trxref`); the stored copy
  // covers a callback that arrives without either.
  const reference = params.get('reference') || params.get('trxref') || recallCheckoutReference();

  const [result, setResult] = useState<VerifiedCheckout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reference) {
      setPending(false);
      setError('We could not find a payment reference for this visit. Open the link from your Paystack receipt, or contact support@zameria.co.');
      return;
    }

    const signal = { cancelled: false };
    setPending(true);
    setError(null);

    pollZameriaCheckout(reference, { signal })
      .then((verified) => {
        if (signal.cancelled) return;
        setResult(verified);
        setPending(false);
        forgetCheckoutReference();
      })
      .catch((err) => {
        if (signal.cancelled) return;
        setPending(false);
        setError(
          err instanceof CheckoutPendingError
            ? `${err.message.replace(/\.?$/, '.')} This can take a minute — use “Check again” below.`
            : err instanceof Error
              ? err.message
              : 'Unable to verify payment.',
        );
      });

    return () => {
      signal.cancelled = true;
    };
  }, [reference]);

  return (
    <main className="zameria-auth-page">
      <div className="zameria-auth-main">
        <section className="zameria-auth-card" style={{ maxWidth: 520, textAlign: 'center' }}>
          {pending && (
            <>
              <Loader2 size={32} color="#2563eb" />
              <h1 style={{ fontSize: 22, color: '#071A31' }}>Confirming your Paystack payment…</h1>
              <p style={{ color: '#64748b', fontSize: 14 }}>
                Keep this page open. Your license key appears as soon as Paystack confirms the transaction.
              </p>
            </>
          )}

          {!pending && error && (
            <>
              <AlertCircle color="#b91c1c" size={32} />
              <h1 style={{ fontSize: 22, color: '#071A31' }}>Payment not confirmed yet</h1>
              <p style={{ color: '#64748b', fontSize: 14 }}>{error}</p>
              {reference && (
                <p style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  Reference: {reference}
                </p>
              )}
              <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                Check again
              </button>
            </>
          )}

          {!pending && result && (
            <>
              <CheckCircle2 color="#16a34a" size={40} />
              <h1 style={{ fontSize: 22, color: '#071A31' }}>Your ZAMERIA license is active</h1>
              <p style={{ color: '#64748b', fontSize: 14 }}>
                This server-issued license key is shown once. Save it, then activate it in the ZAMERIA WooCommerce
                plugin{result.storeUrl ? ` on ${result.storeUrl}` : ''}.
              </p>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  padding: 14,
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  wordBreak: 'break-all',
                  color: '#071A31',
                }}
              >
                {result.licenseKey}
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(result.licenseKey);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                style={{ marginTop: 14 }}
              >
                <Copy size={15} /> {copied ? 'Copied' : 'Copy license key'}
              </button>
              <button className="btn btn-hero-gradient" onClick={() => navigate('/')} style={{ marginTop: 12 }}>
                Back to ZAMERIA
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
};
