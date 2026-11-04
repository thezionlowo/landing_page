import { useEffect } from 'react';
import { useRouter } from '../router/Router';
import { pageSchema, routeSeo, SITE_ORIGIN } from '../lib/siteSeo';
export { ROUTE_SEO_CONFIG } from '../lib/siteSeo';
export type { RouteSEO } from '../lib/siteSeo';

export function SEOHead() {
  const { path } = useRouter();
  useEffect(() => {
    const config = routeSeo(path);
    document.title = config.title;
    const meta = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element); }
      element.content = content;
    };
    meta('description', config.description); meta('robots', config.robots);
    for (const [name, value] of Object.entries({ 'og:title': config.title, 'og:description': config.description, 'og:url': config.canonical, 'og:type': 'website', 'og:site_name': 'ZAMERIA', 'og:image': SITE_ORIGIN + '/zameria-logo.png' })) meta(name, value, true);
    meta('twitter:title', config.title); meta('twitter:description', config.description); meta('twitter:image', SITE_ORIGIN + '/zameria-logo.png'); meta('twitter:card', 'summary_large_image');
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = config.canonical;
    // Replace the previous route's JSON-LD during SPA navigation as well as first load.
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());
    const schema = pageSchema(path);
    if (schema) { const script = document.createElement('script'); script.type = 'application/ld+json'; script.id = 'page-structured-data'; script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c'); document.head.appendChild(script); }
  }, [path]);
  return null;
}
