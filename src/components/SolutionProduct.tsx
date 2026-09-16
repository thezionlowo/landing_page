import React from 'react';
import { ShoppingBag, Globe, Store, RefreshCw } from 'lucide-react';

export const SolutionProduct: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      <div className="container" style={{ maxWidth: '1060px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px' }}>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 800,
              color: 'var(--brand-navy)',
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            One business. One system.
          </h2>
          <p className="lead-text center" style={{ maxWidth: '620px' }}>
            Sell online or in person. ZAMERIA keeps your products, inventory and orders connected.
          </p>
        </div>

        {/* Visual Formula: POS + Online Store + Inventory + Orders -> ZAMERIA */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            padding: '36px',
          }}
        >
          {/* Top Formula Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '28px',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '28px',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
              <Store size={16} />
              <span>Physical POS</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>+</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
              <Globe size={16} />
              <span>Online Store</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>+</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
              <RefreshCw size={15} />
              <span>Shared Inventory</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>+</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
              <ShoppingBag size={15} />
              <span>Unified Orders</span>
            </div>
            <span style={{ color: 'var(--brand-navy)' }}>→</span>
            <span
              style={{
                backgroundColor: 'var(--brand-navy)',
                color: '#ffffff',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
              }}
            >
              ZAMERIA
            </span>
          </div>

          {/* Unified Product UI Showcase — NO CTA, Product Does the Selling */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '24px',
            }}
            className="solution-grid"
          >
            {/* Real Orders & Inventory Feed */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  CONNECTED SALES FEED
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>🟢 Instant 2-way sync</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#1e40af', padding: '2px 6px', borderRadius: '4px' }}>
                      WooCommerce Order #1042
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', marginTop: '4px' }}>
                      Adunni Okafor • 2x Bluetooth Earbuds
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)' }}>₦300,000/year</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#f5f3ff', color: '#6d28d9', padding: '2px 6px', borderRadius: '4px' }}>
                      Store Register Sale #1043
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', marginTop: '4px' }}>
                      Walk-in Customer • 1x Kings Oil 5L
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)' }}>₦8,500</span>
                </div>
              </div>
            </div>

            {/* Inventory Real-Time Sync Outcome */}
            <div
              style={{
                backgroundColor: 'var(--brand-navy)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                THE OUTCOME
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.3, marginBottom: '10px' }}>
                Zero overselling. Zero stock mismatches.
              </h4>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                When someone buys at your physical counter, online stock drops automatically. No spreadsheets, no manual tallies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solution-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
