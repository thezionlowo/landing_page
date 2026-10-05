import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Check,
  Tag,
  Sparkles,
  Layers,
  Users,
  Percent,
  Receipt,
  HelpCircle,
} from 'lucide-react';

export const ClothingBoutiquePosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/industries/fashion' },
    { name: 'Clothing Boutique POS', url: '/industries/clothing-boutique-pos' },
  ];

  const boutiqueFeatures = [
    {
      icon: <Layers size={22} />,
      title: 'Size & Color Variation Matrix',
      desc: 'Instant visual variation picker for clothing items: XS to 3XL, multiple colorways, and fabric types with live stock counts per variant.',
    },
    {
      icon: <Tag size={22} />,
      title: 'Garment Swing Tag Barcoding',
      desc: 'Scan custom price tags and garment swing tags with any handheld USB or Bluetooth laser scanner for 2-second checkouts.',
    },
    {
      icon: <Users size={22} />,
      title: 'VIP Client Profiles & Purchase History',
      desc: 'Look up returning boutique shoppers, view their preferred dress sizes and past order history, and apply exclusive VIP discounts.',
    },
    {
      icon: <Receipt size={22} />,
      title: 'Gift Receipts & Discreet Exchange Policies',
      desc: 'Print clean, unpriced gift receipts alongside detailed thermal receipts for hassle-free size swaps and customer exchanges.',
    },
  ];

  const faqs = [
    {
      q: 'Can ZAMERIA handle hundreds of clothing sizes, cuts, and colorways?',
      a: 'Yes! ZAMERIA is engineered for high-variation WooCommerce apparel catalogs. Whether a dress has 15 color/size combinations or an entire line has 2,000 SKUs, each variation is cached locally for instant barcode scanning without website delay.',
    },
    {
      q: 'How does ZAMERIA prevent overselling limited-edition fashion drops?',
      a: 'When you release a new collection in-store and online, ZAMERIA locks inventory instantly. If a customer buys the last Medium silk dress at your boutique counter, that item is immediately marked out of stock on WooCommerce to prevent duplicate web purchases.',
    },
    {
      q: 'Can cashiers process size exchanges and clothing returns easily?',
      a: 'Yes. Cashiers can easily pull up the original receipt, process a size swap (e.g. exchanging Small for Large), adjust the inventory ledger automatically, and refund or charge any price differences in seconds.',
    },
    {
      q: 'Does it support fitting room holds?',
      a: 'Yes. Cashiers can park an active cart as an open tab while a client tries on additional garments in the fitting room, freeing up the register for other waiting shoppers.',
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
              <ShoppingBag size={13} style={{ marginRight: '6px' }} />
              <span>BOUTIQUE &amp; APPAREL RETAIL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              The WooCommerce POS System Built for Modern Clothing Boutiques
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '750px', margin: '0 auto 32px' }}>
              Manage complex size/color variation matrices, scan garment swing tags in seconds, synchronize boutique and online inventory, and deliver a VIP in-store shopping experience.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={15} />
              </a>
              <a href="/industries/fashion" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>Explore Fashion Features</span>
              </a>
            </div>
          </div>

          {/* Boutique Feature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {boutiqueFeatures.map((f, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Deep Differentiator Section */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              Designed for the High-End Boutique Experience
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '28px' }}>
              Standard point-of-sale software treats apparel like canned groceries. In a boutique, a customer tries on 4 garments, asks for a different color in the fitting room, and pays with two cards. ZAMERIA is tailored specifically to keep checkout counters polished and speedy.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Park &amp; Resume Tabs</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Hold customer carts while shoppers browse more accessories or try on pieces, ensuring queues never stall.
                </p>
              </div>
              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Custom Seasonal Promotions</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Apply automated seasonal discounts (e.g. End of Season Clearance 20% Off) or coupon codes directly at the register.
                </p>
              </div>
              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>Instant Restock Alerts</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                  Get automated notifications when high-demand sizes (Small, Medium) reach low inventory thresholds.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions (Clothing Boutiques)
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
              Elevate Your Boutique’s Checkout Experience
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Join forward-thinking fashion brands and apparel retailers running seamlessly on ZAMERIA.
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
export default ClothingBoutiquePosPage;
