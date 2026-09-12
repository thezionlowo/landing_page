import React from 'react';
import { UserPlus, Link2, ShoppingBag, Store, RefreshCw, LayoutGrid, Users, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'START YOUR FREE TRIAL',
      desc: 'Create your account and start your 7-day free trial.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'CONNECT YOUR STORE',
      desc: 'Connect your online store and set up your ZAMERIA POS.',
      icon: Link2,
    },
    {
      num: '03',
      title: 'START SELLING',
      desc: 'Sell online or in person while keeping your products, inventory and orders connected.',
      icon: ShoppingBag,
    },
  ];

  const benefits = [
    {
      tag: 'Web + Physical POS',
      title: 'SELL EVERYWHERE',
      desc: 'Sell online and in person from one connected system.',
      icon: Store,
      accentBg: '#eff6ff',
      accentColor: '#2563eb',
      badgeBg: 'rgba(37, 99, 235, 0.08)',
      badgeColor: '#1d4ed8',
    },
    {
      tag: 'Real-time Stock Updates',
      title: 'KEEP INVENTORY IN SYNC',
      desc: 'Keep your stock updated across your sales channels.',
      icon: RefreshCw,
      accentBg: '#f0fdf4',
      accentColor: '#16a34a',
      badgeBg: 'rgba(22, 163, 74, 0.08)',
      badgeColor: '#15803d',
    },
    {
      tag: 'Unified Control',
      title: 'MANAGE FROM ONE PLACE',
      desc: 'Products, orders and customers stay connected.',
      icon: LayoutGrid,
      accentBg: '#eef2ff',
      accentColor: '#4f46e5',
      badgeBg: 'rgba(79, 70, 229, 0.08)',
      badgeColor: '#4338ca',
    },
    {
      tag: 'Cashier PINs & Access',
      title: 'KEEP YOUR TEAM MOVING',
      desc: 'Give staff access while keeping control of your business.',
      icon: Users,
      accentBg: '#fffbeb',
      accentColor: '#d97706',
      badgeBg: 'rgba(217, 119, 6, 0.08)',
      badgeColor: '#b45309',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* 1. Get Started Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <div className="eyebrow-badge" style={{ margin: '0 auto 16px' }}>
            <span>GET STARTED WITH ZAMERIA</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 800,
              color: 'var(--brand-navy)',
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Getting Started Is Easy
          </h2>
          <p className="lead-text center">
            It takes less than 2 minutes. No technical experience required.
          </p>
        </div>

        {/* 2. Three Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
          className="get-started-steps-grid"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #dbeafe',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: '#2563eb',
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
                    letterSpacing: '0.02em',
                    marginBottom: '8px',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-body)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3. Free Trial Reassurance Callout */}
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            padding: '12px 24px',
            maxWidth: '620px',
            margin: '0 auto 64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <ShieldCheck size={16} color="#16a34a" />
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--brand-navy)' }}>
            Start your 7-day free trial. No pressure, no commitment.
          </span>
        </div>

        {/* 4. Stress-Free Management Continuation Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
          <h3
            style={{
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontWeight: 800,
              color: 'var(--brand-navy)',
              letterSpacing: '-0.025em',
              marginBottom: '10px',
            }}
          >
            Stress-Free Management
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
            Run your store with confidence while ZAMERIA keeps your sales, inventory, and team aligned.
          </p>
        </div>

        {/* 5. Editorial 2x2 Benefits Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
          className="stress-free-grid"
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 26px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                }}
                className="benefit-card"
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: b.accentBg,
                        color: b.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: b.badgeBg,
                        color: b.badgeColor,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {b.tag}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--brand-navy)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {b.title}
                  </h4>

                  <p
                    style={{
                      fontSize: '14.5px',
                      color: 'var(--text-body)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .benefit-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -6px rgba(7, 26, 49, 0.08);
          border-color: #cbd5e1;
        }
        @media (max-width: 768px) {
          .stress-free-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};
