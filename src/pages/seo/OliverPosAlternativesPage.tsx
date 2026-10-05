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
  AlertTriangle,
  HelpCircle,
  Database,
} from 'lucide-react';

export const OliverPosAlternativesPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Alternatives', url: '/alternatives/oliver-pos' },
    { name: 'Oliver POS Alternatives', url: '/alternatives/oliver-pos' },
  ];

  const comparisonRows = [
    {
      feature: 'Inventory Sync Reliability',
      zameria: 'Sub-second websocket & database locking. Stock updates in < 1s with zero freeze or duplicate orders.',
      oliver: 'Frequent synchronization lag and reported database disconnects during high-volume checkout rushes.',
    },
    {
      feature: 'Server Load & Store Impact',
      zameria: 'Headless cloud processing. Does not run heavy PHP queries inside your WordPress database.',
      oliver: 'Can cause WordPress CPU throttling, slow backend page loads, and REST API timeouts.',
    },
    {
      feature: 'Pricing Transparency',
      zameria: 'Flat annual pricing from ₦200,000/yr (~$130/yr). Unlimited products, registers, and transactions.',
      oliver: 'Freemium tier locks basic analytics; paid tiers jump to $240–$500+/year with per-register fees.',
    },
    {
      feature: 'True Offline Resilience',
      zameria: 'Local IndexedDB engine. Ring up barcode sales and print receipts even if your router goes down.',
      oliver: 'Requires constant cloud connection. When internet cuts, cashiers cannot ring up customer sales.',
    },
    {
      feature: 'Customer Support Quality',
      zameria: 'Dedicated direct live chat and WhatsApp support. Instant response from real WooCommerce engineers.',
      oliver: 'Frequent user complaints on Trustpilot and Reddit regarding slow email ticketing and bot delays.',
    },
    {
      feature: 'Hardware Freedom',
      zameria: 'Works on any laptop, desktop PC, Mac, iPad, or Android tablet with standard 80mm ESC/POS printers.',
      oliver: 'Pushes proprietary Oliver hardware bundles and locked-in card terminals.',
    },
  ];

  const faqs = [
    {
      q: 'Why are WooCommerce merchants switching from Oliver POS to ZAMERIA?',
      a: 'The two primary reasons merchants migrate away from Oliver POS are sync reliability and pricing escalation. Oliver POS frequently experiences synchronization delays where in-store checkouts take minutes to reflect in WooCommerce, leading to double-selling. Furthermore, Oliver POS places restrictive limits on their free tier, forcing merchants into expensive multi-hundred-dollar annual plans.',
    },
    {
      q: 'Does ZAMERIA freeze my WordPress site when processing high-volume counter sales?',
      a: 'No. Unlike traditional plugin architectures that execute heavy SQL loops on your WordPress web server, ZAMERIA uses a high-performance headless cloud engine with local browser caching. Your online shoppers experience zero slowdown, even during peak in-store rush hours.',
    },
    {
      q: 'Can I keep my existing barcode scanners and thermal printers?',
      a: 'Yes! ZAMERIA is 100% hardware-agnostic. It works seamlessly with any standard USB or Bluetooth barcode scanner and ESC/POS thermal receipt printers (Epson, Xprinter, Bixolon, Star Micronics) on laptops, desktops, and tablets.',
    },
    {
      q: 'How fast is the migration from Oliver POS to ZAMERIA?',
      a: 'Migration takes under 2 minutes. Because your products, categories, and inventory are already stored in WooCommerce, you simply connect ZAMERIA to your WooCommerce store. There is zero product data re-entry required.',
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
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 56px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 18px', display: 'inline-flex' }}>
              <Database size={13} style={{ marginRight: '6px' }} />
              <span>STABLE &amp; FAST OLIVER POS ALTERNATIVE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              The Rock-Solid Oliver POS Alternative for WooCommerce Stores
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '740px', margin: '0 auto 32px' }}>
              Frustrated by Oliver POS synchronization lags, database timeouts, and expensive per-register fees? Switch to ZAMERIA — the sub-second, headless WooCommerce POS engineered for zero stockouts and uninterrupted retail checkouts.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/comparisons/foosales-vs-oliver-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Compare FooSales vs Oliver POS</span>
              </a>
            </div>
          </div>

          {/* Contrast Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Zero Sync Disconnects</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                ZAMERIA locks inventory in sub-second intervals. When in-store counter checkout completes, online stock drops instantly. Never apologize to an online customer for an oversold item again.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Zero WordPress CPU Bloat</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Oliver POS queries your WordPress server directly, which can cause 504 gateway timeouts. ZAMERIA runs on a decoupled cloud engine so your website stays blazingly fast.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Scale size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>No Hidden Per-Register Fees</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Unlike Oliver POS which penalizes you with extra fees as your retail team expands, ZAMERIA provides unlimited products and multiple staff members with transparent flat pricing.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-subtle)', padding: '40px', boxShadow: '0 8px 30px rgba(7, 26, 49, 0.04)', marginBottom: '72px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '10px' }}>
                Detailed Comparison: ZAMERIA vs Oliver POS
              </h2>
              <p style={{ fontSize: '15.5px', color: 'var(--text-muted)' }}>
                Compare key architecture, speed, offline resilience, and pricing.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '25%' }}>FEATURE</th>
                    <th style={{ padding: '16px 20px', fontSize: '15px', fontWeight: 800, color: '#4338ca', width: '38%', backgroundColor: '#f5f3ff' }}>ZAMERIA</th>
                    <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '37%' }}>Oliver POS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '18px 20px', fontWeight: 700, color: 'var(--brand-navy)', fontSize: '14px' }}>{row.feature}</td>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: 'var(--brand-navy)', backgroundColor: '#faf5ff', fontWeight: 500, lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.zameria}</span>
                        </div>
                      </td>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <X size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.oliver}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '840px', margin: '0 auto 72px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions About Oliver POS Alternatives
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
              Ready for a Reliable WooCommerce POS?
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '680px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Test ZAMERIA free for 7 days with your real WooCommerce products. No credit card required, zero risk.
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
