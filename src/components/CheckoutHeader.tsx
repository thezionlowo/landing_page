import { LockKeyhole, ArrowUpRight } from 'lucide-react';
import { BrandMark } from './SiteChrome';

export function CheckoutHeader() {
  return <header className="checkout-header"><div><BrandMark /><span className="checkout-secure"><LockKeyhole size={14} />Secure checkout</span><a href="mailto:support@zameria.co">Help <ArrowUpRight size={14} /></a></div></header>;
}

export function CheckoutFooter() {
  return <footer className="checkout-footer"><span>© {new Date().getFullYear()} ZAMERIA</span><nav aria-label="Checkout policies"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/refunds">Refunds</a></nav></footer>;
}
