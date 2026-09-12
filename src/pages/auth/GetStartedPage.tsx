import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { Eye, EyeOff, User, Store, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AuthHeader } from './AuthHeader';

export const GetStartedPage: React.FC = () => {
  const { register } = useCustomerAuth();
  const { navigate } = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please accept the terms of service and privacy policy to continue.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      fullName: fullName.trim(),
      businessName: `${fullName.trim()}'s Retail`,
      email: email.trim(),
      password,
    });
    setIsLoading(false);

    if (res.success) {
      navigate('/account');
    } else {
      setError(res.error || 'Could not complete registration. Please try again.');
    }
  };

  return (
    <div className="zameria-auth-page">
      {/* Top Header Bar with only ZAMERIA logo */}
      <AuthHeader
        actionText="Already have an account?"
        buttonText="Log In"
        buttonAction={() => navigate('/login')}
      />

      {/* Centered Registration Card */}
      <main className="zameria-auth-main">
        <div className="zameria-auth-card" style={{ maxWidth: '480px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '9999px',
                marginBottom: '12px',
              }}
            >
              <ShieldCheck size={14} />
              <span>7-Day Free Trial</span>
            </div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#071A31',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              Start your 7-day free trial
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              No license required. No payment required to start your trial.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                marginBottom: '20px',
                color: '#b91c1c',
                fontSize: '13px',
                lineHeight: 1.45,
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label
                htmlFor="reg-name"
                style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}
              >
                Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  id="reg-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Amara Okafor"
                  autoComplete="name"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 12px 11px 36px',
                    fontSize: '13.5px',
                    color: '#071A31',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="reg-email"
                style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@business.com"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 12px 11px 36px',
                    fontSize: '13.5px',
                    color: '#071A31',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-pass"
                style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  id="reg-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 36px 11px 36px',
                    fontSize: '13.5px',
                    color: '#071A31',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm-pass"
                style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}
              >
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  id="reg-confirm-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 12px 11px 36px',
                    fontSize: '13.5px',
                    color: '#071A31',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Terms and Privacy Agreement */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '2px' }}>
              <input
                id="reg-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="reg-terms" style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.4, cursor: 'pointer' }}>
                I agree to the ZAMERIA Terms of Service and Privacy Policy.
              </label>
            </div>

            {/* Trial Guarantees */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12px',
                color: '#475569',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span>7-day free trial with full POS and inventory sync access</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span>No credit card or license key required to start</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span>License generated automatically upon paid subscription</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '4px',
                width: '100%',
                padding: '14px 20px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(7, 26, 49, 0.15)',
                transition: 'all 0.18s ease',
              }}
            >
              <span>{isLoading ? 'Creating account...' : 'Start Free Trial'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Log In Link */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '13.5px',
              color: '#64748b',
            }}
          >
            Already have a ZAMERIA account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#071A31',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Log In
            </button>
          </div>
        </div>
      </main>

      <footer className="zameria-auth-footer">
        © {new Date().getFullYear()} ZAMERIA. All rights reserved.
      </footer>
    </div>
  );
};

export default GetStartedPage;
