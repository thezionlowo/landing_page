import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Sparkles,
  Layers,
  RefreshCw,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Users,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Tag,
  Search,
} from 'lucide-react';

export const BeautyPosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/#businesses' },
    { name: 'Beauty & Cosmetics', url: '/industries/beauty' },
  ];

  const faqs = [
    {
      q: 'Can ZAMERIA handle hundreds of skincare and cosmetics SKUs easily?',
      a: 'Yes. ZAMERIA is built with high-performance IndexedDB caching and sub-millisecond search. Whether you have 500 or 5,000 beauty SKUs (lipsticks, serums, foundations, fragrances), product searches and barcode scans respond in under 1ms.',
    },
    {
      q: 'How does ZAMERIA organize beauty brands and product categories?',
      a: 'ZAMERIA automatically mirrors your WooCommerce brand taxonomies and product categories. Staff can filter by brand (e.g. CeraVe, Fenty, Ordinary, House brands) with 1 tap on the POS screen.',
    },
    {
      q: 'Can beauty store staff sell shade variations without confusion?',
      a: 'Yes. Color shade variations, bottle sizes (30ml, 50ml, 100ml), and bundle sets are displayed cleanly with dedicated variation photos, prices, and live stock counts.',
    },
    {
      q: 'Does it support fast thermal receipt printing for walk-in cosmetic buyers?',
      a: 'Yes. ZAMERIA prints crisp 80mm and 58mm thermal receipts with your beauty studio/store logo, itemized shade names, tax breakdowns, and custom care instructions or return policies.',
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
                    <a href={b.url} style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-primary">
                      {b.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Hero */}
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 64px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 20px' }}>
              <Sparkles size={13} style={{ marginRight: '6px' }} />
              <span>BEAUTY, SKINCARE & COSMETICS RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS & Inventory Management for Beauty & Cosmetics Retailers
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Seamlessly manage thousands of beauty SKUs, foundation shades, skincare lines, and perfume variations across your WooCommerce website and physical retail counter.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Explore POS Features</span>
              </a>
            </div>
          </div>

          {/* Key Beauty Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Search size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Sub-Millisecond SKU Search</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Instant search across thousands of beauty products by brand name, formula type, shade code, or barcode scan.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Layers size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Shade & Bottle Size Matrix</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Easily select foundation shades or fragrance sizes on the POS screen with live per-variation stock levels displayed.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Real-Time Multi-Channel Sync</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                When popular serums or lip glosses sell out in your store, website stock updates automatically, preventing backorders.
              </p>
            </div>
          </div>

          {/* Related Solutions Navigation */}
          <div style={{ backgroundColor: 'var(--surface-white)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '36px', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '20px' }}>Related Retail Solutions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <a href="/woocommerce-pos" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>WooCommerce POS System →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Learn how our counter register integrates with WooCommerce.</div>
              </a>
              <a href="/woocommerce-inventory-sync" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Real-Time Inventory Sync →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Automatic stock synchronization for multi-channel stores.</div>
              </a>
              <a href="/industries/fashion" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Fashion & Boutique POS →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Size, color & variation matrix counter selling.</div>
              </a>
              <a href="/woocommerce-pos-nigeria" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Retail POS in Nigeria →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Tailored for Nigerian multi-channel retail businesses.</div>
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Beauty & Cosmetics Retail FAQs
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

          {/* CTA */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '28px', padding: '56px 40px', textAlign: 'center', color: '#ffffff', boxShadow: '0 20px 40px rgba(7, 26, 49, 0.25)' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
              Connect Your Cosmetics Store to ZAMERIA
            </h2>
            <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 32px' }}>
              Start ringing up beauty sales faster and keep your online store synchronized in real time.
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
