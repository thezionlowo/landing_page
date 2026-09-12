import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ROUTES } from '../lib/routes';

export const PricingSection: React.FC = () => {
  const [businessCycle, setBusinessCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <section
      id="pricing"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <div className="eyebrow-badge purple" style={{ margin: '0 auto 16px' }}>
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="section-headline">
            Start free. Grow when you're ready.
          </h2>
          <p className="lead-text center">
            Full access to every core feature with a 7-day free trial on all plans.
          </p>
        </div>

        {/* 3 Pricing Cards Grid: STARTER / BUSINESS / BUSINESS PLUS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            alignItems: 'stretch',
            marginBottom: '36px',
          }}
          className="pricing-three-grid"
        >
          {/* Card 1: STARTER */}
          <div
            className="glass-card"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(7, 26, 49, 0.04)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--text-dim)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '6px',
                }}
              >
                STARTER
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                For new retailers setting up their first POS and store sync.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--brand-navy)', lineHeight: 1 }}>
                  7 Days Free
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Then ₦0 for evaluation • No credit card
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '28px',
                }}
              >
                {[
                  '1 store',
                  '500 products',
                  '2 staff/cashiers',
                  'Point of Sale',
                  'Inventory synchronization',
                  'WooCommerce integration',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={ROUTES.trial}
              className="btn btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Card 2: BUSINESS (Featured with In-Card Monthly/Annual Switch) */}
          <div
            style={{
              backgroundColor: 'var(--brand-navy)',
              color: '#ffffff',
              border: '1px solid #1a4275',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 24px 48px -10px rgba(7, 26, 49, 0.35)',
              position: 'relative',
            }}
          >
            {/* Most Popular Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                backgroundColor: '#60a5fa',
                color: '#071A31',
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '3px 12px',
                borderRadius: '9999px',
              }}
            >
              MOST POPULAR
            </div>

            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#93c5fd',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '6px',
                }}
              >
                BUSINESS
              </div>

              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
                For growing stores connecting online orders and high-volume POS sales.
              </p>

              {/* In-Card Billing Toggle (Monthly / Annual) */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '3px',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBusinessCycle('monthly')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '7px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: businessCycle === 'monthly' ? '#ffffff' : 'transparent',
                    color: businessCycle === 'monthly' ? '#071A31' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBusinessCycle('yearly')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '7px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: businessCycle === 'yearly' ? '#60a5fa' : 'transparent',
                    color: businessCycle === 'yearly' ? '#071A31' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Yearly</span>
                  <span style={{ fontSize: '10px', fontWeight: 900, color: businessCycle === 'yearly' ? '#040e1b' : '#34d399' }}>
                    -₦60k
                  </span>
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                  {businessCycle === 'yearly' ? '₦25,000' : '₦30,000'}
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}> / month</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#93c5fd', marginTop: '6px' }}>
                  {businessCycle === 'yearly'
                    ? 'Billed ₦300,000 yearly (Save ₦60,000)'
                    : 'Billed ₦30,000 monthly • Cancel anytime'}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #153258',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '28px',
                }}
              >
                {[
                  '1 store',
                  'Unlimited products',
                  '5 staff/cashiers',
                  'Point of Sale',
                  'Real-time inventory synchronization',
                  'WooCommerce integration',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#ffffff' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(96, 165, 250, 0.2)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={ROUTES.businessTrial}
              className="btn btn-hero-gradient"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Card 3: BUSINESS PLUS */}
          <div
            className="glass-card"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(7, 26, 49, 0.04)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  BUSINESS PLUS
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#475569',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  Coming soon
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                For multi-store retailers needing unlimited scale and staff control.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--brand-navy)', lineHeight: 1 }}>
                  ₦50,000
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}> / month</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Full multi-store capability • Coming soon
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '28px',
                }}
              >
                {[
                  'Multiple stores',
                  'Unlimited products',
                  'Unlimited staff',
                  'Point of Sale',
                  'Multi-store inventory synchronization',
                  'Priority support',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '13px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: '#f1f5f9',
                color: '#94a3b8',
                border: '1px solid #e2e8f0',
                cursor: 'not-allowed',
                userSelect: 'none',
              }}
            >
              <span>Coming Soon</span>
            </button>
          </div>
        </div>

        {/* Reassurance Message Under Pricing */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: '620px',
            margin: '0 auto',
          }}
        >
          If ZAMERIA isn't right for your business, simply don't continue. No pressure. Pay only when you're ready.
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .pricing-three-grid {
            grid-template-columns: 1fr !important;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
};
