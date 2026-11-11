import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react';
import { CheckoutHeader, CheckoutFooter } from '../components/CheckoutHeader';
import { useRouter } from '../router/Router';
import { CheckoutVerificationError, verifyZameriaCheckout, type VerifiedCheckout } from '../lib/zameriaCheckout';
import { rememberCheckoutAccount } from '../lib/checkoutAccount';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const PaymentCompletePage = () => {
  const { search, navigate } = useRouter();
  const { customer, isAuthenticated, isRestoringSession, logout, recordVerifiedPayment } = useCustomerAuth();
  const [result, setResult] = useState<VerifiedCheckout | null>(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const applied = useRef('');
  const params = new URLSearchParams(search);
  const reference = params.get('reference') || params.get('trxref') || '';

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const deadline = Date.now() + 30000;
    setResult(null); setError(''); setChecking(true);
    if (!/^zmr_[a-f0-9]{48}$/.test(reference)) { setChecking(false); setError('This payment link is incomplete. Contact support with your payment reference.'); return; }
    async function verify() {
      try {
        const receipt = await verifyZameriaCheckout(reference, controller.signal);
        if (!active) return;
        rememberCheckoutAccount(reference, receipt.email, receipt.business_name);
        setResult(receipt); setChecking(false);
        try { sessionStorage.removeItem('zameria_pending_checkout'); } catch {}
      } catch (reason) {
        if (!active) return;
        const status = reason instanceof CheckoutVerificationError ? reason.status : 0;
        if ((status === 0 || status === 409 || status >= 500) && Date.now() < deadline) { timer = setTimeout(verify, 2000); return; }
        setChecking(false);
        setError(status === 409 ? 'Your payment is still being confirmed. Keep your reference and check again shortly. Please do not pay again.' : reason instanceof Error ? reason.message : 'We could not confirm your payment. Contact support before trying another payment.');
      }
    }
    void verify();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [reference, attempt]);

  useEffect(() => {
    if (!result?.email || !customer || result.email.toLowerCase() !== customer.email.toLowerCase()) return;
    const identity = `${customer.id}:${reference}`;
    if (applied.current === identity) return;
    applied.current = identity;
    recordVerifiedPayment(result);
  }, [result, customer?.id, customer?.email, reference, recordVerifiedPayment]);

  const mismatch = !!(result?.email && customer && result.email.toLowerCase() !== customer.email.toLowerCase());
  const next = `/payment/complete?reference=${encodeURIComponent(reference)}`;
  const loginURL = `/login?next=${encodeURIComponent(next)}`;
  const signupURL = `/get-started?next=${encodeURIComponent(next)}`;
  const openDashboard = () => {
    if (mismatch) { logout(); navigate(loginURL); }
    else if (isAuthenticated) navigate('/account?tab=billing');
    else navigate(loginURL);
  };
  return <div className="site-checkout checkout-result"><CheckoutHeader /><main className="site-payment-main"><section className="site-payment-card" aria-live="polite" aria-busy={checking}>
    <span className={`site-payment-icon ${result ? 'payment-success-icon' : ''}`}>{result ? <CheckCircle2 size={30} /> : checking ? <LoaderCircle className="checkout-spinner" size={28} /> : <ShieldCheck size={28} />}</span>
    <span className="checkout-eyebrow">{result ? 'PAYMENT CONFIRMED' : 'PAYMENT STATUS'}</span>
    <h1>{result ? 'Congratulations. You’re ready to go.' : checking ? 'Setting up your plan…' : 'Let’s confirm your payment.'}</h1>
    <p role={error ? 'alert' : undefined}>{result ? `Your ${result.plan === 'starter' ? 'Starter' : 'Business'} plan is active for one year on your store.` : checking ? 'We’re securely checking your payment and preparing your annual access. This can take a moment.' : error}</p>
    {result && <>
      <dl className="payment-details"><div><dt>Your plan</dt><dd>{result.plan === 'starter' ? 'Starter' : 'Business'} · Annual</dd></div><div><dt>Licensed store</dt><dd>{result.store_domain}</dd></div><div><dt>Access until</dt><dd>{new Date(result.expires_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</dd></div>{result.email && <div><dt>Account email</dt><dd>{result.email}</dd></div>}</dl>
      <div className="payment-next"><h2>Your next step</h2><p>{mismatch ? `This purchase belongs to ${result.email}. Sign in with that email to manage it.` : !isAuthenticated ? 'Sign in with the email used at checkout to open your dashboard. New to ZAMERIA? Create your account below; your paid plan will be linked to that email.' : 'Your plan, store and expiry are saved in Plan & billing. If your store is already connected, it will pick up your paid access on its next online check.'}</p></div>
      <button className="hm-button payment-primary" disabled={isRestoringSession} onClick={openDashboard}>{mismatch ? 'Sign in with the purchase email' : isAuthenticated ? 'Open your dashboard' : 'Continue to your dashboard'}<ArrowRight size={17} /></button>
      {!isAuthenticated && <a className="payment-secondary" href={signupURL}>Create your ZAMERIA account</a>}
      <p className="payment-connect-note">Connecting for the first time? Install the ZAMERIA plugin on <strong>{result.store_domain}</strong> and sign in with the same ZAMERIA account to connect this store.</p>
    </>}
    {!checking && !result && <div className="payment-recovery"><button className="hm-button" onClick={() => setAttempt(value => value + 1)}>Check payment again</button><a href={`mailto:support@zameria.co?subject=${encodeURIComponent('Payment verification: ' + reference)}`}>Get help with this payment</a><a href="/account?tab=billing">Check your account</a></div>}
    {reference && <p className="payment-reference">Payment reference <span>{reference}</span></p>}
  </section></main><CheckoutFooter /></div>;
};
