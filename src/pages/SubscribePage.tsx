import { CheckoutHeader, CheckoutFooter } from '../components/CheckoutHeader';
import { rememberCheckoutAccount } from '../lib/checkoutAccount';
import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
} from "lucide-react";
import { useRouter } from "../router/Router";
import { startZameriaCheckout, ZameriaPlan } from "../lib/zameriaCheckout";
import { useCustomerAuth } from "../context/CustomerAuthContext";

import { useGeoPricing } from "../services/geoPricingService";
import { checkoutPricing, planCheckoutUrl } from "../lib/checkoutPricing";
import { usePlanComparison } from "../components/PlanComparison";
import { useEffect } from "react";

export const SubscribePage: React.FC = () => {
  const { navigate, search } = useRouter();
  const { customer, isAuthenticated, isRestoringSession } = useCustomerAuth();
  const { geo } = useGeoPricing();
  const openComparison = usePlanComparison();
  const params = new URLSearchParams(search);
  const requestedPlan = params.get("plan");
  const [plan, setPlan] = useState<ZameriaPlan>(
    requestedPlan === "starter" ? "starter" : "business",
  );
  const [email, setEmail] = useState(customer?.email || "");
  const [businessName, setBusinessName] = useState(
    customer?.businessName || "",
  );
  const [storeUrl, setStoreUrl] = useState(customer?.connectedStore?.url || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPlan(requestedPlan === 'starter' ? 'starter' : 'business');
  }, [requestedPlan]);

  useEffect(() => {
    if (!customer) return;
    setBusinessName(value => value || customer.businessName || '');
    setStoreUrl(value => value || customer.connectedStore?.url || '');
  }, [customer?.id]);

  const pricing = checkoutPricing(customer, params.get('country'), params.get('currency'), geo);
  const selected = pricing.plans[plan];
  const targetCountry = pricing.country;
  const currency = pricing.currency;
  const checkoutEmail = isAuthenticated && customer ? customer.email : email;
  const price = selected.displayPrice;
  const amount = selected.amount;

  const comparePlans = () => openComparison({
    country: pricing.isNigeria ? 'NG' : pricing.country,
    selectedPlan: plan,
    onSelect: nextPlan => {
      setPlan(nextPlan);
      navigate(planCheckoutUrl(nextPlan, pricing));
    },
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const checkout = await startZameriaCheckout({
        plan,
        email: checkoutEmail,
        businessName,
        storeUrl,
        country: targetCountry,
        currency,
        amount,
        callbackUrl: `${window.location.origin}/payment/complete`,
      });
      rememberCheckoutAccount(checkout.reference, checkoutEmail, businessName);
      try { sessionStorage.setItem(
        "zameria_pending_checkout",
        JSON.stringify({
          email: checkoutEmail,
          businessName,
          storeUrl,
          reference: checkout.reference,
          country: targetCountry,
          currency,
          amount,
        }),
      );
      } catch {}
      window.location.assign(checkout.authorization_url);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to start checkout.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="site-checkout site-checkout-simple">
      <CheckoutHeader />
      <main className="site-checkout-main">
        <a className="checkout-back" href={`/pricing?country=${encodeURIComponent(targetCountry)}&currency=${currency}`}><ArrowLeft size={16} />Back to plans</a>
        <ol className="checkout-steps" aria-label="Checkout progress"><li aria-current="step"><span>1</span>Store details</li><li><span>2</span>Payment</li><li><span>3</span>Your licence</li></ol>
        <section className="site-checkout-panel" aria-labelledby="checkout-heading">
          <h1 id="checkout-heading">Checkout</h1>
          <p className="site-checkout-intro">A full year of ZAMERIA, connected to your store.</p>
          <div className="site-checkout-selection">
            <div><strong>{selected.plan}</strong><span>{price}<small> / year</small></span></div>
            <button type="button" onClick={comparePlans} aria-haspopup="dialog">Compare plans</button>
          </div>
          <ul className="checkout-includes"><li><Check size={15} />One WooCommerce store</li><li><Check size={15} />12 months of access</li><li><Check size={15} />{plan === 'starter' ? '500 products · 5 staff accounts' : 'Unlimited products and staff'}</li></ul>
          <form onSubmit={submit}>
            <label htmlFor="checkout-business">Business name<input id="checkout-business" required autoComplete="organization" value={businessName} onChange={event => setBusinessName(event.target.value)} placeholder="Your store name" disabled={submitting} /></label>
            <label htmlFor="checkout-email">Email address<input id="checkout-email" required type="email" autoComplete="email" value={checkoutEmail} readOnly={isAuthenticated} onChange={event => setEmail(event.target.value)} placeholder="name@business.com" disabled={submitting} /></label>
            <label htmlFor="checkout-store">WooCommerce store URL<input id="checkout-store" required type="url" autoComplete="url" placeholder="https://yourstore.com" value={storeUrl} onChange={event => setStoreUrl(event.target.value)} disabled={submitting} /></label>
            <p className="checkout-licence-note">Your licence will be tied to this store domain and the email above. It activates after payment is verified. {isAuthenticated && 'You are checking out with your signed-in account.'}</p>
            {error && <p role="alert" className="site-auth-error">{error}</p>}
            <button disabled={submitting || isRestoringSession} type="submit" className="hm-button"><Lock size={15} /><span>{submitting ? 'Opening checkout…' : `Continue to checkout — ${price}`}</span><ArrowRight size={16} /></button>
            <p className="checkout-payment-note"><Lock size={13} />Secure payment by Paystack. One annual payment; no automatic renewal.</p>
            <p className="checkout-policy-note">By continuing, you agree to the <a href="/terms">Terms</a>. Read our <a href="/privacy">Privacy</a> and <a href="/refunds">Refund Policy</a>.</p>
          </form>
        </section>
      </main>
      <CheckoutFooter />
    </div>
  );
};
