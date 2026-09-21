import React, { useState } from 'react';
import { useTrialCode } from '../../lib/useTrialCode';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  RefreshCw,
  ExternalLink,
  Store,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ConnectedStoreTab: React.FC = () => {
  const { customer, activateTrial, retryStoreConnection, disconnectStore } = useCustomerAuth();
  const { setAccountTab } = useRouter();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const isDevBuild = (import.meta as any).env?.DEV === true;
  const [simError, setSimError] = useState<string | null>(null);
  const [simStoreName, setSimStoreName] = useState('Lagos Beauty & Skincare Store');
  const [simStoreUrl, setSimStoreUrl] = useState('https://lagosbeautystore.ng');

  if (!customer) return null;

  const isTrialNotStarted =
    customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started';
  const isTrialActive =
    customer.accountStatus === 'trial_active' && customer.trial?.status === 'active';
  const isTrialExpired =
    customer.accountStatus === 'trial_expired' || customer.trial?.status === 'expired';
  const isPaid = customer.subscription?.status === 'active';

  const store = customer.connectedStore || {
    name: 'No store connected',
    url: '',
    status: isPaid || isTrialActive ? 'connected' : 'not_connected',
  };

  // The activation code is issued by the licensing service for this store, not
  // made up here: only a code the service knows can be redeemed by the plugin.
  const trial = useTrialCode({
    email: customer.email,
    businessName: customer.businessName,
    storeUrl: customer.connectedStore?.url || '',
  });
  const activationCode = trial.code;

  const isConnected = store.status === 'connected';
  const isPending = store.status === 'pending';
  const isError = store.status === 'error';

  const handleCopyCode = () => {
    if (!activationCode) return;
    navigator.clipboard.writeText(activationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleSimulateActivation = async () => {
    setIsSimulating(true);
    setSimError(null);
    const res = await activateTrial(activationCode, {
      name: simStoreName.trim() || 'My WooCommerce Store',
      url: simStoreUrl.trim() || 'https://mystore.ng',
    });
    setIsSimulating(false);
    if (!res.success) {
      setSimError(res.error || 'Failed to activate trial.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. SECTION HEADER */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: isConnected ? '#16a34a' : '#d97706',
                backgroundColor: isConnected ? '#f0fdf4' : '#fffbeb',
                border: isConnected ? '1px solid #bbf7d0' : '1px solid #fde68a',
                padding: '3px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {isConnected ? <CheckCircle2 size={12} /> : <Store size={12} />}
              <span>{isConnected ? 'Store Connected' : isPending ? 'Connecting...' : 'Not Connected'}</span>
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>• WooCommerce 2-Way Sync</span>
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
            Connected Store
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Connect your WooCommerce website to synchronize products, stock, and orders in real-time.
          </p>
        </div>

        {isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={retryStoreConnection}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: '#f1f5f9',
                color: '#071A31',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Sync Now</span>
            </button>
            <a
              href={store.url || 'https://mystore.ng'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Visit Store</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {/* 2. CONNECTION ERROR BANNER (Requirement 12) */}
      {isError && (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#991b1b', margin: '0 0 2px' }}>
                We couldn't connect your store
              </h4>
              <p style={{ fontSize: '13px', color: '#b91c1c', margin: 0 }}>
                {store.connectionError || "We couldn't connect your store. Please check the activation code and try again."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={retryStoreConnection}
            style={{
              padding: '9px 18px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* 3. TRIAL ACTIVATION SUCCESS BANNER (Requirement 13) */}
      {isConnected && isTrialActive && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '18px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                You're ready to go!
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                Your 7-day ZAMERIA trial has started.
              </h3>
              <p style={{ fontSize: '13.5px', color: '#166534', margin: 0, lineHeight: 1.4 }}>
                Trial ends <strong>{customer.trial?.endDate || 'September 19, 2026'}</strong>. Your WooCommerce store is now connected.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="http://localhost:5176"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(7, 26, 49, 0.15)',
              }}
            >
              <span>Open ZAMERIA POS</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="http://localhost:5182"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                backgroundColor: '#ffffff',
                color: '#071A31',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #cbd5e1',
              }}
            >
              <span>Plugin Dashboard</span>
              <ExternalLink size={14} />
            </a>
            <button
              type="button"
              onClick={() => setAccountTab('overview')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#ffffff',
                color: '#071A31',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View Account
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN STORE CARD (Connected vs Not Connected) */}
      {isConnected ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Store size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  {store.name || customer.businessName}
                </h3>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13.5px',
                    color: '#2563eb',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{store.url || 'https://mystore.ng'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#16a34a',
                  backgroundColor: '#f0fdf4',
                  padding: '5px 12px',
                  borderRadius: '8px',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <span>Connected & Synced</span>
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Account Status</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31' }}>
                {isPaid ? 'Active Business Plan' : isTrialActive ? '7-Day Free Trial (Active)' : 'Trial Expired'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Entitlement Period</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31' }}>
                {isPaid
                  ? `Renews ${customer.subscription.renewsAt || 'Next Month'}`
                  : `Ends ${customer.trial?.endDate || 'September 19, 2026'}`}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Last Data Sync</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31' }}>
                {store.lastSyncAt || 'Just now'} (0.4s response)
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Connection Type</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31' }}>
                WordPress REST API v3
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* NOT CONNECTED: ONBOARDING & ACTIVATION CODE CARD */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '32px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
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
                marginBottom: '14px',
              }}
            >
              <Zap size={13} />
              <span>Step-by-Step Store Activation</span>
            </div>

            <h2
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#071A31',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              Connect your WooCommerce store to begin your 7-day trial
            </h2>

            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.55, margin: '0 0 24px' }}>
              Your trial starts the moment your store is activated with your Trial Activation Code. Follow the three steps below:
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
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  Install the ZAMERIA WooCommerce Plugin
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Download the plugin zip file and upload it to your WordPress admin under <strong>Plugins → Add New → Upload Plugin</strong>.
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
                  <span>Download Plugin (v1.2.4)</span>
                </a>
              </div>
            </div>

            {/* Step 2: TRIAL ACTIVATION CODE (Prominently styled) */}
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
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  Copy your Trial Activation Code
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Use this code in the ZAMERIA plugin inside your WooCommerce dashboard to activate your trial:
                </p>

                {/* Activation Code Display Component */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '14px',
                    backgroundColor: '#f8fafc',
                    border: '2px dashed #94a3b8',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Trial Activation Code
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 900,
                        fontFamily: 'var(--font-mono)',
                        color: '#071A31',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {activationCode || 'Not issued yet'}
                    </div>
                    {trial.error && (
                      <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>{trial.error}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={trial.isRequesting}
                    onClick={activationCode ? handleCopyCode : trial.request}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: copiedCode ? '#16a34a' : '#071A31',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    <span>
                      {trial.isRequesting
                        ? 'Issuing…'
                        : activationCode
                          ? copiedCode
                            ? 'Copied!'
                            : 'Copy Code'
                          : 'Get my code'}
                    </span>
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  This code is specifically for your store trial activation. It is not a paid license key.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
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
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
                  Enter the code in your WooCommerce dashboard
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  In WordPress, navigate to <strong>ZAMERIA → Activation</strong>, paste your code, and click <strong>Activate Trial</strong>.
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              <ShieldCheck size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.45 }}>
                <strong>Important:</strong> Your 7-day free trial does not start until activation is completed on your WooCommerce store.
              </div>
            </div>

            {/* Plugin activation simulator — development builds only */}
            {isDevBuild && (
            <div
              style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={16} color="#d97706" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#071A31' }}>
                  Quick Interactive Activation Simulator
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>(For local testing & verification)</span>
              </div>

              {simError && (
                <div style={{ fontSize: '12.5px', color: '#dc2626', marginBottom: '10px' }}>
                  {simError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={simStoreName}
                  onChange={(e) => setSimStoreName(e.target.value)}
                  placeholder="Store Name"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
                <input
                  type="text"
                  value={simStoreUrl}
                  onChange={(e) => setSimStoreUrl(e.target.value)}
                  placeholder="https://mystore.ng"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
                <button
                  type="button"
                  onClick={handleSimulateActivation}
                  disabled={isSimulating}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSimulating ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isSimulating ? 'Verifying...' : 'Simulate Plugin Activation'}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedStoreTab;
