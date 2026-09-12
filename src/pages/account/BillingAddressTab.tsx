import React, { useState } from 'react';
import { useCustomerAuth, BillingAddress } from '../../context/CustomerAuthContext';
import { Building2, MapPin, Phone, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const BillingAddressTab: React.FC = () => {
  const { customer, updateBillingAddress } = useCustomerAuth();

  const [formData, setFormData] = useState<BillingAddress>(() => {
    if (customer?.billingAddress) {
      return customer.billingAddress;
    }
    return {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      city: '',
      state: '',
      country: 'Nigeria',
      phone: '',
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!customer) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please enter both first and last name.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your billing street address.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      setErrorMessage('Please enter your city and state.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter a contact phone number for invoice receipts.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    // Simulate short network latency
    setTimeout(() => {
      updateBillingAddress(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>
      {/* Tab Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#071A31', letterSpacing: '-0.02em', margin: 0 }}>
          Billing Address
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px', margin: 0 }}>
          This address will appear on your official ZAMERIA subscription receipts and tax invoices.
        </p>
      </div>

      {/* Success Banner */}
      {saveSuccess && (
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
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>
            Billing address successfully updated!
          </span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#991b1b',
          }}
        >
          <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{errorMessage}</span>
        </div>
      )}

      {/* Main Billing Form Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 4px 20px -4px rgba(7, 26, 49, 0.04)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                First Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Zion"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                Last Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Lowo"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          {/* Company / Business Name */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Company / Business Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Lagos Skincare Lab Ltd"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
              <Building2
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0' }}>
              Used on the invoice header for corporate business accounting
            </p>
          </div>

          {/* Street Address */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Street Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Plot 14B Admiralty Way, Lekki Phase 1"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
              <MapPin
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
            </div>
          </div>

          {/* City, State Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                City <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lagos"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                State / Region <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Lagos State"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          {/* Country and Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                Country <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#071A31',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 802 345 6789"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    fontSize: '14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: '#071A31',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Phone
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '12px 28px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(7, 26, 49, 0.15)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSaving) e.currentTarget.style.backgroundColor = '#0c284d';
              }}
              onMouseLeave={(e) => {
                if (!isSaving) e.currentTarget.style.backgroundColor = '#071A31';
              }}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
