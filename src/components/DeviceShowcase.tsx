import { ArrowUpRight, Laptop, Monitor, Smartphone, Tablet } from 'lucide-react';

/** Each device shows a different real POS screen at its native responsive size. */
export function DeviceShowcase() {
  return <section id="any-screen" className="saas-section saas-any-screen" aria-labelledby="any-screen-title">
    <div className="saas-container">
      <div className="saas-section-heading saas-any-screen-heading">
        <div><span className="saas-eyebrow">YOUR STORE GOES WITH YOU</span><h2 id="any-screen-title">Your whole store.<br /><span>Anywhere you are.</span></h2></div>
        <div className="saas-any-screen-copy"><p>Check sales from home. Look up stock on the go. Your POS, products, orders and customers are all in your browser.</p><a className="saas-link" href="/hardware-compatibility">Find your setup <ArrowUpRight size={15} /></a></div>
      </div>
      <div className="saas-device-stage" role="group" aria-label="ZAMERIA analytics, orders, products and customers across four devices">
        <figure className="saas-device saas-device-desktop"><img src="/product-shots/desktop.png" width="1156" height="830" loading="lazy" decoding="async" alt="ZAMERIA sales analytics embedded in a desktop monitor" /><figcaption className="site-visually-hidden">Desktop: analytics</figcaption></figure>
        <figure className="saas-device saas-device-laptop"><img src="/product-shots/laptop.png" width="1116" height="745" loading="lazy" decoding="async" alt="ZAMERIA order history embedded in a laptop" /><figcaption className="site-visually-hidden">Laptop: orders</figcaption></figure>
        <figure className="saas-device saas-device-ipad"><img src="/product-shots/tablet.png" width="956" height="738" loading="lazy" decoding="async" alt="ZAMERIA product catalogue embedded in a tablet" /><figcaption className="site-visually-hidden">Tablet: products</figcaption></figure>
        <figure className="saas-device saas-device-phone"><img src="/product-shots/phone.png" width="466" height="922" loading="lazy" decoding="async" alt="ZAMERIA customer directory embedded in a phone" /><figcaption className="site-visually-hidden">Mobile: customers</figcaption></figure>
      </div>
      <ul className="saas-device-labels" aria-label="Access ZAMERIA on your devices"><li><Smartphone size={17} />Mobile</li><li><Tablet size={19} />iPad</li><li><Laptop size={20} />Laptop</li><li><Monitor size={19} />Desktop</li></ul>
      <p className="saas-device-note">One connected store. Open it on the screen that suits your day.</p>
    </div>
  </section>;
}
