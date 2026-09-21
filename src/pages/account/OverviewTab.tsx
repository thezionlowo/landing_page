import React, { useState } from 'react';
import { useTrialCode } from '../../lib/useTrialCode';
import { TrialCodePanel } from '../../components/account/TrialCodePanel';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { AddLicenseModal } from './AddLicenseModal';
import {
  Layers,
  Key,
  Globe,
  CreditCard,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Zap,
  Check,
  Copy,
  Download,
  Store,
  RefreshCw,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { customer, cancelSubscription, resumeSubscription, activateTrial } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const isDevBuild = (import.meta as any).env?.DEV === true;
  const [simError, setSimError] = useState<string | null>(null);

  if (!customer) return null;

  const isTrialNotStarted =
    customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started';
  const isTrialActive =
    customer.accountStatus === 'trial_active' && customer.trial?.status === 'active';
  const isTrialExpired =
    customer.accountStatus === 'trial_expired' || customer.trial?.status === 'expired';
  const isCancelled =
    customer.accountStatus === 'cancelled' || customer.subscription.status === 'cancelled';
  const isPastDue =
    customer.accountStatus === 'payment_failed' || customer.subscription.status === 'past_due';
  const isExpired =
    customer.accountStatus === 'expired' || customer.subscription.status === 'expired';
  const isPaidActive =
    customer.subscription.status === 'active' && !isCancelled && !isExpired;

  const licenses = customer.licenses || [];
  const primaryLicense = licenses[0] || null;

  // Issued by the licensing service for this store; a browser-invented code
  // cannot be redeemed by the plugin.
  const trial = useTrialCode({
    email: customer.email,
    businessName: customer.businessName,
    storeUrl: customer.connectedStore?.url || '',
  });
  const activationCode = trial.code;
  const store = customer.connectedStore || {
    name: 'No store connected',
    url: '',
    status: isPaidActive || isTrialActive ? 'connected' : 'not_connected',
  };

  const daysLeft = customer.trial?.daysRemaining ?? customer.trialDaysRemaining ?? 7;
  const trialEnd = customer.trial?.endDate ?? customer.trialEndsAt ?? 'September 19, 2026';
  const renewsAt = customer.subscription.renewsAt || customer.nextBillingDate || 'October 12, 2026';
  const planName = customer.subscription.planName || 'Business Plan';
  const price = customer.subscription.price || customer.planPrice || '₦300,000 / year';

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2200);
  };


  const handleSimulateActivation = async () => {
    setIsSimulating(true);
    setSimError(null);
    const res = await activateTrial(activationCode, {
      name: `${customer.businessName || 'My Store'} (WooCommerce)`,
      url: 'https://mystore.ng',
    });
    setIsSimulating(false);
    if (!res.success) {
      setSimError(res.error || 'Failed to activate trial.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. STATE BANNERS (TRIAL EXPIRED / PAST DUE / CANCELLED / TRIAL JUST STARTED) */}
      {isTrialExpired && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle size={22} style={{ color: '#b91c1c', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#991b1b', margin: '0 0 4px' }}>
                Your 7-day trial has ended.
              </h3>
              <p style={{ fontSize: '13.5px', color: '#7f1d1d', margin: 0, lineHeight: 1.5 }}>
                Your 7-day free trial has expired. Upgrade your plan now to restore full WooCommerce Point of Sale functionality.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#b91c1c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Upgrade Now
            </button>
            <button
              type="button"
              onClick={() => setAccountTab('plan')}
              style={{
                backgroundColor: '#ffffff',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Pricing
            </button>
          </div>
        </div>
      )}

      {isPastDue && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '16px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} style={{ color: '#b45309', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#92400e' }}>
                Payment Failed / Past Due
              </div>
              <div style={{ fontSize: '13px', color: '#78350f' }}>
                License is temporarily active under grace period. Please update your payment method to avoid suspension.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAccountTab('payment-methods')}
            style={{
              backgroundColor: '#b45309',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Update Payment Method
          </button>
        </div>
      )}

      {isCancelled && !isExpired && (
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} style={{ color: '#64748b', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>
                Subscription Cancelled
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Your subscription has been cancelled. You can continue using ZAMERIA until {renewsAt}.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={resumeSubscription}
            style={{
              backgroundColor: '#071A31',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Resume Subscription
          </button>
        </div>
      )}

      {/* 2. MAIN HEADER CARD (Changes based on State A, B, C, D) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '32px 28px',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {isTrialNotStarted ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#d97706',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Clock size={12} />
                <span>Trial Not Started</span>
              </span>
            ) : isTrialActive ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Clock size={12} />
                <span>Trial · {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>
              </span>
            ) : isCancelled ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#b45309',
                  backgroundColor: '#fffbeb',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Cancelled • Active until {renewsAt}
              </span>
            ) : isExpired ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#b91c1c',
                  backgroundColor: '#fef2f2',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Subscription Expired
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#16a34a',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <CheckCircle2 size={12} />
                <span>{planName} · Active</span>
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>• Account ID: {customer.id}</span>
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#071A31',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}
          >
            Your ZAMERIA Account
          </h1>

          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            {isTrialNotStarted ? (
              <span>
                Your 7-day trial starts when you connect your WooCommerce store.
              </span>
            ) : isTrialActive ? (
              <span>
                Trial · {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left (Ends <strong>{trialEnd}</strong>).
              </span>
            ) : isPaidActive ? (
              <span>
                {planName} · Active for <strong>{customer.businessName}</strong>. License expires: <strong>{primaryLicense?.expiresAt || renewsAt}</strong>.
              </span>
            ) : (
              <span>
                Account for <strong>{customer.businessName}</strong>. Access is currently inactive.
              </span>
            )}
          </p>
        </div>

        {/* Action Button: Prioritizes the single most important action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isTrialNotStarted ? (
            <button
              type="button"
              onClick={() => setAccountTab('store')}
              style={{
                padding: '12px 26px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(7, 26, 49, 0.18)',
                transition: 'all 0.15s ease',
              }}
            >
              <Zap size={16} style={{ color: '#fbbf24' }} />
              <span>Activate Your Trial</span>
            </button>
          ) : isTrialActive ? (
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(7, 26, 49, 0.18)',
                }}
              >
                <Sparkles size={16} style={{ color: '#fbbf24' }} />
                <span>Choose a Plan</span>
              </button>
              <a
                href="http://localhost:5176"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 18px',
                  backgroundColor: '#f1f5f9',
                  color: '#071A31',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Open POS</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="http://localhost:5182"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 18px',
                  backgroundColor: '#ffffff',
                  color: '#071A31',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Plugin Dashboard</span>
                <ExternalLink size={14} />
              </a>
            </>
          ) : isExpired || isTrialExpired ? (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: '12px 26px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} style={{ color: '#fbbf24' }} />
              <span>Choose a Plan</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAccountTab('plan')}
                style={{
                  padding: '11px 20px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Manage Plan</span>
              </button>
              <a
                href="http://localhost:5176"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 18px',
                  backgroundColor: '#f1f5f9',
                  color: '#071A31',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Open POS</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="http://localhost:5182"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 18px',
                  backgroundColor: '#ffffff',
                  color: '#071A31',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Plugin Dashboard</span>
                <ExternalLink size={14} />
              </a>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STATE A — PROMINENT ONBOARDING & ACTIVATION SECTION (TRIAL NOT STARTED) */}
      {/* ========================================================================= */}
      {isTrialNotStarted && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #bfdbfe',
            padding: '32px 28px',
            boxShadow: '0 8px 30px -4px rgba(37, 99, 235, 0.08)',
          }}
        >
          <div style={{ maxWidth: '780px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              <Zap size={13} />
              <span>Step-by-Step Onboarding</span>
            </div>

            <h2
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#071A31',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              Your 7-day trial is ready to start
            </h2>

            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.55, margin: '0 0 28px' }}>
              Your trial begins when you activate ZAMERIA on your WooCommerce store. Follow these three quick steps:
            </p>

            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  Install the ZAMERIA WooCommerce Plugin
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Download the plugin zip file and upload it in your WordPress admin under <strong>Plugins → Add New → Upload Plugin</strong>.
                </p>
                <a
                  href="/downloads/zameria-pos-sync.zip"
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#071A31',
                    textDecoration: 'none',
                  }}
                >
                  <Download size={14} />
                  <span>Download Plugin (v0.3.0)</span>
                </a>
              </div>
            </div>

            {/* Step 2: TRIAL ACTIVATION CODE */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  Copy your Trial Activation Code
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Use this code in the ZAMERIA plugin inside your WooCommerce dashboard to activate your trial:
                </p>

                <TrialCodePanel trial={trial} />
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Use this code to activate your 7-day trial. It is not a paid license key.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '26px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  Enter the code in your WooCommerce dashboard
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Open <strong>WordPress → ZAMERIA → Activation</strong>, paste your code, and click <strong>Activate Trial</strong>.
                </p>
              </div>
            </div>

            {/* Highly Visible Important Note */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <ShieldCheck size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
              <div style={{ fontSize: '13.5px', color: '#1e40af', lineHeight: 1.45 }}>
                <strong>Important:</strong> Your 7-day trial does not start until activation is completed.
              </div>
            </div>

            {/* Store activation simulator — development builds only */}
            {isDevBuild && (
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31' }}>
                  Testing without WordPress?
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Simulate instant store activation to evaluate the 7-day active trial dashboard.
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateActivation}
                disabled={isSimulating}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: isSimulating ? 'not-allowed' : 'pointer',
                }}
              >
                <Sparkles size={14} />
                <span>{isSimulating ? 'Verifying...' : 'Simulate Store Activation'}</span>
              </button>
            </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DYNAMIC STATUS CARDS (Trial Not Started vs. Trial Active vs. Paid)     */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {isTrialNotStarted ? (
          /* STATE A CARDS */
          <>
            {/* Card 1: Trial Status */}
            <div
              onClick={() => setAccountTab('store')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #fde68a',
                background: 'linear-gradient(135deg, #fffdf5 0%, #ffffff 60%)',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(217, 119, 6, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d97706')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#fde68a')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Trial Status
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={18} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#071A31', lineHeight: 1.1 }}>
                Not Started
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                7 days ready upon store activation
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#d97706' }}>
                <span>Activate Your Trial</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: Connected Store */}
            <div
              onClick={() => setAccountTab('store')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Connected Store</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Store size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                No store connected
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                Connect WooCommerce to start using ZAMERIA
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                Connect your store &rarr;
              </div>
            </div>

            {/* Card 3: License */}
            <div
              onClick={() => setAccountTab('licenses')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>License</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f1f5f9',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Key size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#64748b', lineHeight: 1.1 }}>
                No License Yet
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                Your license will be generated when you subscribe to a paid plan.
              </div>
            </div>

            {/* Card 4: Plan */}
            <div
              onClick={() => setAccountTab('plan')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Plan</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                Trial Eligible
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                7-day free trial ready to activate
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                View Plans &rarr;
              </div>
            </div>
          </>
        ) : isTrialActive ? (
          /* STATE B CARDS (TRIAL ACTIVE) */
          <>
            {/* Card 1: Free Trial Countdown */}
            <div
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #bfdbfe',
                background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 60%)',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(37, 99, 235, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#bfdbfe')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  7-Day Free Trial
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={18} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#071A31', lineHeight: 1.1 }}>
                {daysLeft} days remaining
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                Trial ends {trialEnd}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
                <span>Choose a Plan</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: Connected Store */}
            <div
              onClick={() => setAccountTab('store')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Connected Store</span>
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
                  <Store size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                {store.name}
              </div>
              <div style={{ fontSize: '12.5px', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>
                ● Connected · 2-way sync active
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                Manage Store &rarr;
              </div>
            </div>

            {/* Card 3: License */}
            <div
              onClick={() => setAccountTab('licenses')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>License</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f1f5f9',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Key size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#64748b', lineHeight: 1.1 }}>
                No License Yet
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                Your license will be generated when you subscribe to a paid plan.
              </div>
            </div>

            {/* Card 4: Plan */}
            <div
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Subscription</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                Free Trial
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                ₦0 / trial period
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                Upgrade to Business &rarr;
              </div>
            </div>
          </>
        ) : (
          /* STATE D CARDS (PAID CUSTOMER) */
          <>
            {/* Card 1: Active Plan */}
            <div
              onClick={() => setAccountTab('plan')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Plan</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={18} />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                {planName}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                {price}
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                Manage Plan &rarr;
              </div>
            </div>

            {/* Card 2: ZAMERIA License */}
            <div
              onClick={() => setAccountTab('licenses')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>ZAMERIA License</span>
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
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#071A31',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                {primaryLicense ? primaryLicense.licenseKey : 'ZMR-XXXX-XXXX-XXXX'}
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', fontWeight: 700 }}>
                ● License Active
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                View License Details &rarr;
              </div>
            </div>

            {/* Card 3: Connected Store */}
            <div
              onClick={() => setAccountTab('store')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Connected Store</span>
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
                  <Store size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                {store.name}
              </div>
              <div style={{ fontSize: '12.5px', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>
                ● Connected &amp; Synced
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                Store Settings &rarr;
              </div>
            </div>

            {/* Card 4: Renewal Date */}
            <div
              onClick={() => setAccountTab('billing')}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Next Billing</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CreditCard size={18} />
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.1 }}>
                {renewsAt}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                Auto-renews with default card
              </div>
              <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
                Billing History &rarr;
              </div>
            </div>
          </>
        )}
      </div>

      {/* 5. ADD / UPGRADE PLAN MODAL */}
      <AddLicenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialPlan="Business"
      />
    </div>
  );
};

export default OverviewTab;
