import React, { useEffect } from 'react';
import { useRouter } from '../router/Router';

interface RouteSEO {
  title: string;
  description: string;
  canonical: string;
  robots: string;
}

const ROUTE_SEO_CONFIG: Record<string, RouteSEO> = {
  '/': {
    title: 'ZAMERIA — Real-Time WooCommerce POS & In-Store Inventory Management',
    description: 'Connect your WooCommerce store with your physical retail shop. Manage products, real-time inventory synchronization, barcode POS checkout, and orders in one unified system.',
    canonical: 'https://zameria.co/',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/get-started': {
    title: 'Start 7-Day Free Trial | ZAMERIA WooCommerce POS',
    description: 'Try ZAMERIA free for 7 days. Connect your WooCommerce catalog, ring up counter sales, and sync in-store inventory in real time. No credit card required.',
    canonical: 'https://zameria.co/get-started',
    robots: 'index, follow',
  },
  '/login': {
    title: 'Merchant Sign In | ZAMERIA Customer Portal',
    description: 'Log in to your ZAMERIA merchant portal to manage your store licenses, billing subscriptions, and connected WooCommerce stores.',
    canonical: 'https://zameria.co/login',
    robots: 'index, follow',
  },
  '/forgot-password': {
    title: 'Reset Password | ZAMERIA',
    description: 'Reset your ZAMERIA account password.',
    canonical: 'https://zameria.co/forgot-password',
    robots: 'noindex, nofollow',
  },
  '/account': {
    title: 'Customer Account & Billing | ZAMERIA Portal',
    description: 'Manage your ZAMERIA licenses, subscription plans, and connected WooCommerce stores.',
    canonical: 'https://zameria.co/account',
    robots: 'noindex, nofollow',
  },
};

export const SEOHead: React.FC = () => {
  const { path } = useRouter();

  useEffect(() => {
    // Resolve matching SEO config
    let config = ROUTE_SEO_CONFIG[path];
    if (!config) {
      if (path.startsWith('/account')) {
        config = ROUTE_SEO_CONFIG['/account'];
      } else {
        config = ROUTE_SEO_CONFIG['/'];
      }
    }

    // 1. Update Document Title
    document.title = config.title;

    // Helper to set or update meta tag by name
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or update meta tag by property (Open Graph)
    const setOgMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or update link tag
    const setCanonical = (href: string) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Update Standard Meta Tags
    setMeta('description', config.description);
    setMeta('robots', config.robots);
    setCanonical(config.canonical);

    // 3. Update Open Graph Meta Tags
    setOgMeta('og:title', config.title);
    setOgMeta('og:description', config.description);
    setOgMeta('og:url', config.canonical);
    setOgMeta('og:type', 'website');
    setOgMeta('og:site_name', 'ZAMERIA');
    setOgMeta('og:image', 'https://zameria.co/zameria-logo.png');

    // 4. Update Twitter Card Meta Tags
    setMeta('twitter:title', config.title);
    setMeta('twitter:description', config.description);
    setMeta('twitter:image', 'https://zameria.co/zameria-logo.png');
    setMeta('twitter:card', 'summary_large_image');
  }, [path]);

  return null;
};
