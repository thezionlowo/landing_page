import React, { useState } from 'react';
import { resolveSubscriptionState, useCustomerAuth } from '../../context/CustomerAuthContext';
import {
  Monitor,
  Printer,
  Barcode,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  Zap,
  Tablet,
  Laptop,
} from 'lucide-react';

export const DevicesTab: React.FC = () => {
  const { customer } = useCustomerAuth();
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!customer) return null;

  const subscriptionState = resolveSubscriptionState(customer);
  const primaryLicense = customer.licenses?.[0] || null;

  const storeUrl = customer.connectedStore?.url
    ? customer.connectedStore.url
    : (primaryLicense?.connectedDomain ? `https://${primaryLicense.connectedDomain}` : '');

  const posUrl = storeUrl
    ? `${storeUrl.replace(/\/$/, '')}/pos/`
    : 'http://localhost:8899/pos/';

  const rawPlanStr = String(
    customer.giftedDetails?.plan || primaryLicense?.plan || customer.plan || customer.subscription?.planId || ''
  ).toLowerCase();
  const isStarter =
    rawPlanStr.includes('starter') ||
    (!rawPlanStr.includes('business') && Boolean(customer.giftedDetails?.plan?.toLowerCase().includes('starter')));
  const isBusiness = rawPlanStr.includes('business') && !isStarter;

  const registersAllowed = isBusiness ? 'Unlimited Registers' : 'Up to 2 Registers';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(posUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. TAB HEADER */}
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
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#071A31',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}
          >
            Registers &amp; Hardware
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Manage POS terminal access, cash registers, receipt printers, and barcode scanners.
          </p>
        </div>

        <a
          href={posUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            backgroundColor: '#071A31',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(7, 26, 49, 0.15)',
          }}
        >
          <Monitor size={15} style={{ color: '#60a5fa' }} />
          <span>Launch POS Register</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* 2. WEB POS TERMINAL LAUNCHER CARD */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
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
                marginBottom: '8px',
              }}
            >
              <CheckCircle2 size={12} />
              <span>Web POS Terminal Ready</span>
            </span>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#071A31', margin: '0 0 4px' }}>
              Web POS Terminal
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
              Open this terminal on your checkout PC, iPad, or Android tablet to start ringing up sales.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Plan Register Allowance</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#071A31' }}>{registersAllowed}</div>
          </div>
        </div>

        {/* URL Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '14px 18px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Monitor size={16} style={{ color: '#64748b' }} />
            <span style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 700, color: '#071A31' }}>
              {posUrl}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyUrl}
              style={{
                padding: '7px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#071A31',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {copiedUrl ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
              <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={posUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '7px 14px',
                backgroundColor: '#071A31',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Open in New Tab</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* 3. HARDWARE COMPATIBILITY & PERIPHERALS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Barcode Scanners */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Barcode size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Barcode Scanners
              </h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>● Plug &amp; Play Supported</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Works with any USB HID or Bluetooth 1D/2D barcode scanner (Honeywell, Zebra, Netum, Eyoyo). Simply plug in and scan product barcodes into the register.
          </p>
        </div>

        {/* Receipt Printers */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Printer size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Receipt Printers &amp; Drawers
              </h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>● Standard ESC/POS</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Supports 80mm and 58mm thermal receipt printers (Epson, Star Micronics, Xprinter, Rongta). Cash drawers open automatically via standard RJ11 printer pulse.
          </p>
        </div>

        {/* Devices */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                color: '#071A31',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tablet size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Device Flexibility
              </h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>● iPad, Tablet, PC &amp; Mac</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Run ZAMERIA on desktop computers, touchscreen all-in-one POS terminals, Apple iPads, or Android tablets without installing heavy software.
          </p>
        </div>

        {/* Offline Engine */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HardDrive size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>
                Offline Resilience
              </h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>● IndexedDB Cache Enabled</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            If the internet disconnects during busy retail rush hours, cashiers can continue ringing up sales and printing receipts. Transactions sync automatically upon reconnection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevicesTab;
