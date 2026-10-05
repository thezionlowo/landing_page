import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  MapPin,
  ArrowRight,
  ChevronRight,
  Check,
  Zap,
  WifiOff,
  ShieldCheck,
  CreditCard,
  Building,
  PhoneCall,
  Clock,
} from 'lucide-react';

export const LagosRetailPosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Nigeria Retail', url: '/woocommerce-pos-nigeria' },
    { name: 'Lagos Retail POS System', url: '/nigeria/lagos-retail-pos' },
  ];

  const lagosDistricts = [
    {
      name: 'Lekki & Victoria Island',
      desc: 'High-end fashion boutiques, specialty beauty lounges, and supermarkets in Lekki Phase 1, Admiralty Way, and VI needing multi-register speed and premium printed receipts.',
    },
    {
      name: 'Ikeja & Maryland',
      desc: 'Busy computer village electronics retailers, phone hubs, and retail stores in Ikeja GRA and Allen Avenue needing rapid barcode scans and serial number tracking.',
    },
    {
      name: 'Yaba, Surulere & Mainland',
      desc: 'Growing apparel brands, lifestyle stores, and retail supermarkets managing both heavy foot traffic and Instagram/WooCommerce online orders.',
    },
  ];

  const nigerianPainPoints = [
    {
      icon: <WifiOff size={22} />,
      title: 'Unstable Internet & Fiber Drops',
      desc: 'When MTN, Airtel, or fiber connections flicker, foreign POS systems freeze. ZAMERIA works completely offline, saving sales locally and syncing as soon as data returns.',
    },
    {
      icon: <CreditCard size={22} />,
      title: 'OPay & Moniepoint POS Integration',
      desc: 'Log sales tendered across multiple standalone Nigerian POS terminals without incurring double transaction charges or cashier reconciliation errors.',
    },
    {
      icon: <Zap size={22} />,
      title: 'No Dollar Billing Headaches',
      desc: 'Forget $30/month credit card billing affected by FX volatility. ZAMERIA is billed transparently in Naira (₦200,000/year flat), payable via local bank transfer or Paystack.',
    },
  ];

  const faqs = [
    {
      q: 'Why do retail shops in Lagos choose ZAMERIA over foreign POS plugins?',
      a: 'Foreign POS plugins like FooSales and Oliver POS charge steep monthly USD fees, fail when internet is patchy, and do not understand local Nigerian payment dynamics (such as split tender across Moniepoint POS, bank transfers, and cash). ZAMERIA was built specifically with offline resilience and local payment workflows in mind.',
    },
    {
      q: 'Can ZAMERIA print receipts on my local thermal printer?',
      a: 'Yes. ZAMERIA connects to any standard 58mm or 80mm ESC/POS thermal receipt printer (USB, Bluetooth, or Network/LAN) commonly sold in Computer Village, Ikeja (such as Xprinter, Epson, POS-58).',
    },
    {
      q: 'Do you offer in-person setup or local onboarding in Lagos?',
      a: 'Yes! Our support team is based locally. We assist with initial WooCommerce catalog synchronization, barcode scanner setup, staff cashier training, and manager controls over WhatsApp, phone call, or on-site visits across Lagos.',
    },
    {
      q: 'How does ZAMERIA prevent stock discrepancies between my Lagos store and online orders?',
      a: 'ZAMERIA locks inventory at the database level. As soon as a cashier in your Lekki or Ikeja store scans an item at the checkout counter, your WooCommerce website stock drops instantly, preventing online shoppers from ordering sold-out items.',
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
              <MapPin size={13} style={{ marginRight: '6px' }} />
              <span>LAGOS RETAIL POINT OF SALE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              The #1 Retail POS System for WooCommerce Stores in Lagos, Nigeria
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '750px', margin: '0 auto 32px' }}>
              Engineered for Nigerian retail reality. Seamless offline checkout during network dips, local Moniepoint/OPay POS split tender, Naira pricing, and instant WooCommerce stock sync.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos-nigeria" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Nigeria POS Features</span>
              </a>
            </div>
          </div>

          {/* Lagos Specific Pain Points */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {nigerianPainPoints.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Neighborhood Hubs */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '24px', textAlign: 'center' }}>
              Trusted by Retail Stores Across Commercial Districts in Lagos
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {lagosDistricts.map((d, idx) => (
                <div key={idx} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Building size={18} color="#4f46e5" />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', margin: 0 }}>{d.name}</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Local Pricing Banner */}
          <div style={{ backgroundColor: '#eef2ff', borderRadius: '20px', padding: '36px', border: '1px solid #c7d2fe', marginBottom: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4f46e5' }}>TRANSPARENT LOCAL PRICING</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy)', margin: '8px 0 10px' }}>
                ₦200,000 / Year Flat. Zero FX Risks or Transaction Cuts.
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', margin: 0, lineHeight: 1.6 }}>
                Everything included: unlimited products, unlimited registers, staff PIN controls, split payments, and real-time WooCommerce synchronization.
              </p>
            </div>
            <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '14px 32px', fontSize: '15px' }}>
              <span>Start Free Trial</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions (Lagos Retailers)
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
              Power Your Lagos Store With Modern POS Technology
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Get started with our 7-day free trial. Our Lagos support team is ready to help you connect your store in minutes.
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
export default LagosRetailPosPage;
