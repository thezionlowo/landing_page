import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { authDestination, authSwitchURL, checkoutAccountHint } from '../../lib/checkoutAccount';
import { useClientReady } from '../../lib/useClientReady';
import { BrandMark } from '../../components/SiteChrome';

export const LoginPage: React.FC = () => {
  const clientReady = useClientReady();
  const { login } = useCustomerAuth();
  const { navigate, search } = useRouter();

  const [email, setEmail] = useState('');
  useEffect(() => { setEmail(value => value || checkoutAccountHint(search).email || ''); }, [search]);
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
      navigate(authDestination(search));
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return <div className="site-auth-simple">
    <header><BrandMark /></header>
    <main>
      <div className="site-auth-simple-heading"><h1>Welcome back</h1><p>Log in to your ZAMERIA account.</p></div>
      {error && <p className="site-auth-error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email address<input id="login-email" type="email" required autoComplete="email" placeholder="you@business.com" value={email} disabled={isLoading} onChange={e => { setEmail(e.target.value); setError(null); }} /></label>
        <div><div className="site-auth-label-row"><label htmlFor="login-password">Password</label><a href="/forgot-password">Forgot password?</a></div>
          <div className="site-auth-password"><input id="login-password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} disabled={isLoading} onChange={e => { setPassword(e.target.value); setError(null); }} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        </div>
        <button className="site-auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="site-auth-switch">New to ZAMERIA? <a href={authSwitchURL('/get-started', clientReady ? search : '')}>Create an account</a></p>
    </main>
    <footer>© {new Date().getFullYear()} ZAMERIA</footer>
  </div>;
};

export default LoginPage;
