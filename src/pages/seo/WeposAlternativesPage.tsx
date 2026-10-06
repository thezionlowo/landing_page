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
  Sparkles,
  WifiOff,
  CreditCard,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const WeposAlternativesPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Alternatives', url: '/alternatives' },
    { name: 'wePOS Alternative', url: '/alternatives/wepos' },
  ];

  const comparisonRows = [
    {
      feature: 'Offline Operation & Resilience',
      zameria: 'True offline-first IndexedDB storage. Scan barcodes, ring up sales, and print receipts during network blackouts.',
      wepos: 'Web-dependent client. Internet dropouts interrupt transactions and can prevent counter checkouts.',
    },
    {
      feature: 'Real-Time Inventory Sync',
      zameria: 'Sub-second event-driven synchronization with atomic stock locking to eliminate online and in-store overselling.',
      wepos: 'Standard REST API polling; high-volume simultaneous in-store and online checkouts can cause stock race conditions.',
    },
    {
      feature: 'Pricing & Licensing',
      zameria: 'Transparent flat annual pricing with unlimited registers, unlimited orders, and zero commission fees.',
      wepos: 'Free basic version; essential features like barcode scanning, custom receipts, and multi-counter require paid Pro tier.',
    },
    {
      feature: 'Split Tender & Payments',
      zameria: 'Native split payments: split any bill between Cash, Card POS Terminal, and Bank Transfer with automatic change tracking.',
      wepos: 'Basic cash/card payment processing; multi-tender splits are limited.',
    },
    {
      feature: 'Hardware & Thermal Receipt Setup',
      zameria: 'Supports standard 80mm and 58mm ESC/POS thermal printers, USB/Bluetooth barcode scanners, and cash drawers.',
      wepos: 'Standard browser print dialog; thermal printer configuration can require additional browser tweaks.',
    },
    {
      feature: 'Performance on Variable Products',
      zameria: 'Lightning-fast variation picker with variation-specific barcode matching and live stock per attribute.',
      wepos: 'Can experience noticeable latency when querying stores with thousands of product variations.',
    },
  ];

  const faqs = [
    {
      q: 'Why look for an alternative to wePOS?',
      a: 'While wePOS offers a free basic plugin, merchants frequently outgrow it when they need reliable offline resilience during internet drops, atomic inventory locking to stop overselling, and native split-payment support at the counter. ZAMERIA provides a robust modern alternative designed specifically for busy retail counters.',
    },
    {
      q: 'Can I migrate from wePOS to ZAMERIA easily?',
      a: 'Yes. Because ZAMERIA connects directly to your existing WooCommerce catalog, your products, variations, prices, and stock counts are immediately accessible as soon as you activate the ZAMERIA plugin.',
    },
    {
      q: 'Does ZAMERIA require custom hardware?',
      a: 'No. ZAMERIA runs on any PC, laptop, Mac, iPad, or Android tablet. You can plug in standard USB/Bluetooth barcode scanners and ESC/POS thermal receipt printers without vendor lock-in.',
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
              <span>IN-DEPTH COMPETITOR ANALYSIS</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              Looking for a wePOS Alternative? Discover ZAMERIA
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Compare wePOS and ZAMERIA side-by-side. Discover why retail store owners choose ZAMERIA for true offline reliability, sub-second inventory locking, and flat transparent pricing. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/alternatives" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View All Alternatives</span>
              </a>
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Detailed Feature Comparison: ZAMERIA vs wePOS
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Feature</th>
                    <th style={{ padding: '16px', color: '#6366f1', fontWeight: 700 }}>ZAMERIA</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>wePOS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>{row.feature}</td>
                      <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>{row.zameria}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{row.wepos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About wePOS Alternatives
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ padding: '20px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>
                    {faq.q}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion CTA Footer Banner */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Ready for a More Reliable WooCommerce POS?
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Experience sub-second inventory sync and offline resilience with ZAMERIA. Start your free trial today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Compare Best WooCommerce POS</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
