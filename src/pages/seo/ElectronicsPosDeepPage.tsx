import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Cpu,
  ArrowRight,
  ChevronRight,
  Check,
  ShieldCheck,
  Barcode,
  Receipt,
  Wrench,
  Smartphone,
  HelpCircle,
} from 'lucide-react';

export const ElectronicsPosDeepPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/industries/electronics' },
    { name: 'Electronics & Repair POS', url: '/industries/electronics-pos' },
  ];

  const electronicsFeatures = [
    {
      icon: <Barcode size={22} />,
      title: 'Serial & IMEI Number Logging',
      desc: 'Capture unique device serial numbers and phone IMEIs at point of sale. Automatically prints on warranty receipts for fraud-proof tracking.',
    },
    {
      icon: <Receipt size={22} />,
      title: 'Custom Warranty Policy Receipts',
      desc: 'Format detailed manufacturer warranties, repair guarantees, and return policies directly on 80mm and 58mm thermal receipts.',
    },
    {
      icon: <Smartphone size={22} />,
      title: 'High-Volume Accessory Barcoding',
      desc: 'Rapidly scan hundreds of chargers, power banks, screen protectors, and phone cases with instant sub-second barcode matching.',
    },
    {
      icon: <Wrench size={22} />,
      title: 'Repair Intake & Service Ticketing',
      desc: 'Track device repair work orders, customer diagnostic deposits, technician notes, and completion balances in one unified system.',
    },
  ];

  const faqs = [
    {
      q: 'How does ZAMERIA capture serial numbers and IMEI codes at checkout?',
      a: 'When an electronic device or smartphone is scanned, cashiers are prompted with a lightweight modal to scan or type the unique IMEI or serial number. This serial number attaches permanently to the WooCommerce order record and prints on the customer receipt.',
    },
    {
      q: 'Can customers split payment when purchasing expensive electronics?',
      a: 'Yes! High-value electronic sales often involve split tender (e.g. paying ₦250,000 via card POS and ₦150,000 via direct bank transfer). ZAMERIA supports multi-tender payment recording with zero cashier calculation errors.',
    },
    {
      q: 'How does ZAMERIA stop staff from giving unauthorized discounts on electronics?',
      a: 'Electronics retail operates on tight hardware margins. ZAMERIA includes granular role controls allowing store managers to lock down manual discounts or require a Manager PIN override before any price alteration is permitted.',
    },
    {
      q: 'Does ZAMERIA integrate with thermal receipt printers used in computer village electronics shops?',
      a: 'Yes. ZAMERIA works out of the box with any standard ESC/POS USB or wireless thermal printer (Xprinter, Epson, Star Micronics) and standard 1D/2D laser barcode scanners.',
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
              <Cpu size={13} style={{ marginRight: '6px' }} />
              <span>ELECTRONICS &amp; GADGET RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              The WooCommerce POS for Electronics, Gadgets &amp; Phone Repair Stores
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '750px', margin: '0 auto 32px' }}>
              Built for high-value gadget sales and rapid accessory scanning. Log device IMEI/serial numbers, print warranty receipts, protect hardware margins, and sync online stock in real time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/industries/electronics" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View Electronics Overview</span>
              </a>
            </div>
          </div>

          {/* Core Electronics Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {electronicsFeatures.map((f, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Serial Number & Warranty Callout */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              Protect Tight Hardware Margins and Warranty Integrity
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '28px' }}>
              In gadget retail, warranty disputes and inventory shrinkage can wipe out profits. ZAMERIA gives you end-to-end device audit trails from supplier delivery to customer checkout.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>IMEI Fraud Prevention</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Ensure returned gadgets match the exact serial number or IMEI printed on the original purchase receipt.
                </p>
              </div>
              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Manager Margin Locks</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Set floor prices and minimum acceptable margins so counter reps cannot discount below allowable thresholds.
                </p>
              </div>
              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Fast Accessory Scans</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Ring up high-margin cables, screen protectors, and cases at checkout in less than 3 seconds.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions (Electronics Retailers)
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
              Modernize Your Electronics Retail Store Today
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Start your 7-day free trial and experience sub-second barcode scans and real-time inventory synchronization.
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
export default ElectronicsPosDeepPage;
