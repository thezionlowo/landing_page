import React from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { ROUTES } from '../../lib/routes';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const TeamTab: React.FC = () => {
  const { customer } = useCustomerAuth();

  if (!customer) return null;

  const primaryLicense = customer.licenses?.[0] || null;
  const storeUrl = customer.connectedStore?.url
    ? customer.connectedStore.url
    : (primaryLicense?.connectedDomain ? `https://${primaryLicense.connectedDomain}` : '');

  const wpUsersUrl = storeUrl
    ? `${storeUrl.replace(/\/$/, '')}/wp-admin/users.php`
    : ROUTES.pluginDashboard;

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
            Team &amp; Cashiers
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Manage staff roles, cashier logins, and till access for your retail team.
          </p>
        </div>

        <a
          href={wpUsersUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 18px',
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
          <Users size={15} />
          <span>Manage Staff in WordPress</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* 2. ZERO PER-SEAT FEES CALLOUT */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Sparkles size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#166534', margin: '0 0 2px' }}>
            No Per-Seat Pricing · Unlimited Cashiers Included
          </h3>
          <p style={{ fontSize: '13px', color: '#15803d', margin: 0, lineHeight: 1.45 }}>
            ZAMERIA does not charge you extra for each cashier or employee. Every staff member with an account in your store can ring up sales with their own username and PIN.
          </p>
        </div>
      </div>

      {/* 3. ROLES AND PERMISSIONS TABLE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 10px rgba(7, 26, 49, 0.03)',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#071A31', margin: '0 0 16px' }}>
          POS Access Roles &amp; Capabilities
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Cashier */}
          <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={16} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>Cashier</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Quick till login with PIN or password. Can barcode-scan items, select variations, accept multiple payment tenders, and print receipts.
            </p>
          </div>

          {/* Shop Manager */}
          <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={16} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>Shop Manager</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Full checkout capabilities plus inventory stock adjustments, shift closing reports, opening cash floats, and discount application.
            </p>
          </div>

          {/* Store Administrator */}
          <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={16} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#071A31', margin: 0 }}>Administrator</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Unrestricted access to POS registers, refund authorization, staff creation, connection settings, and real-time sales telemetry.
            </p>
          </div>
        </div>

        {/* How to add staff */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#071A31', margin: '0 0 6px' }}>
            How to add a new cashier:
          </h4>
          <ol style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0, paddingLeft: '20px' }}>
            <li>Go to your WordPress Admin → <strong>Users → Add New</strong>.</li>
            <li>Enter the cashier's name, email, and password.</li>
            <li>Set their Role to <strong>Cashier</strong>, <strong>Shop Manager</strong>, or <strong>Administrator</strong>.</li>
            <li>They can immediately sign into ZAMERIA POS using their credentials!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TeamTab;
