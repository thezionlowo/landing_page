import React, { useState } from 'react';
import { resolveSubscriptionState, useCustomerAuth } from '../../context/CustomerAuthContext';
import { isNigerianCountry, getAuthoritativePlanPrice } from '../../lib/geoPricing';
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
  Key,
  Monitor
} from 'lucide-react';

export const PlanTab: React.FC = () => {
  const { customer, changePlan, cancelSubscription, resumeSubscription } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    customer?.billingCycle || 'yearly'
  );

  if (!customer) return null;

  const subscriptionState = resolveSubscriptionState(customer);
  const isTrialNotStarted = subscriptionState === 'no_active_plan' && (customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started');
  const isTrialActive = subscriptionState === 'trial_active';
  const isTrialExpired = subscriptionState === 'trial_expired';
  const isCancelled = customer.accountStatus === 'cancelled' || customer.subscription.status === 'cancelled';
  const isExpired = customer.accountStatus === 'expired' || customer.subscription.status === 'expired';
  const isPaidActive = subscriptionState === 'paid_active';

  const daysLeft = customer.trial?.daysRemaining ?? customer.trialDaysRemaining ?? 7;
  const trialEnd = customer.trial?.endDate ?? customer.trialEndsAt ?? '';

  const dynamicAnnualExpiry = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();
  const primaryLicense = customer.licenses?.[0] || null;
  const renewsAt = customer.subscription.renewsAt || customer.nextBillingDate || primaryLicense?.expiresAt || dynamicAnnualExpiry;

  const isGifted = customer.accessType === 'Gifted' || customer.accessType === 'Complimentary' || Boolean(customer.giftedDetails);
  const rawPlanStr = String(customer.giftedDetails?.plan || primaryLicense?.plan || customer.plan || customer.subscription?.planId || '').toLowerCase();
  const isStarter = rawPlanStr.includes('starter') || (!rawPlanStr.includes('business') && Boolean(customer.giftedDetails?.plan?.toLowerCase().includes('starter')));
  const isBusiness = rawPlanStr.includes('business') && !isStarter;
  const effectivePlan = isStarter ? 'Starter' : isBusiness ? 'Business' : (customer.plan || 'Starter');
  const planName = isPaidActive
    ? (customer.subscription.planName || `${effectivePlan} Plan`)
    : isTrialActive
      ? 'Free Trial'
      : isTrialNotStarted
        ? '7-Day Free Trial'
        : `${effectivePlan} Plan`;

  const targetCountry = customer.country || (customer.currency === 'USD' ? 'US' : 'NG');
  const authoritativePrice = getAuthoritativePlanPrice(targetCountry, isBusiness ? 'Business' : 'Starter');
  const starterCardPrice = getAuthoritativePlanPrice(targetCountry, 'Starter').split(' /')[0];
  const businessCardPrice = getAuthoritativePlanPrice(targetCountry, 'Business').split(' /')[0];
  const freeTrialZeroPrice = (customer.currency === 'USD' || !isNigerianCountry(targetCountry)) ? '$0 (7-Day Trial)' : '₦0 (7-Day Trial)';

  const rawPrice = isGifted ? 'Complimentary' : (customer.subscription.price || customer.planPrice || authoritativePrice);
  const price = (rawPrice.includes('15,000') || rawPrice.includes('5,000') || rawPrice.includes('20,000') || rawPrice.includes('30,000'))
    ? authoritativePrice
    : rawPrice;

  const handleSelectPlan = (plan: 'Starter' | 'Business') => {
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
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: "var(--site-ink)", margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Plan &amp; Subscription
        </h2>
        <p style={{ fontSize: '13.5px', color: "var(--site-muted)", margin: 0 }}>
          Manage your active ZAMERIA subscription, features, and billing cycles.
        </p>
      </div>

      {/* Hero Plan Card */}
      <div
        style={{
          backgroundColor: "var(--site-white)",
          borderRadius: "var(--site-radius)",
          border: isTrialNotStarted
            ? "1px solid var(--site-line)"
            : isTrialActive
            ? '1px solid #bfdbfe'
            : isTrialExpired
            ? '1px solid #fecaca'
            : isCancelled
            ? '1px solid #fed7aa'
            : isExpired
            ? '1px solid #fecaca'
            : "1px solid var(--site-line)",
          background: isTrialNotStarted
            ? "var(--site-white)"
            : isTrialActive
            ? "var(--site-blue-soft)"
            : isCancelled
            ? "var(--site-blue)"
            : isTrialExpired
            ? "var(--site-blue)"
            : "var(--site-white)",
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
                    ? "var(--site-muted)"
                    : isTrialExpired || isExpired
                    ? '#b91c1c'
                    : isCancelled
                    ? '#b45309'
                    : isTrialActive
                    ? "var(--site-blue)"
                    : '#16a34a',
                  backgroundColor: isTrialNotStarted
                    ? "var(--site-surface)"
                    : isTrialExpired || isExpired
                    ? '#fef2f2'
                    : isCancelled
                    ? '#fffbeb'
                    : isTrialActive
                    ? "var(--site-blue-soft)"
                    : '#f0fdf4',
                  border: isTrialNotStarted
                    ? "1px solid var(--site-line-strong)"
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
                    <span>{isGifted ? 'Gifted / Complimentary Plan (Active)' : 'Active Paid Subscription'}</span>
                  </>
                )}
              </span>
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 900, color: "var(--site-ink)", margin: '0 0 6px' }}>
              {isTrialNotStarted
                ? '7-Day Free Trial'
                : isTrialActive
                ? 'Free Trial'
                : isTrialExpired
                ? 'Free Trial Expired'
                : planName}
            </h3>

            <div style={{ fontSize: '18px', fontWeight: 800, color: isTrialNotStarted ? "var(--site-muted)" : "var(--site-blue)", display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              {isTrialNotStarted ? (
                <span>Activate ZAMERIA to start your trial</span>
              ) : isTrialActive ? (
                <span>{freeTrialZeroPrice}</span>
              ) : isTrialExpired ? (
                <span style={{ color: '#dc2626' }}>Trial Ended</span>
              ) : isGifted ? (
                <>
                  <span>Complimentary</span>
                  <span style={{ fontSize: '13px', color: "var(--site-muted)", fontWeight: 500 }}>
                    • 12 months full access
                  </span>
                </>
              ) : (
                <>
                  <span>{price}</span>
                  <span style={{ fontSize: '13px', color: "var(--site-muted)", fontWeight: 500 }}>
                    • billed annually
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
                    backgroundColor: "var(--site-primary)",
                    color: "var(--site-white)",
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: "var(--site-radius)",
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
                    backgroundColor: "var(--site-white)",
                    color: "var(--site-ink)",
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: "var(--site-radius)",
                    border: "1px solid var(--site-line-strong)",
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
                  backgroundColor: "var(--site-primary)",
                  color: "var(--site-white)",
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: "var(--site-radius)",
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
                  backgroundColor: "var(--site-primary)",
                  color: "var(--site-white)",
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: "var(--site-radius)",
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
                  backgroundColor: "var(--site-primary)",
                  color: "var(--site-white)",
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: "var(--site-radius)",
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
                  backgroundColor: "var(--site-primary)",
                  color: "var(--site-white)",
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: "var(--site-radius)",
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
                    backgroundColor: "var(--site-primary)",
                    color: "var(--site-white)",
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: "var(--site-radius)",
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
                    borderRadius: "var(--site-radius)",
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '16px',
            backgroundColor: "var(--site-paper)",
            borderRadius: "var(--site-radius)",
            border: "1px solid var(--site-line)",
            padding: '18px',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: "var(--site-muted)", textTransform: 'uppercase', marginBottom: '4px' }}>
              {isTrialNotStarted ? 'Trial Status' : isTrialActive ? 'Trial Expiration' : isTrialExpired ? 'Trial Status' : 'Next Billing Date'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: "var(--site-ink)", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--site-blue)" />
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
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: "var(--site-muted)", textTransform: 'uppercase', marginBottom: '4px' }}>
              License Status
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: isPaidActive ? '#16a34a' : "var(--site-muted)", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={15} color={isPaidActive ? '#16a34a' : '#94a3b8'} />
              <span>{isPaidActive ? 'Active ZMR License' : 'No license assigned'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: "var(--site-muted)", textTransform: 'uppercase', marginBottom: '4px' }}>
              Staff &amp; Cashiers
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: "var(--site-ink)", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="#d97706" />
              <span>{customer.staffAllowance || 5} Staff PINs Allowed</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: "var(--site-muted)", textTransform: 'uppercase', marginBottom: '4px' }}>
              Registers
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: "var(--site-ink)", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Monitor size={15} color="#0284c7" />
              <span>{isBusiness ? 'Unlimited Registers' : '2 Registers'}</span>
            </div>
          </div>
        </div>

        {/* Informative Notice for Trial States */}
        {isTrialNotStarted ? (
          <div
            style={{
              backgroundColor: "var(--site-paper)",
              border: "1px solid var(--site-line-strong)",
              borderRadius: "var(--site-radius)",
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13px',
              color: "var(--site-ink)",
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px', color: "var(--site-ink)" }} />
            <div>
              <strong>Trial Note:</strong> Creating a ZAMERIA account does not start the 7-day trial. Your trial only begins when you enter your Trial Activation Code into the ZAMERIA WooCommerce plugin on WordPress.
            </div>
          </div>
        ) : isTrialActive ? (
          <div
            style={{
              backgroundColor: "var(--site-blue-soft)",
              border: '1px solid #bfdbfe',
              borderRadius: "var(--site-radius)",
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13px',
              color: '#1e40af',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px', color: "var(--site-blue)" }} />
            <div>
              <strong>Trial Notice:</strong> You are currently using ZAMERIA on a 7-day free trial. Your account does not have a license assigned yet. When you are ready, subscribe to a paid plan below to generate your official software license key.
            </div>
          </div>
        ) : isTrialExpired ? (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: "var(--site-radius)",
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
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: "var(--site-ink)", margin: '0 0 16px' }}>
          {(isTrialActive || isTrialNotStarted || isTrialExpired) ? 'Available Subscription Plans' : 'Compare Plans'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {/* Starter Plan Card */}
          <div
            style={{
              backgroundColor: "var(--site-white)",
              borderRadius: "var(--site-radius)",
              border: planName === 'Starter' ? "2px solid var(--site-blue)" : "1px solid var(--site-line)",
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: "var(--site-ink)" }}>Starter</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '9999px' }}>
                  7-Day Free Trial
                </span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: "var(--site-ink)", marginBottom: '12px' }}>
                {starterCardPrice}
                <span style={{ fontSize: '13px', color: "var(--site-muted)", fontWeight: 500 }}> / year</span>
              </div>
              <p style={{ fontSize: '13px', color: "var(--site-muted)", margin: '0 0 16px', lineHeight: 1.5 }}>
                Essential Point of Sale and inventory synchronization for growing retail stores.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: "var(--site-ink)", display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ 1 WooCommerce store</li>
                <li>✓ 1 physical store/location</li>
                <li>✓ Up to 500 products</li>
                <li>✓ Up to 2 staff members</li>
                <li>✓ Up to 2 POS registers</li>
                <li>✓ Point of Sale and inventory synchronization</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: isPaidActive && planName === 'Starter' ? "var(--site-surface)" : "var(--site-primary)",
                color: isPaidActive && planName === 'Starter' ? "var(--site-muted)" : "var(--site-white)",
                border: 'none',
                borderRadius: "var(--site-radius)",
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isPaidActive && planName === 'Starter' ? 'default' : 'pointer',
              }}
              disabled={isPaidActive && planName === 'Starter'}
            >
              {isPaidActive && planName === 'Starter' ? 'Current Active Plan' : 'Subscribe to Starter'}
            </button>
          </div>

          {/* Business Plan Card */}
          <div
            style={{
            backgroundColor: "var(--site-white)",
            borderRadius: "var(--site-radius)",
            border: planName === 'Business' ? "2px solid var(--site-blue)" : "1px solid var(--site-line)",
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: "var(--site-ink)" }}>Business</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: "var(--site-blue)", backgroundColor: "var(--site-blue-soft)", padding: '2px 8px', borderRadius: '9999px' }}>
                Most Popular
              </span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: "var(--site-ink)", marginBottom: '12px' }}>
              {businessCardPrice}
              <span style={{ fontSize: '13px', color: "var(--site-muted)", fontWeight: 500 }}> / year</span>
            </div>
            <p style={{ fontSize: '13px', color: "var(--site-muted)", margin: '0 0 16px', lineHeight: 1.5 }}>
              Complete retail solution with unlimited products, staff, and real-time inventory synchronization.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: "var(--site-ink)", display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>✓ 1 WooCommerce store</li>
              <li>✓ 1 physical store/location</li>
              <li>✓ Unlimited products</li>
              <li>✓ Unlimited staff members</li>
              <li>✓ Unlimited POS registers</li>
              <li>✓ Point of Sale and real-time inventory synchronization</li>
            </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: isPaidActive && planName === 'Business' ? "var(--site-surface)" : "var(--site-primary)",
                color: isPaidActive && planName === 'Business' ? "var(--site-muted)" : "var(--site-white)",
                border: 'none',
                borderRadius: "var(--site-radius)",
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isPaidActive && planName === 'Business' ? 'default' : 'pointer',
              }}
              disabled={isPaidActive && planName === 'Business'}
            >
              {isPaidActive && planName === 'Business' ? 'Current Active Plan' : 'Subscribe to Business'}
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
              backgroundColor: "var(--site-white)",
              borderRadius: "var(--site-radius)",
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: "var(--site-ink)", margin: '0 0 8px' }}>
              Cancel Subscription?
            </h4>
            <p style={{ fontSize: '13.5px', color: "var(--site-muted)", lineHeight: 1.5, margin: '0 0 20px' }}>
              If you cancel, you will still retain full access to ZAMERIA and your active license until the end of your billing cycle on <strong>{renewsAt}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: "var(--site-surface)",
                  border: "1px solid var(--site-line-strong)",
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
                  color: "var(--site-white)",
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
