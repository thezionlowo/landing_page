import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Plug,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Store,
  Layers,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Download,
  Database,
  Printer,
  WifiOff,
  Cpu,
} from 'lucide-react';

export const WooCommercePosPluginPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Product', url: '/woocommerce-pos' },
    { name: 'WooCommerce POS Plugin', url: '/woocommerce-pos-plugin' },
  ];

  const faqs = [
    {
      q: 'How do I install the ZAMERIA WooCommerce POS plugin?',
      a: 'Download the zameria.zip companion plugin from your merchant portal, upload it via WordPress Admin > Plugins > Add New > Upload Plugin, and activate it. The plugin connects automatically to your store via secure REST API endpoints without requiring complex webhook setups.',
    },
    {
      q: 'Does the plugin slow down my WooCommerce database or website?',
      a: 'No. Unlike legacy POS plugins that flood your wp_posts and wp_postmeta tables with bloated temporary session data, ZAMERIA uses an externalized offline-first client architecture with High-Performance Order Storage (HPOS) compatibility. Your public online store remains lightning fast.',
    },
    {
      q: 'Is the plugin compatible with WooCommerce HPOS (High-Performance Order Storage)?',
      a: 'Yes. ZAMERIA declares full native compatibility with WooCommerce Custom Order Tables (HPOS). Orders created at your physical retail counter are written directly to optimized database tables with zero legacy postmeta overhead.',
    },
    {
      q: 'What hardware works with the ZAMERIA POS plugin?',
      a: 'ZAMERIA runs on standard web browsers (Chrome, Edge, Safari) across any laptop, desktop, iPad, or Android tablet. It supports standard 80mm and 58mm thermal receipt printers (ESC/POS), USB and Bluetooth 1D/2D barcode scanners, and standard cash drawers.',
    },
    {
      q: 'Does the plugin require a recurring monthly subscription per register?',
      a: 'No. ZAMERIA provides flat transparent pricing with unlimited transactions, zero per-transaction cuts, and no punitive hardware lock-in fees.',
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
              <Plug size={13} style={{ marginRight: '6px' }} />
              <span>LIGHTWEIGHT WORDPRESS & WOOCOMMERCE COMPANION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              The Modern WooCommerce POS Plugin for Physical Retail Stores
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Turn your WordPress website into a high-speed in-store checkout register. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync</strong> without database bloat or third-party middleware.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Download Plugin & Start Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Explore POS Features</span>
              </a>
            </div>
          </div>

          {/* Architectural Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Zero Database Bloat
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Traditional WordPress POS plugins run heavy queries directly inside your WordPress admin dashboard, slowing down customer checkouts on your live store. ZAMERIA uses a decoupled, browser-native client that connects cleanly via REST without taxing MySQL.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <WifiOff size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                True Offline-First Architecture
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Most POS plugins freeze the moment your store’s Wi-Fi drops. ZAMERIA caches your product catalog in browser IndexedDB. Cashiers can scan barcodes, ring up sales, and print thermal receipts even during total network blackouts.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                Atomic Sub-Second Stock Locking
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                When a cashier rings up a unit at the physical counter, inventory is decremented on your WooCommerce online catalog in sub-second time. This completely eliminates race conditions and overselling during flash sales.
              </p>
            </div>
          </div>

          {/* How The Plugin Works (3 Simple Steps) */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Connect In Under 2 Minutes
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                No complex server configurations, no developer agency required. Setup is straightforward for any store owner.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              <div style={{ textAlign: 'left', padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', marginBottom: '12px' }}>01</div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Install Zameria Plugin</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Upload the official Zameria plugin to your WordPress dashboard. Activate it in one click. Compatible with WooCommerce 8.0+ and HPOS.
                </p>
              </div>

              <div style={{ textAlign: 'left', padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', marginBottom: '12px' }}>02</div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Pair Register Account</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Sign in with your merchant license. Your WooCommerce products, variable sizes, colors, barcodes, and stock levels sync instantly into the local POS register.
                </p>
              </div>

              <div style={{ textAlign: 'left', padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', marginBottom: '12px' }}>03</div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Start Selling In-Store</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Ring up customers with barcode scanner or manual search. Print thermal receipts. Every sale updates your online WooCommerce stock immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Feature Comparison with Generic Plugins */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Why Store Owners Choose ZAMERIA Over Legacy POS Plugins
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Capability</th>
                    <th style={{ padding: '16px', color: '#6366f1', fontWeight: 700 }}>ZAMERIA POS Plugin</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Traditional POS Plugins</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>Offline Operation</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>IndexedDB caching; rings up sales & prints receipts offline</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>Completely stalls when internet disconnects</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>Sync Latency</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>Sub-second event-driven webhook & REST sync</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>Batched cron jobs every 5–30 minutes</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>Database Impact</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>Zero admin postmeta bloat; HPOS native table support</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>Heavy MySQL table locks during peak in-store hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>Hardware Requirements</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>Runs on any browser, PC, Mac, iPad, or Android tablet</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>Often requires expensive proprietary hardware leasing</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>Pricing Model</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>Predictable flat annual plan; zero transaction cuts</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>Expensive per-register monthly fees + payment fees</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About the WooCommerce POS Plugin
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
              Connect Your Physical Store to WooCommerce Today
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Experience sub-second stock synchronization, lightning-fast barcode scanning, and true offline reliability with ZAMERIA.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Compare Best WooCommerce POS</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
