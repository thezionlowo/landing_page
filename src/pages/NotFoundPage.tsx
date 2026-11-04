import { SiteHeader, SiteFooter } from '../components/SiteChrome';
export function NotFoundPage() {
  return <div className="site-content-page"><SiteHeader /><main className="site-not-found"><span className="saas-eyebrow">PAGE NOT FOUND</span><h1>Let’s get you back to the store.</h1><p>This page may have moved. Start from the homepage or open your account.</p><div className="site-content-actions"><a href="/" className="saas-button">Go to homepage</a><a href="/login" className="saas-button saas-button-secondary">Log in</a></div></main><SiteFooter /></div>;
}
