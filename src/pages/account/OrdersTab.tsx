import React, { useState } from 'react';
import { useCustomerAuth, OrderItem } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { AddLicenseModal } from './AddLicenseModal';
import {
  Package,
  Eye,
  X,
  Download,
  CheckCircle2,
  FileText,
  Calendar,
  CreditCard,
  ShieldCheck,
  Key,
  Copy,
  Check,
  ArrowRight,
  Globe,
  Plus,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OrdersTabProps {
  initialSelectedOrderId?: string | null;
  targetOrderId?: string | null;
  onClearTargetOrder?: () => void;
  onViewLicense?: (licenseId: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  initialSelectedOrderId,
  targetOrderId,
  onClearTargetOrder,
  onViewLicense,
}) => {
  const { customer } = useCustomerAuth();
  const { setAccountTab } = useRouter();

  const orders = customer?.orders || [];
  const licenses = customer?.licenses || [];

  const targetId = targetOrderId || initialSelectedOrderId;
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(() => {
    if (targetId) {
      return orders.find((o) => o.id === targetId || o.orderNumber === targetId) || null;
    }
    return null;
  });

  const [copiedKey, setCopiedKey] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!customer) return null;

  const handleCopyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleDownloadInvoice = (order: OrderItem) => {
    setDownloadSuccess(order.invoiceNumber);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    onClearTargetOrder?.();
  };

  const handleViewLicenseDetails = (licenseId?: string) => {
    closeOrderModal();
    if (onViewLicense && licenseId) {
      onViewLicense(licenseId);
    } else {
      setAccountTab('licenses');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Tab Heading & Actions */}
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
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#071A31', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Orders &amp; Purchases
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            View your complete ZAMERIA purchase history, subscription receipts, and associated licenses.
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
          <Plus size={16} />
          <span>{(customer?.licenses?.length || 0) > 0 ? 'Add Plan / License' : 'Choose a Plan'}</span>
        </button>
      </div>

      {/* Invoice Download Toast */}
      {downloadSuccess && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#166534',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
          <span>Official Tax Invoice {downloadSuccess} downloaded successfully.</span>
        </div>
      )}

      {/* Orders Table Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
        }}
      >
        {orders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Order
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Date
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Plan
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Amount
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    License
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  // Find associated license
                  const associatedLicense = licenses.find(
                    (l) => l.orderId === order.id || l.orderNumber === order.orderNumber || l.id === order.licenseId
                  );

                  const licStatus = associatedLicense?.status || order.licenseStatus || 'Active';
                  const licDomain = associatedLicense?.connectedDomain || order.connectedDomain;

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: idx === orders.length - 1 ? 'none' : '1px solid #f1f5f9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Order Number */}
                      <td style={{ padding: '18px 20px', fontWeight: 800, color: '#071A31', fontSize: '14px' }}>
                        {order.orderNumber}
                      </td>

                      {/* Date */}
                      <td style={{ padding: '18px 20px', color: '#64748b', fontSize: '13px' }}>
                        {order.date}
                      </td>

                      {/* Plan */}
                      <td style={{ padding: '18px 20px', color: '#071A31', fontWeight: 700, fontSize: '13px' }}>
                        {order.plan}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '18px 20px', fontWeight: 800, color: '#071A31', fontSize: '14px' }}>
                        {order.total}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '18px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#16a34a',
                            backgroundColor: '#f0fdf4',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          <span>{order.status}</span>
                        </span>
                      </td>

                      {/* License */}
                      <td style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color:
                                licStatus === 'Active'
                                  ? '#16a34a'
                                  : licStatus === 'Not Activated'
                                  ? '#d97706'
                                  : '#b91c1c',
                              backgroundColor:
                                licStatus === 'Active'
                                  ? '#f0fdf4'
                                  : licStatus === 'Not Activated'
                                  ? '#fef3c7'
                                  : '#fef2f2',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              width: 'fit-content',
                            }}
                          >
                            <Key size={11} />
                            <span>License: {licStatus}</span>
                          </span>
                          {licDomain && (
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {licDomain}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: '#2563eb',
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dbeafe';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                          }}
                        >
                          <Eye size={13} />
                          <span>View Order</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#94a3b8',
              }}
            >
              <Package size={28} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#071A31', margin: '0 0 6px' }}>
              No orders yet
            </h4>
            <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '380px', margin: '0 auto 20px' }}>
              Your ZAMERIA subscription orders and invoices will appear here once processed.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Choose a Plan
            </button>
          </div>
        )}
      </div>

      {/* 8. ORDER DETAILS MODAL (WITH ASSOCIATED LICENSE) */}
      {selectedOrder && (() => {
        const matchingLicense = licenses.find(
          (l) => l.orderId === selectedOrder.id || l.orderNumber === selectedOrder.orderNumber || l.id === selectedOrder.licenseId
        );

        const keyToShow = matchingLicense?.licenseKey || selectedOrder.licenseKey || 'ZAM-88F4-9021-BC44-1024';
        const licenseStatus = matchingLicense?.status || selectedOrder.licenseStatus || 'Active';
        const connectedDomain = matchingLicense?.connectedDomain || selectedOrder.connectedDomain || null;
        const expiryDate = matchingLicense?.expiresAt || 'September 12, 2027';

        return (
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
            onClick={closeOrderModal}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '620px',
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                      Order {selectedOrder.orderNumber}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#16a34a',
                        backgroundColor: '#f0fdf4',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      Status: {selectedOrder.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                    Invoice: {selectedOrder.invoiceNumber}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeOrderModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '6px',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                {/* 1. Order Information Section */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                    Order Information
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      fontSize: '13px',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748b', fontSize: '11.5px' }}>Plan Purchased</div>
                      <div style={{ fontWeight: 800, color: '#071A31', marginTop: '2px' }}>{selectedOrder.plan}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '11.5px' }}>Purchase Date</div>
                      <div style={{ fontWeight: 700, color: '#071A31', marginTop: '2px' }}>{selectedOrder.date}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '11.5px' }}>Payment Method</div>
                      <div style={{ fontWeight: 600, color: '#071A31', marginTop: '2px' }}>{selectedOrder.paymentMethod}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '11.5px' }}>Total Amount Paid</div>
                      <div style={{ fontWeight: 800, color: '#071A31', fontSize: '15px', marginTop: '2px' }}>{selectedOrder.total}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Associated License Section (Two-Way Relationship) */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                    Associated License &amp; Entitlement
                  </div>
                  <div
                    style={{
                      padding: '18px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #2563eb',
                      borderRadius: '14px',
                      boxShadow: '0 4px 14px -3px rgba(37, 99, 235, 0.08)',
                    }}
                  >
                    {/* License Key Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>License Key</div>
                        <code
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: '#071A31',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {keyToShow}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyLicenseKey(keyToShow)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: copiedKey ? '#f0fdf4' : '#f8fafc',
                          color: copiedKey ? '#16a34a' : '#071A31',
                          border: `1px solid ${copiedKey ? '#bbf7d0' : '#cbd5e1'}`,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {copiedKey ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                      </button>
                    </div>

                    {/* License Status & Domain Details */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '12.5px',
                      }}
                    >
                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>License Status</div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: licenseStatus === 'Active' ? '#16a34a' : '#d97706',
                            backgroundColor: licenseStatus === 'Active' ? '#f0fdf4' : '#fef3c7',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '2px',
                          }}
                        >
                          {licenseStatus}
                        </span>
                      </div>

                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Connected Domain</div>
                        <div style={{ fontWeight: 700, color: '#071A31', marginTop: '2px' }}>
                          {connectedDomain ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Globe size={13} style={{ color: '#2563eb' }} />
                              {connectedDomain}
                            </span>
                          ) : (
                            <span style={{ color: '#d97706' }}>Not connected yet</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Activation</div>
                        <div style={{ fontWeight: 600, color: '#071A31', marginTop: '2px' }}>
                          {connectedDomain ? 'Activated' : 'Pending Activation'}
                        </div>
                      </div>

                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Expiry / Renewal</div>
                        <div style={{ fontWeight: 600, color: '#071A31', marginTop: '2px' }}>
                          {expiryDate}
                        </div>
                      </div>
                    </div>

                    {/* View License Details CTA */}
                    <div style={{ paddingTop: '14px', marginTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => handleViewLicenseDetails(matchingLicense?.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#071A31',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Key size={13} />
                        <span>View License Details</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Items Breakdown */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                    Purchased Features
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '12px 16px' }}>
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 0',
                          fontSize: '12.5px',
                          color: '#334155',
                          borderBottom: i === selectedOrder.items.length - 1 ? 'none' : '1px solid #e2e8f0',
                        }}
                      >
                        <span>{item}</span>
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>Included</span>
                      </div>
                    ))}
                  </div>
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
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={14} />
                  <span>Download PDF Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={closeOrderModal}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add License Modal */}
      <AddLicenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
