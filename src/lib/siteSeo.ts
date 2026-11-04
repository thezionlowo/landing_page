import { MARKETING_PAGES, PAGE_REDIRECTS } from '../content/marketingPages';
import { HOME_FAQS } from '../content/homeFaqs';

export const SITE_ORIGIN = 'https://www.zameria.co';
export const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export interface RouteSEO { title: string; description: string; canonical: string; robots: string; h1?: string; keywords?: string; }
export const ROUTE_SEO_CONFIG: Record<string, RouteSEO> = {
  '/': { title: 'WooCommerce POS for Your Shop, Mobile & Desktop | ZAMERIA', description: 'Sell in your shop and stay connected to WooCommerce. Use ZAMERIA for products, stock, orders and customers on mobile, iPad, laptop or desktop.', canonical: SITE_ORIGIN + '/', robots: INDEX_ROBOTS, h1: 'Your shop and website. One connected POS.' },
  ...Object.fromEntries(Object.entries(MARKETING_PAGES).map(([path, page]) => [path, { title: page.title, description: page.description, canonical: SITE_ORIGIN + path, robots: INDEX_ROBOTS, h1: page.heading }])),
};
for (const [path, title, description] of [
  ['/leadcapture1', 'Check Your Shop and Website Stock | ZAMERIA', 'Review how your shop and WooCommerce website share stock records.'],
  ['/leadcapture2', 'Review Your Store Stock Process | ZAMERIA', 'A short stock check for shops that sell in store and online.'],
  ['/404', 'Page Not Found | ZAMERIA', 'Find your way back to ZAMERIA.'],
  ['/login', 'Log in | ZAMERIA', 'Log in to manage your ZAMERIA store connection, plan and account.'],
  ['/get-started', 'Create Your Account | ZAMERIA', 'Create your ZAMERIA account and connect your WooCommerce store.'],
  ['/forgot-password', 'Reset Your Password | ZAMERIA', 'Recover access to your ZAMERIA account.'],
  ['/subscribe', 'Checkout | ZAMERIA', 'Enter your store details and continue to secure payment.'],
  ['/payment/complete', 'Payment Status | ZAMERIA', 'Check your payment status and open your ZAMERIA account.'],
]) ROUTE_SEO_CONFIG[path] = { title, description, canonical: SITE_ORIGIN + path, robots: 'noindex, follow' };

export function canonicalRoute(path: string): string {
  const clean = path === '/' ? path : path.replace(/\/$/, '').replace(/^(\/leadcapture[12])\.html$/, '$1');
  return PAGE_REDIRECTS[clean] || clean;
}
export function routeSeo(path: string): RouteSEO {
  const clean = canonicalRoute(path);
  return ROUTE_SEO_CONFIG[clean] || (clean === '/account' || clean.startsWith('/account/') ? { title: 'Your Account | ZAMERIA', description: 'Manage your ZAMERIA account.', canonical: SITE_ORIGIN + '/account', robots: 'noindex, nofollow' } : { ...ROUTE_SEO_CONFIG['/404'], canonical: SITE_ORIGIN + clean });
}

/** Structured data describes the visible page, without rankings or invented performance claims. */
export function pageSchema(path: string): object | null {
  const clean = canonicalRoute(path);
  const config = ROUTE_SEO_CONFIG[clean];
  if (!config || !config.robots.startsWith('index')) return null;
  const page = MARKETING_PAGES[clean];
  const organization = { '@type': 'Organization', '@id': SITE_ORIGIN + '/#organization', name: 'ZAMERIA', url: SITE_ORIGIN + '/', logo: SITE_ORIGIN + '/zameria-logo.png', email: 'hello@zameria.co' };
  const graph: object[] = [organization, { '@type': 'WebPage', '@id': config.canonical + '#page', url: config.canonical, name: config.title, description: config.description, isPartOf: { '@id': SITE_ORIGIN + '/#website' } }];
  if (clean === '/') {
    graph.push({ '@type': 'WebSite', '@id': SITE_ORIGIN + '/#website', name: 'ZAMERIA', url: SITE_ORIGIN + '/', publisher: { '@id': organization['@id'] } });
    graph.push({ '@type': 'SoftwareApplication', '@id': SITE_ORIGIN + '/#software', name: 'ZAMERIA POS', applicationCategory: 'BusinessApplication', operatingSystem: 'Web browser', url: SITE_ORIGIN + '/', description: config.description, publisher: { '@id': organization['@id'] } });
  } else {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: page?.heading || config.title, item: config.canonical }] });
  }
  const faqs = clean === '/' ? HOME_FAQS : page?.faqs;
  if (faqs?.length) graph.push({ '@type': 'FAQPage', '@id': config.canonical + '#faq', mainEntity: faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}
