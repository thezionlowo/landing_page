import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppShell } from '../src/App';
import { CustomerAuthProvider } from '../src/context/CustomerAuthContext';
import { RouterProvider } from '../src/router/Router';
import { PlanComparisonProvider } from '../src/components/PlanComparison';
import { NotFoundPage } from '../src/pages/NotFoundPage';
import { HomePage } from '../src/pages/HomePage';
import { MarketingPage } from '../src/pages/MarketingPage';
import { LoginPage } from '../src/pages/auth/LoginPage';
import { GetStartedPage } from '../src/pages/auth/GetStartedPage';
import { ForgotPasswordPage } from '../src/pages/auth/ForgotPasswordPage';
import { MARKETING_PAGES } from '../src/content/marketingPages';
import { PolicyPage } from '../src/pages/PolicyPage';
import { POLICY_PAGES, type PolicyPath } from '../src/content/policyPages';
import { pageSchema, routeSeo, SITE_ORIGIN } from '../src/lib/siteSeo';

const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const routes: Record<string, React.ComponentType> = {
  '/': HomePage,
  ...Object.fromEntries(Object.entries(MARKETING_PAGES).map(([route, page]) => [route, () => React.createElement(MarketingPage, { page, path: route })])),
  ...Object.fromEntries(Object.keys(POLICY_PAGES).map(route => [route, () => React.createElement(PolicyPage, { path: route as PolicyPath })])),
  '/login': LoginPage, '/get-started': GetStartedPage, '/forgot-password': ForgotPasswordPage, '/404': NotFoundPage,
};
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const [route, Component] of Object.entries(routes)) {
  const config = routeSeo(route);
  const body = renderToString(React.createElement(CustomerAuthProvider, null, React.createElement(RouterProvider, { initialPath: route }, React.createElement(PlanComparisonProvider, null, React.createElement(AppShell, null, React.createElement(Component))))));
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(config.title)}</title>`)
    .replace(/<meta\s+(?:name|property)=["'](?:description|robots|keywords|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${body}</div>`);
  const schema = pageSchema(route);
  const head = [
    `<meta name="description" content="${escape(config.description)}" />`,
    `<meta name="robots" content="${config.robots}" />`,
    `<link rel="canonical" href="${config.canonical}" />`,
    ...Object.entries({ 'og:title': config.title, 'og:description': config.description, 'og:url': config.canonical, 'og:type': 'website', 'og:site_name': 'ZAMERIA', 'og:image': SITE_ORIGIN + '/zameria-logo.png' }).map(([property, value]) => `<meta property="${property}" content="${escape(value)}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(config.title)}" />`,
    `<meta name="twitter:description" content="${escape(config.description)}" />`,
    `<meta name="twitter:image" content="${SITE_ORIGIN}/zameria-logo.png" />`,
    ...(schema ? [`<script id="page-structured-data" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`] : []),
  ].join('\n');
  html = html.replace('</head>', head + '\n</head>');
  const output = route === '/' ? dist : path.join(dist, route.slice(1));
  fs.mkdirSync(output, { recursive: true }); fs.writeFileSync(path.join(output, 'index.html'), html);
  if (route === '/404') fs.writeFileSync(path.join(dist, '404.html'), html);
  console.log(`Prerendered ${route}`);
}
console.log(`Prerendered ${Object.keys(routes).length} pages with route-specific metadata and visible-content structured data.`);
