import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Database,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lock,
  BarChart3,
} from 'lucide-react';

export const WooCommerceInventoryManagementPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Product', url: '/woocommerce-pos' },
    { name: 'Inventory Management', url: '/woocommerce-inventory-management' },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA manage inventory between WooCommerce and physical stores?',
      a: 'ZAMERIA uses an event-driven synchronization engine. Whenever an in-store counter transaction or an online WooCommerce order occurs, stock is deducted in sub-second time. This guarantees that your physical store and online website always show the identical stock balance.',
    },
    {
      q: 'Can ZAMERIA calculate my total Current Stock Value?',
      a: 'Yes. ZAMERIA provides an aggregated Inventory Overview that computes the mathematical total stock value across all active products and variations: Σ (current stock quantity × selling price). Items with zero stock contribute 0, preventing inflated valuation metrics.',
    },
    {
      q: 'How are variable product stocks managed in ZAMERIA?',
      a: 'ZAMERIA natively syncs parent products and individual variations. If a customer buys a "Size M / Black" hoodie in-store, only that specific variation stock is decremented online, leaving all other sizes and colors unaffected.',
    },
    {
      q: 'Can I track inventory across multiple physical registers?',
      a: 'Yes. Multiple registers in your store connect to the central WooCommerce inventory backend. When Register 1 sells a unit, Register 2 and your online store reflect the updated stock count in real time.',
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
              <Database size={13} style={{ marginRight: '6px' }} />
              <span>REAL-TIME INVENTORY CONTROL FOR WOOCOMMERCE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce Inventory Management for In-Store & Online Retail
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Eliminate stockouts, overselling, and manual spreadsheets. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync</strong> across every counter and screen.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/solutions/stock-mismatch" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>How to Fix Stock Mismatch</span>
              </a>
            </div>
          </div>

          {/* 3 Pillars of Unified Inventory Management */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Atomic Inventory Locking
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                When an in-store customer presents an item at your counter register, ZAMERIA prevents web shoppers from purchasing the same remaining unit. Sub-second locking protects your inventory integrity during peak flash sales.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Accurate Stock Valuation
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Instantly audit your current stock value across all active SKUs. Understand holding capital and avoid carrying excess dead inventory without manual spreadsheet calculation.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Zero Manual Reconciliations
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Throw away nightly inventory count sheets. When in-store barcode sales automatically update WooCommerce in real time, your store catalog is permanently balanced.
              </p>
            </div>
          </div>

          {/* Detailed Problem vs ZAMERIA Solution */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Why Siloed Inventory Fails Retailers
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#9f1239', marginBottom: '8px' }}>The Legacy POS Reality</h4>
                <p style={{ fontSize: '14px', color: '#881337', lineHeight: 1.6, margin: 0 }}>
                  A retail customer buys the last dress in-store. At the same moment, a shopper buys it on WooCommerce. You have one item and two paying customers. You are forced to cancel an order, issue a refund, and apologize.
                </p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>The ZAMERIA Unified Solution</h4>
                <p style={{ fontSize: '14px', color: '#14532d', lineHeight: 1.6, margin: 0 }}>
                  The in-store cashier scans the barcode. In under 0.5 seconds, WooCommerce stock drops from 1 to 0 and displays "Out of Stock" online. Double sales are mathematically eliminated.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About WooCommerce Inventory Management
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

          {/* Final CTA Banner */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Take Complete Control of Your WooCommerce Inventory
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Start your 7-day free trial. Experience automated inventory management and bi-directional counter synchronization.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>View Inventory Sync Details</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
