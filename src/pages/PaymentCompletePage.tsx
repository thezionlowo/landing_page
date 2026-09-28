import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { useRouter } from '../router/Router';
import { verifyZameriaCheckout, VerifiedCheckout } from '../lib/zameriaCheckout';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const PaymentCompletePage: React.FC = () => {
  const { search, navigate } = useRouter();
  const { recordVerifiedPayment } = useCustomerAuth();
  const [result, setResult] = useState<VerifiedCheckout | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const reference = new URLSearchParams(search).get('reference') || '';

  useEffect(() => {
    if (!reference) { setError('Missing payment reference.'); return; }
    verifyZameriaCheckout(reference)
      .then((receipt) => { recordVerifiedPayment(receipt); setResult(receipt); sessionStorage.removeItem('zameria_pending_checkout'); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not verify this payment.'));
  }, [reference, recordVerifiedPayment]);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc', padding: 20 }}>
      <section style={{ maxWidth: 580, width: '100%', textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 36 }}>
        {result ? <><CheckCircle2 size={48} color="#16a34a" /><h1 style={{ color: '#071a31' }}>Payment verified</h1><p style={{ color: '#475569' }}>Your subscription and license are now reflected in this dashboard.</p><div style={{ textAlign: 'left', background: '#f8fafc', borderRadius: 12, padding: 18, margin: '24px 0' }}><div style={{ fontSize: 12, color: '#64748b' }}>ZAMERIA LICENSE KEY</div><strong style={{ fontFamily: 'monospace', color: '#071a31' }}>{result.license_key}</strong><button onClick={() => { navigator.clipboard.writeText(result.license_key); setCopied(true); }} style={{ marginLeft: 10, border: 0, background: 'transparent', cursor: 'pointer' }} aria-label="Copy license key"><Copy size={16} /></button>{copied && <span style={{ color: '#15803d', marginLeft: 6 }}>Copied</span>}<p style={{ color: '#475569', marginBottom: 0 }}>{result.plan === 'starter' ? 'Starter' : 'Business'} plan • expires {new Date(result.expires_at).toLocaleDateString()}</p></div><button onClick={() => navigate('/account?tab=overview')} style={{ border: 0, borderRadius: 10, background: '#071a31', color: '#fff', padding: '13px 18px', fontWeight: 800, cursor: 'pointer' }}>Open dashboard <ExternalLink size={15} style={{ verticalAlign: 'middle' }} /></button></> : <><h1 style={{ color: '#071a31' }}>{error ? 'Payment not verified' : 'Verifying your payment…'}</h1><p style={{ color: error ? '#b91c1c' : '#64748b' }}>{error || 'Please wait while we confirm your Paystack transaction.'}</p>{error && <button onClick={() => navigate('/subscribe')} style={{ border: 0, borderRadius: 10, background: '#071a31', color: '#fff', padding: '13px 18px', cursor: 'pointer' }}>Return to checkout</button>}</>}
      </section>
    </main>
  );
};
