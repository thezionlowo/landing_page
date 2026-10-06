import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  Terminal,
} from 'lucide-react';

export const WooCommerceStockNotUpdatingPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#product-powers' },
    { name: 'WooCommerce Stock Not Updating', url: '/solutions/woocommerce-stock-not-updating' },
  ];

  const diagnosticCauses = [
    {
      title: '1. WP-Cron Scheduled Task Latency',
      desc: 'WordPress cron (wp-cron.php) only executes when visitors trigger HTTP page hits. During slow traffic periods, background stock synchronization tasks get delayed for hours unless a server-level system cron is manually configured.',
      fix: 'ZAMERIA uses real-time event-driven webhooks and direct REST execution rather than relying on unreliable WP-Cron triggers.',
    },
    {
      title: '2. Aggressive Object & Page Caching',
      desc: 'Plugins like WP Rocket, LiteSpeed Cache, or Redis Object Cache often cache WooCommerce REST endpoints and product page payloads. When stock decrements in your database, visitors and POS cashiers continue seeing cached stale numbers.',
      fix: 'ZAMERIA bypasses front-end page caches by executing atomic database transactions directly against WooCommerce stock tables.',
    },
    {
      title: '3. Disconnected POS Periodic Polling Intervals',
      desc: 'Legacy third-party POS connectors poll WooCommerce every 15, 30, or 60 minutes. In a physical store, if a customer buys an item at 2:05 PM, your website does not know until 2:35 PM, creating a 30-minute window for double sales.',
      fix: 'ZAMERIA triggers sub-second bi-directional inventory updates the exact moment the receipt is printed or the transaction completes.',
    },
    {
      title: '4. Non-Atomic Inventory Race Conditions',
      desc: 'During flash sales or busy retail hours, two buyers (one online, one in-store) checkout the last remaining unit within seconds. Standard WooCommerce checkout lacks real-time POS locking, resulting in negative stock values.',
      fix: 'ZAMERIA implements atomic stock locking that blocks the second checkout before it completes.',
    },
  ];

  const faqs = [
    {
      q: 'Why does my WooCommerce inventory show different counts on the website vs my store shelves?',
      a: 'This discrepancy happens when in-store physical sales are not immediately written to your WooCommerce database. If you ring up sales on a disconnected register or spreadsheet, the website continues to show unsold units until someone manually reconciles the inventory.',
    },
    {
      q: 'Can caching plugins cause WooCommerce stock not to update?',
      a: 'Yes. Caching plugins like WP Rocket, W3 Total Cache, or server-level Varnish caches can serve stale HTML where the "Add to Cart" button or inventory count hasn’t updated. Ensuring WooCommerce REST endpoints are excluded from caching is crucial.',
    },
    {
      q: 'How does ZAMERIA permanently fix WooCommerce stock mismatch?',
      a: 'ZAMERIA connects your physical counter register directly to your WooCommerce store via a lightweight companion plugin. Every barcode scan and counter sale updates WooCommerce stock in sub-second time, keeping your physical shelves and digital website 100% synchronized.',
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
              <AlertTriangle size={13} style={{ marginRight: '6px' }} />
              <span>TECHNICAL DIAGNOSTIC & SOLUTION GUIDE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce Stock Not Updating? Causes & How to Fix It Permanently
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px' }}>
              Diagnose why your WooCommerce inventory gets out of sync with physical sales, and learn how sub-second event synchronization eliminates stock mismatch forever. <strong>ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Fix Stock Sync With ZAMERIA</span>
                <ArrowRight size={15} />
              </a>
              <a href="/solutions/stock-mismatch" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Fix Stock Mismatch</span>
              </a>
            </div>
          </div>

          {/* 4 Root Causes Breakdown */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Why WooCommerce Stock Fails to Update
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Retailers running both a WooCommerce store and a physical shop frequently battle four hidden technical causes.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {diagnosticCauses.map((cause, idx) => (
                <div key={idx} style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>
                    {cause.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {cause.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#166534' }}>
                    <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>ZAMERIA Solution:</strong> {cause.fix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '44px 36px', marginBottom: '64px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '32px', textAlign: 'center' }}>
              Frequently Asked Questions: Stock Not Updating in WooCommerce
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
              Eliminate WooCommerce Stock Delays Forever
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Connect your physical retail counters to WooCommerce with sub-second synchronization. Start your 7-day free trial now.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <span>Learn How Sync Works</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
