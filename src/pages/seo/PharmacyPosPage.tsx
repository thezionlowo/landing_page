import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  HeartPulse,
  Search,
  CheckCircle2,
  Users,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  FileText,
  Clock,
} from 'lucide-react';

export const PharmacyPosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/#businesses' },
    { name: 'Pharmacies & Health', url: '/industries/pharmacies' },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA help pharmacies manage thousands of medications and OTC brands?',
      a: 'ZAMERIA provides instant keyword and barcode search for high-density pharmaceutical inventories. Pharmacists and dispensary staff can look up medications by brand name, generic chemical name, dosage, or SKU in milliseconds.',
    },
    {
      q: 'Can staff add prescription notes or patient names to the sales receipt?',
      a: 'Yes. Cashiers can attach custom order notes and customer profiles directly to transactions, which print on 80mm thermal receipts and sync with WooCommerce order records.',
    },
    {
      q: 'How does ZAMERIA prevent stock mismatch for high-demand medications?',
      a: 'With real-time bi-directional synchronization, an over-the-counter sale in your physical pharmacy immediately decrements WooCommerce inventory, preventing online shoppers from purchasing depleted prescription supplies.',
    },
    {
      q: 'Can pharmacy managers restrict discounts and view staff sales logs?',
      a: 'Yes. ZAMERIA features granular staff permission levels. Cashiers can be restricted from modifying unit prices or applying unauthorized discounts without manager overrides.',
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
              <HeartPulse size={13} style={{ marginRight: '6px' }} />
              <span>PHARMACY & HEALTH RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS & Inventory Management for Pharmacies & Health Stores
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Fast medication lookups, barcode checkout, accurate stock tracking across physical dispensaries and your online pharmacy website.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-inventory-sync" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Real-Time Inventory Sync</span>
              </a>
            </div>
          </div>

          {/* Key Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Search size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Fast Medicine Search</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Instant search by brand, active ingredient, dosage, or barcode. Locate prescriptions and over-the-counter products in a fraction of a second.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <FileText size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Prescription & Patient Notes</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Attach dosage instructions, patient names, or doctor references directly to sales. Notes are recorded in WooCommerce and printed cleanly on receipts.
              </p>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 26px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Clock size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Sub-Second Stock Sync</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                Prevent selling life-critical medications online when in-store customers buy the last units over the counter.
              </p>
            </div>
          </div>

          {/* Pharmacy Management Details */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              Accuracy & Accountability for Modern Pharmacies
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '28px' }}>
              Pharmacies cannot afford inaccurate stock counts or unrecorded dispensary sales. ZAMERIA provides strict staff auditing, multi-payment reconciliation, and bulletproof offline reliability.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Individual staff logins track all cashier dispensary activity</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Continuous offline sales during dispensary network drops</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Multi-payment support: POS Card, Cash, and Bank Transfer</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Clear 80mm thermal receipts with pharmacy contact details</span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '820px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '36px' }}>
              Pharmacy POS FAQs
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
              Connect Your Pharmacy Dispensary & WooCommerce Store
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Experience fast counter checkout and real-time inventory synchronization.
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
