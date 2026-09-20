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
  '/woocommerce-pos': {
    title: 'WooCommerce POS for Physical Retail Stores | ZAMERIA Point of Sale',
    description: 'Turn any laptop, desktop, or tablet into a lightning-fast WooCommerce point of sale counter. Real-time stock sync, offline resilience, and thermal receipt printing.',
    canonical: 'https://zameria.co/woocommerce-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-inventory-sync': {
    title: 'WooCommerce Inventory Sync for In-Store & Online Retail | ZAMERIA',
    description: 'Sub-second bi-directional inventory synchronization between your physical shop and WooCommerce store. Eliminate stock mismatch, overselling, and manual reconciliation.',
    canonical: 'https://zameria.co/woocommerce-inventory-sync',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-nigeria': {
    title: 'WooCommerce POS Nigeria — Point of Sale for Nigerian Retailers | ZAMERIA',
    description: 'The premier WooCommerce-connected POS built for Nigerian retail stores. Accept POS card, cash, & bank transfer, issue 80mm thermal receipts, and operate smoothly during internet drops.',
    canonical: 'https://zameria.co/woocommerce-pos-nigeria',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/industries/fashion': {
    title: 'WooCommerce POS for Fashion Boutiques & Clothing Stores | ZAMERIA',
    description: 'Real-time retail POS for fashion stores and boutiques. Manage size/color variation matrices, prevent overselling on Instagram & in-store, and track boutique staff sales.',
    canonical: 'https://zameria.co/industries/fashion',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-for-fashion': {
    title: 'WooCommerce POS for Fashion Boutiques & Clothing Stores | ZAMERIA',
    description: 'Real-time retail POS for fashion stores and boutiques. Manage size/color variation matrices, prevent overselling on Instagram & in-store, and track boutique staff sales.',
    canonical: 'https://zameria.co/industries/fashion',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/industries/beauty': {
    title: 'WooCommerce POS for Beauty, Cosmetics & Skincare Stores | ZAMERIA',
    description: 'Fast counter POS for beauty shops and cosmetic retailers. Rapid shade selection, thousands of SKU lookups, customer purchase records, and instant stock sync.',
    canonical: 'https://zameria.co/industries/beauty',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-for-beauty': {
    title: 'WooCommerce POS for Beauty, Cosmetics & Skincare Stores | ZAMERIA',
    description: 'Fast counter POS for beauty shops and cosmetic retailers. Rapid shade selection, thousands of SKU lookups, customer purchase records, and instant stock sync.',
    canonical: 'https://zameria.co/industries/beauty',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/industries/electronics': {
    title: 'WooCommerce POS for Electronics, Phones & Gadget Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for electronics and phone stores. Serial & warranty tracking, split payment checkout, and live WooCommerce inventory sync.',
    canonical: 'https://zameria.co/industries/electronics',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-for-electronics': {
    title: 'WooCommerce POS for Electronics, Phones & Gadget Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for electronics and phone stores. Serial & warranty tracking, split payment checkout, and live WooCommerce inventory sync.',
    canonical: 'https://zameria.co/industries/electronics',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/solutions/prevent-overselling': {
    title: 'How to Prevent Overselling on WooCommerce With a Physical Store | ZAMERIA',
    description: 'Stop selling in-store stock that was already bought online. Learn how bi-directional inventory locking and real-time POS sync eliminate stock mismatch forever.',
    canonical: 'https://zameria.co/solutions/prevent-overselling',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/how-to-prevent-overselling-woocommerce': {
    title: 'How to Prevent Overselling on WooCommerce With a Physical Store | ZAMERIA',
    description: 'Stop selling in-store stock that was already bought online. Learn how bi-directional inventory locking and real-time POS sync eliminate stock mismatch forever.',
    canonical: 'https://zameria.co/solutions/prevent-overselling',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/industries/supermarkets': {
    title: 'WooCommerce POS for Supermarkets & Grocery Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for supermarkets and grocery stores. Manage thousands of SKUs, cart holding, thermal receipts, and live online stock sync.',
    canonical: 'https://zameria.co/industries/supermarkets',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-for-supermarkets': {
    title: 'WooCommerce POS for Supermarkets & Grocery Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for supermarkets and grocery stores. Manage thousands of SKUs, cart holding, thermal receipts, and live online stock sync.',
    canonical: 'https://zameria.co/industries/supermarkets',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/industries/pharmacies': {
    title: 'WooCommerce POS for Pharmacies & Health Stores | ZAMERIA',
    description: 'Fast medication lookup, prescription order notes, and real-time inventory management for pharmacies selling in-store and online through WooCommerce.',
    canonical: 'https://zameria.co/industries/pharmacies',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-for-pharmacies': {
    title: 'WooCommerce POS for Pharmacies & Health Stores | ZAMERIA',
    description: 'Fast medication lookup, prescription order notes, and real-time inventory management for pharmacies selling in-store and online through WooCommerce.',
    canonical: 'https://zameria.co/industries/pharmacies',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/industries/jewelry': {
    title: 'WooCommerce POS for Jewelry & Luxury Accessory Stores | ZAMERIA',
    description: 'High-value SKU locking, variation matrices (carat/metal), split payment transactions, and live WooCommerce inventory synchronization for jewelry stores.',
    canonical: 'https://zameria.co/industries/jewelry',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-for-jewelry': {
    title: 'WooCommerce POS for Jewelry & Luxury Accessory Stores | ZAMERIA',
    description: 'High-value SKU locking, variation matrices (carat/metal), split payment transactions, and live WooCommerce inventory synchronization for jewelry stores.',
    canonical: 'https://zameria.co/industries/jewelry',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/hardware-compatibility': {
    title: 'WooCommerce POS Hardware Compatibility & Setup Guide | ZAMERIA',
    description: 'Supported thermal receipt printers (80mm ESC/POS, Epson, Xprinter), USB/Bluetooth barcode scanners, cash drawers, and computer compatibility for ZAMERIA.',
    canonical: 'https://zameria.co/hardware-compatibility',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-hardware-compatibility': {
    title: 'WooCommerce POS Hardware Compatibility & Setup Guide | ZAMERIA',
    description: 'Supported thermal receipt printers (80mm ESC/POS, Epson, Xprinter), USB/Bluetooth barcode scanners, cash drawers, and computer compatibility for ZAMERIA.',
    canonical: 'https://zameria.co/hardware-compatibility',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-pos-vs-traditional-pos': {
    title: 'WooCommerce POS vs Traditional Standalone POS Systems | ZAMERIA',
    description: 'Compare connected WooCommerce POS with legacy standalone systems. See why unified catalogs eliminate double data entry, manual sync, and stockouts.',
    canonical: 'https://zameria.co/woocommerce-pos-vs-traditional-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/comparisons/woocommerce-pos-vs-traditional-pos': {
    title: 'WooCommerce POS vs Traditional Standalone POS Systems | ZAMERIA',
    description: 'Compare connected WooCommerce POS with legacy standalone systems. See why unified catalogs eliminate double data entry, manual sync, and stockouts.',
    canonical: 'https://zameria.co/woocommerce-pos-vs-traditional-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/solutions/stock-mismatch': {
    title: 'How to Fix WooCommerce Stock Mismatch With Your Physical Store | ZAMERIA',
    description: 'Step-by-step diagnostic and real-time inventory locking guide to eliminate stock discrepancies between in-store checkouts and WooCommerce websites.',
    canonical: 'https://zameria.co/solutions/stock-mismatch',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/how-to-fix-woocommerce-stock-mismatch': {
    title: 'How to Fix WooCommerce Stock Mismatch With Your Physical Store | ZAMERIA',
    description: 'Step-by-step diagnostic and real-time inventory locking guide to eliminate stock discrepancies between in-store checkouts and WooCommerce websites.',
    canonical: 'https://zameria.co/solutions/stock-mismatch',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/solutions/offline-pos': {
    title: 'WooCommerce Offline POS — Keep Selling When Internet Goes Down | ZAMERIA',
    description: 'Offline-first POS architecture with IndexedDB caching. Ring up barcode sales and print receipts offline, with automatic chronological background sync.',
    canonical: 'https://zameria.co/solutions/offline-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/woocommerce-offline-pos-system': {
    title: 'WooCommerce Offline POS — Keep Selling When Internet Goes Down | ZAMERIA',
    description: 'Offline-first POS architecture with IndexedDB caching. Ring up barcode sales and print receipts offline, with automatic chronological background sync.',
    canonical: 'https://zameria.co/solutions/offline-pos',
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
