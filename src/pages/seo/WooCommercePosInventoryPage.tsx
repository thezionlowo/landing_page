import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Layers,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Database,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Barcode,
  Lock,
  Cpu,
} from 'lucide-react';

export const WooCommercePosInventoryPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Product', url: '/woocommerce-pos' },
    { name: 'POS Inventory', url: '/woocommerce-pos-inventory' },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA POS handle WooCommerce product inventory?',
      a: 'ZAMERIA directly queries and updates WooCommerce stock levels using high-speed REST endpoints. Physical sales decrement inventory in real time, and online orders update the local POS catalog without requiring manual imports.',
    },
    {
      q: 'Does it support variable products with size and color inventories?',
      a: 'Yes. Every variation stock count is independently tracked. Selling a small red shirt will only adjust that exact variation, leaving the rest of the product catalog untouched.',
    },
    {
      q: 'What happens during a rush hour when multiple people buy the same SKU?',
      a: 'ZAMERIA utilizes atomic inventory transactions to prevent negative stock and overselling race conditions. When the stock reaches 0, further attempts to add the item are blocked across both in-store registers and web checkouts.',
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
              <Layers size={13} style={{ marginRight: '6px' }} />
              <span>SYNCHRONIZED POS INVENTORY ENGINE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS Inventory: Real-Time Stock Locking at the Counter
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Stop guessing shelf stock counts. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Learn How Sync Works</span>
              </a>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Atomic Stock Deductions
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Every sale triggers an atomic update at the database level, ensuring quantities drop immediately with zero chance of duplicate deductions.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Barcode size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                SKU & Barcode Mapping
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Map unique barcodes to individual product variations. Scan a barcode at the register to instantly decrement the exact variation stock.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                High-Performance Order Storage (HPOS)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Built natively for WooCommerce HPOS custom order tables to deliver blazing-fast stock updates without slowing down your WordPress admin.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About WooCommerce POS Inventory
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
              Start Syncing Your WooCommerce POS Inventory Today
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Get sub-second inventory sync across all your in-store registers and online store. Start your free trial today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/solutions/prevent-overselling" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Prevent Overselling</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
