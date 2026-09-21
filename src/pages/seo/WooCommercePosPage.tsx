import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  ShoppingCart,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Store,
  Layers,
  Users,
  Printer,
  WifiOff,
  ArrowRight,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const WooCommercePosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#product-powers' },
    { name: 'WooCommerce POS', url: '/woocommerce-pos' },
  ];

  const faqs = [
    {
      q: 'What is a WooCommerce POS system?',
      a: 'A WooCommerce Point of Sale (POS) system connects your web catalog with an in-store counter checkout register. It lets retail staff scan barcodes, accept card/cash payments, and print thermal receipts while keeping your online inventory and physical stock synchronized in real time.',
    },
    {
      q: 'How does ZAMERIA POS connect to WooCommerce?',
      a: 'ZAMERIA connects directly via its secure WordPress companion plugin. It pulls your existing products, variable variations, prices, and stock counts into the POS register in seconds, without requiring third-party middleware or separate inventory databases.',
    },
    {
      q: 'Does ZAMERIA POS work offline if internet fails?',
      a: 'Yes. ZAMERIA is built with offline-first local IndexedDB storage. You can continue scanning barcodes, completing counter sales, and printing receipts even during network outages. Transactions queue securely and sync back to WooCommerce automatically when internet reconnects.',
    },
    {
      q: 'Can multiple cashiers use ZAMERIA simultaneously?',
      a: 'Yes. ZAMERIA supports multi-cashier and multi-manager roles with individual PIN logins, sales tracking per staff member, private on-hold orders, and customizable permissions.',
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
              <span>OFFICIAL WOOCOMMERCE POINT OF SALE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              Real-Time WooCommerce Point of Sale (POS) for Physical Stores
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Turn any laptop, tablet, or desktop into a lightning-fast retail register. Ring up counter sales, scan barcodes, print 80mm receipts, and keep WooCommerce stock 100% accurate in real time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/#pricing" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View Plans & Pricing</span>
              </a>
            </div>
          </div>

          {/* Problem vs Solution Contrast Grid */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Why Traditional POS Systems Fail WooCommerce Retailers
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Generic POS software forces you to maintain two separate databases, export CSV spreadsheets, and spend hours fixing oversold items. ZAMERIA is built natively for WooCommerce.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '18px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontWeight: 800, fontSize: '14px', marginBottom: '16px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</span>
                  <span>DISCONNECTED POS SYSTEMS</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#7f1d1d' }}>
                  <li>• Counter sales don't update website inventory</li>
                  <li>• Online customers buy products already sold in-store</li>
                  <li>• Staff spend hours on manual stock reconciliation</li>
                  <li>• Prices and discounts have to be updated twice</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '18px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a', fontWeight: 800, fontSize: '14px', marginBottom: '16px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                  <span>THE ZAMERIA CONNECTED POS</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#14532d' }}>
                  <li>• Counter checkout reduces WooCommerce stock in 0.5s</li>
                  <li>• Online orders immediately reflect on in-store registers</li>
                  <li>• Zero manual spreadsheets or CSV imports required</li>
                  <li>• Single master catalog for prices, barcodes & variations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Core POS Features Grid */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Everything You Need for High-Speed Counter Selling
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Engineered for speed, reliability, and ease of use so your staff can ring up customers in seconds.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Zap size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Sub-Second Barcode Scanning</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Scan USB, Bluetooth, or built-in camera barcodes. Instant product lookup with automated variation matching (size, color, weight).
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Printer size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>80mm Thermal Receipt Printing</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Clean, continuous thermal receipt formatting with your custom store logo, order breakdown, tax calculation, and custom footer messages.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <WifiOff size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Offline Selling Protection</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Network drops never stop your sales. Sell offline with local IndexedDB storage and sync orders automatically once internet returns.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Staff Roles & PIN Security</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Set up Cashiers and Shop Managers with distinct permissions. Prevent unauthorized price modifications and track sales performance per staff member.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <RefreshCw size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Split & Flexible Payments</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Accept cash, POS card terminals, bank transfers, and split payments on a single order with accurate change calculations.
                </p>
              </div>

              <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Hold & Resume Carts</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Put a customer's cart on hold with private notes while they browse more items, and resume checkout instantly when they return to the till.
                </p>
              </div>
            </div>
          </div>

          {/* Related Solutions Cross-Linking */}
          <div style={{ backgroundColor: 'var(--surface-white)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '36px', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '20px' }}>Explore Related WooCommerce Retail Solutions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <a href="/woocommerce-inventory-sync" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Inventory Synchronization →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Real-time stock sync between counter & online catalog.</div>
              </a>
              <a href="/woocommerce-pos-nigeria" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>WooCommerce POS Nigeria →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Local currency, transfer & POS card payments support.</div>
              </a>
              <a href="/industries/fashion" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Fashion & Boutique POS →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Size, color & variation matrix counter selling.</div>
              </a>
              <a href="/solutions/prevent-overselling" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px', marginBottom: '4px' }}>Prevent Overselling →</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>How to prevent stock mismatches and customer refunds.</div>
              </a>
            </div>
          </div>

          {/* Dedicated FAQ Accordion */}
          <div style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              WooCommerce POS Frequently Asked Questions
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
              Connect Your WooCommerce Store to Your Physical Counter Today
            </h2>
            <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 32px' }}>
              Join retailers who eliminated inventory mismatches and started selling in-person with ZAMERIA. Start your 7-day free trial in under 2 minutes.
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
