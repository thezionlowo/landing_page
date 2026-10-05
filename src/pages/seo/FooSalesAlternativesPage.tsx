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

export const FooSalesAlternativesPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Alternatives', url: '/alternatives/foosales' },
    { name: 'FooSales Alternatives', url: '/alternatives/foosales' },
  ];

  const comparisonRows = [
    {
      feature: 'Annual Subscription Cost',
      zameria: 'From ₦200,000/year (~$130/yr) flat. Unlimited products, unlimited orders, no transaction fees.',
      foosales: '$228 to $360/year per store, plus additional charges for add-ons and payment hardware access.',
    },
    {
      feature: 'Setup & Connection Time',
      zameria: 'Under 2 minutes. Connects directly to WooCommerce with zero manual API key generation.',
      foosales: 'Requires manual REST API creation, consumer secret keys, and webhook token configuration.',
    },
    {
      feature: 'Offline POS Capability',
      zameria: 'True offline-first IndexedDB storage. Ring up barcode sales and print receipts even during internet cuts.',
      foosales: 'Limited offline support; requires prior caching and often refuses checkout if connection drops mid-order.',
    },
    {
      feature: 'Split Payment Tender',
      zameria: 'Native split payments: split bills across Cash, Card POS, and Bank Transfer in a single ticket.',
      foosales: 'Limited split tender support; primarily optimized for Stripe Terminal and Square in select western countries.',
    },
    {
      feature: 'Catalog Speed on 2,000+ SKUs',
      zameria: 'Sub-second search and instant barcode scans powered by local index caching.',
      foosales: 'Noticeable catalog lag and memory consumption on larger product variation trees.',
    },
    {
      feature: 'Regional & Africa Support',
      zameria: 'Built natively for Nigerian and global commerce: Naira (₦) receipts, bank transfer confirmation, local POS card payments.',
      foosales: 'Strictly built for US/UK/EU retail with USD/EUR pricing and Square/Stripe payment locks.',
    },
    {
      feature: 'Staff & Cashier Controls',
      zameria: 'Included in all plans: Cashier PINs, shift float tracking, manager overrides, and individual sales audit.',
      foosales: 'Requires higher tier plan or separate WordPress role configuration.',
    },
  ];

  const faqs = [
    {
      q: 'Why are retailers looking for FooSales alternatives in 2026?',
      a: 'While FooSales is a capable POS, many merchants encounter three major roadblocks: high dollar pricing ($228–$360/year) that is prohibitive for international sellers, performance sluggishness on stores with extensive variable products, and zero native support for emerging market payment methods like local POS split payments and bank transfers.',
    },
    {
      q: 'How does ZAMERIA compare to FooSales for barcode scanning and receipt printing?',
      a: 'ZAMERIA works out-of-the-box with any standard USB or Bluetooth barcode scanner and 80mm ESC/POS thermal receipt printer (Epson, Xprinter, Star). Unlike FooSales which often requires specific tablet-compatible hardware accessories, ZAMERIA runs on any laptop, desktop PC, Mac, or tablet browser without proprietary hardware locks.',
    },
    {
      q: 'Can I switch from FooSales to ZAMERIA without losing my WooCommerce products?',
      a: 'Yes! ZAMERIA connects directly to your existing WooCommerce database. All your products, prices, stock quantities, and variations remain untouched in WooCommerce. You do not need to import CSVs or re-enter products; simply connect ZAMERIA and your register is live in under 2 minutes.',
    },
    {
      q: 'Does ZAMERIA provide true real-time inventory synchronization like FooSales?',
      a: 'ZAMERIA provides sub-second bi-directional inventory locking. When a cashier scans an item in your physical shop, that stock count decreases instantly on your WooCommerce website. If an online buyer places an order, your counter register immediately updates to prevent overselling.',
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
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 56px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 18px', display: 'inline-flex' }}>
              <Scale size={13} style={{ marginRight: '6px' }} />
              <span>FOOSALES ALTERNATIVE &amp; COMPARISON</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              The Modern, Faster FooSales Alternative for WooCommerce Retailers
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '740px', margin: '0 auto 32px' }}>
              Looking for a FooSales alternative that doesn’t charge steep dollar subscriptions, freeze during internet drops, or require complex API keys? Discover why omnichannel merchants are choosing ZAMERIA for in-store checkout and sub-second inventory sync.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/comparisons/foosales-vs-oliver-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Compare FooSales vs Oliver POS</span>
              </a>
            </div>
          </div>

          {/* Core Feature Differentiators */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Sub-Second Catalog Search</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Unlike FooSales which queries remote APIs on every keystroke, ZAMERIA indexes your product variations locally. Find items instantly, even on 5,000+ SKU inventories.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <WifiOff size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>True Offline POS Architecture</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Never stop selling when Wi-Fi or fiber cuts out. ZAMERIA caches checkouts locally in IndexedDB, prints thermal receipts offline, and syncs chronologically once reconnected.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <CreditCard size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Flexible Multi-Tender Splits</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Accept partial cash, card POS terminal, and instant bank transfer on a single sale without complex terminal hardware locks or expensive third-party processor fees.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-subtle)', padding: '40px', boxShadow: '0 8px 30px rgba(7, 26, 49, 0.04)', marginBottom: '72px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '10px' }}>
                Detailed Comparison: ZAMERIA vs FooSales
              </h2>
              <p style={{ fontSize: '15.5px', color: 'var(--text-muted)' }}>
                See how ZAMERIA delivers superior speed, reliability, and value for WooCommerce retailers.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '25%' }}>FEATURE</th>
                    <th style={{ padding: '16px 20px', fontSize: '15px', fontWeight: 800, color: '#4338ca', width: '38%', backgroundColor: '#f5f3ff' }}>ZAMERIA</th>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '37%' }}>FooSales</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '18px 20px', fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px' }}>{row.feature}</td>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: 'var(--brand-navy)', backgroundColor: '#faf5ff', fontWeight: 500, lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.zameria}</span>
                        </div>
                      </td>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <X size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.foosales}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Migration Guarantee */}
          <div style={{ background: 'linear-gradient(135deg, #071A31 0%, #0d2847 100%)', borderRadius: '24px', padding: '48px', color: '#ffffff', textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
              Switch From FooSales in Under 2 Minutes
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '680px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Zero downtime. Keep your existing products, categories, images, and prices. Connect ZAMERIA to your WooCommerce store and start checking out customers immediately.
            </p>
            <a href={ROUTES.trial} className="btn" style={{ backgroundColor: '#ffffff', color: '#071A31', fontWeight: 700, padding: '16px 36px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <span>Start Your 7-Day Free Trial</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '840px', margin: '0 auto 72px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions About FooSales Alternatives
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={18} color="#4f46e5" style={{ flexShrink: 0 }} />
                    <span>{faq.q}</span>
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, paddingLeft: '28px' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
