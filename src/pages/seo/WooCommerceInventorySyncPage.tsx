import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  RefreshCw,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Database,
  Lock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const WooCommerceInventorySyncPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#product-powers' },
    { name: 'WooCommerce Inventory Sync', url: '/woocommerce-inventory-sync' },
  ];

  const faqs = [
    {
      q: 'How fast does ZAMERIA synchronize inventory between WooCommerce and physical stores?',
      a: 'ZAMERIA uses sub-second event-driven synchronization. When an item is sold at the physical POS register, online WooCommerce stock is deducted in under 0.5 seconds. When an online order arrives on WooCommerce, POS registers reflect the updated inventory immediately.',
    },
    {
      q: 'What happens if the internet disconnects in my physical store?',
      a: 'Offline sales are saved locally and marked as pending sync. When internet returns, ZAMERIA reconciles the quantities and updates WooCommerce. Built-in stock protection ensures offline sold units cannot be overwritten by stale server inventory pulls.',
    },
    {
      q: 'Does ZAMERIA support complex variable products with sizes and colors?',
      a: 'Yes. ZAMERIA provides full native support for WooCommerce variable products, variations, parent-child stock relationships, barcodes per variation, and low-stock threshold notifications.',
    },
    {
      q: 'Do I need to export CSV files or run manual sync scripts?',
      a: 'No. ZAMERIA completely eliminates manual spreadsheets, CSV imports, and scheduled cron batch jobs. Synchronization is 100% automated and bi-directional.',
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
              <Sparkles size={13} style={{ marginRight: '6px' }} />
              <span>REAL-TIME INVENTORY SYNCHRONIZATION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              Real-Time WooCommerce Inventory Management & In-Store Stock Sync
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Stop overselling online. Stop manual stock reconciliation. ZAMERIA automatically links your online WooCommerce catalog with in-store POS stock so you sell with 100% inventory confidence.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/solutions/prevent-overselling" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>How to Prevent Overselling</span>
              </a>
            </div>
          </div>

          {/* The Stock Dilemma Visual Breakdown */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                The Cost of Disconnected Retail Inventory
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                When your physical store and online website operate on separate counts, stock mismatches are mathematically inevitable.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '24px' }}>
                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>THE PROBLEM</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>The "Double Sale" Disaster</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
                  A walk-in customer buys the last pair of designer shoes at 2:15 PM. At 2:20 PM, an online customer orders the same shoes on WooCommerce. You are forced to apologize and process an embarrassing refund.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '24px' }}>
                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>THE PROBLEM</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Late-Night Manual Stock Audits</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
                  Retail owners and managers spend 5 to 10 hours every week manually counting shelf stock, cross-checking paper receipts against WooCommerce admin, and updating product quantities by hand.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '24px' }}>
                <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>THE ZAMERIA SOLUTION</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Sub-Second Bi-Directional Sync</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
                  ZAMERIA automatically syncs stock both ways. The exact instant an item scans at your retail counter, WooCommerce inventory drops. When online orders come in, in-store POS availability reflects it live.
                </p>
              </div>
            </div>
          </div>

          {/* Sync Architecture Features */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Engineered for 100% Stock Accuracy
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Advanced inventory algorithms designed specifically for high-volume retail stores.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <RefreshCw size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Instant Stock Deductions</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Counter sales instantly update WooCommerce product quantities, preventing online customers from purchasing items already taken out of the store.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Complete Variation Tracking</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Full multi-attribute support (Size, Color, Material, Flavor, Strength). Track stock individually per variation with dedicated SKUs and barcodes.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Lock size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Offline Stock Protection</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Unsynced offline sales are protected in local IndexedDB. Server inventory syncs will never inflate or overwrite products sold while offline.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <AlertTriangle size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Low Stock & OOS Alerts</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Visual indicators highlight low-stock and out-of-stock items in real time, preventing cashiers from attempting to ring up non-existent stock.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Database size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Unified Master Catalog</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Create or edit products once in WooCommerce. Prices, regular prices, sale prices, images, and descriptions update on all in-store POS devices automatically.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Clock size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Zero Manual Reconciliation</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Save 20+ hours every month. Online orders and counter sales appear in one consolidated order history with cashier attribution and revenue totals.
                </p>
              </div>
            </div>
          </div>

          {/* Related Solutions Navigation */}
          <div style={{ backgroundColor: 'var(--surface-white)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '36px', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '20px' }}>Related Multi-Channel Retail Guides</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <a href="/woocommerce-pos" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>WooCommerce POS System →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>High-speed counter register for WooCommerce physical stores.</div>
              </a>
              <a href="/solutions/prevent-overselling" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Preventing Overselling Guide →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Technical breakdown of solving multi-channel stock conflicts.</div>
              </a>
              <a href="/industries/beauty" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Beauty & Cosmetics POS →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>High SKU count and batch tracking retail management.</div>
              </a>
              <a href="/woocommerce-pos-nigeria" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Retail POS in Nigeria →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Tailored for Nigerian multi-channel retail businesses.</div>
              </a>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Inventory Synchronization FAQs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((f, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>{f.q}</h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion CTA */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '28px', padding: '56px 40px', textAlign: 'center', color: '#ffffff', boxShadow: '0 20px 40px rgba(7, 26, 49, 0.25)' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
              Sync Your Online & In-Store Stock in Under 2 Minutes
            </h2>
            <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 32px' }}>
              Eliminate stock headaches and run a connected WooCommerce business. Start your 7-day free trial today.
            </p>
            <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '16px 40px', fontSize: '16px', display: 'inline-flex' }}>
              <span>Start 7-Day Free Trial</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
