import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useRouter } from '../router/Router';
import { startZameriaCheckout, ZAMERIA_PLANS, ZameriaPlan } from '../lib/zameriaCheckout';

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: '#071A31' };
const fieldStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '12px 14px',
  boxSizing: 'border-box',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  fontSize: 14,
};

export const SubscribePage: React.FC = () => {
  const { search, navigate } = useRouter();
  const requestedPlan = new URLSearchParams(search).get('plan')?.toLowerCase();
  const [plan, setPlan] = useState<ZameriaPlan>(requestedPlan === 'business' ? 'business' : 'starter');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!businessName.trim() || !email.trim() || !storeUrl.trim()) {
      setError('Enter your business name, email, and WooCommerce store URL.');
      return;
    }
    setSubmitting(true);
    try {
      const checkout = await startZameriaCheckout({ plan, businessName, email, storeUrl });
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start payment.');
      setSubmitting(false);
    }
  };

  return (
    <main className="zameria-auth-page">
      <div className="zameria-auth-main">
        <section className="zameria-auth-card" style={{ maxWidth: 540 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ border: 0, background: 'none', color: '#475569', cursor: 'pointer', padding: 0, fontSize: 13 }}
          >
            ← Back to pricing
          </button>

          <h1 style={{ color: '#071A31', margin: '20px 0 8px', fontSize: 26 }}>Complete your ZAMERIA subscription</h1>
          <p style={{ color: '#64748b', marginTop: 0, fontSize: 14 }}>
            You will finish payment securely on Paystack. Your license key is issued by ZAMERIA only after Paystack
            confirms the payment.
          </p>

          {error && (
            <div
              role="alert"
              style={{
                color: '#b91c1c',
                background: '#fef2f2',
                padding: 12,
                borderRadius: 10,
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginBottom: 16,
                fontSize: 13,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <label style={labelStyle}>
              Plan
              <select value={plan} onChange={(e) => setPlan(e.target.value as ZameriaPlan)} style={fieldStyle}>
                <option value="starter">Starter — ₦200,000 / year</option>
                <option value="business">Business — ₦300,000 / year</option>
              </select>
            </label>

            <div style={{ background: '#eff6ff', color: '#1e40af', padding: 12, borderRadius: 10, fontSize: 13 }}>
              <strong>{ZAMERIA_PLANS[plan].label}</strong> · {ZAMERIA_PLANS[plan].price} · billed annually
            </div>

            <label style={labelStyle}>
              Business name
              <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={fieldStyle} />
            </label>

            <label style={labelStyle}>
              Email
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
            </label>

            <label style={labelStyle}>
              WooCommerce store URL
              <input
                required
                placeholder="https://yourstore.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                style={fieldStyle}
              />
            </label>

            <button
              disabled={submitting}
              type="submit"
              className="btn btn-hero-gradient"
              style={{ justifyContent: 'center', padding: 14, border: 0, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? (
                'Opening secure checkout…'
              ) : (
                <>
                  <Lock size={16} /> Continue to Paystack <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p style={{ color: '#64748b', fontSize: 12, display: 'flex', gap: 6, marginTop: 18, alignItems: 'center' }}>
            <CheckCircle2 size={15} color="#16a34a" /> No license is created until Paystack confirms your payment.
          </p>
        </section>
      </div>
    </main>
  );
};
