import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { AddLicenseModal } from './AddLicenseModal';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Store,
  Users,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  X,
  CreditCard,
  Layers,
  Key
} from 'lucide-react';

export const PlanTab: React.FC = () => {
  const { customer, changePlan, cancelSubscription, resumeSubscription } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    customer?.billingCycle || 'monthly'
  );

  if (!customer) return null;

  const isTrialNotStarted = customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started';
  const isTrialActive = (customer.accountStatus === 'trial_active' || customer.trial?.status === 'active' || customer.trial?.status === 'expiring') && !isTrialNotStarted;
  const isTrialExpired = customer.accountStatus === 'trial_expired' || customer.trial?.status === 'expired' || (isTrialActive && (customer.trial?.daysRemaining ?? 0) <= 0);
  const isCancelled = customer.accountStatus === 'cancelled' || customer.subscription.status === 'cancelled';
  const isExpired = customer.accountStatus === 'expired' || customer.subscription.status === 'expired';
  const isPaidActive = customer.subscription.status === 'active' && !isCancelled && !isExpired && !isTrialNotStarted && !isTrialActive && !isTrialExpired;

  const daysLeft = customer.trial?.daysRemaining ?? customer.trialDaysRemaining ?? 7;
  const trialEnd = customer.trial?.endDate ?? customer.trialEndsAt ?? 'September 19, 2026';
  const renewsAt = customer.subscription.renewsAt || customer.nextBillingDate || 'October 12, 2026';
  const planName = customer.subscription.planName || 'Business Plan';
  const price = customer.subscription.price || customer.planPrice || '₦30,000 / month';

  const handleSelectPlan = (plan: 'Starter' | 'Business' | 'Business Plus') => {
    changePlan(plan, billingCycle);
    setShowChangeModal(false);
  };

  const handleConfirmCancel = () => {
    cancelSubscription();
    setShowCancelModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Heading */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Plan &amp; Subscription
        </h2>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
          Manage your active ZAMERIA subscription, features, and billing cycles.
        </p>
      </div>

      {/* Hero Plan Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: isTrialNotStarted
            ? '1px solid #e2e8f0'
            : isTrialActive
            ? '1px solid #bfdbfe'
            : isTrialExpired
            ? '1px solid #fecaca'
            : isCancelled
            ? '1px solid #fed7aa'
            : isExpired
            ? '1px solid #fecaca'
            : '1px solid #e2e8f0',
          background: isTrialNotStarted
            ? '#ffffff'
            : isTrialActive
            ? 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%)'
            : isCancelled
            ? 'linear-gradient(135deg, #fffbeb 0%, #ffffff 50%)'
            : isTrialExpired
            ? 'linear-gradient(135deg, #fef2f2 0%, #ffffff 50%)'
            : '#ffffff',
          padding: '32px 28px',
          boxShadow: '0 8px 30px -8px rgba(7, 26, 49, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isTrialNotStarted
                    ? '#475569'
                    : isTrialExpired || isExpired
                    ? '#b91c1c'
                    : isCancelled
                    ? '#b45309'
                    : isTrialActive
                    ? '#2563eb'
                    : '#16a34a',
                  backgroundColor: isTrialNotStarted
                    ? '#f1f5f9'
                    : isTrialExpired || isExpired
                    ? '#fef2f2'
                    : isCancelled
                    ? '#fffbeb'
                    : isTrialActive
                    ? '#eff6ff'
                    : '#f0fdf4',
                  border: isTrialNotStarted
                    ? '1px solid #cbd5e1'
                    : isTrialExpired || isExpired
                    ? '1px solid #fecaca'
                    : isCancelled
                    ? '1px solid #fde68a'
                    : isTrialActive
                    ? '1px solid #bfdbfe'
                    : '1px solid #bbf7d0',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isTrialNotStarted ? (
                  <>
                    <Clock size={12} />
                    <span>Trial available • 7-Day Free Trial</span>
                  </>
                ) : isTrialExpired ? (
                  <>
                    <AlertTriangle size={12} />
                    <span>Free Trial Expired</span>
                  </>
                ) : isExpired ? (
                  <>
                    <AlertTriangle size={12} />
                    <span>Expired</span>
                  </>
                ) : isCancelled ? (
                  <>
                    <Clock size={12} />
                    <span>Cancelled • Active until {renewsAt}</span>
                  </>
                ) : isTrialActive ? (
                  <>
                    <Clock size={12} />
                    <span>Free Trial • Active ({daysLeft} Days Remaining)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Active Paid Subscription</span>
                  </>
                )}
              </span>
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#071A31', margin: '0 0 6px' }}>
              {isTrialNotStarted
                ? '7-Day Free Trial'
                : isTrialActive
                ? 'Free Trial'
                : isTrialExpired
                ? 'Free Trial Expired'
                : planName}
            </h3>

            <div style={{ fontSize: '18px', fontWeight: 800, color: isTrialNotStarted ? '#475569' : '#2563eb', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              {isTrialNotStarted ? (
                <span>Activate ZAMERIA to start your trial</span>
              ) : isTrialActive ? (
                <span>₦0 (7-Day Trial)</span>
              ) : isTrialExpired ? (
                <span style={{ color: '#dc2626' }}>Trial Ended</span>
              ) : (
                <>
                  <span>{price}</span>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                    {customer.billingCycle === 'yearly' ? '• billed yearly' : '• billed monthly'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isTrialNotStarted ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountTab('store')}
                  style={{
                    padding: '11px 22px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(7, 26, 49, 0.18)',
                  }}
                >
                  <Store size={15} style={{ color: '#60a5fa' }} />
                  <span>Activate Trial</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  style={{
                    padding: '11px 18px',
                    backgroundColor: '#ffffff',
                    color: '#071A31',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  Choose a Plan
                </button>
              </>
            ) : isTrialActive ? (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                style={{
                  padding: '11px 24px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(7, 26, 49, 0.18)',
                }}
              >
                <Sparkles size={15} style={{ color: '#fbbf24' }} />
                <span>Choose a Plan</span>
              </button>
            ) : isTrialExpired ? (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                style={{
                  padding: '11px 24px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(7, 26, 49, 0.18)',
                }}
              >
                <Sparkles size={15} style={{ color: '#fbbf24' }} />
                <span>Choose a Plan to Continue</span>
              </button>
            ) : isCancelled ? (
              <button
                type="button"
                onClick={resumeSubscription}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Resume Subscription
              </button>
            ) : isExpired ? (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Renew Plan
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowChangeModal(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Manage Plan
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    border: '1px solid #fecaca',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Subscription Meta Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '18px',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              {isTrialNotStarted ? 'Trial Status' : isTrialActive ? 'Trial Expiration' : isTrialExpired ? 'Trial Status' : 'Next Billing Date'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="#2563eb" />
              <span>
                {isTrialNotStarted
                  ? 'Not Started (Ready)'
                  : isTrialActive
                  ? `${trialEnd} (${daysLeft}d left)`
                  : isTrialExpired
                  ? 'Expired'
                  : renewsAt}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              License Status
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: isPaidActive ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={15} color={isPaidActive ? '#16a34a' : '#94a3b8'} />
              <span>{isPaidActive ? 'Active ZMR License' : 'No license assigned'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              Staff &amp; Cashiers
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="#d97706" />
              <span>{customer.staffAllowance || 5} Staff PINs Allowed</span>
            </div>
          </div>
        </div>

        {/* Informative Notice for Trial States */}
        {isTrialNotStarted ? (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13px',
              color: '#334155',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#071A31' }} />
            <div>
              <strong>Trial Note:</strong> Creating a ZAMERIA account does not start the 7-day trial. Your trial only begins when you enter your Trial Activation Code into the ZAMERIA WooCommerce plugin on WordPress.
            </div>
          </div>
        ) : isTrialActive ? (
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13px',
              color: '#1e40af',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
            <div>
              <strong>Trial Notice:</strong> You are currently using ZAMERIA on a 7-day free trial. Your account does not have a license assigned yet. When you are ready, subscribe to a paid plan below to generate your official software license key.
            </div>
          </div>
        ) : isTrialExpired ? (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13px',
              color: '#991b1b',
              lineHeight: 1.5,
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#dc2626' }} />
            <div>
              <strong>Trial Ended:</strong> Your 7-day free trial has expired. Subscribe to an active plan below to restore access and generate your official license key.
            </div>
          </div>
        ) : null}
      </div>

      {/* Available Plans Section (Always visible so trial or paid users can choose/switch) */}
      <div style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: '0 0 16px' }}>
          {(isTrialActive || isTrialNotStarted || isTrialExpired) ? 'Available Subscription Plans' : 'Compare Plans'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Business Plan Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: planName.includes('Business Plus') ? '1px solid #e2e8f0' : '2px solid #2563eb',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#071A31' }}>Business Plan</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '9999px' }}>
                  Most Popular
                </span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#071A31', marginBottom: '12px' }}>
                ₦30,000
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}> / month</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                Complete retail solution for physical shops, boutiques, and pharmacies.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ 1 Till Register Allowance</li>
                <li>✓ Real-time 2-way WooCommerce stock sync</li>
                <li>✓ Unlimited products &amp; barcode printing</li>
                <li>✓ 5 Cashier staff PINs</li>
                <li>✓ Offline sales caching</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: isPaidActive && planName === 'Business' ? '#f1f5f9' : '#071A31',
                color: isPaidActive && planName === 'Business' ? '#64748b' : '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isPaidActive && planName === 'Business' ? 'default' : 'pointer',
              }}
              disabled={isPaidActive && planName === 'Business'}
            >
              {isPaidActive && planName === 'Business' ? 'Current Active Plan' : 'Subscribe to Business'}
            </button>
          </div>

          {/* Business Plus Plan Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: planName.includes('Business Plus') ? '2px solid #2563eb' : '1px solid #e2e8f0',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#071A31' }}>Business Plus</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', backgroundColor: '#f5f3ff', padding: '2px 8px', borderRadius: '9999px' }}>
                  Enterprise
                </span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#071A31', marginBottom: '12px' }}>
                ₦50,000
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}> / month</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                Advanced sync and priority infrastructure for multi-location retail brands.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ Multi-store domain routing</li>
                <li>✓ Unlimited registers &amp; till stations</li>
                <li>✓ Priority real-time webhook sync</li>
                <li>✓ Unlimited staff &amp; supervisor accounts</li>
                <li>✓ 24/7 dedicated engineering support</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: isPaidActive && planName.includes('Business Plus') ? '#f1f5f9' : '#071A31',
                color: isPaidActive && planName.includes('Business Plus') ? '#64748b' : '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isPaidActive && planName.includes('Business Plus') ? 'default' : 'pointer',
              }}
              disabled={isPaidActive && planName.includes('Business Plus')}
            >
              {isPaidActive && planName.includes('Business Plus') ? 'Current Active Plan' : 'Subscribe to Business Plus'}
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade / Subscribe Modal */}
      <AddLicenseModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccessNavigate={() => setIsUpgradeModalOpen(false)}
      />

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '20px',
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: '0 0 8px' }}>
              Cancel Subscription?
            </h4>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px' }}>
              If you cancel, you will still retain full access to ZAMERIA and your active license until the end of your billing cycle on <strong>{renewsAt}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTab;
