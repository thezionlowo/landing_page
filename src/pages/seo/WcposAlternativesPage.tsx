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

export const WcposAlternativesPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Alternatives', url: '/alternatives' },
    { name: 'WCPOS Alternative', url: '/alternatives/wcpos' },
  ];

  const comparisonRows = [
    {
      feature: 'Pricing & Addon Model',
      zameria: 'Transparent flat annual pricing. All features included: unlimited orders, barcode scanning, split payments, multi-cashier.',
      wcpos: 'Free basic core plugin, but key retail features (barcode printing, multi-outlet, custom receipts) require expensive Pro licenses.',
    },
    {
      feature: 'Offline Operation & Resilience',
      zameria: 'Engineered with IndexedDB local caching. Cashiers can continue barcode ringing and thermal printing during network blackouts.',
      wcpos: 'Browser-cached interface, but network disconnects during transaction processing can cause sync conflicts or stalled queues.',
    },
    {
      feature: 'Split Tender & Mixed Payments',
      zameria: 'Native split payments: split any order between Cash, Card POS Terminal, and Bank Transfer with exact change calculation.',
      wcpos: 'Standard WooCommerce gateway routing; split payment across multiple tender types is limited or requires custom extensions.',
    },
    {
      feature: 'Hardware & Thermal Receipts',
      zameria: 'Direct driverless printing to 80mm and 58mm ESC/POS thermal printers with custom headers and tax policies.',
      wcpos: 'Standard browser print dialog; specialized receipt layouts often require the paid Pro tier.',
    },
    {
      feature: 'Catalog Performance on Large Variation Trees',
      zameria: 'Sub-second search across thousands of SKUs powered by indexed local cache and atomic inventory locks.',
      wcpos: 'Can experience slow search indexing and memory spikes when loading massive catalogs on shared WordPress hosting.',
    },
    {
      feature: 'Customer Support & Guidance',
      zameria: 'Dedicated priority onboarding, live setup assistance, and continuous WhatsApp/email engineering support.',
      wcpos: 'Community WordPress forum support for free tier; email support reserved for active Pro subscribers.',
    },
  ];

  const faqs = [
    {
      q: 'Why look for an alternative to WCPOS?',
      a: 'WCPOS is a popular open-source tool, but store owners often find that essential retail features like barcode label printing, customized receipt templates, and multi-outlet inventory require expensive annual Pro licenses. Furthermore, ZAMERIA provides a faster, more modern counter UI with native split tender and offline IndexedDB resilience.',
    },
    {
      q: 'Can I switch from WCPOS to ZAMERIA without losing my WooCommerce products?',
      a: 'Yes. Both systems connect to your native WooCommerce database. When you install ZAMERIA, it reads your existing WooCommerce products, variations, prices, and stock counts immediately—no data export or product re-entry is required.',
    },
    {
      q: 'Does ZAMERIA charge per register or per cashier?',
      a: 'No. ZAMERIA offers flat annual plans that include multi-cashier support and unlimited transactions with zero per-order commission fees.',
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
              Looking for a WCPOS Alternative? Meet ZAMERIA
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Compare WCPOS and ZAMERIA side-by-side. Discover why retail store owners choose ZAMERIA for true offline reliability, native split tender, and flat transparent pricing. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
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
              Detailed Feature Comparison: ZAMERIA vs WCPOS
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Feature</th>
                    <th style={{ padding: '16px', color: '#6366f1', fontWeight: 700 }}>ZAMERIA</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>WCPOS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>{row.feature}</td>
                      <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>{row.zameria}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{row.wcpos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About WCPOS Alternatives
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
              Switch to ZAMERIA for Faster, Simpler In-Store Checkout
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Connect your WooCommerce store in 2 minutes. Start your 7-day free trial today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Read Best WooCommerce POS Guide</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
