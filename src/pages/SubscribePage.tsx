import { AuthHeader } from "./auth/AuthHeader";
import React, { useState } from "react";
import {
  ArrowRight,
  Lock,
} from "lucide-react";
import { useRouter } from "../router/Router";
import { getCheckoutConfig, type CheckoutConfig, startZameriaCheckout, ZameriaPlan } from "../lib/zameriaCheckout";
import { useCustomerAuth } from "../context/CustomerAuthContext";

import { useGeoPricing } from "../services/geoPricingService";
import { checkoutPricing, planCheckoutUrl } from "../lib/checkoutPricing";
import { usePlanComparison } from "../components/PlanComparison";
import { useEffect } from "react";

export const SubscribePage: React.FC = () => {
  const { navigate, search } = useRouter();
  const { customer } = useCustomerAuth();
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
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [configError, setConfigError] = useState('');
  useEffect(() => { let active = true; getCheckoutConfig().then(value => { if (active) setConfig(value); }).catch(reason => { if (active) setConfigError(reason.message); }); return () => { active = false; }; }, []);

  useEffect(() => {
    setPlan(requestedPlan === 'starter' ? 'starter' : 'business');
  }, [requestedPlan]);

  const pricing = checkoutPricing(customer, params.get('country'), params.get('currency'), geo);
  const selected = pricing.plans[plan];
  const targetCountry = pricing.country;
  const currency = pricing.currency;
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
    if (currency === 'USD' && (!config || !config.usd_available)) { setError(configError || 'USD checkout is awaiting approval. Please try again later.'); return; }
    setSubmitting(true);
    try {
      const checkout = await startZameriaCheckout({
        plan,
        email,
        businessName,
        storeUrl,
        country: targetCountry,
        currency,
        amount,
        callbackUrl: `${window.location.origin}/payment/complete`,
      });
      sessionStorage.setItem(
        "zameria_pending_checkout",
        JSON.stringify({
          email,
          businessName,
          storeUrl,
          reference: checkout.reference,
          country: targetCountry,
          currency,
          amount,
        }),
      );
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
      <AuthHeader buttonText="Back" buttonAction={() => navigate('/')} showBackIcon />
      <main className="site-checkout-main">
        <section className="site-checkout-panel" aria-labelledby="checkout-heading">
          <h1 id="checkout-heading">Checkout</h1>
          <p className="site-checkout-intro">Enter your store details to continue to secure payment.</p>
          <div className="site-checkout-selection">
            <div><strong>{selected.plan}</strong><span>{price}<small> / year</small></span></div>
            <button type="button" onClick={comparePlans} aria-haspopup="dialog">Compare plans</button>
          </div>
          <form onSubmit={submit}>
            <label htmlFor="checkout-business">Business name<input id="checkout-business" required autoComplete="organization" value={businessName} onChange={event => setBusinessName(event.target.value)} placeholder="Your store name" disabled={submitting} /></label>
            <label htmlFor="checkout-email">Email address<input id="checkout-email" required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@business.com" disabled={submitting} /></label>
            <label htmlFor="checkout-store">WooCommerce store URL<input id="checkout-store" required type="url" autoComplete="url" placeholder="https://yourstore.com" value={storeUrl} onChange={event => setStoreUrl(event.target.value)} disabled={submitting} /></label>
            <p className="site-checkout-intro">{currency === 'USD' && config?.usd_auto_renews ? 'Renews automatically every year. Applicable tax is calculated by Paddle at checkout. Cancel future renewals in Plan & billing.' : 'One year of access. Renewal and payment terms are confirmed at checkout.'} By continuing, you agree to our <a href="/terms">Terms</a>, <a href="/privacy">Privacy Policy</a> and <a href="/refunds">Refund Policy</a>.</p>
            {currency === 'USD' && configError && <p role="alert">{configError}</p>}
            {currency === 'USD' && config && !config.usd_available && <p role="status">USD checkout is awaiting approval.</p>}
            {error && <p role="alert" className="site-auth-error">{error}</p>}
            <button disabled={submitting || (currency === 'USD' && (!config || !config.usd_available))} type="submit" className="hm-button"><Lock size={15} /><span>{submitting ? 'Opening checkout…' : `Continue to checkout — ${price}`}</span><ArrowRight size={16} /></button>
          </form>
        </section>
      </main>
      <footer className="zameria-auth-footer">© {new Date().getFullYear()} ZAMERIA</footer>
    </div>
  );
};
