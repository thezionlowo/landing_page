import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { X, ShieldCheck, Check, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { startZameriaCheckout, ZAMERIA_PLANS, ZameriaPlan } from '../../lib/zameriaCheckout';

interface AddLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  onSuccessNavigate?: () => void;
}

const PLAN_FEATURES: Record<ZameriaPlan, string[]> = {
  starter: [
    'One connected WooCommerce store',
    'Point of Sale with real-time inventory sync',
    'Up to 3 staff accounts',
    'Email support',
  ],
  business: [
    'One connected WooCommerce store',
    'Unlimited products and staff accounts',
    'Advanced reporting and multi-terminal POS',
    'Priority support',
  ],
};

const fieldStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '11px 13px',
  boxSizing: 'border-box',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  fontSize: 14,
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12.5, fontWeight: 700, color: '#071A31' };

/**
 * Starts a real Paystack transaction through the ZAMERIA licensing service.
 * License keys are issued server-side after payment is confirmed, so this modal
 * never creates or displays a key — the buyer returns to /payment/complete.
 */
export const AddLicenseModal: React.FC<AddLicenseModalProps> = ({ isOpen, onClose, initialPlan }) => {
  const { customer } = useCustomerAuth();

  const [plan, setPlan] = useState<ZameriaPlan>(
    initialPlan && initialPlan.toLowerCase().includes('starter') ? 'starter' : 'business',
  );
  const [email, setEmail] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !customer) return;
    setError(null);
    setEmail((current) => current || customer.email || '');
    setStoreUrl((current) => current || customer.connectedStore?.url || '');
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const handlePurchase = async () => {
    setError(null);
    if (!email.trim() || !storeUrl.trim()) {
      setError('Enter the billing email and the WooCommerce store this license is for.');
      return;
    }
    setIsProcessing(true);
    try {
      const checkout = await startZameriaCheckout({
        plan,
        email,
        storeUrl,
        businessName: customer.businessName,
      });
      window.location.assign(checkout.authorization_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to start the secure payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 26, 49, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 800, color: '#071A31', fontSize: 16 }}>Subscribe and get a license</div>
              <div style={{ color: '#64748b', fontSize: 12.5 }}>Secure payment on Paystack · billed annually</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ border: 0, background: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'grid', gap: 18 }}>
          {error && (
            <div
              role="alert"
              style={{
                color: '#b91c1c',
                background: '#fef2f2',
                padding: 12,
                borderRadius: 10,
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                fontSize: 13,
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gap: 12 }}>
            {(Object.keys(ZAMERIA_PLANS) as ZameriaPlan[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPlan(key)}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '16px 18px',
                  borderRadius: 14,
                  border: plan === key ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: plan === key ? '#f0f7ff' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#071A31' }}>{ZAMERIA_PLANS[key].label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>{ZAMERIA_PLANS[key].price}</span>
                </div>
                <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                  {PLAN_FEATURES[key].map((feature) => (
                    <span
                      key={feature}
                      style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#475569' }}
                    >
                      <Check size={13} color="#2563eb" strokeWidth={3} />
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <label style={labelStyle}>
            Billing email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            WooCommerce store URL
            <input
              placeholder="https://yourstore.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              style={fieldStyle}
            />
          </label>

          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, fontSize: 13, color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#071A31' }}>
              <span>{ZAMERIA_PLANS[plan].label} Plan</span>
              <span>{ZAMERIA_PLANS[plan].price}</span>
            </div>
            <p style={{ margin: '8px 0 0' }}>
              Your license key is issued by ZAMERIA after Paystack confirms the payment, and is shown on the
              confirmation page.
            </p>
          </div>
        </div>

        <div style={{ padding: '18px 28px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-hero-gradient"
            onClick={handlePurchase}
            disabled={isProcessing}
            style={{ flex: 2, justifyContent: 'center', border: 0, opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? (
              'Opening secure checkout…'
            ) : (
              <>
                <Lock size={15} /> Continue to Paystack <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
