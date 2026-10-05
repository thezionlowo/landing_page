import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { CustomerAuthProvider } from '../src/context/CustomerAuthContext';
import { RouterProvider } from '../src/router/Router';
import { ROUTE_SEO_CONFIG, RouteSEO } from '../src/components/SEOHead';

// Synchronous imports for pre-rendering
import { LandingPageContent } from '../src/App';
import { WooCommercePosPage } from '../src/pages/seo/WooCommercePosPage';
import { WooCommerceInventorySyncPage } from '../src/pages/seo/WooCommerceInventorySyncPage';
import { WooCommercePosNigeriaPage } from '../src/pages/seo/WooCommercePosNigeriaPage';
import { FashionPosPage } from '../src/pages/seo/FashionPosPage';
import { BeautyPosPage } from '../src/pages/seo/BeautyPosPage';
import { ElectronicsPosPage } from '../src/pages/seo/ElectronicsPosPage';
import { SupermarketPosPage } from '../src/pages/seo/SupermarketPosPage';
import { PharmacyPosPage } from '../src/pages/seo/PharmacyPosPage';
import { JewelryPosPage } from '../src/pages/seo/JewelryPosPage';
import { HardwareCompatibilityPage } from '../src/pages/seo/HardwareCompatibilityPage';
import { PosComparisonPage } from '../src/pages/seo/PosComparisonPage';
import { PreventOversellingPage } from '../src/pages/seo/PreventOversellingPage';
import { StockMismatchPage } from '../src/pages/seo/StockMismatchPage';
import { OfflinePosPage } from '../src/pages/seo/OfflinePosPage';
import { GetStartedPage } from '../src/pages/auth/GetStartedPage';
import { LoginPage } from '../src/pages/auth/LoginPage';
import { FooSalesAlternativesPage } from '../src/pages/seo/FooSalesAlternativesPage';
import { OliverPosAlternativesPage } from '../src/pages/seo/OliverPosAlternativesPage';
import { FooSalesVsOliverPosPage } from '../src/pages/seo/FooSalesVsOliverPosPage';
import { BestWooCommercePosPage } from '../src/pages/seo/BestWooCommercePosPage';
import { MultiStoreInventorySyncPage } from '../src/pages/seo/MultiStoreInventorySyncPage';
import { SplitPaymentsPage } from '../src/pages/seo/SplitPaymentsPage';
import { LagosRetailPosPage } from '../src/pages/seo/LagosRetailPosPage';
import { ClothingBoutiquePosPage } from '../src/pages/seo/ClothingBoutiquePosPage';
import { ElectronicsPosDeepPage } from '../src/pages/seo/ElectronicsPosDeepPage';
import { StopOversellingRushHoursPage } from '../src/pages/seo/StopOversellingRushHoursPage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

const ROUTES_TO_RENDER: Record<string, React.ComponentType> = {
  '/': LandingPageContent,
  '/woocommerce-pos': WooCommercePosPage,
  '/woocommerce-inventory-sync': WooCommerceInventorySyncPage,
  '/woocommerce-pos-nigeria': WooCommercePosNigeriaPage,
  '/industries/fashion': FashionPosPage,
  '/industries/beauty': BeautyPosPage,
  '/industries/electronics': ElectronicsPosPage,
  '/industries/supermarkets': SupermarketPosPage,
  '/industries/pharmacies': PharmacyPosPage,
  '/industries/jewelry': JewelryPosPage,
  '/hardware-compatibility': HardwareCompatibilityPage,
  '/woocommerce-pos-vs-traditional-pos': PosComparisonPage,
  '/solutions/prevent-overselling': PreventOversellingPage,
  '/solutions/stock-mismatch': StockMismatchPage,
  '/solutions/offline-pos': OfflinePosPage,
  '/alternatives/foosales': FooSalesAlternativesPage,
  '/alternatives/oliver-pos': OliverPosAlternativesPage,
  '/comparisons/foosales-vs-oliver-pos': FooSalesVsOliverPosPage,
  '/best-woocommerce-pos': BestWooCommercePosPage,
  '/solutions/multi-store-inventory-sync': MultiStoreInventorySyncPage,
  '/features/split-payments': SplitPaymentsPage,
  '/nigeria/lagos-retail-pos': LagosRetailPosPage,
  '/industries/clothing-boutique-pos': ClothingBoutiquePosPage,
  '/industries/electronics-pos': ElectronicsPosDeepPage,
  '/solutions/stop-overselling-rush-hours': StopOversellingRushHoursPage,
  '/get-started': GetStartedPage,
  '/login': LoginPage,
};

function generatePageSchema(route: string, config: RouteSEO): object {
  const baseCanonical = 'https://www.zameria.co';
  const pageUrl = config.canonical;
  const graph: object[] = [];

  // 1. Breadcrumbs for every subpage
  if (route !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseCanonical}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: config.h1 || config.title,
          item: pageUrl,
        },
      ],
    });
  }

  // 2. Organization entity
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${baseCanonical}/#organization`,
    name: 'ZAMERIA',
    url: baseCanonical,
    logo: `${baseCanonical}/zameria-logo.png`,
    description: 'Real-time WooCommerce Point of Sale (POS) and inventory synchronization platform.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+2348122342436',
      contactType: 'customer support',
      email: 'hello@zameria.co',
      areaServed: ['NG', 'Worldwide'],
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://instagram.com/zameriahq',
      'https://linkedin.com/company/zameria',
      'https://x.com/zameriahq',
      'https://youtube.com/@zameriahq',
    ],
  };

  if (route === '/') {
    graph.push(organizationSchema);
    graph.push({
      '@type': 'WebSite',
      '@id': `${baseCanonical}/#website`,
      url: `${baseCanonical}/`,
      name: 'ZAMERIA',
      publisher: { '@id': `${baseCanonical}/#organization` },
    });
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${baseCanonical}/#software`,
      name: 'ZAMERIA Point of Sale & Inventory Sync',
      operatingSystem: 'Web, Windows, macOS, iOS, Android',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Point of Sale Software',
      url: `${baseCanonical}/`,
      description: config.description,
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter Plan',
          price: '200000',
          priceCurrency: 'NGN',
          priceValidUntil: '2027-12-31',
          description: '1 WooCommerce store, 1 physical store, up to 500 products, 2 staff members, 7-day free trial.',
        },
        {
          '@type': 'Offer',
          name: 'Business Plan',
          price: '300000',
          priceCurrency: 'NGN',
          priceValidUntil: '2027-12-31',
          description: '1 WooCommerce store, 1 physical store, unlimited products, unlimited staff members, 7-day free trial.',
        },
      ],
      publisher: { '@id': `${baseCanonical}/#organization` },
    });
    graph.push({
      '@type': 'FAQPage',
      '@id': `${baseCanonical}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is ZAMERIA?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ZAMERIA connects a merchant WooCommerce store with physical retail counters for real-time POS checkout and stock synchronization.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the free trial work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You get a 7-day free trial with full access to test ZAMERIA without payment or credit card required.',
          },
        },
      ],
    });
  } else if (route.startsWith('/industries/')) {
    graph.push({
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: config.h1 || config.title,
      description: config.description,
      provider: organizationSchema,
      serviceType: 'Point of Sale & Retail Inventory Management',
      areaServed: ['Worldwide', 'NG'],
    });
  } else if (route.startsWith('/solutions/')) {
    graph.push({
      '@type': 'HowTo',
      '@id': `${pageUrl}#howto`,
      name: config.h1 || config.title,
      description: config.description,
      totalTime: 'PT5M',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Connect WooCommerce API',
          text: 'Connect your WooCommerce store via secure REST API credentials.',
        },
        {
          '@type': 'HowToStep',
          name: 'Enable Bi-Directional Inventory Locking',
          text: 'Activate automatic stock reservation during active counter checkouts.',
        },
        {
          '@type': 'HowToStep',
          name: 'Sync Counter Checkouts Instantly',
          text: 'Every sale automatically decrements WooCommerce inventory in real time.',
        },
      ],
    });
  } else if (route === '/hardware-compatibility') {
    graph.push({
      '@type': 'TechArticle',
      '@id': `${pageUrl}#article`,
      headline: config.title,
      description: config.description,
      author: organizationSchema,
      publisher: organizationSchema,
    });
  } else if (route === '/woocommerce-pos-vs-traditional-pos') {
    graph.push({
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: config.title,
      description: config.description,
      author: organizationSchema,
      publisher: organizationSchema,
    });
  } else {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#software`,
      name: config.h1 || config.title,
      description: config.description,
      operatingSystem: 'Web, Windows, macOS, iOS, Android',
      applicationCategory: 'BusinessApplication',
      publisher: organizationSchema,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

async function prerender() {
  console.log('\n🚀 Starting ZAMERIA Static Site Generation (SSG)...');

  const baseTemplatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(baseTemplatePath)) {
    throw new Error(`dist/index.html not found! Run 'vite build' first.`);
  }

  const baseHtml = fs.readFileSync(baseTemplatePath, 'utf8');

  let successCount = 0;

  for (const [route, Component] of Object.entries(ROUTES_TO_RENDER)) {
    const config = ROUTE_SEO_CONFIG[route] || ROUTE_SEO_CONFIG['/'];
    console.log(`  ⚡ Pre-rendering: ${route}`);

    // 1. Render React tree to HTML string
    const renderedBody = renderToString(
      React.createElement(
        CustomerAuthProvider,
        null,
        React.createElement(
          RouterProvider,
          { initialPath: route },
          React.createElement(Component, null)
        )
      )
    );

    // 2. Generate Page-Specific Schema JSON-LD
    const pageSchema = generatePageSchema(route, config);
    const schemaScript = `    <script type="application/ld+json">\n    ${JSON.stringify(pageSchema, null, 2).replace(/\n/g, '\n    ')}\n    </script>`;

    // 3. Assemble complete HTML with exact metadata
    let html = baseHtml;

    // Update <title>
    html = html.replace(/<title>.*?<\/title>/s, `<title>${config.title}</title>`);

    // Update <meta name="description">
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/s,
      `<meta name="description" content="${config.description}" />`
    );

    // Update <meta name="keywords">
    if (config.keywords) {
      html = html.replace(
        /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/s,
        `<meta name="keywords" content="${config.keywords}" />`
      );
    }

    // Update <link rel="canonical">
    html = html.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s,
      `<link rel="canonical" href="${config.canonical}" />`
    );

    // Update Open Graph tags
    html = html.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/s,
      `<meta property="og:title" content="${config.title}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/s,
      `<meta property="og:description" content="${config.description}" />`
    );
    html = html.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/s,
      `<meta property="og:url" content="${config.canonical}" />`
    );
    html = html.replace(
      /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/s,
      `<meta property="og:image" content="https://www.zameria.co/zameria-logo.png" />`
    );

    // Update Twitter Card tags
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/s,
      `<meta name="twitter:title" content="${config.title}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/s,
      `<meta name="twitter:description" content="${config.description}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/s,
      `<meta name="twitter:image" content="https://www.zameria.co/zameria-logo.png" />`
    );

    // Update Robots tag if noindex
    if (config.robots.includes('noindex')) {
      html = html.replace(
        /<meta\s+name="robots"\s+content=".*?"\s*\/?>/s,
        `<meta name="robots" content="${config.robots}" />`
      );
    }

    // Replace schema block with page-specific schema
    html = html.replace(
      /<script\s+type="application\/ld\+json">.*?<\/script>/s,
      schemaScript
    );

    // Remove noscript fallback block because real HTML is now pre-rendered inside #root
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '');

    // Inject rendered markup into #root
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${renderedBody}</div>`
    );

    // 4. Save to target dist path
    if (route === '/') {
      fs.writeFileSync(path.resolve(distDir, 'index.html'), html, 'utf8');
    } else {
      const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
      const routeDir = path.resolve(distDir, cleanRoute);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.writeFileSync(path.resolve(routeDir, 'index.html'), html, 'utf8');

      // Also write cleanRoute.html for static servers that look for file.html
      const fileHtmlPath = path.resolve(distDir, `${cleanRoute}.html`);
      const parentDir = path.dirname(fileHtmlPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(fileHtmlPath, html, 'utf8');
    }

    successCount++;
  }

  console.log(`\n✅ Pre-rendered ${successCount} public pages with full HTML, page-specific metadata & JSON-LD!`);
}

prerender().catch((err) => {
  console.error('❌ SSG Pre-render error:', err);
  process.exit(1);
});
