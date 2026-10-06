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
  Layers,
  HelpCircle,
} from 'lucide-react';

export const WooCommercePosComparisonPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/best-woocommerce-pos' },
    { name: 'WooCommerce POS Comparison', url: '/woocommerce-pos-comparison' },
  ];

  const comparisonRows = [
    {
      feature: 'Online & In-Store Stock Sync',
      zameria: 'Sub-second real-time bi-directional sync directly to WooCommerce.',
      traditional: 'Batched cron jobs or manual CSV exports causing 15–60 min delays.',
      wcpos: 'Direct REST API sync, but requires Pro for advanced features.',
    },
    {
      feature: 'Offline POS Capability',
      zameria: 'Full IndexedDB offline register. Rings up sales & prints receipts offline.',
      traditional: 'Fails or freezes entirely when internet goes down.',
      wcpos: 'Local browser cache, but sync conflicts can occur on reconnect.',
    },
    {
      feature: 'Hardware Compatibility',
      zameria: 'Runs on any device (PC, Mac, iPad, Android). Standard ESC/POS printers.',
      traditional: 'Requires expensive proprietary terminal hardware leasing.',
      wcpos: 'Browser-based, supports standard web printing.',
    },
    {
      feature: 'Product Variations & SKUs',
      zameria: 'Native WooCommerce variable product matrices with atomic stock locks.',
      traditional: 'Struggles with variation models, leading to SKU mismatches.',
      wcpos: 'Supports variable products via WooCommerce REST API.',
    },
    {
      feature: 'Pricing Model',
      zameria: 'Predictable flat annual license. Unlimited orders, 0% transaction fee.',
      traditional: 'High monthly register fees + mandatory payment processor cuts.',
      wcpos: 'Free core version; paid Pro tier for multi-outlet & barcode features.',
    },
    {
      feature: 'Split Tender Support',
      zameria: 'Native split payments: cash, card terminal, bank transfer on one bill.',
      traditional: 'Usually restricted to proprietary payment processors.',
      wcpos: 'Requires Pro extensions or custom setup.',
    },
  ];

  const faqs = [
    {
      q: 'Why does using a standalone POS cause inventory problems for WooCommerce merchants?',
      a: 'When you run a standalone POS that is disconnected from WooCommerce, in-store sales are not deducted from your website in real time. If an online shopper buys the same product before you manually update stock, you oversell, leading to embarrassing customer refund calls and negative reviews.',
    },
    {
      q: 'How does ZAMERIA compare to generic cloud POS systems?',
      a: 'Generic cloud POS systems (like Square, Clover, or Lightspeed) treat WooCommerce as an afterthought through brittle third-party webhook integrations. ZAMERIA is built specifically for WooCommerce—your WordPress database is the direct single source of truth.',
    },
    {
      q: 'Can I switch from my existing POS to ZAMERIA without losing my WooCommerce products?',
      a: 'Yes. Because ZAMERIA uses your existing WooCommerce product catalog, you do not need to export, import, or reformat your product data. Activating ZAMERIA connects your existing products immediately.',
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
              <Scale size={13} style={{ marginRight: '6px' }} />
              <span>IN-DEPTH RETAIL SYSTEM COMPARISON</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS Comparison: Connected POS vs Standalone Systems
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Evaluating point-of-sale systems for your retail store? See how connected WooCommerce POS solutions compare against legacy standalone systems and cloud ERPs. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View Top 5 POS Systems</span>
              </a>
            </div>
          </div>

          {/* Detailed Side-by-Side Comparison Table */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Connected WooCommerce POS vs Legacy Standalone POS
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Capability</th>
                    <th style={{ padding: '16px', color: '#6366f1', fontWeight: 700 }}>ZAMERIA Connected POS</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Legacy Standalone POS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)' }}>{row.feature}</td>
                      <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>{row.zameria}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions About WooCommerce POS Comparison
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

          {/* CTA Banner */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Upgrade to the Modern Connected WooCommerce POS
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Stop double data entry. Stop inventory lag. Try ZAMERIA free for 7 days.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/alternatives" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Explore Alternatives Hub</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
