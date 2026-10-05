import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { useRouter } from '../router/Router';
import { startZameriaCheckout, ZameriaPlan } from '../lib/zameriaCheckout';
import { useCustomerAuth } from '../context/CustomerAuthContext';

import { useGeoPricing } from '../services/geoPricingService';
import { isNigerianCountry } from '../lib/geoPricing';

export const SubscribePage: React.FC = () => {
  const { navigate, search } = useRouter();
  const { customer } = useCustomerAuth();
  const { geo } = useGeoPricing();
  const requestedPlan = new URLSearchParams(search).get('plan');
  const [plan, setPlan] = useState<ZameriaPlan>(requestedPlan === 'starter' ? 'starter' : 'business');
  const [email, setEmail] = useState(customer?.email || '');
  const [businessName, setBusinessName] = useState(customer?.businessName || '');
  const [storeUrl, setStoreUrl] = useState(customer?.connectedStore?.url || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Customer's locked country takes precedence if logged in; otherwise use detected geo
  const customerCountry = customer?.country || customer?.billingAddress?.country;
  const isNigeria = customerCountry ? isNigerianCountry(customerCountry) : geo.isNigeria;
  const targetCountry = isNigeria ? 'Nigeria' : (customerCountry || geo.country || 'International');
  const currency = isNigeria ? 'NGN' : 'USD';

  const starterPrice = isNigeria ? '₦200,000' : '$250';
  const businessPrice = isNigeria ? '₦300,000' : '$400';
  const price = plan === 'starter' ? starterPrice : businessPrice;
  const amount = plan === 'starter' ? (isNigeria ? 200000 : 250) : (isNigeria ? 300000 : 400);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
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
      sessionStorage.setItem('zameria_pending_checkout', JSON.stringify({ email, businessName, storeUrl, reference: checkout.reference, country: targetCountry, currency, amount }));
      window.location.assign(checkout.authorization_url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to start checkout.');
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '48px 20px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 32, boxShadow: '0 20px 45px -30px rgba(7,26,49,.35)' }}>
        <button onClick={() => navigate('/')} style={{ border: 0, background: 'transparent', color: '#334155', cursor: 'pointer', display: 'inline-flex', gap: 8, alignItems: 'center', padding: 0 }}><ArrowLeft size={16} /> Back</button>
        <h1 style={{ color: '#071a31', fontSize: 28, margin: '24px 0 8px' }}>Complete your ZAMERIA subscription</h1>
        <p style={{ color: '#64748b', lineHeight: 1.5, marginTop: 0 }}>
          Region: <strong style={{ color: '#071a31' }}>{targetCountry} ({currency})</strong>. Your subscription and license key activate immediately upon payment confirmation.
        </p>
        <form onSubmit={submit} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <label style={{ color: '#334155', fontWeight: 700 }}>Plan
            <select value={plan} onChange={(e) => setPlan(e.target.value as ZameriaPlan)} style={{ display: 'block', width: '100%', marginTop: 6, padding: 12, border: '1px solid #cbd5e1', borderRadius: 10 }}>
              <option value="starter">Starter — {starterPrice}/year</option>
              <option value="business">Business — {businessPrice}/year</option>
            </select>
          </label>
          <label style={{ color: '#334155', fontWeight: 700 }}>Business name<input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 12, border: '1px solid #cbd5e1', borderRadius: 10 }} /></label>
          <label style={{ color: '#334155', fontWeight: 700 }}>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 12, border: '1px solid #cbd5e1', borderRadius: 10 }} /></label>
          <label style={{ color: '#334155', fontWeight: 700 }}>WooCommerce store URL<input required type="url" placeholder="https://yourstore.com" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 12, border: '1px solid #cbd5e1', borderRadius: 10 }} /></label>
          {error && <p role="alert" style={{ color: '#b91c1c', margin: 0 }}>{error}</p>}
          <button disabled={submitting} type="submit" style={{ padding: '14px 18px', border: 0, borderRadius: 10, cursor: submitting ? 'wait' : 'pointer', color: '#fff', background: '#071a31', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Lock size={16} /> {submitting ? 'Opening checkout…' : `Continue to checkout — ${price}`} <ArrowRight size={16} /></button>
        </form>
      </div>
    </main>
  );
};

