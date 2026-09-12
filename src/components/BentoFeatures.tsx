import React from 'react';
import {
  ScanBarcode,
  RefreshCw,
  ShoppingBag,
  WifiOff,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Globe,
  Store,
  CreditCard,
  Banknote,
  Receipt,
  UserCheck,
} from 'lucide-react';

export const BentoFeatures: React.FC = () => {
  return (
    <section
      id="platform"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <div className="eyebrow-badge purple" style={{ margin: '0 auto 16px' }}>
            <span>✦ THE ZAMERIA ENGINE</span>
          </div>
          <h2 className="section-headline">
            Built from the ground up for modern retail.
          </h2>
          <p className="lead-text center">
            Explore the real software features powering counter checkouts and WooCommerce synchronization every day.
          </p>
        </div>

        {/* Bento Grid Architecture */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
          }}
          className="bento-grid"
        >
          {/* Bento Item 1: Counter POS Speed (Spans 7 columns) */}
          <div
            className="glass-card"
            style={{
              gridColumn: 'span 7',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: '#4f46e5',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '16px',
                }}
              >
                <Zap size={13} />
                <span>COUNTER VELOCITY</span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                Instant Barcode Scanning &amp; Split Tender
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.55, maxWidth: '520px', marginBottom: '24px' }}>
                Ring up products in milliseconds. Accept split payments across Bank Transfer, POS Card swipe, and Cash on a single bill with one-click thermal receipts.
              </p>
            </div>

            {/* Realistic Software Snippet: Split Payment Modal */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  Active Transaction • Lagos Skincare Lab
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
                  Total: ₦36,000
                </span>
              </div>

              {/* Split Tender Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <CreditCard size={16} color="#2563eb" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>POS Card</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)' }}>₦20,000</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <ArrowUpRight size={16} color="#7c3aed" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bank Transfer</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)' }}>₦16,000</div>
                </div>

                <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <Receipt size={16} color="#16a34a" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Receipt</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>Printed ✓</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Real-time WooCommerce Sync (Spans 5 columns) */}
          <div
            className="glass-card"
            style={{
              gridColumn: 'span 5',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  color: '#16a34a',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '16px',
                }}
              >
                <RefreshCw size={13} />
                <span>2-WAY LIVE LOOP</span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                Zero-Lag Inventory Sync
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '24px' }}>
                Every sale rings down WooCommerce website inventory immediately. Never oversell limited stock items again.
              </p>
            </div>

            {/* Micro Stock Sync Visual */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src="/products/vitaminc.jpg" alt="Vitamin C Serum" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>Vitamin C Serum</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SKU: VTC-01</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)' }}>41 left</div>
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Synced &lt; 0.4s ago</div>
                </div>
              </div>

              <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', backgroundColor: '#10b981' }} />
              </div>
            </div>
          </div>

          {/* Bento Item 3: Unified Orders Engine (Spans 6 columns) */}
          <div
            className="glass-card"
            style={{
              gridColumn: 'span 6',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  color: '#2563eb',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '16px',
                }}
              >
                <ShoppingBag size={13} />
                <span>UNIFIED ORDERS FEED</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                Web &amp; In-Store Sales in One Stream
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '20px' }}>
                Track online WordPress orders alongside counter till sales in real time with synchronized customer profiles.
              </p>
            </div>

            {/* Order Snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={14} color="#2563eb" />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>#4821 • Web Order</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>Amara Okafor</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>₦36,000</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: '4px' }}>Processing</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={14} color="#7c3aed" />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>#4820 • Counter Till</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>Walk-in Client</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>₦18,500</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Offline Resilience (Spans 6 columns) */}
          <div
            className="glass-card"
            style={{
              gridColumn: 'span 6',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(217, 119, 6, 0.08)',
                  color: '#d97706',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '16px',
                }}
              >
                <WifiOff size={13} />
                <span>OFFLINE CONTINUITY</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                Sell Without Internet Disruptions
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '20px' }}>
                When your store's connection flickers, ZAMERIA doesn't stop. Ring up sales locally and auto-upload when you reconnect.
              </p>
            </div>

            {/* Offline Alert Box */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ fontSize: '12.5px', color: '#92400e', lineHeight: 1.45 }}>
                <strong>Local Queue Active:</strong> Sales are safely stored offline on this terminal and will sync to WooCommerce automatically.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
};
