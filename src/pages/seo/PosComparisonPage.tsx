import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Scale,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCw,
} from 'lucide-react';

export const PosComparisonPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/#features' },
    { name: 'WooCommerce POS vs Traditional POS', url: '/woocommerce-pos-vs-traditional-pos' },
  ];

  const comparisonRows = [
    {
      feature: 'Online & In-Store Stock Sync',
      zameria: 'Real-time sub-second bi-directional sync with WooCommerce database.',
      traditional: 'Disconnected or relies on slow CSV imports / fragile third-party sync.',
    },
    {
      feature: 'Product Catalog Management',
      zameria: 'Single unified catalog. Add/edit products once in WooCommerce.',
      traditional: 'Double data entry. You must maintain two separate product catalogs.',
    },
    {
      feature: 'Product Variations (Size/Color)',
      zameria: 'Full native variation matrix support with live stock counts per attribute.',
      traditional: 'Often struggles with WooCommerce variable products, resulting in mismatched SKUs.',
    },
    {
      feature: 'Hardware Compatibility',
      zameria: 'Works on any laptop, Mac, PC, tablet, with standard 80mm thermal printers.',
      traditional: 'Requires expensive locked-in proprietary POS hardware terminals.',
    },
    {
      feature: 'Offline Resilience',
      zameria: 'IndexedDB offline buffer allows uninterrupted sales during internet drops.',
      traditional: 'Cloud-only systems freeze completely when internet or fiber cuts out.',
    },
    {
      feature: 'Pricing & Licensing',
      zameria: 'Transparent annual Naira or USD plans with zero per-transaction cuts.',
      traditional: 'High monthly dollar fees + mandatory proprietary card processing surcharges.',
    },
    {
      feature: 'Order & Customer History',
      zameria: 'All counter sales, customer accounts, and online orders live in WooCommerce.',
      traditional: 'Customer records and purchase histories are siloed in separate systems.',
    },
  ];

  const faqs = [
    {
      q: 'Why does using a separate standalone POS cause inventory problems for WooCommerce merchants?',
      a: 'When you run a standalone POS that is not directly connected to WooCommerce, in-store sales are not immediately deducted from your website. If an online shopper buys the same product before you manually update stock, you oversell, leading to embarrassing customer refund calls and negative reviews.',
    },
    {
      q: 'How is ZAMERIA different from middleware sync plugins that connect legacy POS systems?',
      a: 'Middleware plugins rely on scheduled API polling (often every 15 to 60 minutes). During high-traffic retail hours, a 15-minute delay is more than enough time to oversell stock. ZAMERIA operates directly on your WooCommerce data layer with sub-second websocket and database locks.',
    },
    {
      q: 'Do I need to migrate my products away from WooCommerce to use ZAMERIA?',
      a: 'No! You keep 100% of your existing WooCommerce store, themes, payment gateways, and SEO rankings. ZAMERIA installs as a lightweight companion plugin and desktop/web POS counter that syncs instantly with your existing catalog.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas-bg)' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: '130px', paddingBottom: '90px' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)' }}>
              {breadcrumbs.map((b, i) => (
                <li key={b.url} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i > 0 && <ChevronRight size={13} />}
                  {i === breadcrumbs.length - 1 ? (
                    <span style={{ color: 'var(--brand-navy)', fontWeight: 600 }}>{b.name}</span>
                  ) : (
                    <a href={b.url} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                      {b.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Hero */}
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 64px' }}>
            <div className="eyebrow-badge blue" style={{ margin: '0 auto 20px' }}>
              <Scale size={13} style={{ marginRight: '6px' }} />
              <span>OBJECTIVE COMPARISON</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS vs Traditional Standalone POS Systems
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Why maintaining separate systems for your physical retail store and WooCommerce website leads to inventory chaos, manual reconciliation, and overselling.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>How Real-Time Sync Works</span>
              </a>
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', overflow: 'hidden', marginBottom: '80px', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '640px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 800, color: 'var(--brand-navy)', width: '28%' }}>Capability</th>
                    <th style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 800, color: '#2563eb', width: '36%', backgroundColor: '#eff6ff' }}>ZAMERIA (Connected POS)</th>
                    <th style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 800, color: '#64748b', width: '36%' }}>Traditional Standalone POS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === comparisonRows.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                        {row.feature}
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '13.5px', color: 'var(--brand-navy)', backgroundColor: 'rgba(239, 246, 255, 0.4)', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <Check size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.zameria}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <X size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep Dive Problem & Solution */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              The Problem With Running Two Disconnected Systems
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '20px' }}>
              When your physical cashiers and your online WooCommerce store use separate databases, you are effectively running two different businesses with one inventory pool.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '0' }}>
              ZAMERIA transforms your WooCommerce store into the central brain. Every counter scan, barcode sale, variation selection, staff shift, and online order communicates with the exact same data source in real time.
            </p>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '820px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '36px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>{faq.q}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="glass-card" style={{ backgroundColor: '#071A31', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '14px', color: '#ffffff' }}>
              Switch to Connected WooCommerce Retail Today
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Stop double data entry and eliminate overselling across your physical and online store.
            </p>
            <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '14px 32px', fontSize: '15px' }}>
              <span>Start Free 7-Day Trial</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
