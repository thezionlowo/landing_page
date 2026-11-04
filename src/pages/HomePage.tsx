import { HOME_FAQS } from '../content/homeFaqs';
import { DeviceShowcase } from '../components/DeviceShowcase';
import { planCheckoutUrl } from '../lib/checkoutPricing';
import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Globe2, Layers, Package, Plug, ReceiptText, RefreshCw, ShieldCheck, Store, Users, WifiOff, Zap } from 'lucide-react';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { InteractiveWorkspace } from '../components/InteractiveWorkspace';
import { useGeoPricing } from '../services/geoPricingService';

function Hero() {
  return <section className="saas-hero" aria-labelledby="home-title">
    <div className="saas-container">
      <div className="saas-hero-copy">
        <span className="saas-integration"><span className="saas-woo">woo</span> POINT OF SALE FOR WOOCOMMERCE</span>
        <h1 id="home-title">Your shop and website.<br /><span>One connected POS.</span></h1>
        <p>Sell at the counter. Check stock, orders and customers.<br className="saas-wide-break" /> On mobile, iPad, laptop or desktop.</p>
        <div className="saas-actions"><a className="saas-button" href="/get-started">Start your free trial <ArrowRight size={17} /></a><a className="saas-button saas-button-secondary" href="#product">Try the POS demo <ArrowDown size={16} /></a></div>
        <div className="saas-reassurance"><span><Check size={13} />7 days of full Business access</span><span><Check size={13} />No credit card required</span></div>
      </div>
      <InteractiveWorkspace />

    </div>
  </section>;
}

function ConnectedRetail() {
  return <section id="connected" className="saas-connected"><div className="saas-container saas-connected-grid">
    <div className="saas-connected-copy"><span className="saas-eyebrow">YOUR SHOP + YOUR WEBSITE</span><h2>Sell in-store.<br /><span>Stay connected online.</span></h2><p>Connect your counter to WooCommerce. Keep products, stock, customers and orders together.</p><ul><li><Check size={15} /> One catalogue across your shop and website</li><li><Check size={15} /> Stock changes shared through sync</li><li><Check size={15} /> Customers and their purchases, linked</li></ul><a className="saas-link" href="/woocommerce-inventory-sync">See how your store connects <ArrowUpRight size={17} /></a></div>
    <div className="saas-system" aria-label="Your physical shop and WooCommerce website connected through the ZAMERIA plugin"><div className="saas-system-top"><span>CONNECTED COMMERCE</span><span><i /> SYSTEM OVERVIEW</span></div><div className="saas-system-channels"><div><Store size={26} /><strong>Your shop</strong><small>Counter sales & staff</small></div><div><Globe2 size={26} /><strong>Your website</strong><small>WooCommerce orders</small></div></div><div className="saas-system-wires" aria-hidden="true"><span /><span /><i /></div><div className="saas-system-core"><img src="/zameria-icon.png" width="40" height="40" alt="" /><div><strong>ZAMERIA</strong><span>Connected through your WordPress plugin</span></div><RefreshCw size={17} /></div><div className="saas-system-trunk" aria-hidden="true" /><div className="saas-system-data">{[[Package, 'Products'], [Layers, 'Stock'], [ReceiptText, 'Orders'], [Users, 'Customers']].map(([Icon, label]) => { const DataIcon = Icon as typeof Store; return <div key={String(label)}><DataIcon size={19} /><span>{String(label)}</span></div>; })}</div><p><ShieldCheck size={12} /> Your WooCommerce store remains the source of truth.</p></div>
  </div></section>;
}

function FeatureCards() {
  return <section id="features" className="saas-section saas-features"><div className="saas-container"><div className="saas-section-heading"><div><span className="saas-eyebrow">AT YOUR COUNTER</span><h2>Made for the<br /><span>working day.</span></h2></div></div><div className="saas-feature-grid">{[
    [ReceiptText, 'A simpler checkout', 'Find products, build a basket, record payment and issue a receipt.', '/woocommerce-pos', 'Explore point of sale'],
    [Users, 'The right access for your team', 'Give cashiers and managers their own accounts and role-based permissions.', '/woocommerce-retail-pos', 'Explore staff access'],
    [WifiOff, 'Keep selling through interruptions', 'Eligible sales stay on a previously synced device and upload when you reconnect.', '/solutions/offline-pos', 'How offline selling works'],
  ].map(([Icon, title, copy, href, label]) => { const FeatureIcon = Icon as typeof Store; return <article className="saas-feature saas-feature-plain" key={String(title)}><div className="saas-feature-body"><FeatureIcon className="saas-feature-icon" size={25} /><h3>{String(title)}</h3><p>{String(copy)}</p><a className="saas-link" href={String(href)}>{String(label)} <ArrowUpRight size={15} /></a></div></article>; })}</div></div></section>;
}

const INDUSTRIES = [
  ['Beauty & skincare', 'beauty', 'beauty'], ['Fashion & accessories', 'fashion', 'fashion'],
  ['Groceries & essentials', 'grocery', 'supermarkets'], ['Electronics', 'electronics', 'electronics'],
];
function Industries() {
  return <section id="industries" className="saas-section saas-industries"><div className="saas-container"><div className="saas-section-heading"><div><span className="saas-eyebrow">BUILT AROUND YOUR BUSINESS</span><h2>Built for your<br /><span>kind of retail.</span></h2></div><p>For everyday shops and specialist retailers.</p></div><div className="saas-industry-grid">{INDUSTRIES.map(([name, image, slug]) => <a key={slug} href={`/industries/${slug}`}><div><img src={`/categories/${image}.webp`} alt={`${name} retail setting`} width="520" height="580" loading="lazy" /><span><ArrowUpRight size={19} /></span></div><h3>{name}</h3><span>Explore your industry <ArrowRight size={12} /></span></a>)}</div><div className="saas-industry-more"><span>Also built for specialist retailers.</span><a href="/industries/pharmacies">Pharmacy <ArrowUpRight size={14} /></a><a href="/industries/jewelry">Jewellery <ArrowUpRight size={14} /></a></div></div></section>;
}

function Setup() {
  return <section id="how-it-works" className="saas-setup"><div className="saas-container"><div className="saas-section-heading"><div><span className="saas-eyebrow">A STRAIGHTFORWARD START</span><h2>Get started<br /><span>in three steps.</span></h2></div><a href="/get-started" className="saas-button">Get started <ArrowRight size={16} /></a></div><div className="saas-steps">{[
    [Users, 'Create your account', 'Create your account with your business name and email.'],
    [Plug, 'Connect WooCommerce', 'Install the WordPress plugin and connect your store.'],
    [Store, 'Open your point of sale', 'Sign in with your staff account, let products load and make your first sale.'],
  ].map(([Icon, title, copy], i) => { const StepIcon = Icon as typeof Store; return <article key={String(title)}><div><span>0{i + 1}</span><StepIcon size={22} /></div><h3>{String(title)}</h3><p>{String(copy)}</p></article>; })}</div><p className="saas-setup-note"><ShieldCheck size={14} /> Your seven-day trial starts when your eligible store is activated. No card required.</p></div></section>;
}

function Pricing() {
  const { geo, isNigeria, setCountry } = useGeoPricing();
  return <section id="pricing" className="saas-section saas-pricing"><div className="saas-container"><div className="saas-centered-heading"><span className="saas-eyebrow">SIMPLE ANNUAL PRICING</span><h2>Two plans.<br /><span>One annual payment.</span></h2><p>Try full Business access for seven days.<br />Choose an annual plan when you’re ready.</p><div className="saas-region" role="group" aria-label="Pricing region"><button aria-pressed={isNigeria} onClick={() => setCountry('NG')}>Nigeria <span>NGN</span></button><button aria-pressed={!isNigeria} onClick={() => setCountry('US')}>International <span>USD</span></button></div></div><div className="saas-plans">{(['starter', 'business'] as const).map(plan => { const details = geo.plans[plan];const business = plan === 'business'; return <article className={`saas-plan ${business ? 'saas-plan-business' : ''}`} key={plan}><div className="saas-plan-title"><span>{business ? <Zap size={20} /> : <Store size={20} />}{details.plan}</span>{business && <small>MORE ROOM TO GROW</small>}</div><p>{business ? 'For a bigger catalogue and a growing team.' : 'For a small shop ready to get connected.'}</p><div className="saas-plan-price"><strong>{details.displayPrice}</strong><span>/ year</span></div><span className="saas-plan-interval">Billed annually in {geo.currency}.</span><a className={`saas-button ${business ? '' : 'saas-button-secondary'}`} href={planCheckoutUrl(plan, geo)}>Choose {details.plan}<ArrowRight size={16} /></a><div className="saas-plan-divider">{business ? 'Capacity to grow. Everything connected.' : 'Your connected retail essentials.'}</div><ul>{details.features.map(feature => <li key={feature}><Check size={15} />{feature.replace('real-time inventory synchronization','inventory synchronization')}</li>)}</ul></article>; })}</div><div className="saas-pricing-footer"><span><ShieldCheck size={14} /> Secure checkout</span><span><Check size={14} /> Annual access, renewed through checkout</span><a href="/get-started">Start with the free trial <ArrowUpRight size={14} /></a></div></div></section>;
}


function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <section id="faq" className="saas-section saas-faq"><div className="saas-container"><div className="saas-centered-heading"><span className="saas-eyebrow">BEFORE YOU GET STARTED</span><h2>Frequently asked questions</h2></div><div className="saas-faq-list">{HOME_FAQS.map(([question, answer], index) => <div className="saas-faq-item" key={question}><h3><button aria-expanded={open === index} aria-controls={`saas-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}>{question}<ChevronDown size={18} /></button></h3><div id={`saas-answer-${index}`} hidden={open !== index}><p>{answer}</p></div></div>)}</div><p className="saas-faq-contact">Still have a question? <a href="mailto:hello@zameria.co">Talk to our team <ArrowUpRight size={13} /></a></p></div></section>;
}

export function HomePage() {
  return <div className="hm-home saas-landing"><a className="hm-skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content"><Hero /><ConnectedRetail /><DeviceShowcase /><FeatureCards /><Industries /><Setup /><Pricing /><FAQ /><section className="saas-final"><div className="saas-container"><span className="saas-eyebrow">YOUR BUSINESS. BETTER CONNECTED.</span><h2>Connect your store.<br />Start selling.</h2><p>Try full Business access for seven days.<br />No card required.</p><a className="saas-button saas-button-white" href="/get-started">Start your free trial <ArrowRight size={18} /></a></div></section></main><SiteFooter /></div>;
}
