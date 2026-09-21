import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  MapPin,
  CreditCard,
  WifiOff,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Store,
  Layers,
  Users,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export const WooCommercePosNigeriaPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#product-powers' },
    { name: 'WooCommerce POS Nigeria', url: '/woocommerce-pos-nigeria' },
  ];

  const faqs = [
    {
      q: 'Is ZAMERIA designed for Nigerian retail businesses?',
      a: 'Yes. ZAMERIA is built specifically for Nigerian merchants operating physical stores in Lagos, Abuja, Port Harcourt, Ibadan, and across the country who also sell online with WooCommerce. It natively handles local retail workflows including cash, bank transfer, and POS card terminal payments in Naira (₦).',
    },
    {
      q: 'Does ZAMERIA work during internet network downtime or power outages?',
      a: 'Yes. ZAMERIA POS runs locally in the browser with offline IndexedDB storage. If your shop experiences internet or telco network downtime, your staff can continue scanning barcodes, completing counter sales, and printing receipts. When internet returns, all offline sales synchronize to WooCommerce automatically.',
    },
    {
      q: 'How much does ZAMERIA cost in Nigeria?',
      a: 'ZAMERIA offers transparent annual pricing in Naira: Starter is ₦200,000 per year (up to 500 products, 2 staff accounts), and Business is ₦300,000 per year (unlimited products, unlimited staff accounts). Every plan includes a 7-day free trial with no payment required upfront.',
    },
    {
      q: 'What hardware (barcode scanners, receipt printers) can I use in Nigeria?',
      a: 'ZAMERIA is hardware-agnostic. It works with standard USB and Bluetooth 1D/2D barcode scanners, 80mm and 58mm thermal receipt printers (ESC/POS compatible), and runs on any standard Windows laptop, Mac, iPad, or Android tablet.',
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

          {/* Hero Section */}
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 64px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 20px' }}>
              <MapPin size={13} style={{ marginRight: '6px' }} />
              <span>BUILT FOR NIGERIAN RETAILERS</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              Complete WooCommerce POS & Inventory Management System for Nigerian Retailers
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Connect your physical store in Ikeja, Lekki, Victoria Island, Abuja, or Port Harcourt with your WooCommerce online store. High-speed counter sales, offline reliability, Naira payments, and instant stock sync.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/#pricing" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View Naira Pricing</span>
              </a>
            </div>
          </div>

          {/* Localized Retail Realities Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Built to Solve Nigerian Retail Challenges
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Retail in Nigeria has unique operational demands: unpredictable network connectivity, high volume of bank transfers, and multi-staff cashier operations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '28px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <CreditCard size={20} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Naira Payment Flexibility</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
                  Accept POS card payments, Nigerian bank direct transfers, cash, and split payments on the same order. Automatic change calculation prevents cashier math errors.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '28px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <WifiOff size={20} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Telco Network & Power Drop Proof</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
                  When MTN, Airtel, or fiber internet drops, ZAMERIA doesn't freeze. Cashiers continue scanning products and ringing up sales offline without interruption.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '28px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Staff Accountability & Anti-Fraud</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
                  Individual cashier PIN logins ensure every completed sale, discount, and hold order is attributed to the exact staff member. Cashiers cannot modify selling prices.
                </p>
              </div>
            </div>
          </div>

          {/* Nigerian Retail Verticals */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Powering Leading Nigerian Retail Sectors
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                From luxury boutiques in Lekki Phase 1 to electronics retailers in Computer Village and supermarkets across Abuja.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Fashion Boutiques & Apparel</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                  Manage multiple sizes, colors, and fabric variations. Sell on Instagram, your WooCommerce website, and in-store without overselling.
                </p>
                <a href="/industries/fashion" style={{ fontSize: '13.5px', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Learn more for Fashion Stores →</a>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Beauty, Skincare & Cosmetics</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                  Track hundreds of skincare formulations, makeup shades, and brand categories with rapid barcode lookup at checkout.
                </p>
                <a href="/industries/beauty" style={{ fontSize: '13.5px', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Learn more for Beauty Stores →</a>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Phones, Electronics & Gadgets</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                  High-value accessory scanning, thermal warranty receipt printing, and live stock tracking across accessories and devices.
                </p>
                <a href="/industries/electronics" style={{ fontSize: '13.5px', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Learn more for Electronics →</a>
              </div>
            </div>
          </div>

          {/* Related Solutions Navigation */}
          <div style={{ backgroundColor: 'var(--surface-white)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '36px', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '20px' }}>Explore Related Solutions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <a href="/woocommerce-pos" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>WooCommerce POS System →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Learn how our counter register integrates with WooCommerce.</div>
              </a>
              <a href="/woocommerce-inventory-sync" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Real-Time Inventory Sync →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Automatic stock synchronization for multi-channel stores.</div>
              </a>
              <a href="/solutions/prevent-overselling" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Preventing Overselling Guide →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>How to eliminate out-of-stock orders and refunds.</div>
              </a>
              <a href="/#pricing" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>ZAMERIA Pricing Plans →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Starter (₦200k/yr) and Business (₦300k/yr) plans.</div>
              </a>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions for Nigerian Retailers
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
              Start Selling in Your Store with ZAMERIA Today
            </h2>
            <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 32px' }}>
              Empower your staff, protect your inventory, and give your store the retail operating system it deserves.
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
