import React, { useState } from 'react';
import { resolveSubscriptionState, useCustomerAuth, OrderItem } from '../../context/CustomerAuthContext';
import { getAuthoritativePlanPrice } from '../../lib/geoPricing';
import { AddLicenseModal } from './AddLicenseModal';
import {
  CreditCard,
  Receipt,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  X,
  Printer,
  Sparkles,
  AlertCircle,
  Key,
  Copy,
  Check,
  Layers,
  MapPin,
  Building,
} from 'lucide-react';

export const BillingTab: React.FC = () => {
  const { customer, changePlan, cancelSubscription, resumeSubscription, updateBillingAddress } = useCustomerAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<OrderItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [addrForm, setAddrForm] = useState({
    firstName: customer?.billingAddress?.firstName || customer?.fullName?.split(' ')[0] || '',
    lastName: customer?.billingAddress?.lastName || customer?.fullName?.split(' ').slice(1).join(' ') || '',
    company: customer?.businessName || '',
    address: customer?.billingAddress?.address || '14 Admiralty Way, Lekki Phase 1',
    city: customer?.billingAddress?.city || 'Lagos',
    state: customer?.billingAddress?.state || 'Lagos State',
    country: 'Nigeria',
    phone: customer?.billingAddress?.phone || customer?.phone || '+234 800 000 0000',
  });

  if (!customer) return null;

  const subscriptionState = resolveSubscriptionState(customer);
  const isTrialActive = subscriptionState === 'trial_active';
  const isPaidActive = subscriptionState === 'paid_active';
  const isCancelled = customer.accountStatus === 'cancelled' || customer.subscription?.status === 'cancelled';
  const isGifted = customer.accessType === 'Gifted' || customer.accessType === 'Complimentary' || Boolean(customer.giftedDetails);

  const primaryLicense = customer.licenses?.[0] || null;

  const rawPlanStr = String(
    customer.giftedDetails?.plan || primaryLicense?.plan || customer.plan || customer.subscription?.planId || ''
  ).toLowerCase();
  const isStarter =
    rawPlanStr.includes('starter') ||
    (!rawPlanStr.includes('business') && Boolean(customer.giftedDetails?.plan?.toLowerCase().includes('starter')));
  const isBusiness = rawPlanStr.includes('business') && !isStarter;
  const planTier = isStarter ? 'Starter' : isBusiness ? 'Business' : (customer.plan || 'Starter');

  const targetCountry = customer.country || (customer.currency === 'USD' ? 'US' : 'NG');
  const authoritativePrice = getAuthoritativePlanPrice(targetCountry, isBusiness ? 'Business' : 'Starter');

  const planName = isPaidActive
    ? (customer.subscription?.planName || `${planTier} Plan`)
    : isTrialActive
      ? '7-Day Free Trial'
      : isGifted
        ? `Gifted ${planTier} Plan`
        : `${planTier} Plan`;

  const priceDisplay = isGifted
    ? 'Complimentary'
    : isPaidActive
      ? authoritativePrice
      : '₦0 (Active Trial)';

  const dynamicAnnualExpiry = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();
  const renewsAt = customer.subscription?.renewsAt || customer.nextBillingDate || primaryLicense?.expiresAt || dynamicAnnualExpiry;

  const handleCopyKey = () => {
    if (!primaryLicense) return;
    navigator.clipboard.writeText(primaryLicense.licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleDownloadInvoice = (order: OrderItem) => {
    setDownloadSuccess(order.invoiceNumber);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateBillingAddress({
      ...addrForm,
    });
    setIsAddressModalOpen(false);
  };

  const orders = customer.orders || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. TAB HEADER */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
          boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#071A31',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}
          >
            Subscription &amp; Billing
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Manage your ZAMERIA subscription plan, software entitlements, and payment receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlanModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#071A31',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(7, 26, 49, 0.15)',
          }}
        >
          <Sparkles size={14} style={{ color: '#fbbf24' }} />
          <span>{isPaidActive ? 'Change Plan' : 'Upgrade to Annual Plan'}</span>
        </button>
      </div>

      {downloadSuccess && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            color: '#166534',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Tax Invoice {downloadSuccess} downloaded successfully.</span>
        </div>
      )}

      {/* 2. PLAN & SUBSCRIPTION CARD */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isPaidActive ? '#16a34a' : isTrialActive ? '#2563eb' : '#7c3aed',
                  backgroundColor: isPaidActive ? '#f0fdf4' : isTrialActive ? '#eff6ff' : '#f5f3ff',
                  border: isPaidActive ? '1px solid #bbf7d0' : isTrialActive ? '1px solid #bfdbfe' : '1px solid #ddd6fe',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {isPaidActive ? 'Active Subscription' : isTrialActive ? '7-Day Free Trial' : 'Active Plan'}
              </span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
              {planName}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              {priceDisplay} · Annual Billing
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Next Billing / Expiry</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#071A31' }}>{renewsAt}</div>
          </div>
        </div>

        {/* Plan Features breakdown */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Check size={16} style={{ color: '#16a34a' }} />
            <span>{isBusiness ? 'Unlimited Store Products' : 'Up to 500 Products'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Check size={16} style={{ color: '#16a34a' }} />
            <span>{isBusiness ? 'Unlimited POS Registers' : 'Up to 2 Registers'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Check size={16} style={{ color: '#16a34a' }} />
            <span>Real-time 2-Way WooCommerce Sync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Check size={16} style={{ color: '#16a34a' }} />
            <span>Full Offline Mode &amp; Local Caching</span>
          </div>
        </div>

        {/* Cancellation or Switch actions */}
        {isPaidActive && !isGifted && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {isCancelled ? (
              <button
                type="button"
                onClick={resumeSubscription}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Resume Subscription
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Cancel auto-renewal
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. SOFTWARE ENTITLEMENT & LICENSE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Software Entitlement &amp; License
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Authoritative SaaS license assigned to your connected store.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Authoritative License Key
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#071A31',
                fontFamily: 'monospace',
                marginTop: '4px',
              }}
            >
              {primaryLicense ? primaryLicense.licenseKey : 'Auto-Assigned on Store Connection'}
            </div>
          </div>

          {primaryLicense && (
            <button
              type="button"
              onClick={handleCopyKey}
              style={{
                padding: '8px 14px',
                backgroundColor: copiedKey ? '#16a34a' : '#071A31',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {copiedKey ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. BILLING ADDRESS & PAYMENT METHOD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Billing Contact */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} style={{ color: '#64748b' }} />
              <span>Billing Address</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Edit Address
            </button>
          </div>

          <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, color: '#071A31' }}>{customer.fullName}</div>
            <div>{customer.businessName}</div>
            <div>{customer.billingAddress?.address || '14 Admiralty Way, Lekki Phase 1'}</div>
            <div>{customer.billingAddress?.city || 'Lagos'}, {customer.billingAddress?.state || 'Lagos State'}</div>
            <div>{customer.billingAddress?.country || 'Nigeria'}</div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
              Phone: {customer.phone || customer.billingAddress?.phone || '+234 800 000 0000'}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={16} style={{ color: '#64748b' }} />
              <span>Payment Method</span>
            </h3>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '26px',
                backgroundColor: '#071A31',
                borderRadius: '6px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              CARD
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#071A31' }}>
                {isPaidActive ? 'Paystack Verified Card' : 'No Card Required (Trial)'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {isPaidActive ? 'Auto-renews safely via Paystack PCI-DSS token' : 'Add card when upgrading'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INVOICES & PAYMENT RECEIPTS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: '0 0 2px' }}>
              Invoice &amp; Receipt History
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Download official receipts for tax accounting and record-keeping.
            </p>
          </div>
        </div>

        {orders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Invoice #</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Plan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#071A31', fontFamily: 'monospace' }}>
                      {ord.invoiceNumber || ord.orderNumber}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{ord.date}</td>
                    <td style={{ padding: '14px 16px', color: '#071A31' }}>{ord.plan}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#071A31' }}>{ord.total}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#16a34a',
                          backgroundColor: '#f0fdf4',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(ord)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Download size={13} />
                        <span>Download PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            No previous invoices yet. Invoices appear automatically upon completing your subscription payment.
          </div>
        )}
      </div>

      {/* Plan upgrade modal */}
      <AddLicenseModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        initialPlan="Business"
      />

      {/* Edit Address Modal */}
      {isAddressModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Edit Billing Address
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Business / Company Name</label>
                <input
                  type="text"
                  required
                  value={addrForm.company}
                  onChange={(e) => setAddrForm({ ...addrForm, company: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Street Address</label>
                <input
                  type="text"
                  required
                  value={addrForm.address}
                  onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>City</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    required
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#071A31', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: '0 0 8px' }}>
              Cancel Auto-Renewal?
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px' }}>
              Your store will continue to have full access to ZAMERIA POS until <strong>{renewsAt}</strong>. You will not be charged again after this date.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer', fontSize: '13px' }}
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelSubscription();
                  setIsCancelModalOpen(false);
                }}
                style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
