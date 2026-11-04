import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteFooter, SiteHeader } from '../components/SiteChrome';
import { PlanComparisonLink } from '../components/PlanComparison';
import { MARKETING_PAGES, type MarketingPageContent } from '../content/marketingPages';

export function MarketingPage({ page, path }: { page: MarketingPageContent; path: string }) {
  const guide = path.startsWith('/solutions/') || path.includes('comparison') || path === '/hardware-compatibility';
  return <div className="site-marketing site-content-page">
    <a className="hm-skip-link" href="#page-content">Skip to content</a>
    <SiteHeader />
    <main id="page-content">
      <div className="site-content-hero-band">
        <div className="site-content-wrap">
          <nav className="site-content-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">{page.eyebrow.toLowerCase()}</li></ol></nav>
          <section className="site-content-hero" aria-labelledby="page-heading">
            <div className="site-content-hero-copy"><span className="saas-eyebrow">{page.eyebrow}</span><h1 id="page-heading">{page.heading}</h1><p>{page.intro}</p><div className="site-content-actions"><a className="saas-button" href={guide ? '/#product' : '/get-started'}>{guide ? 'Try the POS demo' : 'Start your free trial'}<ArrowRight size={16} /></a><PlanComparisonLink className="saas-button saas-button-secondary" country={page.country}>Compare plans</PlanComparisonLink></div></div>
            <figure className={`site-content-image ${page.image ? 'site-content-photo' : 'site-content-screen'}`}>
              <img src={page.image ? `/categories/${page.image}.webp` : '/device-previews/laptop-pos.png'} alt={page.image ? `${page.eyebrow.toLowerCase()} shop setting` : 'Actual ZAMERIA checkout and skincare catalogue with demo store data'} width={page.image ? 600 : 2880} height={page.image ? 650 : 1800} decoding="async" />
              {!page.image && <figcaption>Actual ZAMERIA interface · Demo store</figcaption>}
            </figure>
          </section>
        </div>
      </div>
      <section className="site-content-section" aria-labelledby="benefits-heading"><div className="site-content-wrap"><h2 id="benefits-heading">{page.sectionTitle}</h2><div className="site-content-benefits">{page.benefits.map(([title, copy], i) => <article key={title}><span aria-hidden="true">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      {page.comparison && <section className="site-content-section site-content-tint" aria-labelledby="comparison-heading"><div className="site-content-wrap"><h2 id="comparison-heading">A practical comparison checklist</h2><div className="site-content-table-scroll" role="region" aria-label="POS comparison checklist" tabIndex={0}><table className="site-content-table"><caption className="site-visually-hidden">What to check when choosing a POS, and how ZAMERIA works</caption><thead><tr><th scope="col">Your task</th><th scope="col">What to check</th><th scope="col">With ZAMERIA</th></tr></thead><tbody>{page.comparison.map(([task, check, detail]) => <tr key={task}><th scope="row">{task}</th><td>{check}</td><td>{detail}</td></tr>)}</tbody></table></div></div></section>}
      <section className={`site-content-section ${page.comparison ? '' : 'site-content-tint'}`} aria-labelledby="steps-heading"><div className="site-content-wrap site-content-steps-layout"><div><span className="saas-eyebrow">STEP BY STEP</span><h2 id="steps-heading">{page.stepsTitle}</h2></div><ol className="site-content-steps">{page.steps.map(([title, copy], i) => <li key={title}><span aria-hidden="true">{i + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></section>
      <section className="site-content-section" aria-labelledby="questions-heading"><div className="site-content-wrap site-content-faq-layout"><h2 id="questions-heading">A few useful answers</h2><div className="site-content-faq">{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
      <section className="site-content-section site-content-related" aria-labelledby="related-heading"><div className="site-content-wrap"><h2 id="related-heading">Keep exploring</h2><div className="site-content-related-grid">{page.related.map(href => { const related = MARKETING_PAGES[href]; return related ? <a href={href} key={href}><span>{related.eyebrow}</span><h3>{related.heading}</h3><ArrowUpRight size={18} aria-hidden="true" /></a> : null; })}</div></div></section>
      <section className="site-content-cta" aria-labelledby="try-heading"><div className="site-content-wrap"><div><h2 id="try-heading">Try it with your store.</h2><p>Seven days of Business access. No card required.</p></div><a className="saas-button saas-button-white" href="/get-started">Start your free trial<ArrowRight size={17} /></a></div></section>
    </main><SiteFooter />
  </div>;
}
