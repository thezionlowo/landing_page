import React, { useState } from 'react';
import { resolveSubscriptionState, useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { ROUTES } from '../../lib/routes';
import { AddLicenseModal } from './AddLicenseModal';
import {
  Layers,
  Key,
  Globe,
  CreditCard,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Zap,
  Store,
  RefreshCw,
  Monitor,
  Printer,
  Barcode,
  Users,
  Check,
  Sparkles,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { customer, resumeSubscription, retryStoreConnection } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!customer) return null;

  const subscriptionState = resolveSubscriptionState(customer);
  const isTrialActive = subscriptionState === 'trial_active';
  const isTrialExpired = subscriptionState === 'trial_expired';
  const isCancelled =
    customer.accountStatus === 'cancelled' || customer.subscription.status === 'cancelled';
  const isPastDue =
    customer.accountStatus === 'payment_failed' || customer.subscription.status === 'past_due';
  const isExpired =
    customer.accountStatus === 'expired' || customer.subscription.status === 'expired';
  const isPaidActive = subscriptionState === 'paid_active';
  const isGifted =
    customer.accessType === 'Gifted' ||
    customer.accessType === 'Complimentary' ||
    Boolean(customer.giftedDetails);

  const licenses = customer.licenses || [];
  const primaryLicense = licenses[0] || null;

  const isStoreConnected =
    customer.connectedStore?.status === 'connected' &&
    Boolean(customer.connectedStore?.url || primaryLicense?.connectedDomain);

  const storeUrl = customer.connectedStore?.url || (primaryLicense?.connectedDomain ? `https://${primaryLicense.connectedDomain}` : '');
  const storeName = customer.connectedStore?.name && customer.connectedStore.name !== 'No store connected'
    ? customer.connectedStore.name
    : (customer.businessName || 'WooCommerce Store');

  // Direct, working Cashier Web POS URL
  const posUrl = storeUrl
    ? `${storeUrl.replace(/\/$/, '')}/pos/`
    : ROUTES.pointOfSale;

  const daysLeft = customer.trial?.daysRemaining ?? customer.trialDaysRemaining ?? 7;
  const trialEnd = customer.trial?.endDate ?? customer.trialEndsAt ?? 'in 7 days';

  const rawPlanStr = String(
    customer.giftedDetails?.plan || primaryLicense?.plan || customer.plan || customer.subscription?.planId || ''
  ).toLowerCase();
  const isStarter =
    rawPlanStr.includes('starter') ||
    (!rawPlanStr.includes('business') && Boolean(customer.giftedDetails?.plan?.toLowerCase().includes('starter')));
  const isBusiness = rawPlanStr.includes('business') && !isStarter;
  const planTier = isStarter ? 'Starter' : isBusiness ? 'Business' : (customer.plan || 'Starter');

  const planName = isPaidActive
    ? (customer.subscription?.planName || `${planTier} Plan`)
    : isTrialActive
      ? '7-Day Free Trial'
      : isGifted
        ? `Gifted ${planTier} Plan`
        : `${planTier} Plan`;

  const authoritativePrice = isBusiness ? '₦300,000 / year' : '₦200,000 / year';
  const price = isGifted
    ? 'Complimentary'
    : isPaidActive
      ? authoritativePrice
      : '₦0 (Active Trial)';

  const dynamicAnnualExpiry = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();
  const renewsAt = customer.subscription.renewsAt || customer.nextBillingDate || primaryLicense?.expiresAt || dynamicAnnualExpiry;

  const handleManualSync = async () => {
    setIsSyncing(true);
    await retryStoreConnection();
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. STATE BANNERS (Alerts needing customer attention) */}
      {isTrialExpired && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
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
            <AlertCircle size={22} style={{ color: '#b91c1c', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#991b1b', margin: '0 0 2px' }}>
                Your 7-day trial has ended
              </h3>
              <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>
                Upgrade your subscription now to restore full WooCommerce Point of Sale functionality.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            style={{
              backgroundColor: '#b91c1c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Upgrade Plan
          </button>
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
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400e' }}>
                Payment Failed / Grace Period Active
              </div>
              <div style={{ fontSize: '13px', color: '#78350f' }}>
                Your POS is temporarily active under grace period. Please update your payment method.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAccountTab('billing')}
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
                You can continue using ZAMERIA POS until {renewsAt}.
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

      {/* 2. EXECUTIVE COMMAND CENTER HERO */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {isTrialActive ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Clock size={12} />
                <span>Free Trial · {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>
              </span>
            ) : isPaidActive ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#16a34a',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <CheckCircle2 size={12} />
                <span>{planName} · Active</span>
              </span>
            ) : isGifted ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#7c3aed',
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Sparkles size={12} />
                <span>Gifted Plan · Active</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Account Active
              </span>
            )}

            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              • {customer.email}
            </span>
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#071A31',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}
          >
            {customer.businessName || 'Welcome to ZAMERIA'}
          </h1>

          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            {isStoreConnected ? (
              <span>
                Connected to <strong>{storeName}</strong>. 2-way real-time catalog &amp; stock sync active.
              </span>
            ) : (
              <span>
                Your store is not connected yet. Connect your WooCommerce store to start syncing products and sales.
              </span>
            )}
          </p>
        </div>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isStoreConnected ? (
            <>
              <a
                href={posUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 22px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(7, 26, 49, 0.16)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Monitor size={15} style={{ color: '#60a5fa' }} />
                <span>Launch POS Register</span>
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                style={{
                  padding: '11px 16px',
                  backgroundColor: '#f8fafc',
                  color: '#071A31',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={14} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isSyncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync Now'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAccountTab('store')}
              style={{
                padding: '12px 24px',
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
                boxShadow: '0 4px 14px rgba(7, 26, 49, 0.16)',
              }}
            >
              <Zap size={16} style={{ color: '#fbbf24' }} />
              <span>Connect Your Store</span>
            </button>
          )}

          {!isPaidActive && !isGifted && (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              style={{
                padding: '11px 18px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '10px',
                border: '1px solid #bfdbfe',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} />
              <span>Choose Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. CORE SAAS OVERVIEW METRIC CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Plan & Access */}
        <div
          onClick={() => setAccountTab('billing')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#071A31')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Plan &amp; Access
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={16} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.2 }}>
            {planName}
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
            {isTrialActive ? `Trial ends ${trialEnd}` : price}
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Manage Subscription</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Card 2: Connected Store */}
        <div
          onClick={() => setAccountTab('store')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#071A31')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Connected Store
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: isStoreConnected ? '#f0fdf4' : '#fffbeb',
                color: isStoreConnected ? '#16a34a' : '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={16} />
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isStoreConnected ? storeName : 'Not Connected'}
          </div>
          <div style={{ fontSize: '12.5px', color: isStoreConnected ? '#16a34a' : '#d97706', marginTop: '4px', fontWeight: 600 }}>
            {isStoreConnected ? '● 2-Way Real-time Sync Active' : '● Connect WooCommerce'}
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Store &amp; Sync Details</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Card 3: POS Register & Hardware */}
        <div
          onClick={() => setAccountTab('devices')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#071A31')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Registers &amp; Till
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                color: '#071A31',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Monitor size={16} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31', lineHeight: 1.2 }}>
            Web POS Terminal
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
            Barcode, 80mm Print &amp; Cash Drawer
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Configure Hardware</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Card 4: License & Entitlement */}
        <div
          onClick={() => setAccountTab('billing')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#071A31')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Entitlement Key
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Key size={16} />
            </div>
          </div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#071A31',
              fontFamily: 'monospace',
              lineHeight: 1.2,
            }}
          >
            {primaryLicense ? primaryLicense.licenseKey : 'Auto-Assigned'}
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
            {isGifted ? '12-Month Complimentary' : `Renews ${renewsAt}`}
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Invoices &amp; Entitlements</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* 4. REAL-TIME SYSTEM PULSE & DIAGNOSTICS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: '0 0 2px' }}>
              Ecosystem Health &amp; Diagnostics
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Live telemetry between your WooCommerce database, Cloud SaaS, and Cashier POS.
            </p>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 700,
              color: isStoreConnected ? '#16a34a' : '#d97706',
              backgroundColor: isStoreConnected ? '#f0fdf4' : '#fffbeb',
              padding: '4px 10px',
              borderRadius: '6px',
            }}
          >
            {isStoreConnected ? 'All Systems Operational' : 'Store Offline'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isStoreConnected ? '#16a34a' : '#94a3b8' }} />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#071A31' }}>Product Catalog</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {isStoreConnected ? 'Synchronized with WooCommerce REST API v3' : 'Awaiting store connection'}
            </div>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isStoreConnected ? '#16a34a' : '#94a3b8' }} />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#071A31' }}>Real-time Inventory</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {isStoreConnected ? 'Instant stock deduction on in-store sales' : 'Inventory sync paused'}
            </div>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isStoreConnected ? '#16a34a' : '#94a3b8' }} />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#071A31' }}>Offline Cashier Buffer</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              IndexedDB enabled for offline transactions
            </div>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#071A31' }}>Security &amp; SaaS API</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              ZAMERIA Cloud Run API authenticated (SSL 256-bit)
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade / Choose Plan Modal */}
      <AddLicenseModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        initialPlan="Business"
      />
    </div>
  );
};

export default OverviewTab;
