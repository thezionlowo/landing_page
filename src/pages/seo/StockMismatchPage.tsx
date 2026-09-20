import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

export const StockMismatchPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#features' },
    { name: 'Fix WooCommerce Stock Mismatch', url: '/solutions/stock-mismatch' },
  ];

  const faqs = [
    {
      q: 'Why does stock mismatch occur between physical stores and WooCommerce?',
      a: 'Stock mismatch happens when in-store counter checkouts and online web orders operate on disconnected databases or delayed synchronization intervals. When a physical store sells a unit without immediately notifying WooCommerce, the website continues showing the item in stock.',
    },
    {
      q: 'How does ZAMERIA resolve stock discrepancies permanently?',
      a: 'ZAMERIA connects the physical POS directly to WooCommerce via real-time websockets and database transactions. The second a cashier completes a sale, WooCommerce stock decrements instantly. When an online customer places an order, the in-store terminal reflects the updated stock without requiring manual reconciliation.',
    },
    {
      q: 'What happens during an in-store physical stock take or count?',
      a: 'ZAMERIA syncs with your central WooCommerce product inventory. Any adjustments made during physical inventory audits reflect instantly across all connected POS terminals and digital channels.',
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
            <div className="eyebrow-badge orange" style={{ margin: '0 auto 20px' }}>
              <AlertTriangle size={13} style={{ marginRight: '6px' }} />
              <span>INVENTORY DIAGNOSTIC & SOLUTION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              How to Fix WooCommerce Stock Mismatch With Your Physical Store
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Eliminate inventory discrepancies, stop manual stocktaking spreadsheets, and prevent selling products online that were already purchased in-store.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>See Real-Time Sync</span>
              </a>
            </div>
          </div>

          {/* Root Causes of Stock Mismatch */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <AlertTriangle size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Cause 1: Disconnected Cashier POS</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Cashiers ring up items on a standalone terminal or paper book. Online shoppers continue buying the sold units until someone manually edits stock numbers.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Cause 2: Delayed Batch Sync</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Sync tools that update inventory every 30 to 60 minutes create huge timing windows for double-sales during busy afternoon shopping periods.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Lock size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>The Solution: Direct Data Locking</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                ZAMERIA executes atomic stock reductions the moment a barcode is scanned and paid for, eliminating sync delays entirely.
              </p>
            </div>
          </div>

          {/* 3 Step Action Plan */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              3 Steps to 100% Stock Accuracy Across Store and Web
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STEP 1</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', margin: '8px 0 6px' }}>Install ZAMERIA Companion</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Connect your WooCommerce store via our secure plugin in less than 2 minutes.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STEP 2</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', margin: '8px 0 6px' }}>Open Counter POS</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Log into your store register on any laptop, Mac, or tablet and begin barcode scanning.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STEP 3</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', margin: '8px 0 6px' }}>Sell With Instant Sync</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Every in-store transaction updates online stock in real time with 0 manual reconciliation.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '820px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '36px' }}>
              Stock Mismatch FAQs
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
              Fix Your WooCommerce Stock Mismatch Today
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Join thousands of retail transactions processed with 100% stock accuracy.
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
