import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Search,
  ShoppingCart,
  Plus,
  FileText,
  Package,
  Users,
  Settings,
  LayoutDashboard,
  ScanBarcode,
  RefreshCw,
  User,
  Wifi,
  CreditCard,
  Zap,
} from 'lucide-react';
import { ROUTES, scrollToSection } from '../lib/routes';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const baseWidth = 1040;
        setScale(Math.min(1, width / baseWidth));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <section
      id="hero"
      style={{
        paddingTop: '144px',
        paddingBottom: '90px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      {/* Top Luminous Ambient Radial Atmosphere */}
      <div
        className="radial-atmosphere"
        style={{
          width: '800px',
          height: '500px',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 70%)',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Core Hero Editorial Header */}
        <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto 52px' }}>
          {/* Luminous Pill Eyebrow */}
          <div className="eyebrow-badge purple" style={{ margin: '0 auto 22px' }}>
            <span className="eyebrow-dot" />
            <span>✦ UNIFIED COMMERCE FOR WOOCOMMERCE</span>
          </div>

          {/* Oversized Display Headline */}
          <h1 className="hero-headline" style={{ margin: '0 auto 24px' }}>
            Your online and offline business shouldn't live in different worlds.
          </h1>

          {/* Straight-To-The-Point Subtitle */}
          <p className="lead-text center" style={{ maxWidth: '680px', marginBottom: '36px' }}>
            ZAMERIA connects your online WooCommerce store with your physical store. Manage your products, inventory, orders, and sales without maintaining separate systems.
          </p>

          {/* Action Duo */}
          <div
            className="btn-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '22px',
            }}
          >
            <a
              href={ROUTES.trial}
              className="btn btn-hero-gradient"
              style={{
                padding: '16px 38px',
                fontSize: '16px',
              }}
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight size={17} />
            </a>
            <a
              href="#product-powers"
              onClick={scrollToSection('product-powers')}
              className="btn btn-secondary"
              style={{
                padding: '16px 28px',
                fontSize: '16px',
              }}
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Trust Strip */}
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <span>✓ 7-day free trial</span>
            <span>✓ No license required to start</span>
            <span>✓ No credit card required</span>
          </div>
        </div>

        {/* The Star: 3D-Elevated Layered POS Interface */}
        <div
          ref={containerRef}
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Orbiting Live Chip 1: Stock Sync */}
          <div
            className="live-chip chip-left"
            style={{
              position: 'absolute',
              top: '-22px',
              left: '24px',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              borderRadius: '9999px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 12px 28px -4px rgba(7, 26, 49, 0.12)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-navy)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span>Vitamin C Serum (-1) synced to WooCommerce in 0.4s</span>
          </div>

          {/* Orbiting Live Chip 2: Split Tender Payment */}
          <div
            className="live-chip chip-right"
            style={{
              position: 'absolute',
              top: '-22px',
              right: '24px',
              zIndex: 10,
              backgroundColor: 'rgba(7, 26, 49, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 12px 28px -4px rgba(7, 26, 49, 0.25)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            <CreditCard size={14} color="#60a5fa" />
            <span>₦36,000 Split Tender • Receipt #1042</span>
          </div>

          {/* Scaled Window Wrapper — completely static, zero interactivity */}
          <div
            style={{
              width: '100%',
              height: `${620 * scale}px`,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              boxShadow: '0 32px 80px -16px rgba(7, 26, 49, 0.22), 0 0 0 1px rgba(7, 26, 49, 0.08)',
              backgroundColor: '#ffffff',
            }}
          >
            {/* The Authentic ZAMERIA POS Window (1040px base width) */}
            <div
              style={{
                width: '1040px',
                height: '620px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none',
                userSelect: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
              }}
              aria-hidden="true"
            >
              {/* POS Window Top Bar */}
              <div
                style={{
                  height: '36px',
                  backgroundColor: '#071A31',
                  borderBottom: '1px solid #0c2340',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#cbd5e1' }}>app.zameria.com/sale</span>
                  <span>•</span>
                  <span>Lagos Skincare Lab — Counter POS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ fontWeight: 600 }}>WooCommerce Synced</span>
                </div>
              </div>

              {/* Main POS Layout: 80px Navy Sidebar + Center Catalog + 320px Cart Pane */}
              <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
                {/* 1. Authentic Sidebar (Uses ONLY ZAMERIA icon in POS software) */}
                <div
                  style={{
                    width: '80px',
                    backgroundColor: '#071A31',
                    borderRight: '1px solid #0C2340',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                  }}
                >
                  {/* Brand Logo Header — ZAMERIA Icon Only */}
                  <div
                    style={{
                      height: '54px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid #0C2340',
                      padding: '0 8px',
                    }}
                  >
                    <img
                      src="/zameria-icon.png"
                      alt="ZAMERIA"
                      style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Primary Action: + New Order */}
                  <div
                    style={{
                      borderBottom: '1px solid #0C2340',
                      padding: '10px 4px',
                      backgroundColor: '#0C2340',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={16} color="#60A5FA" />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>
                      New Order
                    </span>
                  </div>

                  {/* Navigation Items */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#64748b',
                        borderBottom: '1px solid rgba(12, 35, 64, 0.4)',
                      }}
                    >
                      <LayoutDashboard size={17} />
                      <span style={{ fontSize: '10px', fontWeight: 500 }}>Dashboard</span>
                    </div>

                    <div
                      style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#0C2340',
                        color: '#60A5FA',
                        borderBottom: '1px solid rgba(12, 35, 64, 0.4)',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(96, 165, 250, 0.16)',
                          borderRadius: '12px',
                          padding: '3px 14px',
                        }}
                      >
                        <ShoppingCart size={17} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800 }}>Sale</span>
                    </div>

                    <div
                      style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#94a3b8',
                        borderBottom: '1px solid rgba(12, 35, 64, 0.4)',
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <FileText size={17} />
                        <span
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-8px',
                            backgroundColor: '#60A5FA',
                            color: '#071A31',
                            fontSize: '9px',
                            fontWeight: 900,
                            borderRadius: '10px',
                            padding: '1px 5px',
                            lineHeight: 1,
                          }}
                        >
                          4
                        </span>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 500 }}>Orders</span>
                    </div>

                    <div
                      style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#64748b',
                        borderBottom: '1px solid rgba(12, 35, 64, 0.4)',
                      }}
                    >
                      <Users size={17} />
                      <span style={{ fontSize: '10px', fontWeight: 500 }}>Customers</span>
                    </div>

                    <div
                      style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#64748b',
                        borderBottom: '1px solid rgba(12, 35, 64, 0.4)',
                      }}
                    >
                      <Package size={17} />
                      <span style={{ fontSize: '10px', fontWeight: 500 }}>Products</span>
                    </div>

                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '10px 0',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#64748b',
                      }}
                    >
                      <Settings size={17} />
                      <span style={{ fontSize: '10px', fontWeight: 500 }}>Settings</span>
                    </div>
                  </div>

                  {/* Cashier Badge & Wifi */}
                  <div
                    style={{
                      borderTop: '1px solid #0C2340',
                      padding: '8px 4px',
                      textAlign: 'center',
                      backgroundColor: 'rgba(12, 35, 64, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        color: '#f59e0b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Cashier
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                      <Wifi size={11} />
                      <span style={{ fontSize: '9px', fontWeight: 600 }}>Live</span>
                    </div>
                  </div>
                </div>

                {/* 2. Centre Product Catalog */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f8fafc',
                    minWidth: 0,
                  }}
                >
                  {/* Controls */}
                  <div
                    style={{
                      height: '46px',
                      backgroundColor: '#ffffff',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 14px',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                      }}
                    >
                      <Search size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Search skincare products, SKU or barcode...
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--brand-navy)',
                      }}
                    >
                      <ScanBarcode size={13} color="#2563eb" />
                      <span>Scan Barcode</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 9px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#16a34a',
                      }}
                    >
                      <RefreshCw size={12} />
                      <span>Sync</span>
                    </div>
                  </div>

                  {/* 4-Column Product Grid */}
                  <div
                    style={{
                      flex: 1,
                      padding: '12px',
                      overflowY: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '10px',
                      }}
                    >
                      {[
                        {
                          id: 101,
                          name: 'Vitamin C Serum',
                          price: '₦18,500',
                          stock: 42,
                          isLowStock: false,
                          image: '/products/vitaminc.jpg',
                        },
                        {
                          id: 102,
                          name: 'Niacinamide Serum',
                          price: '₦15,500',
                          stock: 7,
                          isLowStock: true,
                          image: '/products/niacinamide.jpg',
                        },
                        {
                          id: 103,
                          name: 'Hyaluronic Acid Serum',
                          price: '₦17,500',
                          stock: 24,
                          isLowStock: false,
                          image: '/products/hyaluronic.jpg',
                        },
                        {
                          id: 104,
                          name: 'Hydrating Toner',
                          price: '₦11,500',
                          stock: 18,
                          isLowStock: false,
                          image: '/products/toner.jpg',
                        },
                        {
                          id: 105,
                          name: 'Facial Cleanser',
                          price: '₦12,000',
                          stock: 22,
                          isLowStock: false,
                          image: '/products/cleanser.jpg',
                        },
                        {
                          id: 106,
                          name: 'SPF 50 Sunscreen',
                          price: '₦16,000',
                          stock: 31,
                          isLowStock: false,
                          image: '/products/sunscreen.jpg',
                        },
                        {
                          id: 107,
                          name: 'Hydrating Moisturizer',
                          price: '₦14,000',
                          stock: 12,
                          isLowStock: false,
                          image: '/products/moisturizer.jpg',
                        },
                        {
                          id: 108,
                          name: 'Acne Treatment Serum',
                          price: '₦15,000',
                          stock: 4,
                          isLowStock: true,
                          image: '/products/serum.jpg',
                        },
                      ].map((prod) => (
                        <div
                          key={prod.id}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            textAlign: 'left',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              aspectRatio: '1 / 1',
                              borderRadius: '8px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              marginBottom: '8px',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            {prod.isLowStock && (
                              <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                                <span
                                  style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '2px 6px',
                                    borderRadius: '9999px',
                                    backgroundColor: '#fffbeb',
                                    color: '#b45309',
                                    border: '1px solid #fde68a',
                                  }}
                                >
                                  Low stock
                                </span>
                              </div>
                            )}
                          </div>

                          <div>
                            <p
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#071a31',
                                lineHeight: 1.25,
                                height: '30px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                margin: 0,
                              }}
                              title={prod.name}
                            >
                              {prod.name}
                            </p>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'space-between',
                                marginTop: '8px',
                                paddingTop: '4px',
                                borderTop: '1px solid #f1f5f9',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: '#071a31',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {prod.price}
                              </span>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {prod.id}</span>
                            </div>

                            <div
                              style={{
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: prod.isLowStock ? 700 : 500,
                                  color: prod.isLowStock ? '#d97706' : '#64748b',
                                }}
                              >
                                Stock: {prod.stock} left
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Authentic Right Cart Pane (320px) */}
                <div
                  style={{
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderLeft: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <User size={13} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                            Amara Okafor
                          </span>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              color: '#2563eb',
                              backgroundColor: '#dbeafe',
                              padding: '1px 5px',
                              borderRadius: '3px',
                            }}
                          >
                            Customer
                          </span>
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                          Counter Sale • Lagos Store
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      4 items
                    </span>
                  </div>

                  <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '7px', overflowY: 'auto' }}>
                    {[
                      {
                        name: 'Vitamin C Serum',
                        image: '/products/vitaminc.jpg',
                        price: '₦18,500',
                        qty: 1,
                        lineTotal: '₦18,500',
                      },
                      {
                        name: 'Facial Cleanser',
                        image: '/products/cleanser.jpg',
                        price: '₦12,000',
                        qty: 2,
                        lineTotal: '₦24,000',
                      },
                      {
                        name: 'SPF 50 Sunscreen',
                        image: '/products/sunscreen.jpg',
                        price: '₦16,000',
                        qty: 1,
                        lineTotal: '₦16,000',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 9px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          gap: '8px',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '5px',
                            objectFit: 'cover',
                            border: '1px solid #e2e8f0',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: 'var(--brand-navy)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.name}
                          </div>
                          <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                            {item.price} each
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                          {item.lineTotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Checkout Summary */}
                  <div
                    style={{
                      padding: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Total Amount</span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy)' }}>
                        ₦58,500
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: '#071A31',
                          color: '#ffffff',
                          padding: '8px',
                          borderRadius: '6px',
                          textAlign: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        Split Tender (POS + Transfer)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .live-chip {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
