import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  WifiOff,
  Database,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const OfflinePosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#features' },
    { name: 'WooCommerce Offline POS', url: '/solutions/offline-pos' },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA allow cashiers to sell when the store internet drops?',
      a: 'ZAMERIA uses an offline-first architecture powered by browser IndexedDB caching. Your entire WooCommerce product catalog, variations, barcodes, and pricing are stored locally on the cashier machine. When network connection is lost, cashiers can continue barcode scanning, cart additions, and receipt printing without interruption.',
    },
    {
      q: 'What happens to sales and receipts processed while offline?',
      a: 'Offline sales are safely queued in an encrypted local database. When internet connection returns, ZAMERIA automatically replays and synchronizes all offline transactions with WooCommerce in the exact chronological sequence they occurred.',
    },
    {
      q: 'Can cashiers print 80mm thermal receipts during internet outages?',
      a: 'Yes. Since receipt printing communicates directly with local thermal printers (via USB or local Wi-Fi/Bluetooth), physical receipts print instantly without needing an external cloud connection.',
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
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 64px' }}>
            <div className="eyebrow-badge blue" style={{ margin: '0 auto 20px' }}>
              <WifiOff size={13} style={{ marginRight: '6px' }} />
              <span>OFFLINE-FIRST ARCHITECTURE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce Offline POS — Keep Selling When Internet Goes Down
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Never freeze your checkout queue during internet cuts, fiber outages, or poor cellular reception. Ring up sales offline and sync automatically upon reconnection.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Explore POS Features</span>
              </a>
            </div>
          </div>

          {/* Offline Architecture Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Database size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Local IndexedDB Storage</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Your complete product catalog, barcodes, variations, and prices are securely cached in the register's local memory for instant zero-latency access.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Zap size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Uninterrupted Counter Flow</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Cashiers can continue barcode scanning, applying discounts, collecting cash/card payments, and issuing thermal receipts without error screens.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Automated Re-Sync</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                The second internet connectivity is restored, queued sales and inventory reductions are automatically transmitted to WooCommerce without data loss.
              </p>
            </div>
          </div>

          {/* Real-World Retail Reliability */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              Why Cloud-Only POS Systems Fail Physical Retailers
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '28px' }}>
              Internet connections drop unexpectedly due to fiber maintenance, power hiccups, or poor telco coverage. When a cloud-only POS freezes, your checkout line grinds to a halt. ZAMERIA is engineered offline-first so you never miss a sale.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Offline cash, POS card, and transfer recording</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Instant thermal receipt printing directly from local printer</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Encrypted transaction queue prevents duplicate orders</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Automatic background sync requiring zero manual intervention</span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '820px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '36px' }}>
              Offline POS FAQs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>{faq.q}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="glass-card" style={{ backgroundColor: '#071A31', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '14px', color: '#ffffff' }}>
              Deploy Resilient Offline-Ready POS for WooCommerce
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Protect your retail operations from unexpected network interruptions today.
            </p>
            <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '14px 32px', fontSize: '15px' }}>
              <span>Start Free 7-Day Trial</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
