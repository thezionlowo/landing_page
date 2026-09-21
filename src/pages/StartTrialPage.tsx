import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Copy, Sparkles } from 'lucide-react';
import { useRouter } from '../router/Router';
import { requestZameriaTrial, TrialResult } from '../lib/zameriaCheckout';

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

export const StartTrialPage: React.FC = () => {
  const { navigate } = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [trial, setTrial] = useState<TrialResult | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!businessName.trim() || !email.trim() || !storeUrl.trim()) {
      setError('Enter your business name, email, and WooCommerce store URL.');
      return;
    }
    setSubmitting(true);
    try {
      setTrial(await requestZameriaTrial({ businessName, email, storeUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start your trial.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="zameria-auth-page">
      <div className="zameria-auth-main">
        <section className="zameria-auth-card" style={{ maxWidth: 540 }}>
          {!trial ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{ border: 0, background: 'none', color: '#475569', cursor: 'pointer', padding: 0, fontSize: 13 }}
              >
                ← Back to ZAMERIA
              </button>

              <h1 style={{ color: '#071A31', margin: '20px 0 8px', fontSize: 26 }}>Start your 7-day free trial</h1>
              <p style={{ color: '#64748b', marginTop: 0, fontSize: 14 }}>
                No card required. We issue an activation code for your store — your 7 days begin when you enter it in
                the ZAMERIA WooCommerce plugin, not before.
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
                  <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                    One free trial per store.
                  </span>
                </label>

                <button
                  disabled={submitting}
                  type="submit"
                  className="btn btn-hero-gradient"
                  style={{ justifyContent: 'center', padding: 14, border: 0, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? (
                    'Creating your trial code…'
                  ) : (
                    <>
                      <Sparkles size={16} /> Get my activation code <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 color="#16a34a" size={40} />
              <h1 style={{ color: '#071A31', margin: '14px 0 8px', fontSize: 24 }}>Your activation code is ready</h1>
              <p style={{ color: '#64748b', marginTop: 0, fontSize: 14 }}>
                Enter this code in the ZAMERIA plugin on <strong>{trial.storeDomain}</strong> to start your{' '}
                {trial.trialDays}-day trial.
              </p>

              <div
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: '0.04em',
                  padding: 16,
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  color: '#071A31',
                  margin: '18px 0',
                }}
              >
                {trial.trialCode}
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(trial.trialCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
              >
                <Copy size={15} /> {copied ? 'Copied' : 'Copy code'}
              </button>

              <ol
                style={{
                  textAlign: 'left',
                  color: '#475569',
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  margin: '22px 0 0',
                  paddingLeft: 20,
                }}
              >
                <li>Install the ZAMERIA plugin on your WooCommerce store.</li>
                <li>Open <strong>ZAMERIA</strong> in your WordPress admin.</li>
                <li>Paste the code above into <strong>Trial Activation Code</strong> and activate.</li>
              </ol>

              <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 18 }}>
                Save this code now — it is shown once. Your 7 days start only when you activate.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
