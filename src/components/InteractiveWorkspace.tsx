/** The real POS app, with its own navigation and a local skincare demo store. */
export function InteractiveWorkspace() {
  return <div id="product" className="saas-pos-demo">
    <iframe src="/product-preview/preview.html" title="Try ZAMERIA POS with a skincare demo store" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups" allow="camera" />
  </div>;
}
