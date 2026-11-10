import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MARKETING_PAGES, PAGE_REDIRECTS } from '../content/marketingPages';
import { POLICY_PAGES } from '../content/policyPages';
import { HOME_FAQS } from '../content/homeFaqs';
import { routeSeo, SITE_ORIGIN } from '../lib/siteSeo';

const root = process.cwd();
const dist = path.join(root, 'dist');
const hosting = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const publicRoutes = ['/', ...Object.keys(MARKETING_PAGES), ...Object.keys(POLICY_PAGES)];
const privateRoutes = ['/login', '/get-started', '/forgot-password', '/subscribe', '/paddle-checkout', '/payment/complete', '/account'];
const leadRoutes = ['/leadcapture1', '/leadcapture2'];
const knownRoutes = new Set([...publicRoutes, ...privateRoutes, ...leadRoutes, ...Object.keys(PAGE_REDIRECTS)]);
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.deepEqual([...locations].sort(), publicRoutes.map(route => SITE_ORIGIN + route).sort(), 'Sitemap must contain only the canonical public pages');
assert.equal(new Set(locations).size, locations.length, 'No duplicate sitemap URLs');
const titles = new Set<string>();
const descriptions = new Set<string>();
let linksChecked = 0;
for (const route of publicRoutes) {
  const html = fs.readFileSync(path.join(dist, route === '/' ? 'index.html' : route.slice(1) + '/index.html'), 'utf8');
  const config = routeSeo(route);
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || '');
  const description = decode(html.match(/<meta name="description" content="([^"]+)"/s)?.[1] || '');
  assert.equal(title, config.title, `${route}: title`);
  assert.equal(description, config.description, `${route}: description`);
  assert(!titles.has(title), `${route}: unique title`); titles.add(title);
  assert(!descriptions.has(description), `${route}: unique description`); descriptions.add(description);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one clear page heading`);
  const plain = decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ');
  assert(plain.includes(config.h1!), `${route}: visible H1`);
  assert(html.includes(`rel="canonical" href="${config.canonical}"`), `${route}: canonical`);
  assert(html.includes(`property="og:url" content="${config.canonical}"`), `${route}: share URL`);
  assert(!/localhost|127\.0\.0\.1/.test(html), `${route}: no local URLs in public HTML`);
  assert(!html.includes('noindex'), `${route}: indexable`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  assert.equal(schemas.length, 1, `${route}: one structured data graph`);
  const graph = JSON.parse(schemas[0][1])['@graph'];
  assert(graph.some((node: any) => node['@type'] === 'WebPage' && node.url === config.canonical));
  assert(!JSON.stringify(graph).match(/aggregateRating|reviewCount/), 'No invented ratings');
  const faq = graph.find((node: any) => node['@type'] === 'FAQPage');
  const expectedFaqs = route === '/' ? HOME_FAQS : MARKETING_PAGES[route]?.faqs || [];
  assert.equal(faq?.mainEntity.length || 0, expectedFaqs.length);
  for (const [question, answer] of expectedFaqs) {
    assert(plain.includes(question) && plain.includes(answer), `${route}: schema FAQ must be visible`);
    assert(faq.mainEntity.some((node: any) => node.name === question && node.acceptedAnswer.text === answer));
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const value = decode(match[1]);
    if (value.startsWith('//')) continue;
    const parsed = new URL(value, SITE_ORIGIN);
    const file = path.join(dist, decodeURIComponent(parsed.pathname));
    assert(knownRoutes.has(parsed.pathname) || fs.existsSync(file), `${route}: broken internal target ${value}`);
    if (parsed.pathname === route && parsed.hash) assert(html.includes(`id="${parsed.hash.slice(1)}"`), `${route}: missing anchor ${value}`);
    linksChecked++;
  }
}
for (const route of ['/login', '/get-started', '/forgot-password', '/404']) {
  const html = fs.readFileSync(path.join(dist, route.slice(1), 'index.html'), 'utf8');
  assert(/name="robots" content="noindex/.test(html), `${route}: must not be indexed`);
  assert(!html.includes('application/ld+json'), `${route}: no public product schema`);
}
assert(fs.existsSync(path.join(dist, '404.html')), 'Static host needs a real 404 page');
assert(!hosting.rewrites.some((r: any) => r.source === '/(.*)' || r.source === '/:path*'), 'Unknown URLs must not return a homepage with status 200');
for (const [source, destination] of Object.entries(PAGE_REDIRECTS)) {
  assert(knownRoutes.has(destination) && !PAGE_REDIRECTS[destination], `${source}: no dead end or redirect chain`);
  assert(hosting.redirects.some((r: any) => r.source === source && r.destination === destination && r.permanent), `${source}: permanent hosted redirect`);
  assert(!locations.includes(SITE_ORIGIN + source), `${source}: duplicate page excluded from sitemap`);
}
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
for (const route of ['/account', '/product-preview/', '/api/']) assert(robots.includes(`Disallow: ${route}`));
assert(robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`));
for (const route of ['/login', '/get-started', '/subscribe', '/account']) assert(hosting.headers.some((h: any) => h.source === route && h.headers.some((v: any) => v.key === 'X-Robots-Tag' && v.value.includes('noindex'))));
for (const route of leadRoutes) {
 const html = fs.readFileSync(path.join(dist, route.slice(1), 'index.html'), 'utf8');
 assert(html.includes('/brand-foundations.css') && html.includes('/assessment-theme.css'), `${route}: shared brand stylesheet`);
 assert(!/within the next few hours|under 15 minutes|already on it/i.test(html), `${route}: no unsupported response-time promises`);
}
console.log(`PASS: ${publicRoutes.length} canonical pages, unique metadata, visible FAQs/schema, ${linksChecked} internal targets, ${Object.keys(PAGE_REDIRECTS).length} redirects, private indexing rules and custom 404.`);
