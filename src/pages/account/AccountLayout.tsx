import React, { useState, useEffect } from 'react';
import { useCustomerAuth, CustomerProfile, LifecycleScenario } from '../../context/CustomerAuthContext';
import { useRouter, AccountTab } from '../../router/Router';
import { OverviewTab } from './OverviewTab';
import { OrdersTab } from './OrdersTab';
import { LicensesTab } from './LicensesTab';
import { PlanTab } from './PlanTab';
import { BillingTab } from './BillingTab';
import { BillingAddressTab } from './BillingAddressTab';
import { PaymentMethodsTab } from './PaymentMethodsTab';
import { SettingsTab } from './SettingsTab';
import { ConnectedStoreTab } from './ConnectedStoreTab';
import {
  LayoutDashboard,
  ShoppingBag,
  Key,
  Layers,
  CreditCard,
  MapPin,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  Store
} from 'lucide-react';

interface NavItem {
  id: AccountTab;
  label: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  getBadge?: (c: CustomerProfile) => { text: string; color: string; bg: string } | null;
}

const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBag,
    getBadge: (c) => (c.orders && c.orders.length > 0 ? { text: String(c.orders.length), color: '#475569', bg: '#f1f5f9' } : null),
  },
  { id: 'plan', label: 'Plan', icon: Layers },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  {
    id: 'licenses',
    label: 'License',
    icon: Key,
    getBadge: (c) => {
      const isTrial = c.subscription.status === 'trial' || c.accountStatus === 'trial_active' || c.accountStatus === 'trial_not_started';
      if (isTrial || !c.licenses || c.licenses.length === 0) {
        return null;
      }
      return { text: `${c.licenses.length}`, color: '#16a34a', bg: '#f0fdf4' };
    },
  },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STORE_NAV_ITEMS: NavItem[] = [
  {
    id: 'store',
    label: 'Connected Store',
    icon: Store,
    getBadge: (c) => {
      const status = c.connectedStore?.status;
      if (status === 'connected') {
        return { text: 'Connected', color: '#16a34a', bg: '#f0fdf4' };
      }
      if (status === 'error') {
        return { text: 'Error', color: '#dc2626', bg: '#fef2f2' };
      }
      if (status === 'pending') {
        return { text: 'Pending', color: '#d97706', bg: '#fffbeb' };
      }
      return { text: 'Not Connected', color: '#64748b', bg: '#f1f5f9' };
    },
  },
];

export const AccountLayout: React.FC = () => {
  const { customer, isAuthenticated, logout, simulateLifecycleScenario } = useCustomerAuth();
  const { activeTab, setAccountTab, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
  const isDevBuild = (import.meta as any).env?.DEV === true;
  const [targetOrderId, setTargetOrderId] = useState<string | null>(null);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!customer) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#071A31',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontSize: '14px', color: '#64748b' }}>Loading your ZAMERIA account...</p>
        </div>
      </div>
    );
  }

  const isTrial = customer.subscription.status === 'trial' || customer.accountStatus === 'trial_active';
  const daysLeft = customer.trial?.daysRemaining ?? customer.trialDaysRemaining ?? 7;
  const isPaid = customer.subscription.status === 'active';
  const planLabel = customer.subscription.planName || 'Business Plan';

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

  const handleSelectScenario = (sc: LifecycleScenario) => {
    simulateLifecycleScenario(sc);
    setScenarioMenuOpen(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#071A31',
      }}
    >
      {/* 1. TOP HEADER / BRAND BAR */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo & Area title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                color: '#071A31',
              }}
              className="zameria-mobile-nav-toggle"
              aria-label="Toggle navigation"
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
                src="/zameria-logo.png"
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
                backgroundColor: '#cbd5e1',
                margin: '0 4px',
              }}
              className="zameria-desktop-divider"
            />

            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
              className="zameria-portal-badge"
            >
              My Account
            </span>
          </div>

          {/* Right Header Navigation & Profile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Lifecycle quick-tester — development builds only, never shown to customers */}
            {isDevBuild && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setScenarioMenuOpen(!scenarioMenuOpen)}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#071A31',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                title="Quickly switch between customer lifecycle scenarios for testing"
              >
                <Beaker size={13} style={{ color: '#2563eb' }} />
                <span>Test Scenarios</span>
                <ChevronDown size={12} style={{ color: '#64748b' }} />
              </button>

              {scenarioMenuOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 60 }}
                    onClick={() => setScenarioMenuOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '320px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 16px 36px -6px rgba(7, 26, 49, 0.16)',
                      padding: '10px',
                      zIndex: 70,
                    }}
                  >
                    <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                      Lifecycle Scenario Switcher
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test1_new_trial')}
                        className="scenario-btn"
                      >
                        <strong>State A: Trial Not Started</strong>
                        <span>Account created • Store not connected • 0 licenses</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test2_active_trial')}
                        className="scenario-btn"
                      >
                        <strong>State B: Trial Active</strong>
                        <span>WooCommerce connected • 6 days left • 0 licenses</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test8_expired_trial')}
                        className="scenario-btn"
                      >
                        <strong>State C: Trial Expired</strong>
                        <span>Trial ended • 0 licenses • Choose Plan CTA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test3_paid_business')}
                        className="scenario-btn"
                      >
                        <strong>State D: Paid Business Plan</strong>
                        <span>₦300,000/yr • Active ZMR license • Store connected</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test4_cancelled_business')}
                        className="scenario-btn"
                      >
                        <strong>Test 5: Cancelled Plan</strong>
                        <span>Cancelled • Access until period end</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test5_expired_subscription')}
                        className="scenario-btn"
                      >
                        <strong>Test 6: Expired Subscription</strong>
                        <span>License expired • Renew CTA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test6_renewed_business')}
                        className="scenario-btn"
                      >
                        <strong>Test 7: Renewed Subscription</strong>
                        <span>Reactivated • Active license</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario('test7_duplicate_webhook')}
                        className="scenario-btn"
                      >
                        <strong>Test 8: Webhook Idempotency</strong>
                        <span>No duplicate subscriptions or keys</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            )}

            {/* Link back to Main Website */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#475569',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              className="zameria-back-to-site"
            >
              <span>Back to Website</span>
              <ExternalLink size={13} style={{ color: '#94a3b8' }} />
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
                  backgroundColor: userDropdownOpen ? '#f1f5f9' : '#ffffff',
                  border: '1px solid #e2e8f0',
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
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {getInitials(customer.fullName)}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="zameria-user-text">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#071A31', lineHeight: 1.2 }}>
                    {customer.fullName}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isTrial ? '#2563eb' : '#16a34a',
                      lineHeight: 1.2,
                    }}
                  >
                    {customer.trial?.status === 'not_started' || customer.accountStatus === 'trial_not_started'
                      ? 'Trial Not Started'
                      : isTrial
                      ? `Free Trial · ${daysLeft} days left`
                      : `${planLabel} · Active`}
                  </span>
                </div>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
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
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 12px 30px -4px rgba(7, 26, 49, 0.12)',
                      padding: '8px 0',
                      zIndex: 60,
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31' }}>
                        {customer.fullName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {customer.email}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isTrial ? '#2563eb' : '#16a34a',
                          marginTop: '4px',
                        }}
                      >
                        {customer.trial?.status === 'not_started' || customer.accountStatus === 'trial_not_started'
                          ? 'Trial Not Started'
                          : isTrial
                          ? `Free Trial · ${daysLeft} days left`
                          : `${planLabel} · Active`}
                      </div>
                    </div>

                    <div style={{ padding: '4px 0' }}>
                      <button
                        onClick={() => {
                          setAccountTab('overview');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <LayoutDashboard size={15} style={{ color: '#64748b' }} />
                        <span>My Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setAccountTab('orders');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <ShoppingBag size={15} style={{ color: '#64748b' }} />
                        <span>Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setAccountTab('plan');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <Layers size={15} style={{ color: '#64748b' }} />
                        <span>Plan</span>
                      </button>

                      <button
                        onClick={() => {
                          setAccountTab('billing');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <CreditCard size={15} style={{ color: '#64748b' }} />
                        <span>Billing</span>
                      </button>

                      {/* License: show actual state */}
                      <button
                        onClick={() => {
                          setAccountTab('licenses');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <Key size={15} style={{ color: '#64748b' }} />
                        <span>{isTrial ? 'License (Not Assigned)' : 'License'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setAccountTab('store');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <Store size={15} style={{ color: '#64748b' }} />
                        <span>Connected Store</span>
                      </button>

                      <button
                        onClick={() => {
                          setAccountTab('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="user-menu-item"
                      >
                        <Settings size={15} style={{ color: '#64748b' }} />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '16px 20px 24px',
            boxShadow: '0 12px 24px -4px rgba(7, 26, 49, 0.08)',
            zIndex: 35,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
          className="zameria-mobile-nav-drawer"
        >
          {/* User profile pill */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '6px',
            }}
          >
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#071A31' }}>
              {customer.fullName}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {customer.email}
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isTrial ? '#2563eb' : '#16a34a',
                marginTop: '4px',
              }}
            >
              {customer.trial?.status === 'not_started' || customer.accountStatus === 'trial_not_started'
                ? 'Trial Not Started'
                : isTrial
                ? `Free Trial · ${daysLeft} days left`
                : `${planLabel} · Active`}
            </div>
          </div>

          {/* Section: ACCOUNT */}
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 16px 2px' }}>
            Account
          </div>
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badge = item.getBadge ? item.getBadge(customer) : null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setAccountTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#071A31' : 'transparent',
                  color: isActive ? '#ffffff' : '#334155',
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
                      color: isActive ? '#60a5fa' : '#64748b',
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
                      color: isActive ? '#ffffff' : badge.color,
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

          {/* Section: STORE */}
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 16px 2px' }}>
            Store
          </div>
          {STORE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badge = item.getBadge ? item.getBadge(customer) : null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setAccountTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#071A31' : 'transparent',
                  color: isActive ? '#ffffff' : '#334155',
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
                      color: isActive ? '#60a5fa' : '#64748b',
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
                      color: isActive ? '#ffffff' : badge.color,
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

          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '6px 0' }} />

          {/* Mobile Back to Website */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              navigate('/');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: '#475569',
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            <span>Back to Website</span>
            <ExternalLink size={14} style={{ color: '#94a3b8' }} />
          </a>

          {/* Mobile Logout */}
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
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '4px',
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
          padding: '24px 20px 60px',
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
          className="zameria-account-sidebar"
        >
          {/* Section: ACCOUNT */}
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 16px 4px' }}>
            Account
          </div>
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badge = item.getBadge ? item.getBadge(customer) : null;

            return (
              <button
                key={item.id}
                onClick={() => setAccountTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#071A31' : 'transparent',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#071A31';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? '#60a5fa' : '#64748b',
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                {badge && (
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : badge.bg,
                      color: isActive ? '#ffffff' : badge.color,
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

          {/* Section: STORE */}
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '14px 16px 4px' }}>
            Store
          </div>
          {STORE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badge = item.getBadge ? item.getBadge(customer) : null;

            return (
              <button
                key={item.id}
                onClick={() => setAccountTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#071A31' : 'transparent',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#071A31';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? '#60a5fa' : '#64748b',
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                {badge && (
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : badge.bg,
                      color: isActive ? '#ffffff' : badge.color,
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
              backgroundColor: '#e2e8f0',
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
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </aside>

        {/* MAIN TAB CONTENT */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'orders' && <OrdersTab targetOrderId={targetOrderId} onClearTargetOrder={() => setTargetOrderId(null)} />}
          {activeTab === 'licenses' && <LicensesTab onOpenOrderDetails={(orderId) => { setTargetOrderId(orderId); setAccountTab('orders'); }} />}
          {activeTab === 'plan' && <PlanTab />}
          {activeTab === 'store' && <ConnectedStoreTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'billing-address' && <BillingAddressTab />}
          {activeTab === 'payment-methods' && <PaymentMethodsTab />}
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
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.12s ease;
        }
        .user-menu-item:hover {
          background-color: #f8fafc;
        }
        .scenario-btn {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: #ffffff;
          text-align: left;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: all 0.12s ease;
        }
        .scenario-btn:hover {
          background-color: #f0f7ff;
          border-color: #93c5fd;
        }
        .scenario-btn strong {
          color: #071A31;
          font-size: 12px;
        }
        .scenario-btn span {
          color: #64748b;
          font-size: 11px;
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
