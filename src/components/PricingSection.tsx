import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ROUTES } from '../lib/routes';

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
    <div className="glass-card" style={{ backgroundColor: featured ? 'var(--brand-navy)' : '#ffffff', color: featured ? '#ffffff' : 'var(--brand-navy)', border: featured ? '1px solid #1a4275' : '1px solid var(--border-subtle)', borderRadius: '24px', padding: '36px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: featured ? '0 24px 48px -10px rgba(7, 26, 49, 0.35)' : '0 4px 16px rgba(7, 26, 49, 0.04)' }}>
      {featured && <span style={{ position: 'absolute', top: '-12px', right: '24px', backgroundColor: '#60a5fa', color: '#071A31', fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.08em', padding: '3px 12px', borderRadius: '9999px' }}>MOST POPULAR</span>}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: featured ? '#93c5fd' : 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>{name}</div>
        <p style={{ fontSize: '13px', color: featured ? '#cbd5e1' : 'var(--text-muted)', marginBottom: '20px' }}>{description}</p>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1 }}>{price}</div>
          <div style={{ fontSize: '12.5px', color: featured ? '#93c5fd' : 'var(--text-muted)', marginTop: '6px' }}>per year • 7-day free trial</div>
        </div>
        <div style={{ borderTop: featured ? '1px solid #153258' : '1px solid var(--border-subtle)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {features.map((item) => <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}><span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: featured ? 'rgba(96, 165, 250, 0.2)' : '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={11} strokeWidth={3} /></span><span>{item}</span></div>)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <a href={`/subscribe?plan=${plan}`} className={featured ? 'btn btn-hero-gradient' : 'btn btn-secondary'} style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '9999px', fontSize: '14px', fontWeight: 700 }}><span>Subscribe to {name}</span><ArrowRight size={15} /></a>
        <a href={featured ? ROUTES.businessTrial : ROUTES.trial} style={{ fontSize: '12.5px', fontWeight: 600, color: featured ? '#93c5fd' : 'var(--text-muted)', textDecoration: 'underline' }}>or start the 7-day free trial</a>
      </div>
    </div>
  );
}

export const PricingSection: React.FC = () => (
  <section id="pricing" style={{ paddingTop: '100px', paddingBottom: '100px', backgroundColor: 'var(--canvas-bg)' }}>
    <div className="container" style={{ maxWidth: '840px' }}>
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
        <div className="eyebrow-badge purple" style={{ margin: '0 auto 16px' }}><span>TRANSPARENT PRICING</span></div>
        <h2 className="section-headline">Two simple plans. One connected business.</h2>
        <p className="lead-text center">Start with a 7-day free trial. All subscriptions are billed annually—there are no monthly plans.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', alignItems: 'stretch' }} className="pricing-two-grid">
        <PlanCard name="Starter" plan="starter" price="₦200,000" description="For a retailer setting up their first connected store and POS." features={starterFeatures} />
        <PlanCard name="Business" plan="business" price="₦300,000" description="For growing retailers with unlimited products and staff." features={businessFeatures} featured />
      </div>
    </div>
  </section>
);
