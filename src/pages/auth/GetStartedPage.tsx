import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { BrandMark } from '../../components/SiteChrome';
import type { LeadSource } from '../../services/leadCaptureClient';

export const GetStartedPage: React.FC = () => {
  const { register } = useCustomerAuth();
  const { navigate } = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill from query params if present (e.g. from assessment or direct marketing link)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const qEmail = searchParams.get('email');
      const qBusiness = searchParams.get('business') || searchParams.get('businessName') || searchParams.get('store');
      const qStoreUrl = searchParams.get('store_url') || searchParams.get('storeUrl') || searchParams.get('store');

      if (qEmail && !email) setEmail(qEmail);
      if (qBusiness && !businessName) setBusinessName(qBusiness);
      if (qStoreUrl && !storeUrl) setStoreUrl(qStoreUrl);
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!businessName.trim()) {
      setError('Please enter your store name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Extract UTM and source attribution parameters
    let source: LeadSource = window.location.pathname.includes('/signup') ? 'Website Signup' : 'Trial Signup';
    let campaign: string | undefined;
    let referralPartner: { partnerName: string } | undefined;
    let planParam: string | undefined;
    let storeUrlParam: string | undefined;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const rawSource = searchParams.get('source') || searchParams.get('utm_source');
      if (rawSource) {
        const lower = rawSource.toLowerCase();
        if (lower.includes('trial')) source = 'Trial Signup';
        else if (lower.includes('website')) source = 'Website Signup';
        else if (lower.includes('meta') || lower.includes('facebook') || lower.includes('fb')) source = 'Meta Ads';
        else if (lower.includes('instagram') || lower.includes('ig')) source = 'Instagram';
        else if (lower.includes('whatsapp')) source = 'WhatsApp';
        else if (lower.includes('assessment')) source = 'Assessment';
        else if (lower.includes('referral') || searchParams.get('ref')) source = 'Referral';
      }

      campaign = searchParams.get('utm_campaign') || searchParams.get('campaign') || undefined;
      const refParam = searchParams.get('ref') || searchParams.get('partner') || undefined;
      if (refParam) {
        referralPartner = { partnerName: refParam };
      }
      planParam = searchParams.get('plan') || undefined;
      storeUrlParam = searchParams.get('store') || searchParams.get('store_url') || undefined;
    } catch {
      // Ignore URL parsing errors
    }

    setIsLoading(true);
    const res = await register({
      businessName: businessName.trim(),
      email: email.trim(),
      password,
      source,
      campaign,
      referralPartner,
      plan: planParam,
      storeUrl: storeUrl.trim() || storeUrlParam,
    });
    setIsLoading(false);

    if (res.success) {
      navigate('/account');
    } else {
      setError(res.error || 'Could not complete registration. Please try again.');
    }
  };

  return <div className="site-auth-simple">
    <header><BrandMark /></header>
    <main>
      <div className="site-auth-simple-heading"><h1>Create your account</h1><p>Your seven-day trial starts when you connect your store.</p></div>
      {error && <p className="site-auth-error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="reg-store-name">Business name<input id="reg-store-name" required autoComplete="organization" placeholder="Your business" value={businessName} disabled={isLoading} onChange={e => { setBusinessName(e.target.value); setError(null); }} /></label>
        <label htmlFor="reg-email">Email address<input id="reg-email" type="email" required autoComplete="email" placeholder="you@business.com" value={email} disabled={isLoading} onChange={e => { setEmail(e.target.value); setError(null); }} /></label>
        <div><label htmlFor="reg-password">Password</label><div className="site-auth-password"><input id="reg-password" type={showPassword ? 'text' : 'password'} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} disabled={isLoading} onChange={e => { setPassword(e.target.value); setError(null); }} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
        <button className="site-auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Creating account…' : 'Create account'}</button>
        <p className="site-policy-notice">Creating an account sends your registration and store details to ZAMERIA for account setup, access checks and onboarding follow-up. By creating an account, you agree to the <a href="/terms">Terms of Service</a>. Read our <a href="/privacy">Privacy Policy</a>.</p>
      </form>
      <p className="site-auth-switch">Already have an account? <a href="/login">Log in</a></p>
    </main>
    <footer>© {new Date().getFullYear()} ZAMERIA</footer>
  </div>;
};

export default GetStartedPage;
