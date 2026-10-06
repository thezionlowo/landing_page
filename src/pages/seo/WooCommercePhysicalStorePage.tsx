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
  Globe,
  Layers,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Database,
  Lock,
} from 'lucide-react';

export const WooCommercePhysicalStorePage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Product', url: '/woocommerce-pos' },
    { name: 'Physical Store', url: '/woocommerce-physical-store' },
  ];

  const faqs = [
    {
      q: 'I run a WooCommerce website and have a physical shop. How does ZAMERIA help me?',
      a: 'ZAMERIA bridges your online WooCommerce store with your physical store register. When you sell an item at your physical counter, the stock is automatically deducted from your online store in real time. When an online customer places an order, your in-store register reflects the new stock count immediately.',
    },
    {
      q: 'Do I need to maintain two separate product catalogs?',
      a: 'No. Your existing WooCommerce catalog serves as the single source of truth. Products, variations, prices, images, and descriptions sync straight to your in-store register without double data entry.',
    },
    {
      q: 'How does ZAMERIA prevent overselling between online and in-store shoppers?',
      a: 'ZAMERIA uses atomic inventory locking. When a physical cashier adds the last in-stock item to the POS cart and rings it up, the online store inventory drops to 0 in sub-second time, preventing online customers from buying out-of-stock items.',
    },
    {
      q: 'What hardware do I need in my physical store?',
      a: 'You can use hardware you already own: any desktop computer, laptop, iPad, or Android tablet. Connect standard USB or Bluetooth barcode scanners and ESC/POS thermal receipt printers.',
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
              <span>ONLINE STORE + PHYSICAL STORE UNIFICATION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              Running WooCommerce With a Physical Store? Connect Them Seamlessly.
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong> One business. One product catalog. One source of truth.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/solutions/prevent-overselling" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Prevent Overselling Online</span>
              </a>
            </div>
          </div>

          {/* Visual Architecture: Online + Physical = One Unified System */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                The Modern Omnichannel Formula for WooCommerce Retailers
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                You shouldn't have to choose between selling online and selling in person. With ZAMERIA, both channels operate from a single synchronized database.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '28px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Globe size={24} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Your Online Website</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Global customers shop 24/7 on your WooCommerce site. Every order updates your master stock count automatically.
                </p>
              </div>

              <div style={{ padding: '28px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Store size={24} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Your Physical Store</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Walk-in shoppers buy at your counter. Cashiers scan barcodes, take card/cash payments, and print thermal receipts.
                </p>
              </div>

              <div style={{ padding: '28px', borderRadius: '16px', backgroundColor: '#071A31', color: '#ffffff', border: '1px solid #1e293b', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <RefreshCw size={24} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>ZAMERIA Sync Engine</h4>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                  Sub-second event-driven synchronization guarantees that when stock sells in either channel, both are instantly updated.
                </p>
              </div>
            </div>
          </div>

          {/* Real Operational Problems Solved */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                No More Double Sales
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Selling the last item in your physical boutique instantly marks it sold out online. You never have to email a customer to cancel their order.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Database size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Single Product Catalog
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Add new products, upload images, and configure variation matrices once in WooCommerce. They appear in your POS register immediately.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShoppingBag size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Unified Sales Reporting
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                View your complete business performance from your WordPress dashboard. See total revenue across web checkouts and counter registers.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions: WooCommerce With a Physical Store
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
              Unify Your Online Store and Physical Counter Today
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Experience the power of one synchronized catalog with ZAMERIA. Start your 7-day free trial now.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>View POS Capabilities</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
