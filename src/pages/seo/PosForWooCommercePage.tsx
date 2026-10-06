import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Store,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Barcode,
  Printer,
  WifiOff,
  ShoppingBag,
} from 'lucide-react';

export const PosForWooCommercePage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Product', url: '/woocommerce-pos' },
    { name: 'POS for WooCommerce', url: '/pos-for-woocommerce' },
  ];

  const faqs = [
    {
      q: 'Why use a dedicated POS built specifically for WooCommerce?',
      a: 'Generic retail POS systems force you to manage two separate databases, re-enter product descriptions, run export/import spreadsheets, and battle inventory delays. A dedicated POS for WooCommerce uses your existing WordPress catalog as the single source of truth.',
    },
    {
      q: 'Do I need dedicated POS hardware to use ZAMERIA?',
      a: 'No. ZAMERIA turns any PC, laptop, Mac, iPad, or Android tablet into an in-store counter register. You can plug in standard USB/Bluetooth barcode scanners and ESC/POS thermal receipt printers without proprietary leasing locks.',
    },
    {
      q: 'How does in-store checkout work with variable products?',
      a: 'ZAMERIA includes a rapid variation selector designed for fast-paced retail counters. Staff can select sizes, colors, and materials with one tap or scan specific variation barcodes directly to ring up sales instantly.',
    },
    {
      q: 'How does ZAMERIA keep my WooCommerce website updated?',
      a: 'Every time a physical sale completes, ZAMERIA fires an immediate atomic inventory update to your WooCommerce store via REST API. Online shoppers see real-time inventory counts instantly, eliminating overselling.',
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
              <Store size={13} style={{ marginRight: '6px' }} />
              <span>UNIFIED RETAIL & ECOMMERCE CHECKOUT</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              POS for WooCommerce: Connect Your In-Store Counter with Your Online Store
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Stop running separate systems for in-store sales and online orders. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos-plugin" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Download Plugin</span>
              </a>
            </div>
          </div>

          {/* Key Advantages Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Barcode size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Fast In-Store Barcode Scanning
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Scan product swing tags, manufacturer UPCs, or custom SKU barcodes. Items add to the checkout cart in milliseconds with instant variation resolution.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Printer size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Instant Thermal Receipt Printing
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Issue clear 80mm and 58mm customer receipts containing itemized orders, tax breakdowns, custom store return policies, and cashier names.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Live Omnichannel Stock Sync
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                When a customer buys the last jacket in your store, your online WooCommerce listing updates immediately. Never apologize to an online customer for an out-of-stock item again.
              </p>
            </div>
          </div>

          {/* Unified Architecture Section */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                One Catalog. One Business. One Source of Truth.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Why pay for third-party connector software that breaks with every WordPress update? ZAMERIA is engineered natively for WooCommerce.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Variable Products & Attributes</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Manage complex variations like apparel sizes, colors, beauty shades, and bundle packs directly in WooCommerce. ZAMERIA understands native WooCommerce variation data models.
                </p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Cashier Permissions & PINs</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Keep your staff accountable. Support for cashier PIN sign-ins, audit logs, drawer balancing, and order history tracking per employee.
                </p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Split Payments & Custom Tender</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Give in-store customers flexible payment options. Split single sales across cash, card POS terminal, and instant bank transfer with zero accounting headache.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About POS for WooCommerce
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

          {/* CTA Banner */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Ready to Upgrade Your WooCommerce Store to Modern Retail POS?
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Start your 7-day free trial. Experience seamless in-store checkout with automated inventory synchronization.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Learn About Inventory Sync</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
