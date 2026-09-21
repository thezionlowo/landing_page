import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Download,
  Package,
  Sparkles,
  MapPin,
  CreditCard,
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  User,
  SlidersHorizontal,
  Plug,
  Apple,
  Layers,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  Key,
  Settings,
  Monitor,
  Store
} from 'lucide-react';
import { ROUTES, scrollToSection } from '../lib/routes';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useRouter, AccountTab } from '../router/Router';

export const Navbar: React.FC = () => {
  const { customer, isAuthenticated, logout, isTrial, isPaid, daysRemaining, planLabel } = useCustomerAuth();
  const { navigate, setAccountTab } = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop dropdown states
  const [productOpen, setProductOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Mobile accordion states
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [mobileDownloadOpen, setMobileDownloadOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  const productTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns when clicking outside
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setProductOpen(false);
        setDownloadOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hover helpers with slight delay to prevent accidental closures
  const handleProductEnter = () => {
    if (productTimeoutRef.current) clearTimeout(productTimeoutRef.current);
    setDownloadOpen(false);
    setAccountOpen(false);
    setProductOpen(true);
  };
  const handleProductLeave = () => {
    productTimeoutRef.current = setTimeout(() => {
      setProductOpen(false);
    }, 150);
  };

  const handleDownloadEnter = () => {
    if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);
    setProductOpen(false);
    setAccountOpen(false);
    setDownloadOpen(true);
  };
  const handleDownloadLeave = () => {
    downloadTimeoutRef.current = setTimeout(() => {
      setDownloadOpen(false);
    }, 150);
  };

  const handleAccountEnter = () => {
    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
    setProductOpen(false);
    setDownloadOpen(false);
    setAccountOpen(true);
  };
  const handleAccountLeave = () => {
    accountTimeoutRef.current = setTimeout(() => {
      setAccountOpen(false);
    }, 150);
  };

  const handleGoToAccount = (tab: AccountTab = 'overview') => {
    setProductOpen(false);
    setDownloadOpen(false);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setAccountTab(tab);
    navigate(`/account?tab=${tab}`);
  };

  const handleLogoutClick = () => {
    setProductOpen(false);
    setDownloadOpen(false);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 0' : '18px 0',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="container">
        {/* Main Floating Navigation Capsule */}
        <div
          style={{
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(226, 232, 240, 0.85)',
            borderRadius: '9999px',
            padding: '8px 12px 8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: scrolled
              ? '0 12px 32px -6px rgba(7, 26, 49, 0.09), 0 0 0 1px rgba(7, 26, 49, 0.04)'
              : '0 4px 16px -2px rgba(7, 26, 49, 0.05)',
            transition: 'all 0.25s ease',
            position: 'relative',
          }}
        >
          {/* 1. Official ZAMERIA Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}
            aria-label="ZAMERIA Home"
          >
            <img
              src="/zameria-logo-header.png"
              alt="ZAMERIA"
              style={{
                height: '28px',
                width: 'auto',
                maxHeight: '28px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </a>

          {/* 2. Desktop Navigation: Product, Pricing, Download ▾, FAQ's, Point of Sale */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
            }}
            className="desktop-nav"
          >
            {/* Product ▾ Dropdown Trigger */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={handleProductEnter}
              onMouseLeave={handleProductLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setDownloadOpen(false);
                  setAccountOpen(false);
                  setProductOpen(!productOpen);
                }}
                aria-expanded={productOpen}
                aria-haspopup="true"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: productOpen ? 'var(--brand-navy)' : 'var(--text-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 0',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  transition: 'color 0.15s ease',
                }}
                className="nav-link"
              >
                <span>Product</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: productOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Product Dropdown Menu */}
              {productOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    boxShadow: '0 20px 40px -10px rgba(7, 26, 49, 0.16), 0 0 0 1px rgba(7, 26, 49, 0.04)',
                    padding: '12px',
                    zIndex: 110,
                    animation: 'dropdownFadeInCenter 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: 'var(--text-dim)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '6px 12px 8px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Product
                  </div>

                  {/* 1. ZAMERIA POS */}
                  <a
                    href="/woocommerce-pos"
                    onClick={(e) => {
                      e.preventDefault();
                      setProductOpen(false);
                      navigate('/woocommerce-pos');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.18s ease',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Store size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                        WooCommerce POS
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                        Fast point of sale checkout for physical store counters.
                      </p>
                    </div>
                  </a>

                  {/* 2. Inventory Sync */}
                  <a
                    href="/woocommerce-inventory-sync"
                    onClick={(e) => {
                      e.preventDefault();
                      setProductOpen(false);
                      navigate('/woocommerce-inventory-sync');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.18s ease',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Package size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                        Inventory Sync
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                        Real-time stock synchronization across store and web.
                      </p>
                    </div>
                  </a>

                  {/* 3. WooCommerce POS Nigeria */}
                  <a
                    href="/woocommerce-pos-nigeria"
                    onClick={(e) => {
                      e.preventDefault();
                      setProductOpen(false);
                      navigate('/woocommerce-pos-nigeria');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.18s ease',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#faf5ff',
                        color: '#9333ea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Plug size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                        WooCommerce POS Nigeria
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                        Built for Nigerian multi-channel retail businesses.
                      </p>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Pricing */}
            <a
              href="#pricing"
              onClick={scrollToSection('pricing')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-body)',
                transition: 'color 0.15s ease',
                textDecoration: 'none',
              }}
              className="nav-link"
            >
              Pricing
            </a>

            {/* Downloads ▾ Dropdown Trigger */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={handleDownloadEnter}
              onMouseLeave={handleDownloadLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setProductOpen(false);
                  setAccountOpen(false);
                  setDownloadOpen(!downloadOpen);
                }}
                aria-expanded={downloadOpen}
                aria-haspopup="true"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: downloadOpen ? 'var(--brand-navy)' : 'var(--text-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 0',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  transition: 'color 0.15s ease',
                }}
                className="nav-link"
              >
                <span>Downloads</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: downloadOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Download Dropdown Menu */}
              {downloadOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '330px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    boxShadow: '0 20px 40px -10px rgba(7, 26, 49, 0.16), 0 0 0 1px rgba(7, 26, 49, 0.04)',
                    padding: '12px',
                    zIndex: 110,
                    animation: 'dropdownFadeInCenter 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: 'var(--text-dim)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '6px 12px 8px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Download
                  </div>

                  {/* 1. ZAMERIA Plugin (Active) */}
                  <a
                    href="http://localhost:5182"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDownloadOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.18s ease',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Plug size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                          ZAMERIA Plugin
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#16a34a',
                            backgroundColor: '#f0fdf4',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Live
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                        Connect ZAMERIA to your WooCommerce store.
                      </p>
                    </div>
                  </a>

                  {/* 2. Desktop App (Active / Available) */}
                  <a
                    href="http://localhost:5176"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDownloadOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.18s ease',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#f5f3ff',
                        color: '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Monitor size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                          Desktop App
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#16a34a',
                            backgroundColor: '#f0fdf4',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Available
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                        Point of Sale app for counter checkout.
                      </p>
                    </div>
                  </a>

                  {/* 3. iOS App (Coming Soon) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      opacity: 0.72,
                      cursor: 'not-allowed',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#f1f5f9',
                        color: '#071A31',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Apple size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                          iOS App
                        </span>
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '3px 0 0', lineHeight: 1.35 }}>
                        Use ZAMERIA on your iPhone and iPad.
                      </p>
                    </div>
                  </div>

                  {/* 3. Android App (Coming Soon) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      opacity: 0.72,
                      cursor: 'not-allowed',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0003 0-.5516.4482-1.0002.9993-1.0002.5516 0 .9997.4486.9997 1.0002 0 .5517-.4481 1.0003-.9997 1.0003m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0003 0-.5516.4482-1.0002.9993-1.0002.5516 0 .9997.4486.9997 1.0002 0 .5517-.4481 1.0003-.9997 1.0003m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.4128 13.8533 8.1 12 8.1c-1.8533 0-3.5902.3128-5.1368.8497L4.8409 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                          Android App
                        </span>
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '3px 0 0', lineHeight: 1.35 }}>
                        Use ZAMERIA on Android devices.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ */}
            <a
              href="#faq"
              onClick={scrollToSection('faq')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-body)',
                transition: 'color 0.15s ease',
                textDecoration: 'none',
              }}
              className="nav-link"
            >
              FAQ
            </a>
          </nav>

          {/* 3. Right Action Group: Dynamic based on Authentication State */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            className="desktop-nav"
          >
            {!isAuthenticated ? (
              /* LOGGED OUT USER STATE: Log In | Start 7-Day Free Trial */
              <>
                <a
                  href={ROUTES.login}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(ROUTES.login);
                  }}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-headline)',
                    transition: 'color 0.15s ease',
                    textDecoration: 'none',
                  }}
                  className="nav-link"
                >
                  Log In
                </a>

                <a
                  href={ROUTES.trial}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(ROUTES.trial);
                  }}
                  className="btn btn-get-started"
                  style={{
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    padding: '10px 22px',
                    height: '40px',
                    borderRadius: '9999px',
                    border: '1px solid #071A31',
                    boxShadow: '0 4px 14px rgba(7, 26, 49, 0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight size={14} />
                </a>
              </>
            ) : (
              /* LOGGED IN USER STATE: My Account ▾ + Open POS */
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={handleAccountEnter}
                  onMouseLeave={handleAccountLeave}
                >
                  <button
                    type="button"
                    onClick={() => setAccountOpen(!accountOpen)}
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: accountOpen ? '#2563eb' : 'var(--brand-navy)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px 6px 10px',
                      backgroundColor: accountOpen ? '#eff6ff' : '#f8fafc',
                      borderRadius: '9999px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#071A31',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      {customer?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span>My Account</span>
                    {isTrial ? (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                        Trial · {daysRemaining}d
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          border: '1px solid #bbf7d0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                        {planLabel}
                      </span>
                    )}
                    <ChevronDown
                      size={14}
                      style={{
                        transform: accountOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {/* My Account Dropdown */}
                  {accountOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        right: 0,
                        width: '290px',
                        backgroundColor: '#ffffff',
                        borderRadius: '18px',
                        border: '1px solid rgba(226, 232, 240, 0.95)',
                        boxShadow: '0 24px 48px -12px rgba(7, 26, 49, 0.18), 0 0 0 1px rgba(7, 26, 49, 0.04)',
                        padding: '10px',
                        zIndex: 110,
                        animation: 'dropdownFadeInRight 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* User info snippet - strictly reflects state per Section 13 */}
                      <div
                        style={{
                          padding: '12px 14px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          marginBottom: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--brand-navy)' }}>
                          {customer?.fullName}
                        </div>
                        {isTrial ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>
                              Free Trial · {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: customer?.subscription?.status === 'past_due' ? '#ef4444' : customer?.subscription?.status === 'cancelled' ? '#f59e0b' : '#10b981',
                              }}
                            />
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                color: customer?.subscription?.status === 'past_due' ? '#b91c1c' : customer?.subscription?.status === 'cancelled' ? '#b45309' : '#047857',
                              }}
                            >
                              {planLabel} · {customer?.subscription?.status === 'past_due' ? 'Payment Failed' : customer?.subscription?.status === 'cancelled' ? 'Cancelled' : customer?.subscription?.status === 'expired' ? 'Expired' : 'Active'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Account Dropdown Links - strictly 6 core sections per Section 15 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button
                          onClick={() => handleGoToAccount('overview')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                          className="dropdown-link-hover"
                        >
                          <LayoutDashboard size={15} color="#2563eb" />
                          <span>Overview</span>
                        </button>

                        <button
                          onClick={() => handleGoToAccount('orders')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                          className="dropdown-link-hover"
                        >
                          <ShoppingBag size={15} color="#0891b2" />
                          <span>Orders</span>
                        </button>

                        <button
                          onClick={() => handleGoToAccount('plan')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                          className="dropdown-link-hover"
                        >
                          <Layers size={15} color="#7c3aed" />
                          <span>Plan</span>
                        </button>

                        <button
                          onClick={() => handleGoToAccount('billing')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                          className="dropdown-link-hover"
                        >
                          <CreditCard size={15} color="#16a34a" />
                          <span>Billing</span>
                        </button>

                        <button
                          onClick={() => handleGoToAccount('licenses')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                          className="dropdown-link-hover"
                        >
                          <Key size={15} color="#2563eb" />
                          <span>License</span>
                        </button>

                        <button
                          onClick={() => handleGoToAccount('settings')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                          className="dropdown-link-hover"
                        >
                          <Settings size={15} color="#64748b" />
                          <span>Settings</span>
                        </button>

                        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                        <button
                          onClick={handleLogoutClick}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#b91c1c',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <LogOut size={15} color="#b91c1c" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Open POS CTA Button */}
                <a
                  href="http://localhost:5176"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    padding: '8px 16px',
                    height: '36px',
                    borderRadius: '9999px',
                    border: '1px solid #071A31',
                    boxShadow: '0 4px 14px rgba(7, 26, 49, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0c284d')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#071A31')}
                >
                  <span>Open POS</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              padding: '8px',
              color: 'var(--brand-navy)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '20px',
            right: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '24px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 24px 48px -10px rgba(7, 26, 49, 0.18)',
            zIndex: 120,
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {/* Mobile Product Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileProductOpen(!mobileProductOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--brand-navy)',
                padding: '4px 0',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              <span>Product</span>
              <ChevronDown
                size={16}
                style={{
                  transform: mobileProductOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            {mobileProductOpen && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* 1. WooCommerce POS */}
                <a
                  href="/woocommerce-pos"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigate('/woocommerce-pos');
                  }}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 700, fontSize: '13px' }}>
                    <Store size={15} />
                    <span>WooCommerce POS</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.4 }}>
                    Fast checkout for physical store counters.
                  </p>
                </a>

                {/* 2. Inventory Sync */}
                <a
                  href="/woocommerce-inventory-sync"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigate('/woocommerce-inventory-sync');
                  }}
                  style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>
                    <Package size={15} />
                    <span>Inventory Sync</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.4 }}>
                    Real-time stock synchronization across store and web.
                  </p>
                </a>

                {/* 3. WooCommerce POS Nigeria */}
                <a
                  href="/woocommerce-pos-nigeria"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigate('/woocommerce-pos-nigeria');
                  }}
                  style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9333ea', fontWeight: 700, fontSize: '13px' }}>
                    <Plug size={15} />
                    <span>WooCommerce POS Nigeria</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.4 }}>
                    Built for Nigerian retail operations and local payments.
                  </p>
                </a>
              </div>
            )}
          </div>

          {/* Pricing */}
          <a
            href="#pricing"
            onClick={(e) => {
              scrollToSection('pricing')(e);
              setMobileMenuOpen(false);
            }}
            style={{ fontSize: '15px', fontWeight: 600, color: 'var(--brand-navy)', padding: '4px 0', textDecoration: 'none' }}
          >
            Pricing
          </a>

          {/* Mobile Downloads Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileDownloadOpen(!mobileDownloadOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--brand-navy)',
                padding: '4px 0',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              <span>Downloads</span>
              <ChevronDown
                size={16}
                style={{
                  transform: mobileDownloadOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            {mobileDownloadOpen && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* 1. ZAMERIA Plugin */}
                <a
                  href="http://localhost:5182"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 700, fontSize: '13px' }}>
                    <Plug size={15} />
                    <span>ZAMERIA Plugin</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '1px 5px', borderRadius: '4px', marginLeft: 'auto' }}>Live</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.4 }}>
                    Connect ZAMERIA to your WooCommerce store.
                  </p>
                </a>

                {/* 2. Desktop App */}
                <a
                  href="http://localhost:5176"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 700, fontSize: '13px' }}>
                    <Monitor size={15} />
                    <span>Desktop App</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '1px 5px', borderRadius: '4px', marginLeft: 'auto' }}>Available</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.4 }}>
                    Point of Sale app for counter checkout.
                  </p>
                </a>

                {/* 3. iOS App */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', opacity: 0.72 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-navy)', fontWeight: 700, fontSize: '13px' }}>
                    <Apple size={15} />
                    <span>iOS App</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', marginLeft: 'auto' }}>Coming Soon</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.35 }}>
                    Use ZAMERIA on your iPhone and iPad.
                  </p>
                </div>

                {/* 3. Android App */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', opacity: 0.72 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0003 0-.5516.4482-1.0002.9993-1.0002.5516 0 .9997.4486.9997 1.0002 0 .5517-.4481 1.0003-.9997 1.0003m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0003 0-.5516.4482-1.0002.9993-1.0002.5516 0 .9997.4486.9997 1.0002 0 .5517-.4481 1.0003-.9997 1.0003m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.4128 13.8533 8.1 12 8.1c-1.8533 0-3.5902.3128-5.1368.8497L4.8409 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                    </svg>
                    <span style={{ color: 'var(--brand-navy)' }}>Android App</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', marginLeft: 'auto' }}>Coming Soon</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0 23px', lineHeight: 1.35 }}>
                    Use ZAMERIA on Android devices.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FAQ */}
          <a
            href="#faq"
            onClick={(e) => {
              scrollToSection('faq')(e);
              setMobileMenuOpen(false);
            }}
            style={{ fontSize: '15px', fontWeight: 600, color: 'var(--brand-navy)', padding: '4px 0', textDecoration: 'none' }}
          >
            FAQ
          </a>

          {/* Logged in vs Logged out Mobile Controls */}
          {!isAuthenticated ? (
            <>
              {/* Log In */}
              <a
                href={ROUTES.login}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(ROUTES.login);
                }}
                style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0', textDecoration: 'none' }}
              >
                Log In
              </a>

              {/* Mobile CTA: Start 7-Day Free Trial */}
              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={ROUTES.trial}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigate(ROUTES.trial);
                  }}
                  className="btn btn-get-started"
                  style={{
                    width: '100%',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: '9999px',
                    justifyContent: 'center',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </>
          ) : (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '10px' }}>
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#071A31' }}>
                  {customer?.fullName}
                </div>
                {isTrial ? (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', marginTop: '3px' }}>
                    Free Trial · {daysRemaining} days left
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857', marginTop: '3px' }}>
                    {planLabel} · Active
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => handleGoToAccount('overview')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#071A31',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LayoutDashboard size={16} color="#2563eb" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => handleGoToAccount('orders')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#071A31',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <ShoppingBag size={16} color="#0891b2" />
                  <span>Orders</span>
                </button>

                <button
                  onClick={() => handleGoToAccount('plan')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#071A31',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Layers size={16} color="#7c3aed" />
                  <span>Plan</span>
                </button>

                <button
                  onClick={() => handleGoToAccount('billing')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#071A31',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <CreditCard size={16} color="#16a34a" />
                  <span>Billing</span>
                </button>

                <button
                  onClick={() => handleGoToAccount('licenses')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#071A31',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Key size={16} color="#2563eb" />
                  <span>License</span>
                </button>

                <button
                  onClick={() => handleGoToAccount('settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#071A31',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Settings size={16} color="#64748b" />
                  <span>Settings</span>
                </button>

                {/* Open POS Link for Mobile */}
                <a
                  href="http://localhost:5176"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#071A31',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginTop: '4px',
                    justifyContent: 'center',
                  }}
                >
                  <span>Open POS</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={handleLogoutClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 4px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#b91c1c',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderTop: '1px solid #f1f5f9',
                    marginTop: '6px',
                  }}
                >
                  <LogOut size={16} color="#b91c1c" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .nav-link:hover {
          color: var(--brand-navy) !important;
        }
        .dropdown-item-hover:hover {
          background-color: #eff6ff !important;
          border-color: #bfdbfe !important;
        }
        .dropdown-link-hover:hover {
          background-color: #f8fafc !important;
        }
        .btn-get-started:hover {
          background-color: #0c2340 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(7, 26, 49, 0.3) !important;
        }
        @keyframes dropdownFadeInCenter {
          from {
            opacity: 0;
            transform: translate(-50%, -6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes dropdownFadeInRight {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
