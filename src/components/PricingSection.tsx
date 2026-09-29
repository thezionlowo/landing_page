import React from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';

const starterFeatures = [
  '1 WooCommerce store',
  '1 physical store/location',
  'Up to 500 products',
  'Up to 2 staff members',
  'Point of Sale and inventory synchronization',
];

const businessFeatures = [
  '1 WooCommerce store',
  '1 physical store/location',
  'Unlimited products',
  'Unlimited staff members',
  'Point of Sale and real-time inventory synchronization',
];

function PlanCard({ name, price, description, features, featured = false, plan }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  plan: 'starter' | 'business';
}) {
  return (
    <div
      className={`glass-card pricing-card ${featured ? 'pricing-card-featured' : 'pricing-card-standard'}`}
    >
      {featured && (
        <span className="pricing-popular-badge">
          MOST POPULAR
        </span>
      )}
      <div className="pricing-card-body">
        <div className={`pricing-plan-badge ${featured ? 'featured' : ''}`}>
          {name}
        </div>
        <p className={`pricing-plan-desc ${featured ? 'featured' : ''}`}>
          {description}
        </p>
        <div className="pricing-price-wrap">
          <div className="pricing-price-number">{price}</div>
          <div className={`pricing-price-interval ${featured ? 'featured' : ''}`}>
            per year • 7-day free trial
          </div>
        </div>
        <div className={`pricing-features-divider ${featured ? 'featured' : ''}`}>
          {features.map((item) => (
            <div key={item} className="pricing-feature-row">
              <span className={`pricing-check-icon ${featured ? 'featured' : ''}`}>
                <Check size={12} strokeWidth={3} />
              </span>
              <span className="pricing-feature-text">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <a
        href={`/subscribe?plan=${plan}`}
        className={`btn ${featured ? 'btn-hero-gradient' : 'btn-secondary'} pricing-cta-btn`}
      >
        <span>Subscribe securely</span>
        <ArrowRight size={15} />
      </a>
    </div>
  );
}

export const PricingSection: React.FC = () => (
  <section id="pricing" className="pricing-section">
    <div className="container pricing-container">
      <div className="pricing-header">
        <div className="eyebrow-badge purple" style={{ margin: '0 auto 16px' }}>
          <span>TRANSPARENT PRICING</span>
        </div>
        <h2 className="section-headline pricing-headline">Two simple plans. One connected business.</h2>
        <p className="lead-text center pricing-lead">
          Start with a 7-day free trial. All subscriptions are billed annually—there are no monthly plans.
        </p>
      </div>

      <div className="pricing-two-grid">
        <PlanCard
          name="Starter"
          price="₦200,000"
          description="For a retailer setting up their first connected store and POS."
          features={starterFeatures}
          plan="starter"
        />
        <PlanCard
          name="Business"
          price="₦300,000"
          description="For growing retailers with unlimited products and staff."
          features={businessFeatures}
          featured
          plan="business"
        />
      </div>

      {/* Trust & Peace of Mind indicators */}
      <div className="pricing-trust-strip">
        <div className="pricing-trust-item">
          <ShieldCheck size={16} className="pricing-trust-icon" />
          <span>7-Day Free Trial • No upfront payment</span>
        </div>
        <div className="pricing-trust-dot">•</div>
        <div className="pricing-trust-item">
          <span>Cancel anytime before trial ends</span>
        </div>
        <div className="pricing-trust-dot">•</div>
        <div className="pricing-trust-item">
          <span>Official WooCommerce REST API</span>
        </div>
      </div>
    </div>

    <style>{`
      .pricing-section {
        padding-top: clamp(64px, 8vw, 104px);
        padding-bottom: clamp(64px, 8vw, 104px);
        background-color: var(--canvas-bg);
      }
      .pricing-container {
        max-width: 860px;
      }
      .pricing-header {
        text-align: center;
        max-width: 680px;
        margin: 0 auto clamp(32px, 5vw, 56px);
      }
      .pricing-headline {
        margin-bottom: 14px;
      }
      .pricing-lead {
        margin: 0 auto;
        font-size: clamp(14px, 1.8vw, 16px);
      }
      .pricing-two-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
        align-items: stretch;
      }
      .pricing-card {
        border-radius: 24px;
        padding: clamp(26px, 4vw, 36px) clamp(20px, 3.5vw, 28px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        box-sizing: border-box;
        transition: transform 0.22s ease, box-shadow 0.22s ease;
      }
      .pricing-card-standard {
        background-color: #ffffff;
        color: var(--brand-navy);
        border: 1px solid var(--border-subtle);
        box-shadow: 0 4px 16px rgba(7, 26, 49, 0.04);
      }
      .pricing-card-featured {
        background-color: var(--brand-navy);
        color: #ffffff;
        border: 1px solid #1a4275;
        box-shadow: 0 24px 48px -10px rgba(7, 26, 49, 0.35);
      }
      .pricing-popular-badge {
        position: absolute;
        top: -12px;
        right: 24px;
        background-color: #60a5fa;
        color: #071A31;
        font-size: 10.5px;
        font-weight: 800;
        letter-spacing: 0.08em;
        padding: 4px 12px;
        border-radius: 9999px;
        box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
        z-index: 2;
      }
      .pricing-card-body {
        margin-bottom: 24px;
      }
      .pricing-plan-badge {
        font-size: 12px;
        font-weight: 800;
        color: var(--text-dim);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: var(--font-mono);
        margin-bottom: 6px;
      }
      .pricing-plan-badge.featured {
        color: #93c5fd;
      }
      .pricing-plan-desc {
        font-size: 13.5px;
        line-height: 1.5;
        color: var(--text-muted);
        margin-bottom: 20px;
        min-height: 40px;
      }
      .pricing-plan-desc.featured {
        color: #cbd5e1;
      }
      .pricing-price-wrap {
        margin-bottom: 24px;
      }
      .pricing-price-number {
        font-size: clamp(32px, 4vw, 40px);
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: -0.02em;
        white-space: nowrap;
      }
      .pricing-price-interval {
        font-size: 12.5px;
        color: var(--text-muted);
        margin-top: 6px;
      }
      .pricing-price-interval.featured {
        color: #93c5fd;
      }
      .pricing-features-divider {
        border-top: 1px solid var(--border-subtle);
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .pricing-features-divider.featured {
        border-top-color: #153258;
      }
      .pricing-feature-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13.5px;
        line-height: 1.45;
      }
      .pricing-check-icon {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #eff6ff;
        color: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .pricing-check-icon.featured {
        background-color: rgba(96, 165, 250, 0.2);
        color: #60a5fa;
      }
      .pricing-feature-text {
        flex: 1;
      }
      .pricing-cta-btn {
        width: 100%;
        justify-content: center;
        padding: 14px 20px;
        border-radius: 9999px;
        font-size: 14px;
        font-weight: 700;
        min-height: 48px;
        box-sizing: border-box;
      }
      .pricing-trust-strip {
        margin-top: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px 16px;
        font-size: 13px;
        color: var(--text-muted);
      }
      .pricing-trust-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .pricing-trust-icon {
        color: #16a34a;
        flex-shrink: 0;
      }
      .pricing-trust-dot {
        color: #cbd5e1;
      }

      /* Mobile & Small Screens Breakpoints */
      @media (max-width: 768px) {
        .pricing-two-grid {
          grid-template-columns: 1fr;
          gap: 22px;
          max-width: 420px;
          margin: 0 auto;
        }
        .pricing-plan-desc {
          min-height: auto;
          margin-bottom: 16px;
        }
        .pricing-card {
          padding: 28px 20px;
        }
        .pricing-popular-badge {
          right: 18px;
          top: -11px;
          font-size: 10px;
          padding: 3px 10px;
        }
        .pricing-trust-strip {
          margin-top: 28px;
          font-size: 12px;
          gap: 6px 12px;
        }
        .pricing-trust-dot {
          display: none;
        }
      }

      @media (max-width: 400px) {
        .pricing-card {
          padding: 24px 16px;
          border-radius: 20px;
        }
        .pricing-price-number {
          font-size: 30px;
        }
        .pricing-cta-btn {
          font-size: 13.5px;
          padding: 12px 16px;
        }
      }
    `}</style>
  </section>
);

