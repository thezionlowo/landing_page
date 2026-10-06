import React, { useEffect } from 'react';
import { useRouter } from '../router/Router';

export interface RouteSEO {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  keywords?: string;
  h1?: string;
}

export const ROUTE_SEO_CONFIG: Record<string, RouteSEO> = {
  '/': {
    title: 'ZAMERIA — Real-Time WooCommerce POS & In-Store Inventory Management',
    description: 'Connect your WooCommerce store with your physical retail shop. Manage products, real-time inventory synchronization, barcode POS checkout, and orders in one unified system.',
    canonical: 'https://www.zameria.co/',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS, WooCommerce inventory sync, Point of Sale WooCommerce, retail POS Nigeria, retail inventory sync',
    h1: 'Real-Time WooCommerce POS & In-Store Inventory Management',
  },
  '/woocommerce-pos': {
    title: 'WooCommerce POS for Physical Retail Stores | ZAMERIA Point of Sale',
    description: 'Turn any laptop, desktop, or tablet into a lightning-fast WooCommerce point of sale counter. Real-time stock sync, offline resilience, and thermal receipt printing.',
    canonical: 'https://www.zameria.co/woocommerce-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS, point of sale WooCommerce, barcode POS system, retail checkout WooCommerce',
    h1: 'Real-Time WooCommerce Point of Sale (POS) for Physical Stores',
  },
  '/woocommerce-inventory-sync': {
    title: 'WooCommerce Inventory Sync for In-Store & Online Retail | ZAMERIA',
    description: 'Sub-second bi-directional inventory synchronization between your physical shop and WooCommerce store. Eliminate stock mismatch, overselling, and manual reconciliation.',
    canonical: 'https://www.zameria.co/woocommerce-inventory-sync',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce inventory sync, real-time stock sync, prevent overselling WooCommerce, retail inventory sync',
    h1: 'Real-Time WooCommerce Inventory Sync (Sub-Second Online & In-Store)',
  },
  '/woocommerce-pos-nigeria': {
    title: 'WooCommerce POS Nigeria — Point of Sale for Nigerian Retailers | ZAMERIA',
    description: 'The premier WooCommerce-connected POS built for Nigerian retail stores. Accept POS card, cash, & bank transfer, issue 80mm thermal receipts, and operate smoothly during internet drops.',
    canonical: 'https://www.zameria.co/woocommerce-pos-nigeria',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS Nigeria, retail POS Lagos, point of sale software Nigeria, Naira WooCommerce POS',
    h1: 'The #1 WooCommerce POS Built for Nigerian Retailers',
  },
  '/industries/fashion': {
    title: 'WooCommerce POS for Fashion Boutiques & Clothing Stores | ZAMERIA',
    description: 'Real-time retail POS for fashion stores and boutiques. Manage size/color variation matrices, prevent overselling on Instagram & in-store, and track boutique staff sales.',
    canonical: 'https://www.zameria.co/industries/fashion',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS fashion, boutique POS, clothing store inventory sync',
    h1: 'WooCommerce POS for Fashion Boutiques & Apparel Stores',
  },
  '/woocommerce-pos-for-fashion': {
    title: 'WooCommerce POS for Fashion Boutiques & Clothing Stores | ZAMERIA',
    description: 'Real-time retail POS for fashion stores and boutiques. Manage size/color variation matrices, prevent overselling on Instagram & in-store, and track boutique staff sales.',
    canonical: 'https://www.zameria.co/industries/fashion',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS fashion, boutique POS, clothing store inventory sync',
    h1: 'WooCommerce POS for Fashion Boutiques & Apparel Stores',
  },
  '/industries/beauty': {
    title: 'WooCommerce POS for Beauty, Cosmetics & Skincare Stores | ZAMERIA',
    description: 'Fast counter POS for beauty shops and cosmetic retailers. Rapid shade selection, thousands of SKU lookups, customer purchase records, and instant stock sync.',
    canonical: 'https://www.zameria.co/industries/beauty',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS beauty, cosmetics POS, skincare store POS system',
    h1: 'WooCommerce POS for Beauty, Cosmetics & Skincare Stores',
  },
  '/woocommerce-pos-for-beauty': {
    title: 'WooCommerce POS for Beauty, Cosmetics & Skincare Stores | ZAMERIA',
    description: 'Fast counter POS for beauty shops and cosmetic retailers. Rapid shade selection, thousands of SKU lookups, customer purchase records, and instant stock sync.',
    canonical: 'https://www.zameria.co/industries/beauty',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS beauty, cosmetics POS, skincare store POS system',
    h1: 'WooCommerce POS for Beauty, Cosmetics & Skincare Stores',
  },
  '/industries/electronics': {
    title: 'WooCommerce POS for Electronics, Phones & Gadget Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for electronics and phone stores. Serial & warranty tracking, split payment checkout, and live WooCommerce inventory sync.',
    canonical: 'https://www.zameria.co/industries/electronics',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS electronics, phone store POS, gadget shop inventory sync',
    h1: 'WooCommerce POS for Electronics, Phones & Gadget Retailers',
  },
  '/woocommerce-pos-for-electronics': {
    title: 'WooCommerce POS for Electronics, Phones & Gadget Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for electronics and phone stores. Serial & warranty tracking, split payment checkout, and live WooCommerce inventory sync.',
    canonical: 'https://www.zameria.co/industries/electronics',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS electronics, phone store POS, gadget shop inventory sync',
    h1: 'WooCommerce POS for Electronics, Phones & Gadget Retailers',
  },
  '/solutions/prevent-overselling': {
    title: 'How to Prevent Overselling on WooCommerce With a Physical Store | ZAMERIA',
    description: 'Stop selling in-store stock that was already bought online. Learn how bi-directional inventory locking and real-time POS sync eliminate stock mismatch forever.',
    canonical: 'https://www.zameria.co/solutions/prevent-overselling',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'prevent overselling WooCommerce, stop double selling retail, inventory locking WooCommerce',
    h1: 'How to Prevent Overselling on WooCommerce With a Physical Retail Store',
  },
  '/how-to-prevent-overselling-woocommerce': {
    title: 'How to Prevent Overselling on WooCommerce With a Physical Store | ZAMERIA',
    description: 'Stop selling in-store stock that was already bought online. Learn how bi-directional inventory locking and real-time POS sync eliminate stock mismatch forever.',
    canonical: 'https://www.zameria.co/solutions/prevent-overselling',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'prevent overselling WooCommerce, stop double selling retail, inventory locking WooCommerce',
    h1: 'How to Prevent Overselling on WooCommerce With a Physical Retail Store',
  },
  '/industries/supermarkets': {
    title: 'WooCommerce POS for Supermarkets & Grocery Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for supermarkets and grocery stores. Manage thousands of SKUs, cart holding, thermal receipts, and live online stock sync.',
    canonical: 'https://www.zameria.co/industries/supermarkets',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'supermarket POS WooCommerce, grocery store point of sale, barcode POS WooCommerce',
    h1: 'WooCommerce POS for Supermarkets & Grocery Stores',
  },
  '/woocommerce-pos-for-supermarkets': {
    title: 'WooCommerce POS for Supermarkets & Grocery Stores | ZAMERIA',
    description: 'High-speed barcode scanning POS for supermarkets and grocery stores. Manage thousands of SKUs, cart holding, thermal receipts, and live online stock sync.',
    canonical: 'https://www.zameria.co/industries/supermarkets',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'supermarket POS WooCommerce, grocery store point of sale, barcode POS WooCommerce',
    h1: 'WooCommerce POS for Supermarkets & Grocery Stores',
  },
  '/industries/pharmacies': {
    title: 'WooCommerce POS for Pharmacies & Health Stores | ZAMERIA',
    description: 'Fast medication lookup, prescription order notes, and real-time inventory management for pharmacies selling in-store and online through WooCommerce.',
    canonical: 'https://www.zameria.co/industries/pharmacies',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'pharmacy POS WooCommerce, chemist inventory management, dispensary POS',
    h1: 'WooCommerce POS for Pharmacies & Health Dispensaries',
  },
  '/woocommerce-pos-for-pharmacies': {
    title: 'WooCommerce POS for Pharmacies & Health Stores | ZAMERIA',
    description: 'Fast medication lookup, prescription order notes, and real-time inventory management for pharmacies selling in-store and online through WooCommerce.',
    canonical: 'https://www.zameria.co/industries/pharmacies',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'pharmacy POS WooCommerce, chemist inventory management, dispensary POS',
    h1: 'WooCommerce POS for Pharmacies & Health Dispensaries',
  },
  '/industries/jewelry': {
    title: 'WooCommerce POS for Jewelry & Luxury Accessory Stores | ZAMERIA',
    description: 'High-value SKU locking, variation matrices (carat/metal), split payment transactions, and live WooCommerce inventory synchronization for jewelry stores.',
    canonical: 'https://www.zameria.co/industries/jewelry',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'jewelry POS WooCommerce, luxury retail POS, gold watch POS inventory',
    h1: 'WooCommerce POS for Jewelry & Luxury Accessory Stores',
  },
  '/woocommerce-pos-for-jewelry': {
    title: 'WooCommerce POS for Jewelry & Luxury Accessory Stores | ZAMERIA',
    description: 'High-value SKU locking, variation matrices (carat/metal), split payment transactions, and live WooCommerce inventory synchronization for jewelry stores.',
    canonical: 'https://www.zameria.co/industries/jewelry',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'jewelry POS WooCommerce, luxury retail POS, gold watch POS inventory',
    h1: 'WooCommerce POS for Jewelry & Luxury Accessory Stores',
  },
  '/hardware-compatibility': {
    title: 'WooCommerce POS Hardware Compatibility & Setup Guide | ZAMERIA',
    description: 'Supported thermal receipt printers (80mm ESC/POS, Epson, Xprinter), USB/Bluetooth barcode scanners, cash drawers, and computer compatibility for ZAMERIA.',
    canonical: 'https://www.zameria.co/hardware-compatibility',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS hardware, receipt printer setup, ESC POS thermal printer, barcode scanner WooCommerce',
    h1: 'WooCommerce POS Hardware Compatibility & Setup Guide',
  },
  '/woocommerce-pos-hardware-compatibility': {
    title: 'WooCommerce POS Hardware Compatibility & Setup Guide | ZAMERIA',
    description: 'Supported thermal receipt printers (80mm ESC/POS, Epson, Xprinter), USB/Bluetooth barcode scanners, cash drawers, and computer compatibility for ZAMERIA.',
    canonical: 'https://www.zameria.co/hardware-compatibility',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS hardware, receipt printer setup, ESC POS thermal printer, barcode scanner WooCommerce',
    h1: 'WooCommerce POS Hardware Compatibility & Setup Guide',
  },
  '/woocommerce-pos-vs-traditional-pos': {
    title: 'WooCommerce POS vs Traditional Standalone POS Systems | ZAMERIA',
    description: 'Compare connected WooCommerce POS with legacy standalone systems. See why unified catalogs eliminate double data entry, manual sync, and stockouts.',
    canonical: 'https://www.zameria.co/woocommerce-pos-vs-traditional-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS vs traditional POS, standalone POS vs connected POS, compare POS systems',
    h1: 'WooCommerce POS vs Traditional Standalone POS Systems',
  },
  '/comparisons/woocommerce-pos-vs-traditional-pos': {
    title: 'WooCommerce POS vs Traditional Standalone POS Systems | ZAMERIA',
    description: 'Compare connected WooCommerce POS with legacy standalone systems. See why unified catalogs eliminate double data entry, manual sync, and stockouts.',
    canonical: 'https://www.zameria.co/woocommerce-pos-vs-traditional-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS vs traditional POS, standalone POS vs connected POS, compare POS systems',
    h1: 'WooCommerce POS vs Traditional Standalone POS Systems',
  },
  '/solutions/stock-mismatch': {
    title: 'How to Fix WooCommerce Stock Mismatch With Your Physical Store | ZAMERIA',
    description: 'Step-by-step diagnostic and real-time inventory locking guide to eliminate stock discrepancies between in-store checkouts and WooCommerce websites.',
    canonical: 'https://www.zameria.co/solutions/stock-mismatch',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'fix WooCommerce stock mismatch, inventory discrepancy physical store, WooCommerce stock out of sync',
    h1: 'How to Fix WooCommerce Stock Mismatch With Your Physical Store',
  },
  '/how-to-fix-woocommerce-stock-mismatch': {
    title: 'How to Fix WooCommerce Stock Mismatch With Your Physical Store | ZAMERIA',
    description: 'Step-by-step diagnostic and real-time inventory locking guide to eliminate stock discrepancies between in-store checkouts and WooCommerce websites.',
    canonical: 'https://www.zameria.co/solutions/stock-mismatch',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'fix WooCommerce stock mismatch, inventory discrepancy physical store, WooCommerce stock out of sync',
    h1: 'How to Fix WooCommerce Stock Mismatch With Your Physical Store',
  },
  '/solutions/offline-pos': {
    title: 'WooCommerce Offline POS — Keep Selling When Internet Goes Down | ZAMERIA',
    description: 'Offline-first POS architecture with IndexedDB caching. Ring up barcode sales and print receipts offline, with automatic chronological background sync.',
    canonical: 'https://www.zameria.co/solutions/offline-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'offline WooCommerce POS, POS no internet, offline cash register WooCommerce, IndexedDB POS',
    h1: 'WooCommerce Offline POS: Keep Selling When the Internet Goes Down',
  },
  '/woocommerce-offline-pos-system': {
    title: 'WooCommerce Offline POS — Keep Selling When Internet Goes Down | ZAMERIA',
    description: 'Offline-first POS architecture with IndexedDB caching. Ring up barcode sales and print receipts offline, with automatic chronological background sync.',
    canonical: 'https://www.zameria.co/solutions/offline-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'offline WooCommerce POS, POS no internet, offline cash register WooCommerce, IndexedDB POS',
    h1: 'WooCommerce Offline POS: Keep Selling When the Internet Goes Down',
  },
  '/alternatives/foosales': {
    title: 'FooSales Alternative: Faster, Affordable WooCommerce POS | ZAMERIA',
    description: 'Looking for a FooSales alternative? ZAMERIA provides sub-second inventory locking, true offline POS mode, native split tender, and flat annual pricing with zero transaction fees.',
    canonical: 'https://www.zameria.co/alternatives/foosales',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'FooSales alternative, FooSales competitors, WooCommerce POS alternative, affordable WooCommerce POS',
    h1: 'The Modern, Faster FooSales Alternative for WooCommerce Retailers',
  },
  '/alternatives/oliver-pos': {
    title: 'Oliver POS Alternative: Zero Hardware Lock-in WooCommerce POS | ZAMERIA',
    description: 'Ditch Oliver POS hardware leasing fees and sync lag. ZAMERIA runs on your existing devices with sub-second inventory locking, offline mode, and flat annual pricing.',
    canonical: 'https://www.zameria.co/alternatives/oliver-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'Oliver POS alternative, Oliver POS competitors, Oliver POS vs ZAMERIA, WooCommerce POS hardware agnostic',
    h1: 'The Fast, Hardware-Agnostic Oliver POS Alternative for WooCommerce',
  },
  '/comparisons/foosales-vs-oliver-pos': {
    title: 'FooSales vs Oliver POS (2026 In-Depth Comparison) | ZAMERIA',
    description: 'Comparing FooSales vs Oliver POS for WooCommerce? Detailed side-by-side analysis of pricing, sync latency, offline reliability, hardware requirements, and the ZAMERIA modern alternative.',
    canonical: 'https://www.zameria.co/comparisons/foosales-vs-oliver-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'FooSales vs Oliver POS, compare FooSales and Oliver POS, WooCommerce POS comparison, best POS for WooCommerce',
    h1: 'FooSales vs Oliver POS: 2026 In-Depth Retailer Comparison',
  },
  '/best-woocommerce-pos': {
    title: '5 Best WooCommerce POS Systems (2026 Ranked & Tested) | ZAMERIA',
    description: 'Looking for the best WooCommerce POS in 2026? We benchmarked ZAMERIA, FooSales, Oliver POS, wePOS, and VitePOS on sync speed, offline capability, hardware freedom, and pricing.',
    canonical: 'https://www.zameria.co/best-woocommerce-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'best WooCommerce POS, top WooCommerce POS systems, WooCommerce point of sale reviews, compare WooCommerce POS',
    h1: 'The 5 Best WooCommerce POS Systems in 2026: Tested & Ranked',
  },
  '/solutions/multi-store-inventory-sync': {
    title: 'WooCommerce Multi-Store Inventory Sync for Retail Chains | ZAMERIA',
    description: 'Sync multiple retail branches, physical registers, central warehouses, and your WooCommerce store in real time with sub-second inventory locking and zero overselling.',
    canonical: 'https://www.zameria.co/solutions/multi-store-inventory-sync',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce multi-store inventory sync, multi-branch POS WooCommerce, multi-location inventory sync WooCommerce',
    h1: 'WooCommerce Multi-Store Inventory Sync Built for Growing Retailers',
  },
  '/features/split-payments': {
    title: 'WooCommerce POS Split Payments: Cash, Card & Transfer | ZAMERIA',
    description: 'Accept split tender on a single WooCommerce POS sale. Split tickets across cash, card POS terminal, and instant bank transfer with automatic shift reconciliation.',
    canonical: 'https://www.zameria.co/features/split-payments',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS split payments, split tender POS, multi-payment WooCommerce POS, split bill retail register',
    h1: 'WooCommerce POS Split Payments: Accept Cash, Card & Transfer in One Sale',
  },
  '/nigeria/lagos-retail-pos': {
    title: 'Retail POS System for WooCommerce Stores in Lagos, Nigeria | ZAMERIA',
    description: 'Engineered for Lagos retail. Offline resilience during fiber/grid blackouts, Moniepoint & OPay card POS split tender, Naira pricing (₦200,000/yr), and instant WooCommerce sync.',
    canonical: 'https://www.zameria.co/nigeria/lagos-retail-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'retail POS system Lagos, WooCommerce POS Nigeria, Lekki Ikeja retail POS, Moniepoint POS WooCommerce integration',
    h1: 'The #1 Retail POS System for WooCommerce Stores in Lagos, Nigeria',
  },
  '/industries/clothing-boutique-pos': {
    title: 'WooCommerce POS for Clothing Boutiques & Apparel Stores | ZAMERIA',
    description: 'Fast size/color variation picker, swing tag barcode scanning, fitting room tab holds, and real-time boutique inventory sync with WooCommerce.',
    canonical: 'https://www.zameria.co/industries/clothing-boutique-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'clothing boutique POS, apparel retail POS WooCommerce, fashion boutique point of sale, garment barcode POS',
    h1: 'The WooCommerce POS System Built for Modern Clothing Boutiques',
  },
  '/industries/electronics-pos': {
    title: 'WooCommerce POS for Electronics & Gadget Retailers | ZAMERIA',
    description: 'Built for electronics and gadget stores. Serial & IMEI number logging, warranty policy thermal receipts, rapid accessory scanning, and margin protection.',
    canonical: 'https://www.zameria.co/industries/electronics-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'electronics POS WooCommerce, phone store POS, IMEI serial number tracking POS, gadget store point of sale',
    h1: 'The WooCommerce POS for Electronics, Gadgets & Phone Repair Stores',
  },
  '/solutions/stop-overselling-rush-hours': {
    title: 'How to Stop WooCommerce Overselling During Rush Hours & Flash Sales | ZAMERIA',
    description: 'Prevent race conditions, negative inventory, and stockouts during peak retail rushes and flash sales with atomic inventory locks and sub-second webhook sync.',
    canonical: 'https://www.zameria.co/solutions/stop-overselling-rush-hours',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'stop overselling WooCommerce, prevent flash sale race condition WooCommerce, peak rush inventory sync',
    h1: 'How to Stop WooCommerce Overselling During Peak Rush Hours & Flash Sales',
  },
  '/get-started': {
    title: 'Start 7-Day Free Trial | ZAMERIA WooCommerce POS',
    description: 'Try ZAMERIA free for 7 days. Connect your WooCommerce catalog, ring up counter sales, and sync in-store inventory in real time. No credit card required.',
    canonical: 'https://www.zameria.co/get-started',
    robots: 'index, follow',
    keywords: 'ZAMERIA free trial, try WooCommerce POS, start POS trial',
    h1: 'Start Your 7-Day Free Trial of ZAMERIA',
  },
  '/woocommerce-pos-plugin': {
    title: 'WooCommerce POS Plugin for Physical Stores | ZAMERIA Point of Sale',
    description: 'Turn WordPress into a high-speed in-store checkout register. Lightweight companion plugin with sub-second bi-directional sync, HPOS compatibility, and offline mode.',
    canonical: 'https://www.zameria.co/woocommerce-pos-plugin',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS plugin, POS plugin for WooCommerce, WordPress POS plugin, retail POS plugin WooCommerce',
    h1: 'The Modern WooCommerce POS Plugin for Physical Retail Stores',
  },
  '/pos-for-woocommerce': {
    title: 'POS for WooCommerce — In-Store Counter Checkout & Stock Sync | ZAMERIA',
    description: 'Dedicated POS for WooCommerce retailers. Ring up in-store sales, scan barcodes, print receipts, and keep online & physical stock 100% matched in real time.',
    canonical: 'https://www.zameria.co/pos-for-woocommerce',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'POS for WooCommerce, point of sale for WooCommerce, retail counter WooCommerce POS, WooCommerce cash register',
    h1: 'POS for WooCommerce: Connect Your In-Store Counter with Your Online Store',
  },
  '/woocommerce-inventory-management': {
    title: 'WooCommerce Inventory Management for In-Store & Online Stores | ZAMERIA',
    description: 'Manage retail and WooCommerce inventory in real time. Atomic stock locking, variation matrices, stock valuation, and zero manual spreadsheets.',
    canonical: 'https://www.zameria.co/woocommerce-inventory-management',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce inventory management, retail inventory management WooCommerce, online and physical inventory sync, stock management WooCommerce',
    h1: 'WooCommerce Inventory Management for In-Store & Online Retail',
  },
  '/woocommerce-stock-management': {
    title: 'WooCommerce Stock Management & In-Store Reconciliation | ZAMERIA',
    description: 'Accurate stock reconciliation between physical stores and WooCommerce. Current stock value calculations, variation tracking, and sub-second updates.',
    canonical: 'https://www.zameria.co/woocommerce-stock-management',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce stock management, stock reconciliation WooCommerce, WooCommerce stock sync, inventory valuation WooCommerce',
    h1: 'WooCommerce Stock Management for Retail Stores & Counter Registers',
  },
  '/woocommerce-retail-pos': {
    title: 'WooCommerce Retail POS for Brick-and-Mortar Stores | ZAMERIA',
    description: 'High-speed retail counter POS for WooCommerce physical shops. Barcode scanning, split tender, ESC/POS thermal receipts, and real-time stock sync.',
    canonical: 'https://www.zameria.co/woocommerce-retail-pos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce retail POS, retail point of sale WooCommerce, brick and mortar POS WooCommerce, shop counter POS',
    h1: 'WooCommerce Retail POS for Physical Brick-and-Mortar Stores',
  },
  '/woocommerce-physical-store': {
    title: 'WooCommerce for Physical Stores — Connect Online & In-Store | ZAMERIA',
    description: 'Run WooCommerce online and sell from a physical store? ZAMERIA connects your WooCommerce website and physical store so your products, stock and sales stay in sync.',
    canonical: 'https://www.zameria.co/woocommerce-physical-store',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce physical store, WooCommerce retail store, WooCommerce online and physical sales, sync WooCommerce with physical shop',
    h1: 'Running WooCommerce With a Physical Store? Connect Them Seamlessly',
  },
  '/woocommerce-pos-inventory': {
    title: 'WooCommerce POS Inventory: Real-Time Counter Stock Locking | ZAMERIA',
    description: 'Sub-second inventory synchronization between POS registers and WooCommerce. Atomic stock deductions prevent overselling during flash sales and peak rushes.',
    canonical: 'https://www.zameria.co/woocommerce-pos-inventory',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS inventory, POS inventory sync WooCommerce, atomic stock lock WooCommerce, prevent overselling POS',
    h1: 'WooCommerce POS Inventory: Real-Time Stock Locking at the Counter',
  },
  '/woocommerce-pos-comparison': {
    title: 'WooCommerce POS Comparison: Connected POS vs Standalone Systems | ZAMERIA',
    description: 'Detailed comparison of connected WooCommerce POS systems vs legacy standalone registers and cloud ERPs. Evaluate sync speed, offline capability, and pricing.',
    canonical: 'https://www.zameria.co/woocommerce-pos-comparison',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS comparison, best POS for WooCommerce, compare WooCommerce POS systems, connected POS vs standalone POS',
    h1: 'WooCommerce POS Comparison: Connected POS vs Standalone Systems',
  },
  '/solutions/woocommerce-stock-not-updating': {
    title: 'WooCommerce Stock Not Updating? Causes & How to Fix Permanently | ZAMERIA',
    description: 'Technical diagnostic guide for WooCommerce inventory not syncing. Solve WP-Cron delays, caching plugin locks, and race conditions with atomic event sync.',
    canonical: 'https://www.zameria.co/solutions/woocommerce-stock-not-updating',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce stock not updating, WooCommerce inventory mismatch, WooCommerce inventory not syncing, fix WooCommerce stock out of sync',
    h1: 'WooCommerce Stock Not Updating? Causes & How to Fix It Permanently',
  },
  '/alternatives': {
    title: 'Best WooCommerce POS Alternatives (2026 In-Depth Guide) | ZAMERIA',
    description: 'Explore top WooCommerce POS alternatives. Side-by-side comparisons of FooSales, Oliver POS, WCPOS, wePOS, and ZAMERIA on sync speed, offline mode, and pricing.',
    canonical: 'https://www.zameria.co/alternatives',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WooCommerce POS alternatives, FooSales alternatives, Oliver POS alternatives, WCPOS alternatives, wePOS alternatives',
    h1: 'The Best WooCommerce POS Alternatives & Competitor Comparisons',
  },
  '/alternatives/wcpos': {
    title: 'WCPOS Alternative: Offline Resilience & Flat Annual Pricing | ZAMERIA',
    description: 'Evaluating WCPOS alternatives? Discover why retail store owners choose ZAMERIA for true offline IndexedDB operation, native split tender, and flat annual pricing.',
    canonical: 'https://www.zameria.co/alternatives/wcpos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'WCPOS alternative, WCPOS alternatives, WCPOS vs ZAMERIA, compare WCPOS',
    h1: 'Looking for a WCPOS Alternative? Meet ZAMERIA',
  },
  '/alternatives/wepos': {
    title: 'wePOS Alternative: Sub-Second Stock Locking & Offline Mode | ZAMERIA',
    description: 'Searching for a wePOS alternative? Compare wePOS and ZAMERIA on offline capability, inventory locking, variation handling, and flat transparent pricing.',
    canonical: 'https://www.zameria.co/alternatives/wepos',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: 'wePOS alternative, wePOS alternatives, wePOS vs ZAMERIA, WooCommerce POS alternatives',
    h1: 'Looking for a wePOS Alternative? Discover ZAMERIA',
  },
  '/login': {
    title: 'Merchant Sign In | ZAMERIA Customer Portal',
    description: 'Log in to your ZAMERIA merchant portal to manage your store licenses, billing subscriptions, and connected WooCommerce stores.',
    canonical: 'https://www.zameria.co/login',
    robots: 'index, follow',
    keywords: 'ZAMERIA login, merchant portal, WooCommerce POS login',
    h1: 'Sign in to Your Merchant Account',
  },
  '/forgot-password': {
    title: 'Reset Password | ZAMERIA',
    description: 'Reset your ZAMERIA account password.',
    canonical: 'https://www.zameria.co/forgot-password',
    robots: 'noindex, nofollow',
  },
  '/account': {
    title: 'Customer Account & Billing | ZAMERIA Portal',
    description: 'Manage your ZAMERIA licenses, subscription plans, and connected WooCommerce stores.',
    canonical: 'https://www.zameria.co/account',
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
    setOgMeta('og:image', 'https://www.zameria.co/zameria-logo.png');

    // 4. Update Twitter Card Meta Tags
    setMeta('twitter:title', config.title);
    setMeta('twitter:description', config.description);
    setMeta('twitter:image', 'https://www.zameria.co/zameria-logo.png');
    setMeta('twitter:card', 'summary_large_image');
  }, [path]);

  return null;
};
