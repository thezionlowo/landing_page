import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Layers,
  ArrowRight,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  Store,
  Boxes,
  Zap,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';

export const MultiStoreInventorySyncPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/solutions/multi-store-inventory-sync' },
    { name: 'Multi-Store Inventory Sync', url: '/solutions/multi-store-inventory-sync' },
  ];

  const syncFeatures = [
    {
      icon: <Store size={22} />,
      title: 'Unified Multi-Location Catalog',
      desc: 'Manage inventory across two, three, or twenty physical retail outlets and your WooCommerce website from a single, unified command center.',
    },
    {
      icon: <RefreshCw size={22} />,
      title: 'Sub-Second Global Stock Reservation',
      desc: 'When an item sells out at your flagship store, that exact SKU is immediately decremented from your central warehouse and online storefront without latency.',
    },
    {
      icon: <Boxes size={22} />,
      title: 'Inter-Branch Stock Transfers',
      desc: 'Shift stock between branches with automated dispatch notes, receiver sign-offs, and in-transit tracking to eliminate discrepancies.',
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Per-Branch Sales & Margin Analytics',
      desc: 'Compare revenue, top-selling SKUs, and register performance per store branch, identifying profitable inventory allocation trends.',
    },
  ];

  const comparisonTable = [
    {
      feature: 'Sync Architecture',
      zameria: 'Sub-second event-driven webhook sync. Real-time distributed stock locking.',
      legacy: 'Scheduled cron jobs (every 15–60 mins). High risk of overselling during busy shifts.',
    },
    {
      feature: 'Multi-Register Support',
      zameria: 'Unlimited registers per branch. Fast cashier switching via quick PIN authentication.',
      legacy: 'Heavy server load per active register. Frequent timeout errors on shared hosting.',
    },
    {
      feature: 'Stock Allocation Rules',
      zameria: 'Flexible per-store inventory allocation or shared central warehouse pooling.',
      legacy: 'Rigid static stock tables that require third-party addon plugins.',
    },
    {
      feature: 'Inter-Branch Transfers',
      zameria: 'Native dispatch and receiving workflows with real-time discrepancy alerts.',
      legacy: 'Manual CSV exports and manual stock count adjustments.',
    },
    {
      feature: 'Offline Operation',
      zameria: 'Cashiers keep ringing up sales during network outages; local queues auto-merge.',
      legacy: 'Registers lock up or fail to process sales if internet drops.',
    },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA handle multi-store inventory synchronization with WooCommerce?',
      a: 'ZAMERIA connects directly with your WooCommerce database while providing multi-location stock mapping. You can designate specific inventory quantities to individual store locations or pool stock into a shared warehouse. When an in-store cashier scans a barcode, that specific store inventory updates immediately on WooCommerce.',
    },
    {
      q: 'What happens if two customers buy the last item at the exact same moment across two stores?',
      a: 'ZAMERIA utilizes atomic stock reservation locks. When an item is added to an active checkout register or web cart, an instant temporary hold is placed. If stock reaches zero, subsequent scans trigger an immediate out-of-stock alert to prevent double selling.',
    },
    {
      q: 'Can cashiers see inventory levels at other store branches?',
      a: 'Yes! If a customer wants an item or size that is out of stock at Branch A, the cashier can quickly look up real-time stock at Branch B or C, reserve the item, or initiate an inter-branch transfer directly from the POS interface.',
    },
    {
      q: 'Do I need separate WooCommerce installations for each physical store?',
      a: 'No. You run a single, clean WooCommerce store. ZAMERIA seamlessly handles the multi-store routing, multiple cashier registers, and multi-location warehouses under one unified catalog.',
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
              <Layers size={13} style={{ marginRight: '6px' }} />
              <span>MULTI-LOCATION OMNICHANNEL RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              WooCommerce Multi-Store Inventory Sync Built for Growing Retailers
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '750px', margin: '0 auto 32px' }}>
              Stop juggling disconnected spreadsheets and broken multi-inventory plugins. Sync physical branches, pop-up locations, central warehouses, and your online WooCommerce store with zero latency.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Learn How Sync Engine Works</span>
              </a>
            </div>
          </div>

          {/* 4 Feature Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {syncFeatures.map((f, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Side by Side Comparison */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '24px' }}>
              ZAMERIA Real-Time Sync vs Legacy Multi-Inventory Plugins
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Feature / Capability</th>
                    <th style={{ padding: '14px 16px', fontSize: '14px', color: '#4f46e5', fontWeight: 700 }}>ZAMERIA Multi-Store POS</th>
                    <th style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Traditional Multi-Inventory Addons</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: i % 2 === 0 ? '#fbfcfe' : '#ffffff' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--brand-navy)', fontSize: '14px' }}>{row.feature}</td>
                      <td style={{ padding: '16px', color: 'var(--brand-navy)', fontSize: '14px', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <Check size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.zameria}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <X size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{row.legacy}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workflow Walkthrough */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '28px', textAlign: 'center' }}>
              How ZAMERIA Keeps Multiple Branches in Sync
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px' }}>01</div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Register Barcode Scan</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  A cashier at Branch 1 scans an item. ZAMERIA calculates the cart, registers discounts, and tenders payment in under 3 seconds.
                </p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px' }}>02</div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Immediate Inventory Lock</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  The inventory ledger decrements Branch 1 stock immediately. WooCommerce stock counters drop in real time, preventing concurrent online orders.
                </p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px' }}>03</div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Cross-Branch Visibility</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Managers see live sales and stock figures across all branches from any phone or laptop, with automatic low-stock alerts before items run out.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions About Multi-Store Sync
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
              Ready to Unite All Your Stores Under One System?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Connect your WooCommerce store to ZAMERIA and experience seamless multi-location inventory synchronization across every counter.
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
export default MultiStoreInventorySyncPage;
