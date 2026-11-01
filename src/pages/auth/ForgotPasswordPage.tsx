import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { accountRequest } from '../../lib/accountClient';
import { AuthHeader } from './AuthHeader';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useCustomerAuth(); const { navigate } = useRouter();
  const [reset] = useState(() => {
    const values = new URLSearchParams(typeof window !== 'undefined' ? window.location.hash.slice(1) : '');
    return { token: values.get('token') || '', email: values.get('email') || '' };
  });
  const [email, setEmail] = useState(reset.email); const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState(''); const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [completed, setCompleted] = useState(false);
  useEffect(() => { if (reset.token) window.history.replaceState(null, '', window.location.pathname + window.location.search); }, [reset.token]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setMessage('');
    if (reset.token && (new TextEncoder().encode(password).length < 8 || new TextEncoder().encode(password).length > 72 || password !== confirm)) { setError('Use a password of 8 to 72 bytes and enter the same password twice.'); return; }
    setBusy(true);
    try {
      if (reset.token) {
        const result = await accountRequest('reset-password', { email: reset.email, token: reset.token, newPassword: password });
        if (result.success !== true) throw new Error('Password reset was not confirmed');
        setCompleted(true); setPassword(''); setConfirm(''); setMessage('Your password has been reset. Sign in with your new password.');
      } else {
        const result = await requestPasswordReset(email);
        if (!result.success) throw new Error(result.error || 'Could not request recovery');
        setMessage('If an account exists for this email, reset instructions have been sent. Open the one-use link in that email.');
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not complete password recovery'); }
    finally { setBusy(false); }
  };
  const input: React.CSSProperties = { width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: 10, padding: '12px', fontSize: 16, marginTop: 6 };
  return <div className="zameria-auth-page">
    <AuthHeader buttonText="Back to Log In" buttonAction={() => navigate('/login')} showBackIcon />
    <main className="zameria-auth-main"><section className="zameria-auth-card" style={{ maxWidth: 460 }}>
      <h1 style={{ fontSize: 26, color: '#071a31', marginBottom: 12 }}>{reset.token ? 'Choose your new password' : 'Reset your password'}</h1>
      <p style={{ color: '#64748b', lineHeight: 1.6 }}>{reset.token ? 'This recovery link expires after 30 minutes and can be used once.' : 'Enter your ZAMERIA account email to request recovery instructions.'}</p>
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      {message && <p role="status" style={{ color: '#047857', lineHeight: 1.6 }}>{message}</p>}
      {!completed && <form onSubmit={submit} style={{ display: 'grid', gap: 18, marginTop: 24 }}>
        {reset.token ? <><label>New password<input style={input} type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} disabled={busy} /></label><label>Confirm password<input style={input} type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} disabled={busy} /></label></> : <label>Email address<input style={input} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} /></label>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : reset.token ? 'Reset password' : 'Send recovery instructions'}</button>
      </form>}
      {completed && <button className="btn btn-primary" onClick={() => navigate('/login')}>Log in</button>}
    </section></main>
    <footer className="zameria-auth-footer"><button type="button" onClick={() => navigate('/login')}>Back to log in</button></footer>
  </div>;
};
