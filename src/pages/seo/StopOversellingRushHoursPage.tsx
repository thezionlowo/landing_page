import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Check,
  Zap,
  Lock,
  Clock,
  RefreshCw,
  AlertTriangle,
  Flame,
  HelpCircle,
} from 'lucide-react';

export const StopOversellingRushHoursPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/solutions/prevent-overselling' },
    { name: 'Stop Overselling Rush Hours', url: '/solutions/stop-overselling-rush-hours' },
  ];

  const raceConditionHazards = [
    {
      icon: <Flame size={22} />,
      title: 'Flash Sale Traffic Surges',
      desc: 'When hundreds of online shoppers rush to buy limited clearance stock while in-store counters are ringing up sales, standard WooCommerce plugins trigger duplicate checkouts.',
    },
    {
      icon: <Clock size={22} />,
      title: 'Cron Job Sync Lag (15–60 Mins)',
      desc: 'Legacy multi-channel plugins sync on timed cron schedules. If an item sells in your shop at 2:05 PM, your website may not know until 2:30 PM—leaving a 25-minute window for overselling.',
    },
    {
      icon: <AlertTriangle size={22} />,
      title: 'Costly Customer Apologies & Chargebacks',
      desc: 'Having to contact online shoppers to refund their money and admit you sold their item to an in-store walk-in ruins customer loyalty and damages brand reputation.',
    },
  ];

  const architecturalFixes = [
    {
      step: '01',
      title: 'Atomic Inventory Decrement',
      desc: 'Instead of slow "read-then-write" database calls, ZAMERIA uses atomic database level locks. If only 1 unit remains, the first checkout locks it immediately.',
    },
    {
      step: '02',
      title: 'Sub-Second Webhook Broadcast',
      desc: 'The millisecond a physical cashier scans an item barcode, our bi-directional webhook updates the WooCommerce catalog to prevent cart additions.',
    },
    {
      step: '03',
      title: 'Queue Concurrency Handling',
      desc: 'During peak flash sales, incoming checkout events are sequenced chronologically in an event queue, completely eliminating race conditions.',
    },
  ];

  const faqs = [
    {
      q: 'Why does WooCommerce allow customers to buy out-of-stock items during flash sales?',
      a: 'Standard WooCommerce checks stock at the start of cart addition and again at final payment. In high-traffic rushes, multiple shoppers reach the checkout step before the database commits the first order, resulting in race conditions where multiple orders are approved for the same physical inventory.',
    },
    {
      q: 'How does ZAMERIA stop overselling during Black Friday or weekend rushes?',
      a: 'ZAMERIA connects directly via real-time bi-directional webhooks with atomic stock locking. When an item reaches zero inventory at the counter or online, it is instantly locked across both channels, stopping duplicate orders in under 500 milliseconds.',
    },
    {
      q: 'Does ZAMERIA slow down my WooCommerce website during heavy sales?',
      a: 'No. Traditional POS plugins make heavy REST queries on every search keystroke, overloading shared hosting CPU. ZAMERIA handles catalog search and register caching in the cashier’s browser, communicating only lightweight transactional webhooks back to WooCommerce.',
    },
    {
      q: 'What happens if our physical store loses internet during a flash sale?',
      a: 'ZAMERIA’s offline mode allows cashiers to continue serving physical customers. Offline transactions are assigned high-priority reconciliation timestamps, synchronizing back to WooCommerce immediately upon connection recovery.',
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
              <Lock size={13} style={{ marginRight: '6px' }} />
              <span>HIGH-CONCURRENCY INVENTORY PROTECTION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              How to Stop WooCommerce Overselling During Peak Rush Hours &amp; Flash Sales
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '750px', margin: '0 auto 32px' }}>
              Eliminate double-selling, race conditions, and embarrassing out-of-stock apology emails. Discover how atomic inventory locking synchronizes retail counters and online storefronts under heavy concurrency.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/solutions/prevent-overselling" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Prevent Overselling Guide</span>
              </a>
            </div>
          </div>

          {/* The Pain Points */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {raceConditionHazards.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Architectural Solution */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '28px', textAlign: 'center' }}>
              How ZAMERIA Prevents Overselling at the Database Level
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {architecturalFixes.map((f) => (
                <div key={f.step} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', marginBottom: '8px' }}>{f.step}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions (High-Concurrency Inventory)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {faqs.map((f, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{f.q}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Conversion CTA */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '56px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Never Oversell Again on WooCommerce
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Experience zero sync latency with ZAMERIA. Start your 7-day free trial today.
            </p>
            <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '16px 40px', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
export default StopOversellingRushHoursPage;
