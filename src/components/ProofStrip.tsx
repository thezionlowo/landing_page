import React from 'react';
import { ShieldCheck, Zap, RefreshCw, Layers } from 'lucide-react';

export const ProofStrip: React.FC = () => {
  const metrics = [
    {
      value: '₦500M+',
      label: 'Retail GMV Processed',
      desc: 'Across physical counters and online stores',
      icon: Layers,
    },
    {
      value: '< 0.5s',
      label: 'Counter Checkout Speed',
      desc: 'Rapid barcode scan & split tender',
      icon: Zap,
    },
    {
      value: '100%',
      label: '2-Way WooCommerce Sync',
      desc: 'Stock decreases everywhere automatically',
      icon: RefreshCw,
    },
    {
      value: '99.98%',
      label: 'Till Uptime Reliability',
      desc: 'Offline-ready when internet dips',
      icon: ShieldCheck,
    },
  ];

  return (
    <div
      style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        padding: '36px 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
          className="proof-grid"
        >
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '8px 4px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: 'var(--brand-navy)',
                      letterSpacing: '-0.03em',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.1,
                      marginBottom: '4px',
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--brand-navy)',
                      marginBottom: '2px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .proof-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 520px) {
          .proof-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};
