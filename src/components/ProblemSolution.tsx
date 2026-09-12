import React from 'react';
import { Globe, Store, RefreshCw, ArrowDown, CheckCircle2, AlertTriangle, Zap, ShieldCheck } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  return (
    <section
      id="problem-solution"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Section Header: The Problem */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 52px' }}>
          <div className="eyebrow-badge" style={{ margin: '0 auto 16px' }}>
            <span>THE PROBLEM</span>
          </div>
          <h2 className="section-headline">
            Online and physical sales shouldn't live in separate systems.
          </h2>
          <p className="lead-text center">
            Online orders and physical-store sales are often managed separately. Products get duplicated, inventory becomes difficult to track, and staff use different systems. ZAMERIA brings them together.
          </p>
        </div>

        {/* Visual Transformation Architecture */}
        <div
          style={{
            backgroundColor: 'var(--canvas-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '28px',
            padding: '44px 28px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
          className="problem-solution-card"
        >
          {/* 1. The Disconnected Reality (4 Fragmented Problems) */}
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#ef4444',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                backgroundColor: '#fee2e2',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              WITHOUT ZAMERIA • THE PROBLEM
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px',
            }}
            className="disconnected-grid"
          >
            {/* Problem 1 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Globe size={16} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>
                  Disconnected
                </span>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '4px' }}>
                  Separate Sales
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                  Online orders and physical-store sales are managed separately in silos.
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Store size={16} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>
                  Double Work
                </span>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '4px' }}>
                  Duplicate Products
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                  Products, prices, and changes get duplicated manually across systems.
                </p>
              </div>
            </div>

            {/* Problem 3 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RefreshCw size={16} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>
                  Out of Sync
                </span>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '4px' }}>
                  Untracked Inventory
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                  Inventory becomes difficult to track, leading to overselling and discrepancies.
                </p>
              </div>
            </div>

            {/* Problem 4 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={16} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>
                  Confusion
                </span>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '4px' }}>
                  Different Systems
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                  Staff use different systems and spreadsheets without seeing the same live data.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Transformation Hub */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '32px 0',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                marginBottom: '16px',
              }}
            >
              <ArrowDown size={20} />
            </div>

            {/* ZAMERIA Unified Core Badge */}
            <div
              style={{
                backgroundColor: 'var(--brand-navy)',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '12px 28px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 12px 32px -4px rgba(7, 26, 49, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <img
                src="/zameria-logo-footer.png"
                alt="ZAMERIA"
                style={{ height: '22px', width: 'auto', display: 'block' }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(96, 165, 250, 0.2)',
                  color: '#60a5fa',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                }}
              >
                UNIFIED REAL-TIME BRAIN
              </span>
            </div>
          </div>

          {/* 2. The Connected Outcome */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #86efac',
              borderRadius: '20px',
              padding: '32px 28px',
              boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.12)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#16a34a',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '12px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>THE ZAMERIA WAY • ONE CONNECTED SYSTEM</span>
            </div>

            <h3
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--brand-navy)',
                letterSpacing: '-0.025em',
                marginBottom: '10px',
              }}
            >
              One business. One system.
            </h3>

            <p
              style={{
                fontSize: '15.5px',
                color: 'var(--text-body)',
                maxWidth: '680px',
                margin: '0 auto 24px',
                lineHeight: 1.6,
              }}
            >
              Sell online or in person while keeping your products, inventory and orders connected in real time.
            </p>

            {/* Verified Feature Highlights */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--brand-navy)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#16a34a" />
                <span>Instant WooCommerce Stock Sync</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#16a34a" />
                <span>Unified Order &amp; Customer Flow</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#16a34a" />
                <span>Fast Counter POS &amp; Split Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .disconnected-grid {
            grid-template-columns: 1fr !important;
          }
          .problem-solution-card {
            padding: 32px 18px !important;
          }
        }
      `}</style>
    </section>
  );
};
