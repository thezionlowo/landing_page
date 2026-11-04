import React, { useState, useEffect } from 'react';
import { calculateTrialDaysRemaining, resolveSubscriptionState, useCustomerAuth, CustomerProfile } from '../../context/CustomerAuthContext';
import { useRouter, AccountTab } from '../../router/Router';
import { ROUTES } from '../../lib/routes';
import { OverviewTab } from './OverviewTab';
import { ConnectedStoreTab } from './ConnectedStoreTab';
import { BillingTab } from './BillingTab';
import { DevicesTab } from './DevicesTab';
import { TeamTab } from './TeamTab';
import { SettingsTab } from './SettingsTab';
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Store,
  Monitor,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: AccountTab;
  label: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  getBadge?: (c: CustomerProfile) => { text: string; color: string; bg: string } | null;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  {
    id: 'store',
    label: 'Store',
    icon: Store,
    getBadge: (c) => {
      const status = c.connectedStore?.status;
      if (status === 'connected') return { text: 'Connected', color: '#16a34a', bg: '#f0fdf4' };
      if (status === 'error') return { text: 'Error', color: '#dc2626', bg: '#fef2f2' };
      return { text: 'Connect', color: '#d97706', bg: '#fffbeb' };
    },
  },
  {
    id: 'billing',
    label: 'Plan & billing',
    icon: CreditCard,
    getBadge: (c) => {
      const state = resolveSubscriptionState(c);
      if (state === 'trial_active') {
        const d = calculateTrialDaysRemaining(c);
        return { text: `${d}d Trial`, color: "var(--site-blue)", bg: "var(--site-blue-soft)" };
      }
      if (state === 'paid_active') return { text: 'Active', color: '#16a34a', bg: '#f0fdf4' };
      return null;
    },
  },
  {
    id: 'devices',
    label: 'Devices & hardware',
    icon: Monitor,
  },
  {
    id: 'team',
    label: 'Team access',
    icon: Users,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const AccountLayout: React.FC = () => {
  const { customer, isAuthenticated, isRestoringSession, logout } = useCustomerAuth();
  const { activeTab, setAccountTab, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isRestoringSession && !isAuthenticated) {
      navigate('/login');
    }
  }, [isRestoringSession, isAuthenticated, navigate]);

  if (!customer) {
    return (
      <div className="site-account"
      style={{
        minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: "var(--site-paper)",
          fontFamily: "var(--site-font)",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: "3px solid var(--site-line)",
              borderTopColor: "var(--site-ink)",
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontSize: '14px', color: "var(--site-muted)" }}>Loading your account…</p>
        </div>
      </div>
    );
  }

  const subscriptionState = resolveSubscriptionState(customer);
  const isTrial = subscriptionState === 'trial_active';
  const isTrialNotStarted = subscriptionState === 'no_active_plan' && (customer.trial?.status === 'not_started' || customer.accountStatus === 'trial_not_started');
  const daysLeft = calculateTrialDaysRemaining(customer);
  const isPaid = subscriptionState === 'paid_active';

  const rawPlanStr = String(
    customer.giftedDetails?.plan || customer.licenses?.[0]?.plan || customer.plan || customer.subscription?.planId || ''
  ).toLowerCase();
  const isStarter = rawPlanStr.includes('starter') || (!rawPlanStr.includes('business') && Boolean(customer.giftedDetails?.plan?.toLowerCase().includes('starter')));
  const isBusiness = rawPlanStr.includes('business') && !isStarter;
  const effectivePlan = isStarter ? 'Starter' : isBusiness ? 'Business' : (customer.plan || 'Starter');
  const planLabel = customer.subscription?.planName || `${effectivePlan} Plan`;

  const primaryLicense = customer.licenses?.[0] || null;
  const storeUrl = customer.connectedStore?.url
    ? customer.connectedStore.url
    : (primaryLicense?.connectedDomain ? `https://${primaryLicense.connectedDomain}` : '');
  const posUrl = storeUrl ? `${storeUrl.replace(/\/$/, '')}/pos/` : ROUTES.pointOfSale;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="site-account"
      style={{
        minHeight: '100vh',
        backgroundColor: "var(--site-paper)",
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "var(--site-font)",
        color: "var(--site-ink)",
      }}
    >
      {/* 1. TOP HEADER / BRAND BAR */}
      <header className="site-account-header"
        style={{
          backgroundColor: "var(--site-white)",
          borderBottom: "1px solid var(--site-line)",
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div
          style={{
            maxWidth: '1328px',
            margin: '0 auto',
            padding: '0 20px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo & Portal Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                color: "var(--site-ink)",
              }}
              className="zameria-mobile-nav-toggle"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="merchant-mobile-navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              aria-label="ZAMERIA Home"
            >
              <img
                src="/zameria-logo-header.png"
                alt="ZAMERIA"
                style={{
                  height: '28px',
                  width: 'auto',
                  maxHeight: '28px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </a>

            <div
              style={{
                height: '20px',
                width: '1px',
                backgroundColor: "var(--site-line-strong)",
                margin: '0 4px',
              }}
              className="zameria-desktop-divider"
            />

            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: "var(--site-muted)",
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
              className="zameria-portal-badge"
            >
              Merchant Portal
            </span>
          </div>

          {/* Right Header Navigation & Profile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Direct Launch POS Button */}
            <a
              href={posUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: "var(--site-ink)",
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: "var(--site-surface)",
                border: "1px solid var(--site-line-strong)",
                transition: 'background-color 0.15s ease',
              }}
              className="zameria-back-to-site"
            >
              <Monitor size={14} style={{ color: "var(--site-blue)" }} />
              <span>Launch POS</span>
              <ExternalLink size={12} style={{ color: '#94a3b8' }} />
            </a>

            {/* Profile Menu Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px 6px 6px',
                  backgroundColor: userDropdownOpen ? "var(--site-surface)" : "var(--site-white)",
                  border: "1px solid var(--site-line)",
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: "var(--site-ink)",
                    color: "var(--site-white)",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {getInitials(customer.fullName || 'Merchant')}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="zameria-user-text">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: "var(--site-ink)", lineHeight: 1.2 }}>
                    {customer.businessName || customer.fullName}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isTrial ? "var(--site-blue)" : isPaid ? '#16a34a' : "var(--site-muted)",
                      lineHeight: 1.2,
                    }}
                  >
                    {isTrialNotStarted
                      ? 'Trial Eligible'
                      : isTrial
                      ? `Free Trial · ${daysLeft}d left`
                      : `${planLabel} · Active`}
                  </span>
                </div>
                <ChevronDown size={14} style={{ color: "var(--site-muted)" }} />
              </button>

              {/* Profile Dropdown */}
              {userDropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '260px',
                      backgroundColor: "var(--site-white)",
                      borderRadius: "var(--site-radius)",
                      border: "1px solid var(--site-line)",
                      boxShadow: '0 12px 30px -4px rgba(7, 26, 49, 0.12)',
                      padding: '8px 0',
                      zIndex: 60,
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderBottom: "1px solid var(--site-surface)" }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: "var(--site-ink)" }}>
                        {customer.fullName}
                      </div>
                      <div style={{ fontSize: '12px', color: "var(--site-muted)", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {customer.email}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isTrial ? "var(--site-blue)" : '#16a34a',
                          marginTop: '4px',
                        }}
                      >
                        {isTrial ? `Free Trial · ${daysLeft} days left` : `${planLabel} · Active`}
                      </div>
                    </div>

                    <div style={{ padding: '4px 0' }}>

          {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setAccountTab(item.id);
                              setUserDropdownOpen(false);
                            }}
                            className="user-menu-item"
                          >
                            <Icon size={15} style={{ color: "var(--site-muted)" }} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ borderTop: "1px solid var(--site-surface)", marginTop: '4px', paddingTop: '4px' }}>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          fontSize: '13px',
                          color: '#b91c1c',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: 600,
                        }}
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER (< 860px) */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "var(--site-white)",
            borderBottom: "1px solid var(--site-line)",
            padding: '16px 20px 24px',
            boxShadow: '0 12px 24px -4px rgba(7, 26, 49, 0.08)',
            zIndex: 35,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
          className="zameria-mobile-nav-drawer"
          id="merchant-mobile-navigation"
        >
          {/* User profile pill */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: "var(--site-paper)",
              borderRadius: "var(--site-radius)",
              border: "1px solid var(--site-line)",
              marginBottom: '6px',
            }}
          >
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: "var(--site-ink)" }}>
              {customer.fullName}
            </div>
            <div style={{ fontSize: '12px', color: "var(--site-muted)" }}>
              {customer.email}
            </div>
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badge = item.getBadge ? item.getBadge(customer) : null;

            return (
              <button
                key={item.id}
                className={`site-account-mobile-item ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => {
                  setAccountTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  borderRadius: "var(--site-radius)",
                  border: 'none',
                  backgroundColor: isActive ? "var(--site-primary)" : 'transparent',
                  color: isActive ? "var(--site-white)" : "var(--site-ink)",
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? '#60a5fa' : "var(--site-muted)",
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                {badge && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : badge.bg,
                      color: isActive ? "var(--site-white)" : badge.color,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {badge.text}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ height: '1px', backgroundColor: "var(--site-line)", margin: '6px 0' }} />

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: "var(--site-radius)",
              border: 'none',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* 2. BODY CONTAINER: SIDEBAR + CONTENT */}
      <div
        style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 32px 70px',
          display: 'flex',
          gap: '32px',
          flex: 1,
        }}
      >
        {/* DESKTOP SIDEBAR */}
        <aside
          style={{
            width: '240px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
          className="zameria-account-sidebar site-account-sidebar"
        >
          <div className="site-account-sidebar-title"><span>YOUR WORKSPACE</span><strong>{customer.businessName || customer.fullName || "Your business"}</strong><small>Your store and account.</small></div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isTabActive =
              activeTab === item.id ||
              (item.id === 'billing' &&
                (activeTab === 'plan' ||
                  activeTab === 'licenses' ||
                  activeTab === 'orders' ||
                  activeTab === 'billing-address' ||
                  activeTab === 'payment-methods'));
            const badge = item.getBadge ? item.getBadge(customer) : null;

            return (
              <button
                key={item.id}
                className={`site-account-nav-item ${isTabActive ? "is-active" : ""}`}
                aria-pressed={isTabActive}
                onClick={() => setAccountTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: "var(--site-radius)",
                  border: 'none',
                  backgroundColor: isTabActive ? "var(--site-primary)" : 'transparent',
                  color: isTabActive ? "var(--site-white)" : "var(--site-muted)",
                  fontSize: '13.5px',
                  fontWeight: isTabActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isTabActive) {
                    e.currentTarget.style.backgroundColor = "var(--site-surface)";
                    e.currentTarget.style.color = "var(--site-ink)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isTabActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = "var(--site-muted)";
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    size={17}
                    style={{
                      color: isTabActive ? '#60a5fa' : "var(--site-muted)",
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                {badge && (
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      backgroundColor: isTabActive ? 'rgba(255, 255, 255, 0.15)' : badge.bg,
                      color: isTabActive ? "var(--site-white)" : badge.color,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {badge.text}
                  </span>
                )}
              </button>
            );
          })}

          <div
            style={{
              height: '1px',
              backgroundColor: "var(--site-line)",
              margin: '12px 0',
            }}
          />

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 16px',
              borderRadius: "var(--site-radius)",
              border: 'none',
              backgroundColor: 'transparent',
              color: '#dc2626',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </aside>

        {/* MAIN TAB CONTENT */}
        <main className="site-account-content" style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'store' && <ConnectedStoreTab />}
          {(activeTab === 'billing' ||
            activeTab === 'orders' ||
            activeTab === 'licenses' ||
            activeTab === 'plan' ||
            activeTab === 'billing-address' ||
            activeTab === 'payment-methods') && <BillingTab />}
          {activeTab === 'devices' && <DevicesTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      <style>{`
        .user-menu-item {
          width: 100%;
          padding: 8px 16px;
          border: none;
          background: none;
          text-align: left;
          font-size: 13px;
          color: var(--site-ink);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.12s ease;
        }
        .user-menu-item:hover {
          background-color: var(--site-paper);
        }
        @media (max-width: 860px) {
          .zameria-mobile-nav-toggle {
            display: block !important;
          }
          .zameria-desktop-divider,
          .zameria-portal-badge,
          .zameria-back-to-site,
          .zameria-account-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountLayout;
