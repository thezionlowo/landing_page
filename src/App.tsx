import React from 'react';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { RouterProvider, useRouter } from './router/Router';
import { LoginPage } from './pages/auth/LoginPage';
import { GetStartedPage } from './pages/auth/GetStartedPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { AccountLayout } from './pages/account/AccountLayout';

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

import { WooCommercePosPage } from './pages/seo/WooCommercePosPage';
import { WooCommerceInventorySyncPage } from './pages/seo/WooCommerceInventorySyncPage';
import { WooCommercePosNigeriaPage } from './pages/seo/WooCommercePosNigeriaPage';
import { FashionPosPage } from './pages/seo/FashionPosPage';
import { BeautyPosPage } from './pages/seo/BeautyPosPage';
import { ElectronicsPosPage } from './pages/seo/ElectronicsPosPage';
import { PreventOversellingPage } from './pages/seo/PreventOversellingPage';

function LandingPageContent() {
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

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/get-started' || path === '/signup') {
    return <GetStartedPage />;
  }

  if (path === '/forgot-password') {
    return <ForgotPasswordPage />;
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

  // SEO Problem-Solution Pages
  if (path === '/solutions/prevent-overselling' || path === '/how-to-prevent-overselling-woocommerce') {
    return <PreventOversellingPage />;
  }

  return <LandingPageContent />;
}

export function App() {
  return (
    <CustomerAuthProvider>
      <RouterProvider>
        <SEOHead />
        <MainAppRoutes />
      </RouterProvider>
    </CustomerAuthProvider>
  );
}

export default App;
