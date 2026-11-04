import React, { useState } from 'react';
import { resolveSubscriptionState, useCustomerAuth, LicenseItem, LicenseStatus } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { AddLicenseModal } from './AddLicenseModal';
import {
  Key,
  ShieldCheck,
  Globe,
  Copy,
  Check,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Calendar,
  X,
  FileText,
  Plug,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface LicensesTabProps {
  onOpenOrderDetails?: (orderId: string) => void;
}

export const LicensesTab: React.FC<LicensesTabProps> = ({ onOpenOrderDetails }) => {
  const { customer, renewLicense } = useCustomerAuth();
  const { setAccountTab } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LicenseStatus>('ALL');
  const [selectedLicense, setSelectedLicense] = useState<LicenseItem | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  if (!customer) return null;

  const licenses = customer.licenses || [];

  const handleCopyKey = (key: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const filteredLicenses = licenses.filter((lic) => {
    // Status Filter
    if (statusFilter !== 'ALL' && lic.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchDomain = lic.connectedDomain?.toLowerCase().includes(q) || false;
      const matchKey = lic.licenseKey.toLowerCase().includes(q);
      const matchOrder = lic.orderNumber.toLowerCase().includes(q);
      const matchPlan = lic.plan.toLowerCase().includes(q);
      if (!matchDomain && !matchKey && !matchOrder && !matchPlan) {
        return false;
      }
    }

    return true;
  });

  const handleViewOrder = (orderId: string) => {
    setSelectedLicense(null);
    if (onOpenOrderDetails) {
      onOpenOrderDetails(orderId);
    } else {
      setAccountTab('orders');
    }
  };

  const subscriptionState = resolveSubscriptionState(customer);
  const isTrialNotStarted = subscriptionState === 'no_active_plan' && (customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started');
  const isTrialActive = subscriptionState === 'trial_active';
  const isTrialExpired = subscriptionState === 'trial_expired';
  const daysLeft = customer.trial?.daysRemaining ?? customer.trialDaysRemaining ?? 7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header with Add License CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: "var(--site-ink)", letterSpacing: '-0.02em', margin: 0 }}>
            My Licenses
          </h2>
          <p style={{ fontSize: '14px', color: "var(--site-muted)", marginTop: '6px', margin: 0 }}>
            {licenses.length > 0
              ? 'Manage your ZAMERIA licenses and connected domains.'
              : 'View and manage software entitlements attached to your paid subscriptions.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '11px 20px',
            backgroundColor: "var(--site-primary)",
            color: "var(--site-white)",
            border: 'none',
            borderRadius: "var(--site-radius)",
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(7, 26, 49, 0.15)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0c284d')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--site-ink)")}
        >
          {licenses.length === 0 ? (
            <>
              <Sparkles size={15} style={{ color: '#fbbf24' }} />
              <span>Choose a Plan</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add a License</span>
            </>
          )}
        </button>
      </div>

      {/* Search and Filtering Toolbar (Only shown when user has licenses) */}
      {licenses.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: "var(--site-white)",
            padding: '16px 20px',
            borderRadius: "var(--site-radius)",
            border: "1px solid var(--site-line)",
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by domain, license key, order ID, plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                fontSize: '13px',
                borderRadius: "var(--site-radius)",
                border: "1px solid var(--site-line-strong)",
                outline: 'none',
                color: "var(--site-ink)",
                boxSizing: 'border-box',
              }}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {(['ALL', 'Active', 'Not Activated', 'Expired', 'Suspended'] as const).map((st) => {
              const isSelected = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: isSelected ? "1px solid var(--site-ink)" : "1px solid var(--site-line)",
                    backgroundColor: isSelected ? "var(--site-primary)" : "var(--site-paper)",
                    color: isSelected ? "var(--site-white)" : "var(--site-muted)",
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {st === 'ALL' ? 'All Licenses' : st}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Licenses List / Cards */}
      {licenses.length === 0 ? (
        /* Empty State 1: No License Assigned (Trial or Unsubscribed User) */
        <div
          style={{
            backgroundColor: "var(--site-white)",
            borderRadius: "var(--site-radius)",
            border: "1px solid var(--site-line)",
            padding: '64px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: "var(--site-radius)",
              backgroundColor: isTrialActive ? "var(--site-blue-soft)" : isTrialNotStarted ? "var(--site-surface)" : '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: isTrialActive ? "var(--site-blue)" : isTrialNotStarted ? "var(--site-muted)" : '#dc2626',
            }}
          >
            <Key size={32} />
          </div>

          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: isTrialNotStarted
                ? "var(--site-muted)"
                : isTrialActive
                ? "var(--site-blue)"
                : isTrialExpired
                ? '#b91c1c'
                : "var(--site-muted)",
              backgroundColor: isTrialNotStarted
                ? "var(--site-surface)"
                : isTrialActive
                ? "var(--site-blue-soft)"
                : isTrialExpired
                ? '#fef2f2'
                : "var(--site-surface)",
              border: isTrialNotStarted
                ? "1px solid var(--site-line-strong)"
                : isTrialActive
                ? '1px solid #bfdbfe'
                : isTrialExpired
                ? '1px solid #fecaca'
                : "1px solid var(--site-line)",
              padding: '3px 12px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            {isTrialNotStarted
              ? 'Trial Not Started'
              : isTrialActive
              ? `Free Trial Active • ${daysLeft} Days Remaining`
              : isTrialExpired
              ? 'Trial Expired'
              : 'No Active License'}
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 800, color: "var(--site-ink)", margin: '0 0 10px' }}>
            No License Yet
          </h3>

          <p style={{ fontSize: '14.5px', color: "var(--site-muted)", maxWidth: '480px', margin: '0 0 24px', lineHeight: 1.6 }}>
            {isTrialNotStarted
              ? 'Your license will be generated when you subscribe to a paid plan. Your trial uses a Trial Activation Code to connect your WooCommerce store.'
              : isTrialActive
              ? "You're currently using ZAMERIA during your free trial. Subscribe to a paid plan to receive your license."
              : isTrialExpired
              ? 'Your 7-day free trial has expired. Subscribe to a paid plan to receive your license.'
              : 'Your license will be generated when you subscribe to a paid plan.'}
          </p>

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: '12px 28px',
              backgroundColor: "var(--site-primary)",
              color: "var(--site-white)",
              border: 'none',
              borderRadius: "var(--site-radius)",
              fontSize: '14px',
              fontWeight: 700,
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
        </div>
      ) : filteredLicenses.length === 0 ? (
        /* Empty State 2: No search results */
        <div
          style={{
            backgroundColor: "var(--site-white)",
            borderRadius: "var(--site-radius)",
            border: "1px solid var(--site-line)",
            padding: '50px 20px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 600, color: "var(--site-muted)", margin: '0 0 12px' }}>
            No licenses matching "{searchQuery || statusFilter}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            style={{
              background: 'none',
              border: "1px solid var(--site-line-strong)",
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: "var(--site-ink)",
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Render License Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredLicenses.map((lic) => {
            const isActivated = lic.status === 'Active';
            const isCopied = copiedKeyId === lic.id;

            return (
              <div
                key={lic.id}
                style={{
                  backgroundColor: "var(--site-white)",
                  borderRadius: "var(--site-radius)",
                  border: "1px solid var(--site-line)",
                  padding: '24px',
                  boxShadow: '0 4px 16px -4px rgba(7, 26, 49, 0.04)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                {/* Header Row: Plan, Domain & Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: "var(--site-ink)", margin: 0 }}>
                      {lic.plan}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor:
                          lic.status === 'Active'
                            ? '#f0fdf4'
                            : lic.status === 'Not Activated'
                            ? '#fef3c7'
                            : lic.status === 'Expired'
                            ? '#fef2f2'
                            : "var(--site-surface)",
                        color:
                          lic.status === 'Active'
                            ? '#16a34a'
                            : lic.status === 'Not Activated'
                            ? '#d97706'
                            : lic.status === 'Expired'
                            ? '#b91c1c'
                            : "var(--site-muted)",
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {lic.status === 'Active' && <CheckCircle2 size={12} />}
                      {lic.status === 'Not Activated' && <Clock size={12} />}
                      {lic.status === 'Expired' && <AlertCircle size={12} />}
                      {lic.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: "var(--site-muted)" }}>
                      Order {lic.orderNumber}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: "var(--site-muted)" }}>
                    Expires: <strong style={{ color: "var(--site-ink)" }}>{lic.expiresAt}</strong>
                  </div>
                </div>

                {/* Details Grid: License Key & Connected Domain */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: '16px',
                    padding: '16px 20px',
                    backgroundColor: "var(--site-paper)",
                    borderRadius: "var(--site-radius)",
                    border: "1px solid var(--site-surface)",
                  }}
                >
                  {/* License Key Box */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: "var(--site-muted)", textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      License Key
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code
                        style={{
                          fontFamily: "var(--site-font)",
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: "var(--site-ink)",
                          backgroundColor: "var(--site-white)",
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: "1px solid var(--site-line)",
                          letterSpacing: '0.04em',
                        }}
                      >
                        {lic.licenseKey}
                      </code>
                      <button
                        onClick={(e) => handleCopyKey(lic.licenseKey, lic.id, e)}
                        title="Copy license key"
                        style={{
                          padding: '6px 10px',
                          backgroundColor: isCopied ? '#f0fdf4' : "var(--site-white)",
                          color: isCopied ? '#16a34a' : "var(--site-muted)",
                          border: `1px solid ${isCopied ? '#bbf7d0' : "var(--site-line-strong)"}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Connected Domain Box */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: "var(--site-muted)", textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      Connected Domain
                    </div>
                    {lic.connectedDomain ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} style={{ color: "var(--site-blue)", flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: "var(--site-ink)" }}>
                          {lic.connectedDomain}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#16a34a',
                            backgroundColor: '#f0fdf4',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Connected
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
                          Not connected
                        </span>
                        <p style={{ fontSize: '11px', color: '#d97706', margin: '2px 0 0' }}>
                          Enter this key in the ZAMERIA Plugin to connect your store.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingTop: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: "var(--site-muted)" }}>
                    <Calendar size={13} />
                    <span>
                      {lic.activatedAt ? `Activated on ${lic.activatedAt}` : 'Awaiting store connection'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => setSelectedLicense(lic)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: "var(--site-white)",
                        border: "1px solid var(--site-line-strong)",
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: "var(--site-ink)",
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--site-surface)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--site-white)")}
                    >
                      <span>View Details</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. LICENSE DETAILS MODAL */}
      {selectedLicense && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedLicense(null)}
        >
          <div
            style={{
              backgroundColor: "var(--site-white)",
              borderRadius: "var(--site-radius)",
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: "1px solid var(--site-line)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: "var(--site-paper)",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: "var(--site-radius)",
                    backgroundColor: "var(--site-ink)",
                    color: "var(--site-white)",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Key size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: "var(--site-ink)", margin: 0 }}>
                    License Details
                  </h3>
                  <p style={{ fontSize: '12px', color: "var(--site-muted)", margin: '2px 0 0' }}>
                    {selectedLicense.plan} Plan Entitlement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLicense(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: "var(--site-muted)",
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* License Key Hero Box */}
              <div
                style={{
                  backgroundColor: "var(--site-paper)",
                  border: "1px solid var(--site-line)",
                  borderRadius: "var(--site-radius)",
                  padding: '20px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: "var(--site-muted)", textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  License Key
                </div>
                <div
                  style={{
                    fontFamily: "var(--site-font)",
                    fontSize: '17px',
                    fontWeight: 800,
                    color: "var(--site-ink)",
                    letterSpacing: '0.06em',
                    marginBottom: '12px',
                  }}
                >
                  {selectedLicense.licenseKey}
                </div>
                <button
                  onClick={(e) => handleCopyKey(selectedLicense.licenseKey, selectedLicense.id, e)}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: copiedKeyId === selectedLicense.id ? '#f0fdf4' : "var(--site-white)",
                    color: copiedKeyId === selectedLicense.id ? '#16a34a' : "var(--site-ink)",
                    border: `1px solid ${copiedKeyId === selectedLicense.id ? '#bbf7d0' : "var(--site-line-strong)"}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {copiedKeyId === selectedLicense.id ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKeyId === selectedLicense.id ? 'Copied License Key!' : 'Copy License Key'}</span>
                </button>
              </div>

              {/* Attributes Grid */}
              <div className="site-responsive-columns"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: "1px solid var(--site-surface)",
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Plan
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: "var(--site-ink)", marginTop: '4px' }}>
                    {selectedLicense.plan}
                  </div>
                  <div style={{ fontSize: '12px', color: "var(--site-muted)" }}>
                    {selectedLicense.plan.toLowerCase().includes('business') ? '₦300,000 / year' : '₦200,000 / year'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Status
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: selectedLicense.status === 'Active' ? '#f0fdf4' : '#fef3c7',
                        color: selectedLicense.status === 'Active' ? '#16a34a' : '#d97706',
                      }}
                    >
                      {selectedLicense.status}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Activation Status
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: "var(--site-ink)", marginTop: '4px' }}>
                    {selectedLicense.activationStatus}
                  </div>
                  <div style={{ fontSize: '11px', color: "var(--site-muted)" }}>
                    {selectedLicense.activatedAt ? `On ${selectedLicense.activatedAt}` : 'Pending connection'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Expiry / Renewal Date
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: "var(--site-ink)", marginTop: '4px' }}>
                    {selectedLicense.expiresAt}
                  </div>
                </div>

                {/* Associated Order Link */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Originating Order
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleViewOrder(selectedLicense.orderId)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: "var(--site-blue-soft)",
                        color: "var(--site-blue)",
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <FileText size={14} />
                      <span>{selectedLicense.orderNumber}</span>
                      <ArrowRight size={13} />
                    </button>
                    <span style={{ fontSize: '12px', color: "var(--site-muted)" }}>
                      Click to view purchase receipt & invoice breakdown
                    </span>
                  </div>
                </div>
              </div>

              {/* Connected Domain Section */}
              <div
                style={{
                  backgroundColor: selectedLicense.connectedDomain ? "var(--site-paper)" : '#fefce8',
                  borderRadius: "var(--site-radius)",
                  border: `1px solid ${selectedLicense.connectedDomain ? "var(--site-line)" : '#fef08a'}`,
                  padding: '18px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} style={{ color: selectedLicense.connectedDomain ? "var(--site-blue)" : '#d97706' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: "var(--site-ink)" }}>
                      Connected Domain:
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: selectedLicense.connectedDomain ? '#f0fdf4' : '#fffbeb',
                      color: selectedLicense.connectedDomain ? '#16a34a' : '#b45309',
                      border: `1px solid ${selectedLicense.connectedDomain ? '#bbf7d0' : '#fde68a'}`,
                    }}
                  >
                    {selectedLicense.connectedDomain ? 'Status: Connected' : 'Status: Not Activated'}
                  </span>
                </div>

                {selectedLicense.connectedDomain ? (
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: "var(--site-ink)" }}>
                      {selectedLicense.connectedDomain}
                    </div>
                    <div style={{ fontSize: '12px', color: "var(--site-muted)", marginTop: '4px' }}>
                      Active real-time 2-way catalog sync running via WooCommerce REST API.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                      Not connected yet
                    </div>
                    <p style={{ fontSize: '12px', color: '#78350f', margin: '4px 0 12px', lineHeight: 1.45 }}>
                      Enter this license key in your WordPress/WooCommerce ZAMERIA Plugin to activate your license.
                    </p>

                    <div
                      style={{
                        backgroundColor: "var(--site-white)",
                        borderRadius: "var(--site-radius)",
                        padding: '12px',
                        border: '1px solid #fde68a',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: "var(--site-ink)", marginBottom: '4px' }}>
                        Store selected at checkout: {selectedLicense.requestedDomain || 'Not recorded'}
                      </div>
                      <div style={{ fontSize: '12px', color: "var(--site-muted)", lineHeight: 1.45 }}>
                        Install the ZAMERIA WooCommerce plugin and enter this license key. The plugin securely detects and confirms the live store domain; it cannot be changed from this dashboard.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                backgroundColor: "var(--site-paper)",
                borderTop: "1px solid var(--site-line)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setSelectedLicense(null)}
                style={{
                  padding: '9px 18px',
                  backgroundColor: "var(--site-white)",
                  border: "1px solid var(--site-line-strong)",
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: "var(--site-muted)",
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add License Modal */}
      <AddLicenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccessNavigate={() => {
          setIsAddModalOpen(false);
          setStatusFilter('ALL');
        }}
      />
    </div>
  );
};
