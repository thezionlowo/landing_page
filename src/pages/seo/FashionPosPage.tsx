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
} from 'lucide-react';

export const FashionPosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/#businesses' },
    { name: 'Fashion & Boutiques', url: '/industries/fashion' },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA handle multiple sizes and color variations for clothing?',
      a: 'ZAMERIA has full native support for WooCommerce variable products. When a cashier selects or scans a dress, shirt, or shoes, a clean variation matrix allows 1-tap selection of Size (XS, S, M, L, XL, XXL) and Color, with individual stock counts displayed per variation.',
    },
    {
      q: 'Can I sell fast-moving fashion items on Instagram and in my boutique simultaneously?',
      a: 'Yes! When you post a new dress collection on Instagram directing buyers to your WooCommerce store, in-store sales and online checkouts deduct from the exact same live inventory in real time, completely eliminating double-selling of limited-edition pieces.',
    },
    {
      q: 'Can cashiers apply promotional discounts or seasonal sale pricing?',
      a: 'Yes. Cashiers can ring up store-wide sales, apply percentage or fixed Naira discounts, and use WooCommerce coupon codes right at the counter, subject to manager permission settings.',
    },
    {
      q: 'Can I print barcode clothing tags with ZAMERIA?',
      a: 'ZAMERIA works with all standard WooCommerce SKU and barcode formats (UPC, EAN, custom serial numbers). You can scan printed swing tags or garment barcodes instantly with any USB or Bluetooth barcode scanner.',
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
              <Tag size={13} style={{ marginRight: '6px' }} />
              <span>BOUTIQUE & APPAREL RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS & Inventory System for Fashion Stores & Boutiques
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Manage multi-size and color variations, ring up boutique counter checkouts in seconds, and keep your online WooCommerce apparel store synchronized with your physical shop.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>See Variation Stock Sync</span>
              </a>
            </div>
          </div>

          {/* Key Fashion Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Layers size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Size & Color Matrix</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Instantly view stock availability across all sizes and color variations. Cashiers can switch sizes on the fly without cluttering the screen.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Social & In-Store Stock Harmony</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Sell through Instagram, your website, and in-store. When the last medium-size dress sells in your boutique, online stock drops to 0 instantly.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShoppingBag size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Boutique Customer Profiles</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Attach walk-in shoppers to customer profiles to track purchase history, size preferences, and reward your most loyal VIP fashion clients.
              </p>
            </div>
          </div>

          {/* Related Solutions Navigation */}
          <div style={{ backgroundColor: 'var(--surface-white)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '36px', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '20px' }}>Related Retail Solutions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <a href="/woocommerce-pos" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>WooCommerce POS System →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>High-speed register features and hardware support.</div>
              </a>
              <a href="/woocommerce-inventory-sync" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Inventory Synchronization →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Real-time catalog and variation stock sync.</div>
              </a>
              <a href="/industries/beauty" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Beauty & Cosmetics POS →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Inventory solution for cosmetics and wellness stores.</div>
              </a>
              <a href="/solutions/prevent-overselling" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Preventing Overselling Guide →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>How to eliminate out-of-stock orders and refunds.</div>
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Fashion & Boutique Retail FAQs
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
              Upgrade Your Fashion Boutique to ZAMERIA
            </h2>
            <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 32px' }}>
              Join forward-thinking apparel retailers who sell online and in-store seamlessly. Start your 7-day free trial now.
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
