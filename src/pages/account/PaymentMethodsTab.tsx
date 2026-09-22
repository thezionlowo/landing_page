import React, { useState } from 'react';
import { useCustomerAuth, PaymentMethodItem } from '../../context/CustomerAuthContext';
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  X,
  AlertCircle,
  Check
} from 'lucide-react';

export const PaymentMethodsTab: React.FC = () => {
  const {
    customer,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  } = useCustomerAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Card Form State
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardBrand, setCardBrand] = useState<'Visa' | 'Mastercard' | 'Verve'>('Visa');
  const [expMonth, setExpMonth] = useState('09');
  const [expYear, setExpYear] = useState('28');
  const [cvv, setCvv] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!customer) return null;

  const paymentMethods = customer.paymentMethods || [];

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
    setFeedback({ type: 'success', text: 'Default payment method updated.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      removePaymentMethod(id);
      setFeedback({ type: 'success', text: 'Payment method removed.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);

    // Auto detect brand
    if (val.startsWith('4')) {
      setCardBrand('Visa');
    } else if (val.startsWith('5')) {
      setCardBrand('Mastercard');
    } else if (val.startsWith('506') || val.startsWith('650') || val.startsWith('507')) {
      setCardBrand('Verve');
    }

    // Format with spaces
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
    if (modalError) setModalError(null);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');

    if (cleanNum.length < 16) {
      setModalError('Please enter a valid 16-digit debit or credit card number.');
      return;
    }
    if (!cardholderName.trim()) {
      setModalError('Please enter the name printed on your card.');
      return;
    }
    if (cvv.length < 3) {
      setModalError('Please enter the 3-digit security code (CVV).');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    setTimeout(() => {
      const last4 = cleanNum.slice(-4);
      addPaymentMethod({
        brand: cardBrand,
        last4,
        expMonth,
        expYear,
      });

      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setCardNumber('');
      setCardholderName('');
      setCvv('');
      setFeedback({ type: 'success', text: `New ${cardBrand} card ending in ${last4} added securely.` });
      setTimeout(() => setFeedback(null), 4000);
    }, 450);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '780px' }}>
      {/* Tab Header & Action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#071A31', letterSpacing: '-0.02em', margin: 0 }}>
            Payment Methods
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px', margin: 0 }}>
            Manage and secure debit or credit cards used for your automated ZAMERIA subscription renewal.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
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
            boxShadow: '0 2px 8px rgba(7, 26, 49, 0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0c284d')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#071A31')}
        >
          <Plus size={16} />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
          }}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
          ) : (
            <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{feedback.text}</span>
        </div>
      )}

      {/* Saved Payment Methods List */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
        }}
      >
        {paymentMethods.length === 0 ? (
          /* Empty State */
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#94a3b8',
              }}
            >
              <CreditCard size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#071A31', margin: '0 0 6px' }}>
              No payment methods added
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '400px', margin: '0 auto 20px' }}>
              Add a payment method to make future payments easier and ensure uninterrupted POS syncing service.
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
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Plus size={15} />
              <span>Add Payment Method</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  borderRadius: '14px',
                  border: pm.isDefault ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: pm.isDefault ? '#f8faff' : '#ffffff',
                  transition: 'all 0.15s ease',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: '#071A31',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      boxShadow: '0 2px 6px rgba(7, 26, 49, 0.1)',
                    }}
                  >
                    {pm.brand === 'Visa' ? 'VISA' : pm.brand === 'Mastercard' ? 'MC' : 'VERVE'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#071A31' }}>
                        {pm.brand} ending in {pm.last4}
                      </span>
                      {pm.isDefault && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#2563eb',
                            backgroundColor: '#eff6ff',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #bfdbfe',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <Check size={11} />
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                      Expires {pm.expMonth}/{pm.expYear}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!pm.isDefault && (
                    <button
                      onClick={() => handleSetDefault(pm.id)}
                      style={{
                        padding: '7px 14px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.borderColor = '#94a3b8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      Set as default
                    </button>
                  )}

                  <button
                    onClick={() => handleRemove(pm.id)}
                    title="Remove card"
                    style={{
                      padding: '7px 10px',
                      backgroundColor: 'transparent',
                      border: '1px solid transparent',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ef4444';
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={15} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Assurance Footer */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#64748b',
            fontSize: '12px',
          }}
        >
          <Lock size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
          <span>
            Payments are 256-bit SSL encrypted and PCI-DSS Level 1 compliant. Your complete card number and CVV are never stored in plain text on ZAMERIA servers.
          </span>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 49, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '480px',
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                  Add Payment Method
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            {/* Modal Form */}
            <form onSubmit={handleAddCardSubmit} style={{ padding: '24px' }}>
              {modalError && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#991b1b',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Supported Cards Badge Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                  Supported Cards:
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Visa', 'Mastercard', 'Verve'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setCardBrand(b as any)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: cardBrand === b ? '1px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: cardBrand === b ? '#eff6ff' : '#f8fafc',
                        color: cardBrand === b ? '#2563eb' : '#64748b',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name on card */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zion Lowo"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Card Number */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={handleFormatCardNumber}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      fontSize: '14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      boxSizing: 'border-box',
                      outline: 'none',
                      letterSpacing: '0.04em',
                    }}
                  />
                  <CreditCard
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Expiration Date
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const val = (i + 1).toString().padStart(2, '0');
                        return (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {['26', '27', '28', '29', '30', '31', '32'].map((y) => (
                        <option key={y} value={y}>
                          20{y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>{isSubmitting ? 'Verifying Card...' : 'Save Payment Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
