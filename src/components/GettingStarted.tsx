import React from 'react';
import { Link2, ShoppingBag, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react';
import { ROUTES } from '../lib/routes';

export const GettingStarted: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'CONNECT YOUR STORE',
      desc: 'Connect WooCommerce in just a couple of clicks.',
      icon: Link2,
      accent: '#2563eb',
      bg: '#eff6ff',
    },
    {
      num: '02',
      title: 'MANAGE YOUR BUSINESS',
      desc: 'Use ZAMERIA POS to manage products, orders, inventory and physical sales.',
      icon: ShoppingBag,
      accent: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      num: '03',
      title: 'STAY IN SYNC',
      desc: 'Online and offline sales update the same business data automatically.',
      icon: RefreshCw,
      accent: '#16a34a',
      bg: '#f0fdf4',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 52px' }}>
          <div className="eyebrow-badge purple" style={{ margin: '0 auto 16px' }}>
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="section-headline">
            How ZAMERIA Works
          </h2>
          <p className="lead-text center">
            A simple, practical 3-step process to bring your store and online sales together.
          </p>
        </div>

        {/* 3 Step Milestone Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '40px',
          }}
          className="get-started-grid"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
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
                  position: 'relative',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: step.bg,
                        color: step.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '15px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: step.accent,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--brand-navy)',
                      letterSpacing: '0.04em',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14.5px',
                      color: 'var(--text-body)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Trial Reassurance Banner */}
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '12px 28px',
            maxWidth: '620px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <ShieldCheck size={18} color="#16a34a" />
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--brand-navy)' }}>
            Start your 7-day free trial. No pressure, no commitment.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .get-started-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  );
};
