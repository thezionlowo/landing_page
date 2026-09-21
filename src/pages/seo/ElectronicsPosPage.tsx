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
  Monitor,
  Printer,
} from 'lucide-react';

export const ElectronicsPosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/#businesses' },
    { name: 'Electronics & Gadgets', url: '/industries/electronics' },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA assist with high-value gadget and phone accessories sales?',
      a: 'ZAMERIA allows rapid barcode scanning for accessories (chargers, cables, power banks, cases) while maintaining individual serialized SKU tracking for expensive phones, laptops, and smart gadgets.',
    },
    {
      q: 'Can I print itemized warranty and return terms on receipts?',
      a: 'Yes. ZAMERIA’s thermal receipt engine formats custom footer messages, return policies, and warranty claim instructions directly on printed 80mm and 58mm receipts.',
    },
    {
      q: 'Does it support split payments for expensive electronic equipment?',
      a: 'Yes. Customers buying high-value gadgets often pay with a combination of bank transfer, POS card swipe, and cash. ZAMERIA calculates split tender with zero math errors.',
    },
    {
      q: 'Can staff discount electronic products without manager permission?',
      a: 'No. You can restrict discount capabilities so cashiers cannot alter prices or apply discounts beyond your configured rules without a Manager PIN authorization.',
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
              <Monitor size={13} style={{ marginRight: '6px' }} />
              <span>ELECTRONICS & GADGET RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS & Inventory System for Electronics & Gadget Retailers
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Ring up accessories, phones, computers, and audio equipment in seconds. Synchronize high-value stock in real time with your WooCommerce web store.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Explore POS Hardware</span>
              </a>
            </div>
          </div>

          {/* Key Electronics Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Zap size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Rapid Barcode Checkout</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Scan packaged accessories and gadget boxes instantly with standard 1D/2D USB or Bluetooth barcode scanners.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Printer size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Warranty & Serial Receipts</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Print itemized thermal receipts with return policy details, warranty claim timelines, and official store branding.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>High-Value Stock Protection</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Avoid selling the last laptop or smartphone twice. Live inventory deductions update the WooCommerce store within 0.5 seconds.
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
              <a href="/woocommerce-pos-nigeria" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Retail POS in Nigeria →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Tailored for Nigerian multi-channel retail businesses.</div>
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
              Electronics Retail FAQs
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
              Connect Your Gadget Store with ZAMERIA
            </h2>
            <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 32px' }}>
              Upgrade your electronics checkout and safeguard your high-value inventory.
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
