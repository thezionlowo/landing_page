import React from 'react';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../lib/routes';
import { useRouter, AccountTab } from '../router/Router';

// --- Pixel-Perfect Subtle SVG Social Icons ---
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.6a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.67 1.67 0 0 0 1.67-1.66A1.66 1.66 0 0 0 7.83 6.6z" />
  </svg>
);

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.73 2.65 4.2 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.32z" />
  </svg>
);

const XTwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface SocialItem {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number }>;
  ariaLabel: string;
}

const SOCIAL_ITEMS: SocialItem[] = [
  { name: 'Instagram', url: 'https://instagram.com/zameriahq', icon: InstagramIcon, ariaLabel: 'ZAMERIA on Instagram' },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/zameria', icon: LinkedInIcon, ariaLabel: 'ZAMERIA on LinkedIn' },
  { name: 'WhatsApp', url: 'https://wa.me/2348122342436', icon: WhatsAppIcon, ariaLabel: 'Chat with ZAMERIA on WhatsApp' },
  { name: 'X', url: 'https://x.com/zameriahq', icon: XTwitterIcon, ariaLabel: 'ZAMERIA on X' },
  { name: 'YouTube', url: 'https://youtube.com/@zameriahq', icon: YouTubeIcon, ariaLabel: 'ZAMERIA on YouTube' },
];

export const Footer: React.FC = () => {
  const { navigate, setAccountTab } = useRouter();

  const handleNavScroll = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    scrollToSection(sectionId)(e);
  };

  const handleGoToAccount = (tab: AccountTab) => (e: React.MouseEvent) => {
    e.preventDefault();
    setAccountTab(tab);
    navigate(`/account?tab=${tab}`);
  };

  const handleOpenPos = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('http://localhost:5176', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer
      style={{
        backgroundColor: '#071A31',
        borderTop: '1px solid #0c2340',
        padding: '64px 0 36px',
        color: '#ffffff',
        position: 'relative',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Balanced Columns Layout with Dedicated SEO Solutions */}
        <div className="zameria-dark-footer-grid">
          {/* 1. PRODUCT & SOLUTIONS COLUMN */}
          <div className="dark-footer-col">
            <h4 className="dark-footer-col-title">PRODUCT</h4>
            <ul className="dark-footer-links-list">
              <li>
                <a
                  href="/woocommerce-pos"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/woocommerce-pos');
                  }}
                  className="dark-footer-link"
                >
                  WooCommerce POS
                </a>
              </li>
              <li>
                <a
                  href="/woocommerce-inventory-sync"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/woocommerce-inventory-sync');
                  }}
                  className="dark-footer-link"
                >
                  Inventory Sync
                </a>
              </li>
              <li>
                <a
                  href="/woocommerce-pos-nigeria"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/woocommerce-pos-nigeria');
                  }}
                  className="dark-footer-link"
                >
                  WooCommerce POS Nigeria
                </a>
              </li>
              <li>
                <a
                  href="/solutions/prevent-overselling"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/solutions/prevent-overselling');
                  }}
                  className="dark-footer-link"
                >
                  Prevent Overselling
                </a>
              </li>
              <li>
                <a href="#pricing" onClick={handleNavScroll('pricing')} className="dark-footer-link">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* 2. INDUSTRIES COLUMN */}
          <div className="dark-footer-col">
            <h4 className="dark-footer-col-title">INDUSTRIES</h4>
            <ul className="dark-footer-links-list">
              <li>
                <a
                  href="/industries/fashion"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/industries/fashion');
                  }}
                  className="dark-footer-link"
                >
                  Fashion & Boutiques
                </a>
              </li>
              <li>
                <a
                  href="/industries/beauty"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/industries/beauty');
                  }}
                  className="dark-footer-link"
                >
                  Beauty & Cosmetics
                </a>
              </li>
              <li>
                <a
                  href="/industries/electronics"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/industries/electronics');
                  }}
                  className="dark-footer-link"
                >
                  Electronics & Gadgets
                </a>
              </li>
              <li>
                <a href="#faq" onClick={handleNavScroll('faq')} className="dark-footer-link">
                  FAQ's
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5176"
                  onClick={handleOpenPos}
                  className="dark-footer-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <span>Launch POS Counter</span>
                  <ArrowUpRight size={13} style={{ color: '#64748b' }} />
                </a>
              </li>
            </ul>
          </div>

          {/* 3. ACCOUNT COLUMN */}
          <div className="dark-footer-col">
            <h4 className="dark-footer-col-title">ACCOUNT</h4>
            <ul className="dark-footer-links-list">
              <li>
                <button onClick={handleGoToAccount('orders')} className="dark-footer-link">
                  Orders
                </button>
              </li>
              <li>
                <button onClick={handleGoToAccount('licenses')} className="dark-footer-link">
                  License
                </button>
              </li>
              <li>
                <button onClick={handleGoToAccount('plan')} className="dark-footer-link">
                  Plan
                </button>
              </li>
              <li>
                <button onClick={handleGoToAccount('billing')} className="dark-footer-link">
                  Billing
                </button>
              </li>
              <li>
                <button onClick={handleGoToAccount('settings')} className="dark-footer-link">
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* 4. DOWNLOADS & APPS COLUMN */}
          <div className="dark-footer-col">
            <h4 className="dark-footer-col-title">DOWNLOADS</h4>
            <ul className="dark-footer-links-list">
              <li>
                <a
                  href="http://localhost:5182"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark-footer-link"
                >
                  ZAMERIA Plugin
                </a>
              </li>
              <li>
                <a
                  href="/#download"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('http://localhost:5176', '_blank', 'noopener,noreferrer');
                  }}
                  className="dark-footer-link"
                >
                  Desktop App
                </a>
              </li>
              <li>
                <div className="dark-footer-item-muted">
                  <span>iOS App</span>
                  <span className="dark-coming-soon-label">— Coming Soon</span>
                </div>
              </li>
              <li>
                <div className="dark-footer-item-muted">
                  <span>Android App</span>
                  <span className="dark-coming-soon-label">— Coming Soon</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 5. CONNECT COLUMN */}
          <div className="dark-footer-col">
            <h4 className="dark-footer-col-title">CONNECT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="tel:08122342436"
                className="dark-footer-link dark-footer-contact"
                title="Call ZAMERIA Support"
              >
                <Phone size={14} style={{ color: '#64748b', flexShrink: 0 }} />
                <span>08122342436</span>
              </a>

              <a
                href="mailto:hello@zameria.co"
                className="dark-footer-link dark-footer-contact"
                title="Email ZAMERIA Support"
              >
                <Mail size={14} style={{ color: '#64748b', flexShrink: 0 }} />
                <span>hello@zameria.co</span>
              </a>

              {/* Clean, subtle, consistent social icons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  flexWrap: 'wrap',
                }}
              >
                {SOCIAL_ITEMS.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark-footer-social-btn"
                    aria-label={item.ariaLabel}
                    title={item.name}
                  >
                    <item.icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM: Subtle divider and understated copyright */}
        <div
          style={{
            marginTop: '56px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            © 2026 ZAMERIA. All rights reserved.
          </p>
        </div>
      </div>

      {/* Scoped CSS for Dark Blue Footer */}
      <style>{`
        .zameria-dark-footer-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 36px;
        }

        .dark-footer-col-title {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0 0 18px 0;
        }

        .dark-footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dark-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .dark-footer-link:hover {
          color: #ffffff;
        }

        .dark-footer-item-muted {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          user-select: none;
          transition: color 0.15s ease;
        }

        .dark-footer-item-muted:hover {
          color: #94a3b8;
        }

        .dark-coming-soon-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 400;
        }

        .dark-footer-contact:hover {
          color: #60a5fa;
        }

        .dark-footer-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-decoration: none;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dark-footer-social-btn:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        /* Mobile & Tablet Responsive Layout */
        @media (max-width: 1024px) {
          .zameria-dark-footer-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 36px 28px;
          }
        }

        @media (max-width: 680px) {
          .zameria-dark-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 24px;
          }
        }

        @media (max-width: 480px) {
          .zameria-dark-footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
};
