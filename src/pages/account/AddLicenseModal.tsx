import React, { useState } from 'react';
import { useCustomerAuth, LicenseItem, OrderItem } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import {
  X,
  ShieldCheck,
  Check,
  CreditCard,
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  CheckCircle2,
  Plug,
  Lock,
  Zap,
  Key,
  ExternalLink
} from 'lucide-react';

interface AddLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  onSuccessNavigate?: () => void;
}

export const AddLicenseModal: React.FC<AddLicenseModalProps> = ({ isOpen, onClose, initialPlan, onSuccessNavigate }) => {
  const { customer, subscribeToPlan } = useCustomerAuth();
  const { navigate, setAccountTab } = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<'Business' | 'Business Plus'>(
    (initialPlan === 'Business Plus' ? 'Business Plus' : 'Business')
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ license: LicenseItem; order: OrderItem } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen || !customer) return null;

  const isTrial = customer.subscription.status === 'trial' || customer.accountStatus === 'trial_active' || customer.accountStatus === 'trial_expired';
  const defaultPm = customer.paymentMethods.find((p) => p.isDefault) || customer.paymentMethods[0];

  const getPrice = (plan: 'Business' | 'Business Plus', cycle: 'monthly' | 'yearly') => {
    if (plan === 'Business') {
      return cycle === 'yearly'
        ? { amount: '₦25,000', period: 'per month', billedTotal: '₦300,000 billed annually (Save ₦60,000)' }
        : { amount: '₦30,000', period: 'per month', billedTotal: '₦30,000 billed monthly' };
    }
    // Business Plus
    return cycle === 'yearly'
      ? { amount: '₦42,000', period: 'per month', billedTotal: '₦504,000 billed annually (Save ₦96,000)' }
      : { amount: '₦50,000', period: 'per month', billedTotal: '₦50,000 billed monthly' };
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await subscribeToPlan({
        plan: selectedPlan,
        billingCycle,
        transactionRef: `txn_${Date.now()}`,
      });
      setCreatedResult({ license: res.license, order: res.order });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyKey = () => {
    if (!createdResult) return;
    navigator.clipboard.writeText(createdResult.license.licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleClose = () => {
    setCreatedResult(null);
    onClose();
  };

  const priceDetails = getPrice(selectedPlan, billingCycle);

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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '620px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              {createdResult ? <Key size={18} /> : <Layers size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                {createdResult
                  ? 'License Generated & Active!'
                  : isTrial
                  ? 'Choose a Plan — Upgrade to Paid Subscription'
                  : 'Add a License / Expand Subscription'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                Account: <strong>{customer.businessName}</strong> ({customer.email})
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
          {!createdResult ? (
            /* STEP 1: CHOOSE PLAN & BILLING */
            <div>
              {isTrial && (
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: '#1e40af',
                  }}
                >
                  <Sparkles size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                  <span>
                    Upgrading creates your official subscription and automatically generates your unique <strong>ZMR license key</strong>.
                  </span>
                </div>
              )}

              {/* Billing Cycle Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  padding: '5px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  maxWidth: '320px',
                  margin: '0 auto 20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                    color: billingCycle === 'monthly' ? '#071A31' : '#64748b',
                    boxShadow: billingCycle === 'monthly' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: billingCycle === 'yearly' ? '#ffffff' : 'transparent',
                    color: billingCycle === 'yearly' ? '#071A31' : '#64748b',
                    boxShadow: billingCycle === 'yearly' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Yearly</span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    Save 17%
                  </span>
                </button>
              </div>

              {/* Plan Selection Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                {/* 1. Business Plan */}
                <div
                  onClick={() => setSelectedPlan('Business')}
                  style={{
                    border: selectedPlan === 'Business' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: selectedPlan === 'Business' ? '#f0f7ff' : '#ffffff',
                    borderRadius: '16px',
                    padding: '18px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#071A31' }}>Business</span>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedPlan === 'Business' ? '6px solid #2563eb' : '2px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#071A31' }}>
                    {billingCycle === 'yearly' ? '₦25,000' : '₦30,000'}
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}> / mo</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 10px', lineHeight: 1.4 }}>
                    Ideal for single-location retail stores and boutiques.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li>✓ 1 Till Register</li>
                    <li>✓ Real-time WooCommerce Sync</li>
                    <li>✓ 5 Staff PINs</li>
                  </ul>
                </div>

                {/* 2. Business Plus Plan */}
                <div
                  onClick={() => setSelectedPlan('Business Plus')}
                  style={{
                    border: selectedPlan === 'Business Plus' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: selectedPlan === 'Business Plus' ? '#f0f7ff' : '#ffffff',
                    borderRadius: '16px',
                    padding: '18px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#071A31' }}>Business Plus</span>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedPlan === 'Business Plus' ? '6px solid #2563eb' : '2px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#071A31' }}>
                    {billingCycle === 'yearly' ? '₦42,000' : '₦50,000'}
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}> / mo</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 10px', lineHeight: 1.4 }}>
                    For multi-store retailers and high-volume chains.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li>✓ Multi-store Support</li>
                    <li>✓ Unlimited Registers</li>
                    <li>✓ Priority Webhook Sync</li>
                  </ul>
                </div>
              </div>

              {/* Order Summary & Payment Review */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '18px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Plan selected:</span>
                  <span style={{ fontWeight: 700, color: '#071A31' }}>{selectedPlan} Plan</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Billing frequency:</span>
                  <span style={{ fontWeight: 700, color: '#071A31' }}>
                    {billingCycle === 'yearly' ? 'Annual (Yearly)' : 'Monthly'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Payment method:</span>
                  <span style={{ fontWeight: 700, color: '#071A31', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} color="#2563eb" />
                    <span>{defaultPm ? `${defaultPm.brand} •••• ${defaultPm.last4}` : 'Mastercard ending in 4092'}</span>
                  </span>
                </div>
                <div
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#071A31' }}>Total due today:</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563eb' }}>
                      {priceDetails.amount}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{priceDetails.billedTotal}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePurchase}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  opacity: isProcessing ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(7, 26, 49, 0.2)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isProcessing ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTopColor: '#ffffff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Verifying payment &amp; generating license...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pay {priceDetails.amount} &amp; Activate License</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* STEP 2: PAYMENT SUCCESS & LICENSE GENERATED */
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Check size={28} />
              </div>

              <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#071A31', margin: '0 0 6px' }}>
                You're all set!
              </h4>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 auto 20px', maxWidth: '440px', lineHeight: 1.5 }}>
                Your {createdResult.license.planName || 'Business'} plan is now active.<br />
                Your ZAMERIA license has been generated.
              </p>

              {/* License Card */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Your ZAMERIA License Key
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 800, color: '#071A31' }}>
                    {createdResult.license.licenseKey}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    style={{
                      backgroundColor: copiedKey ? '#f0fdf4' : '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: copiedKey ? '#16a34a' : '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedKey ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  <strong>Next step:</strong> Enter this license key in your WooCommerce WordPress admin under <em>ZAMERIA POS &rarr; Settings</em> to activate real-time catalog syncing.
                </div>
              </div>

              {/* Action CTAs (Section 21: Primary "Go to ZAMERIA", Secondary "View License") */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    window.open('http://localhost:5176', '_blank', 'noopener,noreferrer');
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(7, 26, 49, 0.18)',
                  }}
                >
                  <span>Go to ZAMERIA</span>
                  <ExternalLink size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setAccountTab('licenses');
                    if (onSuccessNavigate) onSuccessNavigate();
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    backgroundColor: '#f1f5f9',
                    color: '#071A31',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View License
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLicenseModal;
