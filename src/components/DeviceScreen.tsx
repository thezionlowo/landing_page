import { useEffect, useRef, useState } from 'react';

export type ProductScreen = 'dashboard' | 'sale' | 'products' | 'orders';

/** Display the real responsive app at the device's native viewport, only when in view. */
export function DeviceScreen({ screen, width, height, label }: { screen: ProductScreen; width: number; height: number; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'zameria-product-ready' && event.data.screen === screen) setReady(true);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [screen]);
  useEffect(() => {
    const element = host.current!;
    const resize = () => setScale(element.clientWidth / width);
    resize();
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(element);
    const visibilityObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); visibilityObserver.disconnect(); }
    }, { rootMargin: '100px' });
    visibilityObserver.observe(element);
    return () => { sizeObserver.disconnect(); visibilityObserver.disconnect(); };
  }, [width]);
  return <div ref={host} className="saas-device-screen" style={{ aspectRatio: `${width}/${height}` }} inert aria-hidden="true">
    <span className="saas-device-loading"><img src="/zameria-icon.png" width="26" height="26" alt="" /></span>
    {visible && scale > 0 && <iframe ref={frame} src={`/product-preview/preview.html?screen=${screen}&showcase=1`} title={label} width={width} height={height} tabIndex={-1} sandbox="allow-scripts allow-same-origin" style={{ opacity: ready ? 1 : 0, transform: `scale(${scale})`, width, height }} />}
  </div>;
}
