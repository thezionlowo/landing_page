import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Printer,
  Scan,
  Laptop,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Tv,
  Coins,
} from 'lucide-react';

export const HardwareCompatibilityPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Product', url: '/#features' },
    { name: 'Hardware Compatibility', url: '/hardware-compatibility' },
  ];

  const faqs = [
    {
      q: 'Do I need to buy expensive proprietary POS hardware to use ZAMERIA?',
      a: 'No. ZAMERIA runs on standard hardware you already own — including Windows laptops, MacBooks, desktop computers, Chromebooks, and tablets. You do not need locked-in proprietary POS terminals.',
    },
    {
      q: 'Which 80mm thermal receipt printers work with ZAMERIA?',
      a: 'ZAMERIA supports all standard ESC/POS thermal printers connected via USB, Bluetooth, or Wi-Fi. Tested brands include Epson (TM-T20, TM-T88), Xprinter (XP-N160M, XP-80C), Sunmi, Star Micronics, and generic 80mm/58mm thermal printers.',
    },
    {
      q: 'Which barcode scanners are supported?',
      a: 'Any standard 1D or 2D USB or Bluetooth barcode scanner works out of the box (keyboard emulation mode). Supported scanners include Honeywell, Zebra, Netum, Eyoyo, and all standard handheld laser scanners.',
    },
    {
      q: 'Can ZAMERIA trigger electronic cash drawers automatically?',
      a: 'Yes. ZAMERIA automatically triggers standard electronic cash drawers connected via RJ11 printer-kick cables upon completing a cash transaction.',
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
              <Cpu size={13} style={{ marginRight: '6px' }} />
              <span>HARDWARE ECOSYSTEM</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px' }}>
              WooCommerce POS Hardware Compatibility & Setup Guide
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px' }}>
              Run ZAMERIA on any computer or tablet. Connect standard 80mm thermal receipt printers, USB/Bluetooth barcode scanners, and automated cash drawers with zero driver headaches.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/woocommerce-pos" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View POS Software</span>
              </a>
            </div>
          </div>

          {/* Hardware Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Laptop size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Computers & Tablets</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ Windows Laptops & Desktops</li>
                <li>✓ Apple MacBooks & iMacs</li>
                <li>✓ Touchscreen POS Terminals</li>
                <li>✓ iPads & Android Tablets</li>
              </ul>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Printer size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Receipt Printers</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ 80mm & 58mm Thermal Printers</li>
                <li>✓ Epson, Xprinter, Sunmi, Star</li>
                <li>✓ USB, Bluetooth, & Wi-Fi</li>
                <li>✓ Standard Browser Print & ESC/POS</li>
              </ul>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Scan size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Barcode Scanners</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ 1D Laser & CCD Scanners</li>
                <li>✓ 2D QR Code Handheld Scanners</li>
                <li>✓ Hands-Free Counter Scanners</li>
                <li>✓ Wireless Bluetooth Scanners</li>
              </ul>
            </div>

            <div className="glass-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '32px 24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Coins size={22} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>Cash Drawers & Accessories</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>✓ RJ11 / RJ12 Kick Cash Drawers</li>
                <li>✓ Customer Display Screens</li>
                <li>✓ Barcode Label Printers</li>
                <li>✓ Standalone Payment POS Terminals</li>
              </ul>
            </div>
          </div>

          {/* Plug & Play Simplicity */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '48px 36px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              Zero Complex Hardware Setup or Special Drivers Required
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '28px' }}>
              Unlike legacy POS systems that force you to buy overpriced proprietary terminals, ZAMERIA works instantly with standard hardware available from local computer markets and online retailers.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Plug in any standard USB barcode scanner and start scanning immediately</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Automatic 80mm thermal receipt sizing with 0mm print margins</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Save thousands of dollars compared to locked-in proprietary POS machines</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '14px', color: 'var(--brand-navy)', fontWeight: 600 }}>Easily add new counter registers as your retail foot traffic scales</span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ maxWidth: '820px', margin: '0 auto 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '36px' }}>
              Hardware Compatibility FAQs
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
              Test ZAMERIA on Your Existing Hardware in 2 Minutes
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Connect your WooCommerce store and start ringing up sales right away.
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
