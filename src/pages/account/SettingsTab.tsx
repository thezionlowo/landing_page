import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { Eye, EyeOff } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { customer, updateProfile, changePassword, logout, requestPasswordReset } = useCustomerAuth();
  const { navigate } = useRouter();

  // Personal Info Form State
  const [fullName, setFullName] = useState(customer?.fullName || '');
  const [email] = useState(customer?.email || '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Reset email request state
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState<'profile' | 'password' | 'reset' | null>(null);

  if (!customer) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setProfileError('Please provide a valid email address.');
      return;
    }

    setBusy('profile'); setProfileError(null);
    try {
      const result = await updateProfile({ fullName: fullName.trim(), email: email.trim() });
      if (!result.success) { setProfileError(result.error || 'Could not save your name.'); return; }
      setProfileSuccess(true);
    } catch { setProfileError('Could not save your name. Try again.'); }
    finally { setBusy(null); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setBusy('password'); setPasswordError(null);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (!result.success) { setPasswordError(result.error || 'Could not update your password.'); return; }
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      navigate('/login');
    } catch { setPasswordError('Could not update your password. Try again.'); }
    finally { setBusy(null); }
  };

  const handleSendResetEmail = async () => {
    setBusy('reset'); setPasswordError(null);
    try {
      const result = await requestPasswordReset(customer.email);
      if (!result.success) { setPasswordError(result.error || 'Could not send reset instructions.'); return; }
      setResetSent(true);
    } catch { setPasswordError('Could not send reset instructions. Try again.'); }
    finally { setBusy(null); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <div className="site-account-page">
    <header className="site-account-page-heading"><div><h1>Account settings</h1><p>Update your name and sign-in details.</p></div></header>
    <section className="site-account-panel"><h2>Your details</h2>
      <form className="site-account-form" onSubmit={handleProfileSubmit}>
        <label>Full name<input autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} required /></label>
        <label>Email<input type="email" value={email} readOnly autoComplete="email" /><small>Your sign-in email.</small></label>
        {profileSuccess && <p role="status">Your name has been saved.</p>}{profileError && <p role="alert">{profileError}</p>}
        <button className="site-account-primary" type="submit" disabled={busy !== null}>{busy === 'profile' ? 'Saving…' : 'Save changes'}</button>
      </form>
    </section>
    <section className="site-account-panel"><h2>Change password</h2><p>You will sign in again after changing your password.</p>
      <form className="site-account-form" onSubmit={handlePasswordSubmit}>
        <label>Current password<div className="site-account-password"><input type={showCurrentPass ? 'text' : 'password'} autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /><button type="button" aria-label={showCurrentPass ? 'Hide current password' : 'Show current password'} onClick={() => setShowCurrentPass(!showCurrentPass)}>{showCurrentPass ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        <label>New password<div className="site-account-password"><input type={showNewPass ? 'text' : 'password'} autoComplete="new-password" minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} required /><button type="button" aria-label={showNewPass ? 'Hide new password' : 'Show new password'} onClick={() => setShowNewPass(!showNewPass)}>{showNewPass ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><small>At least eight characters.</small></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></label>
        {passwordError && <p role="alert">{passwordError}</p>}{resetSent && <p role="status">Check your email for reset instructions.</p>}
        <div className="site-account-actions"><button className="site-account-primary" type="submit" disabled={busy !== null}>{busy === 'password' ? 'Updating…' : 'Update password'}</button><button type="button" disabled={busy !== null} onClick={handleSendResetEmail}>{busy === 'reset' ? 'Sending…' : 'Send password reset email'}</button></div>
      </form>
    </section>
    <section className="site-account-panel"><h2>Sign out</h2><p>End your merchant account session on this browser.</p><button onClick={handleLogout}>Log out</button></section>
  </div>;
};
export default SettingsTab;
