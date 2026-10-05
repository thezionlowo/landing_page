import React from 'react';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { RouterProvider, useRouter } from './router/Router';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProofStrip } from './components/ProofStrip';
import { ProblemSolution } from './components/ProblemSolution';
import { ProductPowers } from './components/ProductPowers';
import { BusinessCategories } from './components/BusinessCategories';
import { GettingStarted } from './components/GettingStarted';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { ZameriaSupportChatWidget } from './components/ZameriaSupportChatWidget';

// Code-split subpages for performance and smaller initial bundles
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const GetStartedPage = React.lazy(() => import('./pages/auth/GetStartedPage').then(m => ({ default: m.GetStartedPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AccountLayout = React.lazy(() => import('./pages/account/AccountLayout').then(m => ({ default: m.AccountLayout })));
const SubscribePage = React.lazy(() => import('./pages/SubscribePage').then(m => ({ default: m.SubscribePage })));
const PaymentCompletePage = React.lazy(() => import('./pages/PaymentCompletePage').then(m => ({ default: m.PaymentCompletePage })));
const LeadCapture1Page = React.lazy(() => import('./pages/LeadCapture1Page').then(m => ({ default: m.LeadCapture1Page })));
const LeadCapture2Page = React.lazy(() => import('./pages/LeadCapture2Page').then(m => ({ default: m.LeadCapture2Page })));

// Code-split SEO Pillar & Industry Pages
const WooCommercePosPage = React.lazy(() => import('./pages/seo/WooCommercePosPage').then(m => ({ default: m.WooCommercePosPage })));
const WooCommerceInventorySyncPage = React.lazy(() => import('./pages/seo/WooCommerceInventorySyncPage').then(m => ({ default: m.WooCommerceInventorySyncPage })));
const WooCommercePosNigeriaPage = React.lazy(() => import('./pages/seo/WooCommercePosNigeriaPage').then(m => ({ default: m.WooCommercePosNigeriaPage })));
const FashionPosPage = React.lazy(() => import('./pages/seo/FashionPosPage').then(m => ({ default: m.FashionPosPage })));
const BeautyPosPage = React.lazy(() => import('./pages/seo/BeautyPosPage').then(m => ({ default: m.BeautyPosPage })));
const ElectronicsPosPage = React.lazy(() => import('./pages/seo/ElectronicsPosPage').then(m => ({ default: m.ElectronicsPosPage })));
const SupermarketPosPage = React.lazy(() => import('./pages/seo/SupermarketPosPage').then(m => ({ default: m.SupermarketPosPage })));
const PharmacyPosPage = React.lazy(() => import('./pages/seo/PharmacyPosPage').then(m => ({ default: m.PharmacyPosPage })));
const JewelryPosPage = React.lazy(() => import('./pages/seo/JewelryPosPage').then(m => ({ default: m.JewelryPosPage })));
const HardwareCompatibilityPage = React.lazy(() => import('./pages/seo/HardwareCompatibilityPage').then(m => ({ default: m.HardwareCompatibilityPage })));
const PosComparisonPage = React.lazy(() => import('./pages/seo/PosComparisonPage').then(m => ({ default: m.PosComparisonPage })));
const StockMismatchPage = React.lazy(() => import('./pages/seo/StockMismatchPage').then(m => ({ default: m.StockMismatchPage })));
const OfflinePosPage = React.lazy(() => import('./pages/seo/OfflinePosPage').then(m => ({ default: m.OfflinePosPage })));
const PreventOversellingPage = React.lazy(() => import('./pages/seo/PreventOversellingPage').then(m => ({ default: m.PreventOversellingPage })));

// Phase 1 Commercial Attack Pages
const FooSalesAlternativesPage = React.lazy(() => import('./pages/seo/FooSalesAlternativesPage').then(m => ({ default: m.FooSalesAlternativesPage })));
const OliverPosAlternativesPage = React.lazy(() => import('./pages/seo/OliverPosAlternativesPage').then(m => ({ default: m.OliverPosAlternativesPage })));
const FooSalesVsOliverPosPage = React.lazy(() => import('./pages/seo/FooSalesVsOliverPosPage').then(m => ({ default: m.FooSalesVsOliverPosPage })));
const BestWooCommercePosPage = React.lazy(() => import('./pages/seo/BestWooCommercePosPage').then(m => ({ default: m.BestWooCommercePosPage })));
const MultiStoreInventorySyncPage = React.lazy(() => import('./pages/seo/MultiStoreInventorySyncPage').then(m => ({ default: m.MultiStoreInventorySyncPage })));
const SplitPaymentsPage = React.lazy(() => import('./pages/seo/SplitPaymentsPage').then(m => ({ default: m.SplitPaymentsPage })));
const LagosRetailPosPage = React.lazy(() => import('./pages/seo/LagosRetailPosPage').then(m => ({ default: m.LagosRetailPosPage })));
const ClothingBoutiquePosPage = React.lazy(() => import('./pages/seo/ClothingBoutiquePosPage').then(m => ({ default: m.ClothingBoutiquePosPage })));
const ElectronicsPosDeepPage = React.lazy(() => import('./pages/seo/ElectronicsPosDeepPage').then(m => ({ default: m.ElectronicsPosDeepPage })));
const StopOversellingRushHoursPage = React.lazy(() => import('./pages/seo/StopOversellingRushHoursPage').then(m => ({ default: m.StopOversellingRushHoursPage })));

export function LandingPageContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas-bg)' }}>
      {/* 1. Ultra-Clean Floating Frosted Glass Capsule */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* 2. Showstopper Hero: Oversized Headline + Bluish-Purple CTA + 3D Authentic POS Chrome */}
        <Hero />

        {/* 3. Proof Strip: Real-time Retail Metrics */}
        <ProofStrip />

        {/* 4. The Contrast: Disconnected Chaos → Unified ZAMERIA Brain ("One business. One system.") */}
        <ProblemSolution />

        {/* 5. Product Powers: Stress-Free Management & The 4 Core Retail Powers Visualized */}
        <ProductPowers />

        {/* 6. Built for Nigerian Commerce: 6 Retail Verticals with Authentic Photography */}
        <BusinessCategories />

        {/* 7. Getting Started Is Easy: 3 Simple Milestone Steps (< 2 Minutes) */}
        <GettingStarted />

        {/* 8. Transparent annual pricing: Starter and Business */}
        <PricingSection />

        {/* 9. FAQ: Split Editorial Layout with Support Reassurance */}
        <FAQSection />

        {/* 10. Final Conversion Moment: "Ready to connect your business?" */}
        <FinalCta />
      </main>

      {/* 11. Minimal Functional Footer */}
      <Footer />
    </div>
  );
}

function MainAppRoutes() {
  const { path } = useRouter();

  if (path === '/leadcapture1' || path === '/leadcapture1/' || path === '/leadcapture1.html') {
    return <LeadCapture1Page />;
  }

  if (path === '/leadcapture2' || path === '/leadcapture2/' || path === '/leadcapture2.html') {
    return <LeadCapture2Page />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/get-started' || path === '/signup') {
    return <GetStartedPage />;
  }

  if (path === '/forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (path === '/subscribe') {
    return <SubscribePage />;
  }

  if (path === '/payment/complete') {
    return <PaymentCompletePage />;
  }

  if (path === '/account' || path.startsWith('/account')) {
    return <AccountLayout />;
  }

  // SEO Pillar Pages
  if (path === '/woocommerce-pos') {
    return <WooCommercePosPage />;
  }

  if (path === '/woocommerce-inventory-sync') {
    return <WooCommerceInventorySyncPage />;
  }

  if (path === '/woocommerce-pos-nigeria') {
    return <WooCommercePosNigeriaPage />;
  }

  // SEO Industry / Use Case Cluster Pages
  if (path === '/industries/fashion' || path === '/woocommerce-pos-for-fashion') {
    return <FashionPosPage />;
  }

  if (path === '/industries/beauty' || path === '/woocommerce-pos-for-beauty') {
    return <BeautyPosPage />;
  }

  if (path === '/industries/electronics' || path === '/woocommerce-pos-for-electronics') {
    return <ElectronicsPosPage />;
  }

  if (path === '/industries/supermarkets' || path === '/woocommerce-pos-for-supermarkets') {
    return <SupermarketPosPage />;
  }

  if (path === '/industries/pharmacies' || path === '/woocommerce-pos-for-pharmacies') {
    return <PharmacyPosPage />;
  }

  if (path === '/industries/jewelry' || path === '/woocommerce-pos-for-jewelry') {
    return <JewelryPosPage />;
  }

  // Technical Guides & Comparisons
  if (path === '/hardware-compatibility' || path === '/woocommerce-pos-hardware-compatibility') {
    return <HardwareCompatibilityPage />;
  }

  if (path === '/woocommerce-pos-vs-traditional-pos' || path === '/comparisons/woocommerce-pos-vs-traditional-pos') {
    return <PosComparisonPage />;
  }

  // SEO Problem-Solution Pages
  if (path === '/solutions/prevent-overselling' || path === '/how-to-prevent-overselling-woocommerce') {
    return <PreventOversellingPage />;
  }

  if (path === '/solutions/stock-mismatch' || path === '/how-to-fix-woocommerce-stock-mismatch') {
    return <StockMismatchPage />;
  }

  if (path === '/solutions/offline-pos' || path === '/woocommerce-offline-pos-system') {
    return <OfflinePosPage />;
  }

  // Phase 1 Commercial Attack Routes
  if (path === '/alternatives/foosales') {
    return <FooSalesAlternativesPage />;
  }

  if (path === '/alternatives/oliver-pos') {
    return <OliverPosAlternativesPage />;
  }

  if (path === '/comparisons/foosales-vs-oliver-pos') {
    return <FooSalesVsOliverPosPage />;
  }

  if (path === '/best-woocommerce-pos') {
    return <BestWooCommercePosPage />;
  }

  if (path === '/solutions/multi-store-inventory-sync') {
    return <MultiStoreInventorySyncPage />;
  }

  if (path === '/features/split-payments') {
    return <SplitPaymentsPage />;
  }

  if (path === '/nigeria/lagos-retail-pos') {
    return <LagosRetailPosPage />;
  }

  if (path === '/industries/clothing-boutique-pos') {
    return <ClothingBoutiquePosPage />;
  }

  if (path === '/industries/electronics-pos') {
    return <ElectronicsPosDeepPage />;
  }

  if (path === '/solutions/stop-overselling-rush-hours') {
    return <StopOversellingRushHoursPage />;
  }

  return <LandingPageContent />;
}

function AppShell() {
  const { path } = useRouter();
  const hideChatWidget = path.startsWith('/leadcapture1') || path.startsWith('/leadcapture2');

  return (
    <>
      <SEOHead />
      <React.Suspense fallback={<div style={{ minHeight: '80vh', backgroundColor: 'var(--canvas-bg)' }} />}>
        <MainAppRoutes />
      </React.Suspense>
      {!hideChatWidget && <ZameriaSupportChatWidget />}
    </>
  );
}

export function App() {
  return (
    <CustomerAuthProvider>
      <RouterProvider>
        <AppShell />
      </RouterProvider>
    </CustomerAuthProvider>
  );
}

export default App;
