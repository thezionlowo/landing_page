import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../router/Router';
import { useCustomerAuth } from '../context/CustomerAuthContext';

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

/**
 * Starting a trial begins with an account.
 *
 * The store address is not asked for here: it belongs in the dashboard, where
 * the activation code is issued against it and stays readable afterwards. A
 * code issued to nobody could not be found again.
 */
export const StartTrialPage: React.FC = () => {
  const { navigate } = useRouter();
  const { register } = useCustomerAuth();

  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!businessName.trim()) return setError('Enter your business name.');
    if (!email.trim() || !email.includes('@')) return setError('Enter a valid email address.');
    if (!phone.trim()) return setError('Enter your phone number.');
    if (password.length < 8) return setError('Your password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Both passwords must match.');

    setSubmitting(true);
    const result = await register({
      fullName: businessName.trim(),
      businessName: businessName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/account');
      return;
    }
    setError(result.error || 'Could not create your account.');
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
            ← Back to ZAMERIA
          </button>

          <h1 style={{ color: '#071A31', margin: '20px 0 8px', fontSize: 26 }}>Start your 7-day free trial</h1>
          <p style={{ color: '#64748b', marginTop: 0, fontSize: 14 }}>
            No card required. Create your ZAMERIA account, then add your store in the dashboard to get your activation
            code — your 7 days begin when you enter it in the plugin, not before.
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
              Phone number
              <input
                required
                type="tel"
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              Password
              <input
                required
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              Confirm password
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={fieldStyle}
              />
            </label>

            <button
              disabled={submitting}
              type="submit"
              className="btn btn-hero-gradient"
              style={{ justifyContent: 'center', padding: 14, border: 0, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Creating your account…' : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ color: '#64748b', fontSize: 12, display: 'flex', gap: 6, marginTop: 18, alignItems: 'center' }}>
            <CheckCircle2 size={15} color="#16a34a" /> Your activation code stays in your account, so you can always
            find it again.
          </p>

          <p style={{ color: '#64748b', fontSize: 13, marginTop: 14 }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{ border: 0, background: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Log in
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};
