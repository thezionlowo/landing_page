import { NotFoundPage } from './pages/NotFoundPage';
import { MARKETING_PAGES, PAGE_REDIRECTS } from './content/marketingPages';
import React from 'react';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { RouterProvider, useRouter } from './router/Router';
import { HomePage } from './pages/HomePage';
import { PlanComparisonProvider } from './components/PlanComparison';
import { SEOHead } from './components/SEOHead';
import { ZameriaSupportChatWidget } from './components/ZameriaSupportChatWidget';
import { POLICY_PAGES, type PolicyPath } from './content/policyPages';

// Code-split subpages for performance and smaller initial bundles
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const GetStartedPage = React.lazy(() => import('./pages/auth/GetStartedPage').then(m => ({ default: m.GetStartedPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AccountLayout = React.lazy(() => import('./pages/account/AccountLayout').then(m => ({ default: m.AccountLayout })));
const SubscribePage = React.lazy(() => import('./pages/SubscribePage').then(m => ({ default: m.SubscribePage })));
const PaymentCompletePage = React.lazy(() => import('./pages/PaymentCompletePage').then(m => ({ default: m.PaymentCompletePage })));
const LeadCapture1Page = React.lazy(() => import('./pages/LeadCapture1Page').then(m => ({ default: m.LeadCapture1Page })));
const LeadCapture2Page = React.lazy(() => import('./pages/LeadCapture2Page').then(m => ({ default: m.LeadCapture2Page })));

const MarketingPage = React.lazy(() => import('./pages/MarketingPage').then(m => ({ default: m.MarketingPage })));
const PolicyPage = React.lazy(() => import('./pages/PolicyPage').then(m => ({ default: m.PolicyPage })));

export function LandingPageContent() {
  return <HomePage />;
}

function PageRedirect({ to }: { to: string }) {
  React.useEffect(() => {
    window.history.replaceState(null, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [to]);
  return <main className="site-route-loading"><p>Opening page…</p><a href={to}>Continue</a></main>;
}

function MainAppRoutes() {
  const { path, search } = useRouter();
  const redirect = PAGE_REDIRECTS[path.replace(/\/$/, '')];
  if (redirect) return <PageRedirect to={redirect + search} />;

  const policyPath = path.replace(/\/$/, '') as PolicyPath;
  if (Object.prototype.hasOwnProperty.call(POLICY_PAGES, policyPath)) return <PolicyPage path={policyPath} />;

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

  if (path === '/account' || path.startsWith('/account/')) {
    return <AccountLayout />;
  }

  const page = MARKETING_PAGES[path.replace(/\/$/, '')];
  if (page) return <MarketingPage page={page} path={path.replace(/\/$/, '')} />;

  return path === '/' ? <LandingPageContent /> : <NotFoundPage />;
}

export function AppShell({ children }: { children?: React.ReactNode }) {
  const { path } = useRouter();
  const hideChatWidget = ['/', '/login', '/get-started', '/forgot-password', '/subscribe', '/terms', '/privacy'].includes(path.replace(/\/$/, '') || '/') || path.startsWith('/leadcapture1') || path.startsWith('/leadcapture2');

  return (
    <>
      <SEOHead />
      <React.Suspense fallback={<div style={{ minHeight: '80vh', backgroundColor: 'var(--canvas-bg)' }} />}>
        {children || <MainAppRoutes />}
      </React.Suspense>
      {!hideChatWidget && <ZameriaSupportChatWidget />}
    </>
  );
}

export function App() {
  return (
    <CustomerAuthProvider>
      <RouterProvider>
        <PlanComparisonProvider><AppShell /></PlanComparisonProvider>
      </RouterProvider>
    </CustomerAuthProvider>
  );
}

export default App;
