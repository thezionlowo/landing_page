import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Scale,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Store,
} from 'lucide-react';

export const AlternativesHubPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/best-woocommerce-pos' },
    { name: 'WooCommerce POS Alternatives', url: '/alternatives' },
  ];

  const alternatives = [
    {
      name: 'FooSales Alternative',
      url: '/alternatives/foosales',
      desc: 'Looking for a FooSales alternative? Compare pricing, setup complexity, offline IndexedDB resilience, and why ZAMERIA provides a faster, more affordable option with zero transaction cuts.',
      tag: 'FASTER SETUP & NO PER-REGISTER TAX',
    },
    {
      name: 'Oliver POS Alternative',
      url: '/alternatives/oliver-pos',
      desc: 'Ditch Oliver POS hardware leasing fees and sync lag. ZAMERIA runs on your existing PCs, iPads, or tablets with sub-second inventory locking and flat annual pricing.',
      tag: 'ZERO HARDWARE LOCK-IN',
    },
    {
      name: 'WCPOS Alternative',
      url: '/alternatives/wcpos',
      desc: 'Evaluating WCPOS vs ZAMERIA? See how ZAMERIA provides true offline counter operations, native split payments, and direct receipt printing without expensive Pro addons.',
      tag: 'ADVANCED OFFLINE & SPLIT TENDER',
    },
    {
      name: 'wePOS Alternative',
      url: '/alternatives/wepos',
      desc: 'Comparing wePOS with modern WooCommerce point-of-sale systems. Learn why store owners switch to ZAMERIA for reliable real-time inventory synchronization and barcode scanning.',
      tag: 'RELIABLE INVENTORY LOCKING',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas-bg)' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: '130px', paddingBottom: '90px' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)' }}>
              {breadcrumbs.map((b, i) => (
                <li key={b.url} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i > 0 && <ChevronRight size={13} />}
                  {i === breadcrumbs.length - 1 ? (
                    <span style={{ color: 'var(--brand-navy)', fontWeight: 600 }}>{b.name}</span>
                  ) : (
                    <a href={b.url} style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-primary">
                      {b.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Hero Header */}
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 64px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 20px' }}>
              <Scale size={13} style={{ marginRight: '6px' }} />
              <span>INDEPENDENT WOOCOMMERCE POS COMPARISONS</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              The Best WooCommerce POS Alternatives & Competitor Comparisons
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Detailed, objective side-by-side evaluations to help you choose the right point-of-sale system for your retail store. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Top 5 Ranked & Tested</span>
              </a>
            </div>
          </div>

          {/* Alternatives Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '64px' }}>
            {alternatives.map((alt, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  {alt.tag}
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                  {alt.name}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, flex: 1, marginBottom: '24px' }}>
                  {alt.desc}
                </p>
                <a href={alt.url} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Read Full Comparison</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>

          {/* Evaluation Factors */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Key Criteria When Evaluating WooCommerce POS Systems
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Sync Speed & Locking</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Does the POS lock stock immediately at checkout, or does it rely on scheduled API polling that causes overselling?
                </p>
              </div>

              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Offline Resilience</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Can cashiers ring up sales and print receipts when store Wi-Fi drops, without losing pending transactions?
                </p>
              </div>

              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Hardware Freedom</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Can you use any standard PC, tablet, ESC/POS thermal printer, and USB scanner, or are you locked into vendor hardware?
                </p>
              </div>
            </div>
          </div>

          {/* Conversion CTA Footer Banner */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Experience the Faster, More Reliable WooCommerce POS
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Test ZAMERIA free for 7 days on your existing WooCommerce catalog. No credit card required.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Explore Full POS Features</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
