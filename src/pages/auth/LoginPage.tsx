import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { AuthHeader } from './AuthHeader';

export const LoginPage: React.FC = () => {
  const { login } = useCustomerAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/account');
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('zion@skincarelab.ng');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="zameria-auth-page">
      {/* Top Header Bar with only ZAMERIA logo */}
      <AuthHeader
        actionText="New to ZAMERIA?"
        buttonText="Get Started"
        buttonAction={() => navigate('/get-started')}
      />

      {/* Main Centered Content */}
      <main className="zameria-auth-main">
        <div className="zameria-auth-card" style={{ maxWidth: '460px' }}>
          {/* Brand Heading — No duplicate logo inside card */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: 'clamp(22px, 4.5vw, 26px)',
                fontWeight: 800,
                color: '#071A31',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              Log in to ZAMERIA
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Access your merchant account and retail operations
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#071A31',
                  marginBottom: '8px',
                }}
              >
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  color="#94a3b8"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-email"
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
                    padding: '12px 14px 12px 42px',
                    fontSize: '14px',
                    color: '#071A31',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#071A31';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7, 26, 49, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#071A31',
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#2563eb',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  color="#94a3b8"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 42px 12px 42px',
                    fontSize: '14px',
                    color: '#071A31',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#071A31';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7, 26, 49, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '6px',
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
              <span>{isLoading ? 'Logging in...' : 'Log In'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div
            style={{
              marginTop: '24px',
              padding: '12px 14px',
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Testing Demo Account
              </div>
              <div style={{ fontSize: '12px', color: '#071A31', fontWeight: 600 }}>
                zion@skincarelab.ng
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} />
              <span>Fill Demo</span>
            </button>
          </div>

          {/* Registration Link */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '13.5px',
              color: '#64748b',
            }}
          >
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/get-started')}
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
              Start your free trial
            </button>
          </div>
        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="zameria-auth-footer">
        © {new Date().getFullYear()} ZAMERIA. Secure customer account portal.
      </footer>
    </div>
  );
};

export default LoginPage;
