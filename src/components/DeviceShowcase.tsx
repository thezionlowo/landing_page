import { DeviceScreen } from './DeviceScreen';
import { ArrowUpRight, Laptop, Monitor, Smartphone, Tablet } from 'lucide-react';

/** Each device shows a different real POS screen at its native responsive size. */
export function DeviceShowcase() {
  return <section id="any-screen" className="saas-section saas-any-screen" aria-labelledby="any-screen-title">
    <div className="saas-container">
      <div className="saas-section-heading saas-any-screen-heading">
        <div><span className="saas-eyebrow">YOUR STORE GOES WITH YOU</span><h2 id="any-screen-title">Your whole store.<br /><span>Anywhere you are.</span></h2></div>
        <div className="saas-any-screen-copy"><p>Check sales from home. Look up stock on the go. Your POS, products, orders and customers are all in your browser.</p><a className="saas-link" href="/hardware-compatibility">Find your setup <ArrowUpRight size={15} /></a></div>
      </div>
      <div className="saas-device-stage" role="group" aria-label="The actual ZAMERIA POS on desktop, laptop, iPad and mobile">
        <figure className="saas-device saas-device-desktop">
          <div className="saas-device-bezel"><DeviceScreen screen="dashboard" width={1440} height={900} label="ZAMERIA sales dashboard on desktop" /></div>
          <div className="saas-monitor-chin" aria-hidden="true"><img src="/zameria-icon.png" width="18" height="18" alt="" /></div><div className="saas-monitor-stand" aria-hidden="true" />
          <figcaption className="site-visually-hidden">Desktop: sales dashboard</figcaption>
        </figure>
        <figure className="saas-device saas-device-laptop">
          <div className="saas-device-bezel"><DeviceScreen screen="sale" width={1440} height={900} label="ZAMERIA checkout on laptop" /></div>
          <div className="saas-laptop-base" aria-hidden="true"><span /></div><figcaption className="site-visually-hidden">Laptop: checkout</figcaption>
        </figure>
        <figure className="saas-device saas-device-ipad">
          <div className="saas-device-bezel"><DeviceScreen screen="products" width={1024} height={768} label="ZAMERIA product catalogue on iPad in landscape" /></div><figcaption className="site-visually-hidden">iPad in landscape: products</figcaption>
        </figure>
        <figure className="saas-device saas-device-phone">
          <div className="saas-device-bezel"><DeviceScreen screen="orders" width={390} height={844} label="ZAMERIA orders on mobile" /></div><figcaption className="site-visually-hidden">Mobile: orders</figcaption>
        </figure>
      </div>
      <ul className="saas-device-labels" aria-label="Access ZAMERIA on your devices"><li><Smartphone size={17} />Mobile</li><li><Tablet size={19} />iPad</li><li><Laptop size={20} />Laptop</li><li><Monitor size={19} />Desktop</li></ul>
      <p className="saas-device-note">One connected store. Open it on the screen that suits your day.</p>
    </div>
  </section>;
}
