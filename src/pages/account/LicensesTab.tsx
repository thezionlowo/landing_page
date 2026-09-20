import React, { useState } from 'react';
import { useCustomerAuth, LicenseItem, LicenseStatus } from '../../context/CustomerAuthContext';
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
  const { customer, activateLicenseDomain, renewLicense } = useCustomerAuth();
  const { setAccountTab } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LicenseStatus>('ALL');
  const [selectedLicense, setSelectedLicense] = useState<LicenseItem | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Activation simulator inside modal
  const [simDomain, setSimDomain] = useState('');
  const [simError, setSimError] = useState<string | null>(null);
  const [simSuccess, setSimSuccess] = useState(false);
  const isDevBuild = (import.meta as any).env?.DEV === true;

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

  const handleSimulateActivation = (licenseId: string) => {
    if (!simDomain.trim()) {
      setSimError('Please enter a domain name (e.g. brandone.com).');
      return;
    }

    const res = activateLicenseDomain(licenseId, simDomain.trim());
    if (res.success) {
      setSimSuccess(true);
      setSimError(null);
      // Update local selected license state
      setSelectedLicense((prev) =>
        prev && prev.id === licenseId
          ? {
              ...prev,
              connectedDomain: simDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
              status: 'Active',
              activationStatus: 'Activated',
              activatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            }
          : prev
      );
      setTimeout(() => setSimSuccess(false), 3500);
      setSimDomain('');
    } else {
      setSimError(res.error || 'Failed to activate domain.');
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedLicense(null);
    if (onOpenOrderDetails) {
      onOpenOrderDetails(orderId);
    } else {
      setAccountTab('orders');
    }
  };

  const isTrialNotStarted = customer.accountStatus === 'trial_not_started' || customer.trial?.status === 'not_started';
  const isTrialActive = (customer.accountStatus === 'trial_active' || customer.trial?.status === 'active' || customer.trial?.status === 'expiring') && !isTrialNotStarted;
  const isTrialExpired = customer.accountStatus === 'trial_expired' || customer.trial?.status === 'expired' || (isTrialActive && (customer.trial?.daysRemaining ?? 0) <= 0);
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
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#071A31', letterSpacing: '-0.02em', margin: 0 }}>
            My Licenses
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px', margin: 0 }}>
            {licenses.length > 0
              ? 'Manage your ZAMERIA licenses and connected domains.'
              : 'View and manage software entitlements attached to your paid subscriptions.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '11px 20px',
            backgroundColor: '#071A31',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
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
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#071A31')}
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
            backgroundColor: '#ffffff',
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
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
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                color: '#071A31',
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
                    border: isSelected ? '1px solid #071A31' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#071A31' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#64748b',
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
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
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
              borderRadius: '20px',
              backgroundColor: isTrialActive ? '#eff6ff' : isTrialNotStarted ? '#f1f5f9' : '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: isTrialActive ? '#2563eb' : isTrialNotStarted ? '#64748b' : '#dc2626',
            }}
          >
            <Key size={32} />
          </div>

          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: isTrialNotStarted
                ? '#475569'
                : isTrialActive
                ? '#2563eb'
                : isTrialExpired
                ? '#b91c1c'
                : '#64748b',
              backgroundColor: isTrialNotStarted
                ? '#f1f5f9'
                : isTrialActive
                ? '#eff6ff'
                : isTrialExpired
                ? '#fef2f2'
                : '#f1f5f9',
              border: isTrialNotStarted
                ? '1px solid #cbd5e1'
                : isTrialActive
                ? '1px solid #bfdbfe'
                : isTrialExpired
                ? '1px solid #fecaca'
                : '1px solid #e2e8f0',
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

          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#071A31', margin: '0 0 10px' }}>
            No License Yet
          </h3>

          <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '480px', margin: '0 0 24px', lineHeight: 1.6 }}>
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
              backgroundColor: '#071A31',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
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
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '50px 20px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', margin: '0 0 12px' }}>
            No licenses matching "{searchQuery || statusFilter}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            style={{
              background: 'none',
              border: '1px solid #cbd5e1',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#071A31',
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
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
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
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
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
                            : '#f1f5f9',
                        color:
                          lic.status === 'Active'
                            ? '#16a34a'
                            : lic.status === 'Not Activated'
                            ? '#d97706'
                            : lic.status === 'Expired'
                            ? '#b91c1c'
                            : '#64748b',
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
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      Order {lic.orderNumber}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Expires: <strong style={{ color: '#071A31' }}>{lic.expiresAt}</strong>
                  </div>
                </div>

                {/* Details Grid: License Key & Connected Domain */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  {/* License Key Box */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      License Key
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#071A31',
                          backgroundColor: '#ffffff',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
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
                          backgroundColor: isCopied ? '#f0fdf4' : '#ffffff',
                          color: isCopied ? '#16a34a' : '#475569',
                          border: `1px solid ${isCopied ? '#bbf7d0' : '#cbd5e1'}`,
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
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      Connected Domain
                    </div>
                    {lic.connectedDomain ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#071A31' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
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
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#071A31',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
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
              backgroundColor: '#ffffff',
              borderRadius: '24px',
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
                  }}
                >
                  <Key size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                    License Details
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                    {selectedLicense.plan} Plan Entitlement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLicense(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
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
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  License Key
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#071A31',
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
                    backgroundColor: copiedKeyId === selectedLicense.id ? '#f0fdf4' : '#ffffff',
                    color: copiedKeyId === selectedLicense.id ? '#16a34a' : '#071A31',
                    border: `1px solid ${copiedKeyId === selectedLicense.id ? '#bbf7d0' : '#cbd5e1'}`,
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
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Plan
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#071A31', marginTop: '4px' }}>
                    {selectedLicense.plan}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedLicense.price}</div>
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
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31', marginTop: '4px' }}>
                    {selectedLicense.activationStatus}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {selectedLicense.activatedAt ? `On ${selectedLicense.activatedAt}` : 'Pending connection'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Expiry / Renewal Date
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31', marginTop: '4px' }}>
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
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
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
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Click to view purchase receipt & invoice breakdown
                    </span>
                  </div>
                </div>
              </div>

              {/* Connected Domain Section */}
              <div
                style={{
                  backgroundColor: selectedLicense.connectedDomain ? '#f8fafc' : '#fefce8',
                  borderRadius: '14px',
                  border: `1px solid ${selectedLicense.connectedDomain ? '#e2e8f0' : '#fef08a'}`,
                  padding: '18px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} style={{ color: selectedLicense.connectedDomain ? '#2563eb' : '#d97706' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#071A31' }}>
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
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#071A31' }}>
                      {selectedLicense.connectedDomain}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
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

                    {/* Domain activation simulator — development builds only; real activation happens from the plugin */}
                    {isDevBuild && (
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #fde68a',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#071A31', marginBottom: '6px' }}>
                        Connect Domain:
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="e.g. yourstore.com"
                          value={simDomain}
                          onChange={(e) => setSimDomain(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: '13px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSimulateActivation(selectedLicense.id)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#071A31',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Connect & Activate
                        </button>
                      </div>
                      {simError && (
                        <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '6px' }}>
                          {simError}
                        </div>
                      )}
                      {simSuccess && (
                        <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>
                          Domain connected successfully!
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b',
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
