import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { AuthHeader } from './AuthHeader';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useCustomerAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'sent' | 'reset' | 'success'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const res = await requestPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setStep('sent');
    } else {
      setError(res.error || 'Failed to send reset link. Please try again.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please confirm your new password.');
      return;
    }

    setStep('success');
  };

  return (
    <div className="zameria-auth-page">
      {/* Top Header Bar with only ZAMERIA logo */}
      <AuthHeader
        buttonText="Back to Log In"
        buttonAction={() => navigate('/login')}
        showBackIcon
      />

      {/* Main Container */}
      <main className="zameria-auth-main">
        <div className="zameria-auth-card" style={{ maxWidth: '460px' }}>
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

          {/* STEP 1: REQUEST RESET LINK */}
          {step === 'request' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#071A31',
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Forgot your password?
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Enter your email address and we'll send you a password reset link.
                </p>
              </div>

              <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label
                    htmlFor="reset-email"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#071A31',
                      marginBottom: '8px',
                    }}
                  >
                    Email
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
                      id="reset-email"
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
                      }}
                    />
                  </div>
                </div>

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
                  }}
                >
                  <Send size={15} />
                  <span>{isLoading ? 'Sending Link...' : 'Send Reset Link'}</span>
                </button>
              </form>
            </>
          )}

          {/* STEP 2: CHECK YOUR EMAIL CONFIRMATION */}
          {step === 'sent' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Mail size={28} />
              </div>

              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#071A31',
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                }}
              >
                Check your email
              </h2>

              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.55, margin: '0 0 24px' }}>
                We've sent a password reset link to <strong>{email}</strong>. Please follow the instructions to choose a new password.
              </p>

              <button
                type="button"
                onClick={() => setStep('reset')}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '12px',
                }}
              >
                Enter New Password
              </button>

              <button
                type="button"
                onClick={() => setStep('request')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Resend reset link
              </button>
            </div>
          )}

          {/* STEP 3: RESET PASSWORD SCREEN */}
          {step === 'reset' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#071A31',
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Create new password
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Please enter and confirm your new password below.
                </p>
              </div>

              <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="new-password"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="At least 6 characters"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      fontSize: '13.5px',
                      color: '#071A31',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-new-password"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Re-enter your new password"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      fontSize: '13.5px',
                      color: '#071A31',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Update Password
                </button>
              </form>
            </>
          )}

          {/* STEP 4: PASSWORD UPDATED SUCCESSFULLY */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#071A31',
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                }}
              >
                Password updated successfully.
              </h2>

              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.55, margin: '0 0 28px' }}>
                Your account password has been updated. You can now log in to ZAMERIA.
              </p>

              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Log In
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Log In</span>
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

export default ForgotPasswordPage;
