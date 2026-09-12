import React from 'react';

interface CategoryItem {
  name: string;
  desc: string;
  image: string;
  tag: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'Fashion & Clothing',
    desc: 'Boutiques, apparel brands, shoe stores and bespoke Nigerian designers.',
    image: '/categories/fashion.jpg',
    tag: 'Size & Color Variations',
  },
  {
    name: 'Beauty & Cosmetics',
    desc: 'Skincare shops, cosmetics brands, wellness bars and beauty studios.',
    image: '/categories/beauty.jpg',
    tag: 'Batch & Expiry Ready',
  },
  {
    name: 'Electronics & Gadgets',
    desc: 'Phone shops, computer vendors, audio equipment and tech accessories.',
    image: '/categories/electronics.jpg',
    tag: 'Serial & IMEI Tracking',
  },
  {
    name: 'Grocery & Supermarkets',
    desc: 'Supermarkets, mini marts, food provisions and fast-paced retail stores.',
    image: '/categories/grocery.jpg',
    tag: 'Rapid Barcode Scanning',
  },
  {
    name: 'Pharmacies & Health Stores',
    desc: 'Retail pharmacies, medical dispensaries and wellness product centers.',
    image: '/categories/pharmacy.jpg',
    tag: 'Stock Alert Safeguards',
  },
  {
    name: 'Jewelry & Accessories',
    desc: 'Fine jewelry stores, luxury watches, handcrafted beads and gift shops.',
    image: '/categories/jewelry.jpg',
    tag: 'High-Value Tagging',
  },
];

export const BusinessCategories: React.FC = () => {
  return (
    <section
      id="businesses"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <div className="eyebrow-badge" style={{ margin: '0 auto 16px' }}>
            <span>BUILT FOR NIGERIAN COMMERCE</span>
          </div>
          <h2 className="section-headline">
            What type of businesses use ZAMERIA?
          </h2>
          <p className="lead-text center">
            ZAMERIA works for businesses that sell physical products or services — from fashion and beauty to groceries, electronics, and more.
          </p>
        </div>

        {/* 6 Categories Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div
          className="category-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="category-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(7, 26, 49, 0.04)',
                transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease, border-color 0.24s ease',
              }}
            >
              {/* Category Imagery with Floating Feature Pill */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                }}
              >
                <img
                  src={cat.image}
                  alt={`${cat.name} Nigerian retail store`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="cat-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(7, 26, 49, 0.82)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {cat.tag}
                </div>
              </div>

              {/* Text content */}
              <div
                style={{
                  padding: '24px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  backgroundColor: '#ffffff',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--brand-navy)',
                    marginBottom: '8px',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {cat.name}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-body)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px -6px rgba(7, 26, 49, 0.12);
          border-color: #cbd5e1;
        }
        .category-card:hover .cat-img {
          transform: scale(1.04);
        }
        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 640px) {
          .category-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};
