import React from 'react';
import { Store, RefreshCw, LayoutGrid, Users, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const StressFreeSection: React.FC = () => {
  const benefits = [
    {
      badge: 'OMNICHANNEL SALES',
      title: 'SELL EVERYWHERE',
      desc: 'Sell online and in person from one connected system.',
      details: 'Whether a customer orders on your WooCommerce site from Abuja or walks into your counter in Lagos, your catalog, prices, and stock stay perfectly aligned.',
      icon: Store,
      accentBg: '#eff6ff',
      accentColor: '#2563eb',
      tagBg: 'rgba(37, 99, 235, 0.08)',
    },
    {
      badge: 'AUTOMATIC RECONCILIATION',
      title: 'KEEP INVENTORY IN SYNC',
      desc: 'Keep your stock updated across your sales channels.',
      details: 'Instant 2-way sync ensures when an item is scanned and sold at your checkout till, your website stock level drops in milliseconds. Zero overselling.',
      icon: RefreshCw,
      accentBg: '#f0fdf4',
      accentColor: '#16a34a',
      tagBg: 'rgba(22, 163, 74, 0.08)',
    },
    {
      badge: 'CENTRALIZED CONTROL',
      title: 'MANAGE FROM ONE PLACE',
      desc: 'Products, orders and customers stay connected.',
      details: 'View customer purchase histories across both online visits and physical counter checkouts in unified profiles that help build lasting customer loyalty.',
      icon: LayoutGrid,
      accentBg: '#eef2ff',
      accentColor: '#4f46e5',
      tagBg: 'rgba(79, 70, 229, 0.08)',
    },
    {
      badge: 'STAFF CONTROL & SECURITY',
      title: 'KEEP YOUR TEAM MOVING',
      desc: 'Give staff access while keeping control of your business.',
      details: 'Enable cashiers with rapid 4-digit PIN log-ins to process orders while keeping profit margins, financial reports, and settings protected for management.',
      icon: Users,
      accentBg: '#fffbeb',
      accentColor: '#d97706',
      tagBg: 'rgba(217, 119, 6, 0.08)',
    },
  ];

  return (
    <section
      id="stress-free"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
          <div className="eyebrow-badge" style={{ margin: '0 auto 16px' }}>
            <span>FRICTIONLESS OPERATIONS</span>
          </div>
          <h2 className="section-headline">
            Stress-Free Management
          </h2>
          <p className="lead-text center">
            Run your store with confidence while ZAMERIA keeps your sales, inventory, and team aligned.
          </p>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
          className="stress-grid"
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="glass-card"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '24px',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(7, 26, 49, 0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
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
                        borderRadius: '12px',
                        backgroundColor: b.accentBg,
                        color: b.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: b.tagBg,
                        color: b.accentColor,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {b.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--brand-navy)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '8px',
                    }}
                  >
                    {b.title}
                  </h3>

                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--brand-navy)',
                      lineHeight: 1.4,
                      marginBottom: '10px',
                    }}
                  >
                    {b.desc}
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-body)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {b.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .stress-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  );
};
