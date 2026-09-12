import React from 'react';
import {
  LayoutDashboard,
  Store,
  RefreshCw,
  Globe,
  Receipt,
  Package,
  Users,
  ShieldCheck,
  CheckCircle2,
  Search,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const ProductPowers: React.FC = () => {
  return (
    <section
      id="product-powers"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 52px' }}>
          <div className="eyebrow-badge purple" style={{ margin: '0 auto 16px' }}>
            <span>✦ COMPLETE RETAIL MANAGEMENT</span>
          </div>
          <h2 className="section-headline">
            Built for retail reality
          </h2>
          <p className="lead-text center" style={{ fontSize: '18px', color: 'var(--text-body)' }}>
            The essential tools you need to run your store smoothly without the clutter.
          </p>
        </div>

        {/* =========================================================================
            TIER 1: THE TWO CENTRAL FLAGSHIPS (Admin Dashboard & Point of Sale)
            Visual hierarchy communicates: Admin = Command Center, POS = Checkout Speed
        ========================================================================= */}
        <div
          className="retail-reality-tier1"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.18fr 0.82fr',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* FEATURE 1: ADMIN DASHBOARD (Command Center of the Business) */}
          <div
            className="retail-card retail-card-hero"
            style={{
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              {/* Feature Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  <LayoutDashboard size={13} />
                  <span>Command Center</span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#10b981',
                    backgroundColor: '#ecfdf5',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  <span className="live-dot" />
                  <span>Real-Time Telemetry</span>
                </div>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(22px, 2.4vw, 28px)',
                  fontWeight: 800,
                  color: 'var(--brand-navy)',
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}
              >
                Admin Dashboard
              </h3>

              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--text-body)',
                  lineHeight: 1.55,
                  maxWidth: '560px',
                  marginBottom: '26px',
                }}
              >
                Give business owners a clear overview of their store. See sales, orders, inventory, and important business activity at a glance.
              </p>
            </div>

            {/* Realistic Command Center UI Preview */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px -2px rgba(7, 26, 49, 0.05)',
              }}
            >
              {/* Mini Top Metrics Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '16px',
                }}
                className="dashboard-metrics-grid"
              >
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Today's Sales
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em' }}>
                    ₦342,800
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
                    +18.4% vs yesterday
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Today's Orders
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em' }}>
                    38 Total
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>
                    24 Store · 14 Web
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Inventory Status
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706', letterSpacing: '-0.02em' }}>
                    3 Items Low
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#d97706', marginTop: '2px' }}>
                    Reorder alerts ready
                  </div>
                </div>
              </div>

              {/* Real-time Activity Stream Feed */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Store size={13} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                      Store Counter Till 1
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-navy)' }}>
                    ₦18,500 <span style={{ fontSize: '10px', fontWeight: 600, color: '#16a34a' }}>(Cash)</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={13} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                      WooCommerce Web Store
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-navy)' }}>
                    ₦36,000 <span style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb' }}>(Paid)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 2: POINT OF SALE (Speed and Simplicity at Checkout) */}
          <div
            className="retail-card retail-card-hero"
            style={{
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              {/* Feature Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Store size={13} />
                  <span>Checkout Terminal</span>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#059669',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Fast & Simple
                </span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(22px, 2.4vw, 28px)',
                  fontWeight: 800,
                  color: 'var(--brand-navy)',
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}
              >
                Point of Sale
              </h3>

              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--text-body)',
                  lineHeight: 1.55,
                  marginBottom: '26px',
                }}
              >
                Process physical-store sales quickly and easily. Built to make checkout simple for staff and cashiers during rush hours.
              </p>
            </div>

            {/* Fast Checkout Terminal UI Mockup */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px -2px rgba(7, 26, 49, 0.05)',
              }}
            >
              {/* Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                <Search size={14} color="#94a3b8" />
                <span>Scan barcode or search product...</span>
              </div>

              {/* Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>2x</span>
                    <span style={{ color: 'var(--text-body)' }}>Hydrating Daily Cleanser</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>₦14,000</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>1x</span>
                    <span style={{ color: 'var(--text-body)' }}>Brightening Face Cream</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>₦10,500</span>
                </div>
              </div>

              {/* Payment Methods & Total */}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Amount</span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy)', letterSpacing: '-0.02em' }}>
                  ₦24,500
                </span>
              </div>

              {/* 1-Tap Tender Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #10b981',
                    borderRadius: '6px',
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#065f46',
                  }}
                >
                  ✓ Cash
                </div>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-body)',
                  }}
                >
                  Card / POS
                </div>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-body)',
                  }}
                >
                  Transfer
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={14} />
                <span>Complete Sale & Print Receipt</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 2: THE TWO SYNCHRONIZATION PILLARS (Inventory & WooCommerce)
            Communicates seamless synchronization between online and physical sales
        ========================================================================= */}
        <div
          className="retail-reality-tier2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* FEATURE 3: INVENTORY */}
          <div
            className="retail-card"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(7, 26, 49, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RefreshCw size={19} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#16a34a',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    2-Way Stock Sync
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', margin: 0 }}>
                    Inventory
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '20px' }}>
                Keep stock levels accurate across online and physical sales. Help merchants know what is available without manually checking multiple systems.
              </p>
            </div>

            {/* Inventory Sync Telemetry Graphic */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  Vitamin C Serum 50ml
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                  Live Balance
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Physical Store</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-navy)' }}>Sold -1 unit</div>
                </div>

                <div style={{ color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={16} />
                </div>

                <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>WooCommerce Stock</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>42 → 41 left</div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 8: WOOCOMMERCE INTEGRATION */}
          <div
            className="retail-card"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(7, 26, 49, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#eef2ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Globe size={19} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#4f46e5',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Direct Store Bridge
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', margin: 0 }}>
                    WooCommerce Integration
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '20px' }}>
                Connect the online store with the physical store. Keep products, inventory, and orders synchronized without exporting CSV files.
              </p>
            </div>

            {/* Direct 2-Way Connection Bridge Graphic */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                    Active 2-Way Connection
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WordPress REST API</span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: 1.45 }}>
                Orders, prices, and stock counts synchronize instantly between your website and your counter registers.
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 3: THE FOUR ESSENTIAL OPERATIONAL TOOLS
            Orders, Products, Customers, Staff & Cashiers
        ========================================================================= */}
        <div
          className="retail-reality-tier3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {/* FEATURE 4: ORDERS */}
          <div
            className="retail-card retail-card-mini"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(7, 26, 49, 0.02)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#fff7ed',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Receipt size={18} />
              </div>

              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px' }}>
                Orders
              </h4>

              <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                Manage online and physical-store orders from one place. Make it easy to see order status and sales activity.
              </p>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 600,
                color: '#ea580c',
              }}
            >
              <span>Unified sales feed</span>
              <span>Web + Till</span>
            </div>
          </div>

          {/* FEATURE 5: PRODUCTS */}
          <div
            className="retail-card retail-card-mini"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(7, 26, 49, 0.02)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#f5f3ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Package size={18} />
              </div>

              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px' }}>
                Products
              </h4>

              <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                Add, organize, edit, and manage products from one system. Products and inventory stay connected to your WooCommerce store.
              </p>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 600,
                color: '#7c3aed',
              }}
            >
              <span>Single catalog</span>
              <span>Variants & Barcodes</span>
            </div>
          </div>

          {/* FEATURE 6: CUSTOMERS */}
          <div
            className="retail-card retail-card-mini"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(7, 26, 49, 0.02)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#ecfeff',
                  color: '#0891b2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Users size={18} />
              </div>

              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px' }}>
                Customers
              </h4>

              <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                Keep customer information and purchase history organized. Make customer records easy to access when needed.
              </p>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 600,
                color: '#0891b2',
              }}
            >
              <span>Purchase history</span>
              <span>Online & In-Store</span>
            </div>
          </div>

          {/* FEATURE 7: STAFF & CASHIERS */}
          <div
            className="retail-card retail-card-mini"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(7, 26, 49, 0.02)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#fffbeb',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <ShieldCheck size={18} />
              </div>

              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px' }}>
                Staff & Cashiers
              </h4>

              <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                Give employees the access they need to do their jobs. Keep sensitive business controls restricted to authorized users.
              </p>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 600,
                color: '#d97706',
              }}
            >
              <span>4-digit PIN switch</span>
              <span>Protected controls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Component Styles for Hover and Responsive Layouts */}
      <style>{`
        .retail-card:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 10px 24px -4px rgba(7, 26, 49, 0.08) !important;
          transform: translateY(-2px);
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
          box-shadow: 0 0 6px #10b981;
          animation: pulse-live 2s infinite ease-in-out;
        }

        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        @media (max-width: 1024px) {
          .retail-reality-tier1 {
            grid-template-columns: 1fr !important;
          }
          .retail-reality-tier3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 680px) {
          .retail-reality-tier2 {
            grid-template-columns: 1fr !important;
          }
          .retail-reality-tier3 {
            grid-template-columns: 1fr !important;
          }
          .retail-card-hero {
            padding: 24px 18px !important;
          }
          .dashboard-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
