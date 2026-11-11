import { Check, ArrowRight, ArrowUpRight, ShieldCheck, Store, Zap } from 'lucide-react';
import { useGeoPricing } from '../services/geoPricingService';
import { useClientReady } from '../lib/useClientReady';
import { useRouter } from '../router/Router';
import { checkoutPricing, planCheckoutUrl } from '../lib/checkoutPricing';

export function PricingSection({ standalone = false }: { standalone?: boolean }) {
  const { geo: detected, setCountry } = useGeoPricing();
  const { search, navigate } = useRouter();
  const clientReady = useClientReady();
  const params = new URLSearchParams(search);
  const geo = standalone && clientReady ? checkoutPricing(null, params.get('country'), params.get('currency'), detected) : detected;
  const isNigeria = geo.isNigeria;
  const chooseRegion = (code: string) => {
    setCountry(code);
    if (standalone) navigate(`/pricing?country=${code}&currency=${code === 'NG' ? 'NGN' : 'USD'}`);
  };
  const Heading = standalone ? 'h1' : 'h2';
  return <section id="pricing" className="saas-section saas-pricing"><div className="saas-container"><div className="saas-centered-heading"><span className="saas-eyebrow">SIMPLE ANNUAL PRICING</span><Heading>Two plans.<br /><span>One annual payment.</span></Heading><p>Try full Business access for seven days.<br />Choose an annual plan when you’re ready.</p><div className="saas-region" role="group" aria-label="Pricing region"><button aria-pressed={isNigeria} onClick={() => chooseRegion('NG')}>Nigeria <span>NGN</span></button><button aria-pressed={!isNigeria} onClick={() => chooseRegion('US')}>International <span>USD</span></button></div></div><div className="saas-plans">{(['starter', 'business'] as const).map(plan => { const details = geo.plans[plan];const business = plan === 'business'; return <article className={`saas-plan ${business ? 'saas-plan-business' : ''}`} key={plan}><div className="saas-plan-title"><span>{business ? <Zap size={20} /> : <Store size={20} />}{details.plan}</span>{business && <small>MORE ROOM TO GROW</small>}</div><p>{business ? 'For a bigger catalogue and a growing team.' : 'For a small shop ready to get connected.'}</p><div className="saas-plan-price"><strong>{details.displayPrice}</strong><span>/ year</span></div><span className="saas-plan-interval">Billed annually in {geo.currency}.</span><a className={`saas-button ${business ? '' : 'saas-button-secondary'}`} href={planCheckoutUrl(plan, geo)}>Choose {details.plan}<ArrowRight size={16} /></a><div className="saas-plan-divider">{business ? 'Capacity to grow. Everything connected.' : 'Your connected retail essentials.'}</div><ul>{details.features.map(feature => <li key={feature}><Check size={15} />{feature.replace('real-time inventory synchronization','inventory synchronization')}</li>)}</ul></article>; })}</div><div className="saas-pricing-footer"><span><ShieldCheck size={14} /> Secure checkout</span><span><Check size={14} /> Annual access, renewed through checkout</span><a href="/get-started">Start with the free trial <ArrowUpRight size={14} /></a></div></div></section>;
}
