import React from 'react';
import { Globe, Store, ClipboardList } from 'lucide-react';

export const PainPoint: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div className="container" style={{ maxWidth: '960px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: 'var(--brand-navy)',
            letterSpacing: '-0.03em',
            marginBottom: '40px',
          }}
        >
          Still managing online and physical sales separately?
        </h2>

        {/* 3 Simple Pain Points */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          <div
            style={{
              padding: '28px 24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #fee2e2',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Globe size={18} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ONLINE STORE
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginTop: '4px' }}>
              Sales live in one place
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '6px' }}>
              Web customers place orders that cashiers on the sales floor don't see.
            </p>
          </div>

          <div
            style={{
              padding: '28px 24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #fee2e2',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Store size={18} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PHYSICAL STORE
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginTop: '4px' }}>
              Sales live in another place
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '6px' }}>
              In-person payments happen on a separate machine without touching your online records.
            </p>
          </div>

          <div
            style={{
              padding: '28px 24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #fee2e2',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <ClipboardList size={18} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              INVENTORY
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginTop: '4px' }}>
              Manually checked &amp; adjusted
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '6px' }}>
              Staff spend hours updating spreadsheets, or worse — overselling items that are out of stock.
            </p>
          </div>
        </div>

        {/* The Immediate Resolution: Clean statement, NO CTA */}
        <p
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--brand-navy)',
          }}
        >
          ZAMERIA brings them together.
        </p>
      </div>
    </section>
  );
};
