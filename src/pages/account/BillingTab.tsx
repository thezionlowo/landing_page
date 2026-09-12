import React, { useState } from 'react';
import { useCustomerAuth, OrderItem } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import {
  CreditCard,
  Receipt,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  X,
  Printer,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const BillingTab: React.FC = () => {
  const { customer, updateBillingAddress, addPaymentMethod } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [selectedInvoice, setSelectedInvoice] = useState<OrderItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrForm, setAddrForm] = useState({
    firstName: customer?.billingAddress?.firstName || customer?.fullName?.split(' ')[0] || '',
    lastName: customer?.billingAddress?.lastName || customer?.fullName?.split(' ').slice(1).join(' ') || '',
    company: customer?.businessName || '',
    address: customer?.billingAddress?.address || '14 Admiralty Way, Lekki Phase 1',
    city: customer?.billingAddress?.city || 'Lagos',
    state: customer?.billingAddress?.state || 'Lagos State',
    country: 'Nigeria',
    phone: customer?.billingAddress?.phone || '08122342436',
  });

  // Payment Method Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardholderName, setCardholderName] = useState(customer?.fullName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardSuccess, setCardSuccess] = useState(false);

  if (!customer) return null;

  const isTrial = customer.accountStatus === 'trial_active' || customer.plan === 'Starter';
  const isCancelled = customer.accountStatus === 'cancelled';

  const handleDownloadInvoice = (order: OrderItem) => {
    setDownloadSuccess(order.invoiceNumber);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  const billingItems = customer.orders || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Tab Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#071A31', letterSpacing: '-0.02em', margin: 0 }}>
          Billing & Invoices
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px', margin: 0 }}>
          Manage your subscription cycle, view previous payments, and download official ZAMERIA tax invoices.
        </p>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#166534' }}>
              Invoice {downloadSuccess} downloaded successfully.
            </span>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#166534',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section 1: Current Subscription Overview */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingBottom: '20px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: isCancelled
                    ? '#fef2f2'
                    : isTrial
                    ? '#eff6ff'
                    : '#f0fdf4',
                  color: isCancelled
                    ? '#b91c1c'
                    : isTrial
                    ? '#2563eb'
                    : '#16a34a',
                }}
              >
                {isCancelled ? 'Cancelled' : isTrial ? '7-Day Free Trial' : 'Active Subscription'}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                Billed {customer.billingCycle === 'yearly' ? 'Annually (Save 17%)' : 'Monthly'}
              </span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#071A31', margin: 0 }}>
              {customer.plan} Plan
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setAccountTab('plan')}
              style={{
                padding: '10px 18px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0c284d')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#071A31')}
            >
              <span>{isTrial ? 'Choose a Plan' : 'Manage Plan'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Subscription Key Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '22px',
          }}
        >
          {/* Price */}
          <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              Recurring Price
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#071A31' }}>
              {customer.planPrice}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              VAT & sync infrastructure included
            </div>
          </div>

          {/* Billing Cycle */}
          <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              Billing Cycle
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#071A31', textTransform: 'capitalize' }}>
              {customer.billingCycle}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Automatic renewal unless cancelled
            </div>
          </div>

          {/* Renewal / Expiry Date */}
          <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              {isTrial ? 'Trial Expiration Date' : 'Renewal Date'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: isTrial ? '#2563eb' : '#071A31' }}>
              {customer.nextBillingDate || customer.trialEndsAt}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              {isTrial ? `${customer.trialDaysRemaining} days remaining in trial` : 'Next scheduled billing date'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Billing Information & Payment Method Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Billing Information Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Billing Information
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit Details
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Name</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#071A31', marginTop: '2px' }}>
                  {customer.billingAddress?.firstName || customer.fullName} {customer.billingAddress?.lastName || ''}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontSize: '14px', color: '#071A31', marginTop: '2px' }}>
                  {customer.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Billing Address</div>
                <div style={{ fontSize: '13.5px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                  {customer.billingAddress?.address
                    ? `${customer.billingAddress.address}, ${customer.billingAddress.city}, ${customer.billingAddress.state}, ${customer.billingAddress.country}`
                    : 'Lekki Phase 1, Lagos, Nigeria'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8' }}>
            Tax invoices are generated using this entity name &amp; address.
          </div>
        </div>

        {/* Payment Method Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Payment Method
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: customer.paymentMethods.length > 0 ? '#f0fdf4' : '#f1f5f9',
                  color: customer.paymentMethods.length > 0 ? '#16a34a' : '#64748b',
                }}
              >
                {customer.paymentMethods.length > 0 ? 'Active Card' : 'None on File'}
              </span>
            </div>

            {customer.paymentMethods.length > 0 ? (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CreditCard size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#071A31' }}>
                    {customer.paymentMethods[0].brand} ending in {customer.paymentMethods[0].last4}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Expires {customer.paymentMethods[0].expMonth}/{customer.paymentMethods[0].expYear}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <CreditCard size={24} style={{ color: '#94a3b8', margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31' }}>
                  No payment method required during trial
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Add a payment method whenever you're ready to subscribe to a paid plan.
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              style={{
                width: '100%',
                padding: '11px 16px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <CreditCard size={15} />
              <span>Update Payment Method</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Billing History Ledger */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '24px 28px 18px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
              Billing History
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', margin: 0 }}>
              Review past charges, download tax receipts, and audit subscription invoices.
            </p>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: '6px',
            }}
          >
            {billingItems.length} {billingItems.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {billingItems.length === 0 ? (
          /* Empty State */
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: '#94a3b8',
              }}
            >
              <Receipt size={30} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#071A31', margin: '0 0 6px' }}>
              No billing history yet
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 0 16px' }}>
              Your ZAMERIA subscription payments and invoices will automatically appear here once processed.
            </p>
            <button
              onClick={() => setAccountTab('plan')}
              style={{
                padding: '9px 18px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Available Plans
            </button>
          </div>
        ) : (
          /* Billing Ledger Table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Date
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Description
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Amount
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Status
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingItems.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Date */}
                    <td style={{ padding: '18px 24px', fontSize: '13px', fontWeight: 600, color: '#071A31' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} style={{ color: '#94a3b8' }} />
                        <span>{item.date}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31' }}>
                        {item.plan}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Order {item.orderNumber} • {item.paymentMethod}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: 700, color: '#071A31' }}>
                      {item.total}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '18px 20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor:
                            item.status === 'Completed'
                              ? '#f0fdf4'
                              : item.status === 'Processing'
                              ? '#eff6ff'
                              : '#fef3c7',
                          color:
                            item.status === 'Completed'
                              ? '#16a34a'
                              : item.status === 'Processing'
                              ? '#2563eb'
                              : '#d97706',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        {item.status}
                      </span>
                    </td>

                    {/* Invoice Actions */}
                    <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedInvoice(item)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f1f5f9',
                            color: '#071A31',
                            border: '1px solid #e2e8f0',
                            borderRadius: '7px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                        >
                          <FileText size={13} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(item)}
                          title="Download PDF invoice"
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#ffffff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            borderRadius: '7px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                        >
                          <Download size={13} />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
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
                <img
                  src="/zameria-logo.png"
                  alt="ZAMERIA"
                  style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
                />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                    Tax Invoice {selectedInvoice.invoiceNumber}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    ZAMERIA Technologies Ltd • Lagos, Nigeria
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Billed To
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31', marginTop: '4px' }}>
                    {selectedInvoice.billingName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedInvoice.billingEmail}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Payment Details
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#071A31', marginTop: '4px' }}>
                    {selectedInvoice.paymentMethod}
                  </div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                    Paid on {selectedInvoice.date}
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                  Subscription Inclusions
                </div>
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 16px' }}>
                  {selectedInvoice.items.map((itemText, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: idx === selectedInvoice.items.length - 1 ? 'none' : '1px solid #e2e8f0',
                        fontSize: '12px',
                        color: '#334155',
                      }}
                    >
                      <span>{itemText}</span>
                      <span style={{ fontWeight: 600, color: '#071A31' }}>Included</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Paid (NGN)</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>All statutory taxes inclusive</div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#071A31' }}>
                  {selectedInvoice.total}
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
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadInvoice(selectedInvoice);
                  setSelectedInvoice(null);
                }}
                style={{
                  padding: '9px 18px',
                  backgroundColor: '#071A31',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download size={14} />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Edit Modal */}
      {isAddressModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Update Billing Information
              </h4>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBillingAddress(addrForm);
                setIsAddressModalOpen(false);
              }}
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={addrForm.firstName}
                    onChange={(e) => setAddrForm({ ...addrForm, firstName: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={addrForm.lastName}
                    onChange={(e) => setAddrForm({ ...addrForm, lastName: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={addrForm.address}
                  onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  style={{ padding: '9px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', backgroundColor: '#071A31', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {isPaymentModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsPaymentModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Update Payment Method
              </h4>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '8844';
                addPaymentMethod({
                  brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
                  last4: last4,
                  expMonth: cardExpiry.split('/')[0] || '12',
                  expYear: cardExpiry.split('/')[1] || '2028',
                });
                setCardSuccess(true);
                setTimeout(() => {
                  setCardSuccess(false);
                  setIsPaymentModalOpen(false);
                }, 1200);
              }}
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {cardSuccess && (
                <div style={{ padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '13px', fontWeight: 600 }}>
                  Payment method updated successfully!
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Amara Okafor"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="5399 •••• •••• 4242"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31', marginBottom: '4px' }}>
                    CVC
                  </label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="•••"
                    required
                    maxLength={4}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  style={{ padding: '9px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', backgroundColor: '#071A31', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Update Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
