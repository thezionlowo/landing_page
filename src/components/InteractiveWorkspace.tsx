import { useEffect, useRef, useState } from 'react';

/** Instant product image while the real, isolated demo becomes interactive. */
export function InteractiveWorkspace() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const receive = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== 'zameria-product-ready') return;
      const doc = frame.current?.contentDocument;
      if (!doc) return;
      await doc.fonts.ready;
      await Promise.all([...doc.images].map(image => image.decode().catch(() => {})));
      if (active) setReady(true);
    };
    window.addEventListener('message', receive);
    return () => { active = false; window.removeEventListener('message', receive); };
  }, []);
  return <div id="product" className="saas-pos-demo">
    {!ready && <img className="saas-workspace-poster" src="/product-shots/workspace.png" width="1440" height="900" fetchPriority="high" alt="ZAMERIA point of sale with the sample store" />}
    <iframe ref={frame} style={{ opacity: ready ? 1 : 0 }} src="/product-preview/preview.html" title="Try ZAMERIA POS with a skincare demo store" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups" allow="camera" />
  </div>;
}
