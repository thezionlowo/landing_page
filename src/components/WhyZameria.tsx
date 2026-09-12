import React from 'react';
import { Store, RefreshCw, LayoutGrid, Users } from 'lucide-react';

export const WhyZameria: React.FC = () => {
  const benefits = [
    {
      title: 'SELL EVERYWHERE',
      desc: 'Sell online and in person from one connected system.',
      icon: Store,
    },
    {
      title: 'KEEP INVENTORY IN SYNC',
      desc: 'Stop manually updating stock in different places.',
      icon: RefreshCw,
    },
    {
      title: 'MANAGE FROM ONE PLACE',
      desc: 'Products, orders and customers stay connected.',
      icon: LayoutGrid,
    },
    {
      title: 'GIVE YOUR TEAM ACCESS',
      desc: 'Let staff sell while you stay in control.',
      icon: Users,
    },
  ];

  return (
    <section
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 800,
              color: 'var(--brand-navy)',
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Why store owners choose ZAMERIA.
          </h2>
          <p className="lead-text center">
            Sell online and in person while keeping your products, inventory and orders in sync.
          </p>
        </div>

        {/* 4 Crisp Benefit Cards — NO CTA here */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
          }}
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 20px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={18} />
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#2563eb',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {b.title}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
