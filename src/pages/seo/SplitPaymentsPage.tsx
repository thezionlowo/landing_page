import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  CreditCard,
  ArrowRight,
  ChevronRight,
  Check,
  DollarSign,
  Layers,
  Banknote,
  Receipt,
  FileCheck,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

export const SplitPaymentsPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Features', url: '/features/split-payments' },
    { name: 'Split Payments POS', url: '/features/split-payments' },
  ];

  const tenderTypes = [
    {
      icon: <Banknote size={24} />,
      title: 'Cash Tender',
      desc: 'Accept cash notes with automatic change calculation and cash drawer trigger pulses.',
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Card POS Terminal',
      desc: 'Seamlessly log transactions swiped or tapped on any external POS terminal (Moniepoint, OPay, Verifone, Ingenico).',
    },
    {
      icon: <Receipt size={24} />,
      title: 'Instant Bank Transfer',
      desc: 'Record direct bank transfer confirmations with session reference notes to eliminate fraud.',
    },
    {
      icon: <FileCheck size={24} />,
      title: 'Store Credit & Vouchers',
      desc: 'Redeem customer balance credits, gift vouchers, or promotional coupons alongside another tender.',
    },
  ];

  const shiftAuditSteps = [
    {
      step: '01',
      title: 'Split At Checkout',
      desc: 'Customer wants to pay ₦30,000 with Card and ₦15,000 in Cash? The cashier enters ₦30,000 under Card, and the system automatically calculates the remaining ₦15,000 balance.',
    },
    {
      step: '02',
      title: 'Itemized Multi-Tender Receipt',
      desc: 'Thermal receipt prints each individual payment method, transaction references, and timestamp for complete customer transparency.',
    },
    {
      step: '03',
      title: 'End-of-Shift Reconciliation',
      desc: 'When cashiers close out their shifts, ZAMERIA generates an automated breakdown comparing expected cash in drawer vs card POS slips vs bank transfers.',
    },
  ];

  const faqs = [
    {
      q: 'Can I split a single order across multiple payment methods in WooCommerce?',
      a: 'With standard WooCommerce checkout, split tender is difficult and requires complex custom gateways. ZAMERIA brings native multi-tender support to your retail counter. A single ticket can easily be split across cash, physical POS card terminals, and bank transfers.',
    },
    {
      q: 'Do I need a proprietary payment gateway to use split payments in ZAMERIA?',
      a: 'No. ZAMERIA is completely non-custodial and gateway-agnostic. You can use any existing standalone card terminal (Moniepoint, OPay, Square, Pax, etc.) without paying extra gateway transaction markups.',
    },
    {
      q: 'How does split payment show up inside WooCommerce order admin?',
      a: 'ZAMERIA records the transaction into WooCommerce with comprehensive order notes detailing exact tender breakdown (e.g. ₦20,000 via POS Card Slip #4829, ₦10,000 via Cash). The order status is automatically set to Completed.',
    },
    {
      q: 'What happens if a customer needs a partial refund on a split-tender purchase?',
      a: 'ZAMERIA supports line-item returns. Cashiers can refund specific items back to cash or issue store credit, maintaining an audited trail of all returned stock in your inventory ledger.',
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
              <CreditCard size={13} style={{ marginRight: '6px' }} />
              <span>NATIVE MULTI-TENDER CHECKOUT</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              WooCommerce POS Split Payments: Accept Cash, Card &amp; Transfer in One Sale
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '750px', margin: '0 auto 32px' }}>
              Give in-store customers total payment flexibility. Split bills across multiple payment methods seamlessly with zero register math errors and automated end-of-day float reconciliation.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Try Split Payments Free</span>
                <ArrowRight size={15} />
              </a>
              <a href="/best-woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>See All POS Capabilities</span>
              </a>
            </div>
          </div>

          {/* Tender Types Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {tenderTypes.map((t, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {t.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{t.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Shift Reconciliation Deep Dive */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '14px' }}>
                Eliminate Cashier Discrepancies and Till Shortages
              </h2>
              <p style={{ fontSize: '15.5px', color: 'var(--text-body)', lineHeight: 1.65 }}>
                When cashiers attempt manual split payments on paper or basic registers, arithmetic mistakes and missing POS slips cause constant headaches. ZAMERIA automates balance calculation and logs every penny to its respective channel.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {shiftAuditSteps.map((s) => (
                <div key={s.step} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', marginBottom: '8px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions About Split Tender
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
              Speed Up Your Checkout Counters With ZAMERIA
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Test split payments, offline cashiering, and real-time inventory locking with our 7-day free trial.
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
export default SplitPaymentsPage;
