import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Scale,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sparkles,
  WifiOff,
  HelpCircle,
  Award,
} from 'lucide-react';

export const FooSalesVsOliverPosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/woocommerce-pos-vs-traditional-pos' },
    { name: 'FooSales vs Oliver POS', url: '/comparisons/foosales-vs-oliver-pos' },
  ];

  const showdownMetrics = [
    {
      criterion: 'Core Architecture',
      foosales: 'REST API Bridge + Mobile Tablet Apps',
      oliver: 'Direct WordPress Plugin + Cloud Bridge',
      zameria: 'Headless Sub-Second Cloud Engine + IndexedDB',
    },
    {
      criterion: 'Inventory Sync Latency',
      foosales: '2 – 5 seconds (API polling dependent)',
      oliver: '3 – 8 seconds (can freeze under heavy traffic)',
      zameria: '< 1 second (sub-second websocket locks)',
    },
    {
      criterion: 'Offline Checkout Mode',
      foosales: 'Partial (requires prior caching; drops checkout)',
      oliver: 'Unreliable (requires constant online connection)',
      zameria: 'Complete (Local IndexedDB caching + offline receipts)',
    },
    {
      criterion: 'Annual Base Price',
      foosales: '$228 – $360/year per store',
      oliver: '$240 – $500+/year per register',
      zameria: '₦200,000/yr (~$130/yr) flat',
    },
    {
      criterion: 'Hardware Freedom',
      foosales: 'Primarily iOS/Android tablets + Square readers',
      oliver: 'Pushes proprietary Oliver hardware bundles',
      zameria: 'Any PC, Mac, laptop, tablet, standard 80mm printers',
    },
    {
      criterion: 'Multi-Tender Split Payments',
      foosales: 'Basic (limited outside Stripe/Square)',
      oliver: 'Basic (restricted to specific gateways)',
      zameria: 'Native (Cash + POS Card + Bank Transfer on 1 order)',
    },
    {
      criterion: 'Impact on WordPress Server',
      foosales: 'Medium (frequent webhook triggers)',
      oliver: 'High (can cause 504 timeouts on shared hosts)',
      zameria: 'Zero (processed off-server via edge API)',
    },
  ];

  const faqs = [
    {
      q: 'Which is better overall: FooSales or Oliver POS?',
      a: 'FooSales is generally better for merchants who want a dedicated iPad register app and already use Square or Stripe card readers in North America or Europe. Oliver POS appeals to users wanting an easy freemium start inside WordPress. However, both platforms suffer from high dollar renewal costs, sync delays during rush hours, and lack of support for multi-tender split payments.',
    },
    {
      q: 'Why does ZAMERIA outperform both FooSales and Oliver POS in retail stability?',
      a: 'ZAMERIA was built from the ground up to solve the #1 flaw of traditional WooCommerce POS systems: database locks and sync lag. While FooSales and Oliver POS rely on scheduled API polling that can delay stock updates by seconds or minutes, ZAMERIA uses sub-second bi-directional inventory locking with an offline IndexedDB buffer.',
    },
    {
      q: 'Can I connect thermal receipt printers and barcode scanners without buying proprietary kits?',
      a: 'Yes! Unlike Oliver POS which markets proprietary hardware terminals, ZAMERIA is 100% hardware-agnostic. Any standard 80mm ESC/POS thermal receipt printer (Epson, Xprinter, Star Micronics) and USB/Bluetooth barcode scanner works instantly.',
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
                    <a href={b.url} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                      {b.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Hero */}
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 56px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 18px', display: 'inline-flex' }}>
              <Scale size={13} style={{ marginRight: '6px' }} />
              <span>2026 WOOCOMMERCE POS SHOWDOWN</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              FooSales vs Oliver POS vs ZAMERIA: Which WooCommerce POS is Best?
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '760px', margin: '0 auto 32px' }}>
              Comparing FooSales and Oliver POS for your retail store? Review this objective 3-way analysis of synchronization latency, offline resilience, hardware flexibility, and total cost of ownership.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Try ZAMERIA Free for 7 Days</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View Best WooCommerce POS Guide</span>
              </a>
            </div>
          </div>

          {/* 3-Way Showdown Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-subtle)', padding: '40px', boxShadow: '0 8px 30px rgba(7, 26, 49, 0.04)', marginBottom: '72px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eef2ff', color: '#4338ca', padding: '6px 14px', borderRadius: '9999px', fontSize: '12.5px', fontWeight: 700, marginBottom: '12px' }}>
                <Award size={14} />
                <span>ARCHITECTURAL COMPARISON</span>
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '10px' }}>
                Side-by-Side: FooSales vs Oliver POS vs ZAMERIA
              </h2>
              <p style={{ fontSize: '15.5px', color: 'var(--text-muted)' }}>
                Comparing technical performance, uptime, hardware compatibility, and costs.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '22%' }}>CRITERIA</th>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: '#334155', width: '26%' }}>FooSales</th>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: '#334155', width: '26%' }}>Oliver POS</th>
                    <th style={{ padding: '16px 20px', fontSize: '15px', fontWeight: 800, color: '#4338ca', width: '26%', backgroundColor: '#f5f3ff' }}>ZAMERIA (Winner)</th>
                  </tr>
                </thead>
                <tbody>
                  {showdownMetrics.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '18px 20px', fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px' }}>{row.criterion}</td>
                      <td style={{ padding: '18px 20px', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5 }}>{row.foosales}</td>
                      <td style={{ padding: '18px 20px', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5 }}>{row.oliver}</td>
                      <td style={{ padding: '18px 20px', fontSize: '13.5px', color: 'var(--brand-navy)', backgroundColor: '#faf5ff', fontWeight: 600, lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Check size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.zameria}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Verdict Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '72px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '10px' }}>Choose FooSales If:</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                You operate a small market stall in the US or UK, want a tablet-specific iPad application, and are already locked into Square or Stripe credit card terminals.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '10px' }}>Choose Oliver POS If:</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                You want a free tier to test a basic single-register setup inside WordPress, don't mind sync delays, and have reliable, uninterrupted internet connectivity.
              </p>
            </div>

            <div style={{ backgroundColor: '#f5f3ff', borderRadius: '18px', padding: '32px', border: '2px solid #818cf8' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#312e81', marginBottom: '10px' }}>Choose ZAMERIA If:</h3>
              <p style={{ fontSize: '14.5px', color: '#1e1b4b', lineHeight: 1.6 }}>
                You want high-speed checkout, sub-second inventory sync that prevents overselling, true offline protection, split payments, and flat, transparent pricing.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '840px', margin: '0 auto 72px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions: FooSales vs Oliver POS
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={18} color="#4f46e5" style={{ flexShrink: 0 }} />
                    <span>{faq.q}</span>
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, paddingLeft: '28px' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div style={{ background: 'linear-gradient(135deg, #071A31 0%, #0d2847 100%)', borderRadius: '24px', padding: '48px', color: '#ffffff', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
              Test The #1 Modern Alternative Free for 7 Days
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '680px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Connect your WooCommerce catalog in under 2 minutes. No credit card required. Experience sub-second retail checkouts with ZAMERIA.
            </p>
            <a href={ROUTES.trial} className="btn" style={{ backgroundColor: '#ffffff', color: '#071A31', fontWeight: 700, padding: '16px 36px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
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
