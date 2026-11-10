import { useEffect, useState } from 'react';
import { initializePaddle } from '@paddle/paddle-js';
import { accountRequest } from '../lib/accountClient';
import { AuthHeader } from './auth/AuthHeader';
import { useRouter } from '../router/Router';
import { getCheckoutConfig, ZAMERIA_API_BASE } from '../lib/zameriaCheckout';

export function PaddleCheckoutPage() {
  const { search, navigate } = useRouter();
  const reference = new URLSearchParams(search).get('reference') || '';
  const paymentTransaction = new URLSearchParams(search).get('_ptxn') || '';
  const [message, setMessage] = useState('Preparing secure USD checkout…');
  const [error, setError] = useState('');
  const [canCancel, setCanCancel] = useState(false);
  useEffect(() => {
    let active = true;
    async function open() {
      let data: { environment: 'sandbox' | 'live'; client_token: string; transaction_id: string; callback_url?: string };
      if (reference) {
        const response = await fetch(`${ZAMERIA_API_BASE}/checkout/paddle?reference=${encodeURIComponent(reference)}`, { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not open USD checkout.');
        data = result;
      } else {
        if (!/^txn_[a-z0-9]{26}$/.test(paymentTransaction)) throw new Error('This payment link is incomplete.');
        const config = await getCheckoutConfig();
        if (!config.usd_available || !config.paddle_environment || !config.paddle_client_token) throw new Error('USD checkout is unavailable.');
        data = { environment: config.paddle_environment, client_token: config.paddle_client_token, transaction_id: paymentTransaction };
      }
      if (!active) return;
      const success = reference ? `${window.location.origin}/payment/complete?reference=${encodeURIComponent(reference)}` : `${window.location.origin}/account?tab=billing`;
      // Retain receives only the customer resolved from the authenticated
      // server session; cached profiles, posted emails and internal IDs do not qualify.
      const ownedCustomer = await accountRequest('paddle/customer').catch(() => null);
      const customerID = ownedCustomer?.paddle_customer_id;
      if (!active) return;
      const paddle = await initializePaddle({
        ...(typeof customerID === 'string' && /^ctm_[a-z0-9]{26}$/.test(customerID) ? { pwCustomer: { id: customerID } } : {}),
        environment: data.environment === 'live' ? 'production' : 'sandbox', token: data.client_token,
        eventCallback: event => {
          if (!active) return;
          if ('name' in event && event.name === 'checkout.completed') window.location.assign(success);
          if ('name' in event && event.name === 'checkout.closed') { setCanCancel(!!reference); setMessage('Checkout closed. You can reopen this page to continue, or cancel the unpaid checkout.'); }
          if ('name' in event && ['checkout.error', 'checkout.payment.failed', 'checkout.payment.error'].includes(event.name || '')) setError('Payment could not complete. Check your details and try again in the secure checkout.');
        },
      });
      if (!active) return;
      if (!paddle) throw new Error('Secure checkout did not load. Please reload or contact support.');
      setMessage(data.environment === 'sandbox' ? 'Sandbox checkout — test payments only.' : 'Secure annual USD subscription. Tax and the final total are shown in checkout.');
      // Server-created transaction fixes the plan, quantity, currency and account.
      // Browser events never activate a licence; verification is server-side.
      paddle.Checkout.open({ transactionId: data.transaction_id, settings: { variant: 'one-page', allowLogout: false, showAddDiscounts: false, successUrl: success } });
    }
    open().catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Could not open checkout.'); });
    return () => { active = false; };
  }, [reference, paymentTransaction]);
  async function cancel() {
    setError('');
    try {
      const response = await fetch(`${ZAMERIA_API_BASE}/checkout/paddle/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference }) });
      const data = await response.json();
      if (!response.ok || !data.canceled) throw new Error(data.error || 'Could not confirm cancellation.');
      sessionStorage.removeItem('zameria_pending_checkout'); navigate('/subscribe?country=US&currency=USD');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not cancel checkout.'); }
  }
  return <div className="site-checkout"><AuthHeader buttonText="Your account" buttonAction={() => navigate('/account?tab=billing')} /><main className="site-payment-main"><section className="site-payment-card" aria-live="polite"><h1>Secure USD checkout</h1><p>{message}</p>{error && <p role="alert">{error}</p>}{canCancel && <button className="hm-button" onClick={cancel}>Cancel unpaid checkout</button>}<p>Annual subscriptions renew automatically. Cancel future renewals in Plan & billing. <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a></p></section></main></div>;
}
