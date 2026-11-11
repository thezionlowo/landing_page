import { createContext, useContext, useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useGeoPricing } from '../services/geoPricingService';
import { useRouter } from '../router/Router';
import { checkoutPricing, planCheckoutUrl } from '../lib/checkoutPricing';
import type { GeoPricingConfig, PlanId } from '../lib/geoPricing';

interface ComparisonOptions {
  country?: string;
  selectedPlan?: PlanId;
  onSelect?: (plan: PlanId) => void;
}
const ComparisonContext = createContext<((options?: ComparisonOptions) => void) | null>(null);

export function usePlanComparison() {
  const open = useContext(ComparisonContext);
  if (!open) throw new Error('Plan comparison requires PlanComparisonProvider');
  return open;
}

export function PlanComparisonDialog({ open, pricing, selectedPlan, onClose, onSelect }: {
  open: boolean;
  pricing: GeoPricingConfig;
  selectedPlan?: PlanId;
  onClose: () => void;
  onSelect: (plan: PlanId) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);
  if (!open) return null;
  const difference = pricing.plans.business.amount - pricing.plans.starter.amount;
  const extra = `${pricing.currencySymbol}${difference.toLocaleString('en-US')}`;
  return <dialog ref={dialogRef} className="site-plan-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <div className="site-plan-dialog-heading"><h2 id={titleId}>Compare plans</h2><button type="button" className="site-plan-close" aria-label="Close plan comparison" onClick={onClose} autoFocus><X size={20} /></button></div>
    <table className="site-plan-table">
      <caption className="site-visually-hidden">Starter and Business annual pricing in {pricing.currency}</caption>
      <colgroup><col className="site-plan-label-col" /><col /><col /></colgroup>
      <thead><tr><td /><th scope="col"><span className="site-plan-name">Starter</span><strong>{pricing.plans.starter.displayPrice}</strong><small>/ year</small></th><th scope="col" className="site-plan-featured"><span className="site-plan-recommendation">ROOM TO GROW</span><span className="site-plan-name">Business</span><strong>{pricing.plans.business.displayPrice}</strong><small>/ year</small></th></tr></thead>
      <tbody>{[
        ['Products', 'Up to 500', 'Unlimited'],
        ['Staff', 'Up to 5', 'Unlimited'],
        ['Active sessions', 'One per staff account', 'One per staff account'],
        ['WooCommerce stores', '1', '1'],
        ['Physical locations', '1', '1'],
        ['POS & stock sync', 'Included', 'Included'],
      ].map(([label, starter, business]) => <tr key={label}><th scope="row">{label}</th><td>{starter}</td><td className="site-plan-featured">{business}</td></tr>)}</tbody>
      <tfoot><tr><td /><td><button type="button" className="site-plan-choice" onClick={() => onSelect('starter')}>{selectedPlan === 'starter' ? 'Keep Starter' : 'Choose Starter'}</button></td><td className="site-plan-featured"><button type="button" className="site-plan-choice site-plan-choice-primary" onClick={() => onSelect('business')}>{selectedPlan === 'business' ? 'Keep Business' : 'Choose Business'}</button></td></tr></tfoot>
    </table>
    <p className="site-plan-upgrade-note">Unlimited products, staff and registers for {extra} more per year.</p>
  </dialog>;
}

export function PlanComparisonProvider({ children }: { children: ReactNode }) {
  const { customer } = useCustomerAuth();
  const { geo } = useGeoPricing();
  const { navigate, search, path } = useRouter();
  const [request, setRequest] = useState<(ComparisonOptions & { pricing: GeoPricingConfig }) | null>(null);
  useEffect(() => { setRequest(null); }, [path]);
  const open = (options: ComparisonOptions = {}) => {
    const params = new URLSearchParams(search);
    const pricing = checkoutPricing(customer, options.country || params.get('country'), params.get('currency'), geo);
    setRequest({ ...options, pricing });
  };
  return <ComparisonContext.Provider value={open}>{children}
    <PlanComparisonDialog open={Boolean(request)} pricing={request?.pricing || geo} selectedPlan={request?.selectedPlan} onClose={() => setRequest(null)} onSelect={plan => {
      if (!request) return;
      const current = request;
      setRequest(null);
      if (current.onSelect) current.onSelect(plan);
      else navigate(planCheckoutUrl(plan, current.pricing));
    }} />
  </ComparisonContext.Provider>;
}

/** Ordinary fallback link remains available to crawlers and modified/new-tab clicks. */
export function PlanComparisonLink({ country, selectedPlan, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { country?: string; selectedPlan?: PlanId }) {
  const open = usePlanComparison();
  return <a {...props} href="/#pricing" aria-haspopup="dialog" onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    open({ country, selectedPlan });
  }} />;
}
