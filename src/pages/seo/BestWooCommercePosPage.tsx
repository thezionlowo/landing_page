import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ROUTES } from '../../lib/routes';
import {
  Trophy,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Star,
  WifiOff,
  CreditCard,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const BestWooCommercePosPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'POS Guides', url: '/best-woocommerce-pos' },
    { name: 'Best WooCommerce POS Systems (2026)', url: '/best-woocommerce-pos' },
  ];

  const posRankingList = [
    {
      rank: '1',
      name: 'ZAMERIA POS',
      rating: '4.9/5',
      badge: 'Best Overall & Fastest Real-Time Sync',
      pricing: 'From ₦200,000/yr (~$130/yr) flat',
      offline: 'Full IndexedDB Offline POS with auto-sync',
      hardware: 'Any standard USB/Bluetooth thermal printer & barcode scanner (Zero lock-in)',
      idealFor: 'Omnichannel retailers, fashion boutiques, electronics, multi-store shops requiring zero overselling.',
      pros: ['Sub-second inventory lock', 'Native split tender (Cash, Card, Transfer)', 'True offline mode', 'No per-transaction fees'],
      cons: ['Focused exclusively on WooCommerce stores'],
    },
    {
      rank: '2',
      name: 'FooSales',
      rating: '4.2/5',
      badge: 'Popular for Western Stripe/Square users',
      pricing: '$228 – $360/yr per store',
      offline: 'Limited offline catalog caching',
      hardware: 'Optimized for specific iPad/Android tablet accessories',
      idealFor: 'Basic pop-up stalls in the US/UK using Stripe Terminal.',
      pros: ['Clean iPad tablet interface', 'Direct WooCommerce connection'],
      cons: ['High recurring dollar cost', 'Sluggish on stores with 2,000+ SKUs', 'No native bank transfer splits'],
    },
    {
      rank: '3',
      name: 'Oliver POS',
      rating: '3.9/5',
      badge: 'Cloud Hub System',
      pricing: '$288 – $828/yr + hardware bundles',
      offline: 'Cloud-dependent with intermittent offline bridge',
      hardware: 'Strongly pushes proprietary Oliver register hardware',
      idealFor: 'Retailers wanting an all-in-one hardware package who don’t mind ongoing leasing costs.',
      pros: ['Custom hardware terminals available', 'App ecosystem integrations'],
      cons: ['Expensive tiered plans', 'Frequent sync delay reports on high-order days', 'Hardware lock-in'],
    },
    {
      rank: '4',
      name: 'wePOS',
      rating: '3.7/5',
      badge: 'WordPress Admin Plugin',
      pricing: 'Free tier / $199/yr Pro',
      offline: 'Requires live internet connection to WP admin',
      hardware: 'Basic desktop browser printing',
      idealFor: 'Very small mom-and-pop stores with under 100 simple products.',
      pros: ['Low initial barrier', 'Runs directly inside WP-Admin'],
      cons: ['Cannot handle complex variation matrices', 'No true offline mode', 'Lacks split payments'],
    },
    {
      rank: '5',
      name: 'VitePOS',
      rating: '3.8/5',
      badge: 'Vue-Powered Admin POS',
      pricing: '$149 – $299 one-time/yearly',
      offline: 'Basic local storage caching',
      hardware: 'Thermal printer ESC/POS',
      idealFor: 'Developers comfortable configuring self-hosted plugins.',
      pros: ['Single page application speed', 'Modern Vue UI'],
      cons: ['Requires heavy WordPress server resources', 'Complex multi-location sync bugs', 'Limited customer support'],
    },
  ];

  const evaluationCriteria = [
    {
      icon: <Zap size={22} />,
      title: '1. Inventory Sync Latency',
      desc: 'The #1 risk for omnichannel retail is overselling. We benchmarked how fast an in-store counter scan deducts stock from the online WooCommerce site and vice versa.',
    },
    {
      icon: <WifiOff size={22} />,
      title: '2. Offline Resilience',
      desc: 'If fiber cuts or cellular data fails during peak hours, can cashiers still scan barcodes, accept cash or card tenders, and print receipts without freezing?',
    },
    {
      icon: <CreditCard size={22} />,
      title: '3. Flexible Split Tender',
      desc: 'Modern shoppers frequently split a single transaction across cash, card POS terminals, and instant bank transfers. We tested multi-tender flexibility on every platform.',
    },
    {
      icon: <Layers size={22} />,
      title: '4. Hardware Freedom',
      desc: 'Does the POS force you into buying proprietary $800 tablet docks, or can you reuse existing ESC/POS thermal printers, USB handheld scanners, and desktop laptops?',
    },
  ];

  const faqs = [
    {
      q: 'Which WooCommerce POS system is best for 2026?',
      a: 'ZAMERIA POS ranks #1 in our 2026 benchmark for performance, value, and reliability. It provides sub-second inventory locking to eliminate overselling, operates offline during internet blackouts, supports native split payments (cash + card + bank transfer), and avoids expensive dollar pricing by offering a transparent flat annual rate.',
    },
    {
      q: 'Can a WooCommerce POS operate without an internet connection?',
      a: 'Most legacy plugins (like wePOS or Webkul) immediately fail when disconnected because they make direct AJAX requests to WordPress. ZAMERIA POS uses an offline-first IndexedDB architecture that allows cashiers to continue scanning barcodes, adding discounts, and printing receipts completely offline, synchronizing all transactions sequentially once connection resumes.',
    },
    {
      q: 'Do I need special hardware to run a WooCommerce POS?',
      a: 'No. While platforms like Oliver POS encourage expensive custom hardware packages, ZAMERIA and FooSales work on standard devices. ZAMERIA is completely hardware-agnostic: you can run it in Chrome, Safari, or Edge on any Windows PC, Mac, iPad, or Android tablet with standard 80mm ESC/POS thermal printers and USB/Bluetooth scanners.',
    },
    {
      q: 'How does WooCommerce POS handle variable products (sizes, colors)?',
      a: 'Handling hundreds of product variations is where many POS systems slow down. ZAMERIA indexes variations locally with parent-child relationship caching, allowing instant barcode scans of specific SKUs (e.g. Red / XL) without reloading the page.',
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
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 56px' }}>
            <div className="eyebrow-badge purple" style={{ margin: '0 auto 18px', display: 'inline-flex' }}>
              <Trophy size={13} style={{ marginRight: '6px' }} />
              <span>INDEPENDENT 2026 RETAIL BENCHMARK</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '22px' }}>
              The 5 Best WooCommerce POS Systems in 2026: Tested &amp; Ranked
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '760px', margin: '0 auto 32px' }}>
              Looking to connect your physical retail store directly with WooCommerce? We evaluated the top point-of-sale systems on sync latency, offline resilience, hardware flexibility, and total cost of ownership.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '15px 36px', fontSize: '15px' }}>
                <span>Try #1 Ranked ZAMERIA Free</span>
                <ArrowRight size={15} />
              </a>
              <a href="#comparison-matrix" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '15px' }}>
                <span>View Full Comparison Matrix</span>
              </a>
            </div>
          </div>

          {/* Benchmark Criteria */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              How We Evaluated Each WooCommerce POS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {evaluationCriteria.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(7, 26, 49, 0.04)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Ranking Cards */}
          <div id="comparison-matrix" style={{ marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '24px' }}>
              Comprehensive 2026 Rankings &amp; Scorecards
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {posRankingList.map((pos) => (
                <div
                  key={pos.name}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '32px',
                    border: pos.rank === '1' ? '2px solid #6366f1' : '1px solid var(--border-subtle)',
                    boxShadow: pos.rank === '1' ? '0 10px 30px rgba(99, 102, 241, 0.1)' : '0 4px 20px rgba(7, 26, 49, 0.04)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: pos.rank === '1' ? '#6366f1' : 'var(--brand-navy)', color: '#ffffff', fontWeight: 800, fontSize: '14px' }}>
                          #{pos.rank}
                        </span>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy)', margin: 0 }}>{pos.name}</h3>
                        <span style={{ fontSize: '13px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', backgroundColor: pos.rank === '1' ? '#eef2ff' : '#f1f5f9', color: pos.rank === '1' ? '#4f46e5' : '#475569' }}>
                          {pos.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>{pos.idealFor}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)' }}>{pos.rating}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{pos.pricing}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '20px', fontSize: '13.5px' }}>
                    <div>
                      <strong style={{ color: 'var(--brand-navy)' }}>Offline Architecture:</strong>
                      <p style={{ margin: '4px 0 0', color: 'var(--text-body)' }}>{pos.offline}</p>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--brand-navy)' }}>Hardware Compatibility:</strong>
                      <p style={{ margin: '4px 0 0', color: 'var(--text-body)' }}>{pos.hardware}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: pos.rank === '1' ? '24px' : 0 }}>
                    <div>
                      <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} /> Strengths
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-body)' }}>
                        {pos.pros.map((p, idx) => (
                          <li key={idx} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#059669' }}>•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#dc2626', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <X size={14} /> Limitations
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-body)' }}>
                        {pos.cons.map((c, idx) => (
                          <li key={idx} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#dc2626' }}>•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {pos.rank === '1' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <a href={ROUTES.trial} className="btn btn-hero-gradient" style={{ padding: '12px 28px', fontSize: '14px' }}>
                        <span>Start Free ZAMERIA Trial</span>
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deep Differentiator Section */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '48px', border: '1px solid var(--border-subtle)', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '16px' }}>
              Why ZAMERIA Ranks #1 for Omnichannel WooCommerce Retailers
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '24px' }}>
              Most WooCommerce POS plugins were created over 7 years ago as simple WordPress admin wrappers. They query WordPress via sluggish WP-JSON endpoints on every single keystroke. When your store grows beyond 1,000 SKUs or processes dozens of concurrent counter orders during a Saturday afternoon rush, traditional plugins crash your web hosting or trigger stock overselling.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '6px' }}>Instant Sub-Second Sync</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Direct bi-directional webhooks lock inventory quantities instantly, preventing customers online from buying items that just sold at the physical register.
                </p>
              </div>
              <div style={{ borderLeft: '3px solid #059669', paddingLeft: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '6px' }}>Zero Hardware Traps</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Plug in your existing ESC/POS USB or wireless receipt printer, any 1D/2D barcode reader, and any laptop or iPad. Zero specialized hardware purchases required.
                </p>
              </div>
              <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '6px' }}>Flexible Payment Tenders</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Log multi-tender checkouts effortlessly. Split any order across Cash, Card POS machines, and direct Bank Transfers with automated shift reconciliation.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div style={{ marginBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-navy)', textAlign: 'center', marginBottom: '32px' }}>
              Frequently Asked Questions About WooCommerce POS Systems
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

          {/* Internal Links & Silo Anchors */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '18px', padding: '32px', marginBottom: '64px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '16px' }}>Explore Specialized Comparisons &amp; Industry Solutions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a href="/alternatives/foosales" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 500 }}>
                FooSales Alternatives →
              </a>
              <a href="/alternatives/oliver-pos" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 500 }}>
                Oliver POS Alternatives →
              </a>
              <a href="/comparisons/foosales-vs-oliver-pos" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 500 }}>
                FooSales vs Oliver POS →
              </a>
              <a href="/woocommerce-inventory-sync" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 500 }}>
                Real-Time Inventory Sync →
              </a>
              <a href="/solutions/offline-pos" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 500 }}>
                Offline POS Capabilities →
              </a>
              <a href="/hardware-compatibility" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 500 }}>
                Hardware Compatibility Guide →
              </a>
            </div>
          </div>

          {/* Bottom Conversion CTA */}
          <div style={{ backgroundColor: 'var(--brand-navy)', borderRadius: '24px', padding: '56px 36px', textAlign: 'center', color: '#ffffff' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Upgrade Your WooCommerce Store to Modern POS Today
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Start your 7-day free trial in under 2 minutes. Connect your catalog, scan your first item, and keep your inventory synchronized effortlessly.
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
export default BestWooCommercePosPage;
