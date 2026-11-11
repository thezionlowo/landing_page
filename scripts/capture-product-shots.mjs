// Capture the real, isolated POS demo. The app, branding and device frame are
// baked into each PNG so the public mockup never loads an app inside a bezel.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const output = path.join(root, 'product-shots');
const shots = [
  { name: 'desktop', screen: 'dashboard', width: 1440, height: 900, display: 1080 },
  { name: 'laptop', screen: 'orders', width: 1440, height: 900, display: 1040 },
  { name: 'tablet', screen: 'products', width: 1024, height: 768, display: 880 },
  { name: 'phone', screen: 'customers', width: 390, height: 844, display: 390 },
  { name: 'workspace', screen: 'sale', width: 1440, height: 900, display: 1440 },
];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + decodeURIComponent(pathname));
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end();
  try { response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(await readFile(file)); }
  catch { response.writeHead(404).end(); }
});
await mkdir(output, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const assets = {};
try {
  for (const shot of shots) {
    console.log(`Preparing ${shot.name}: ${shot.screen}`);
    const context = await browser.newContext({ viewport: { width: shot.display + 100, height: 1100 }, deviceScaleFactor: 1 });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    await page.goto(`${origin}/product-preview/preview.html?screen=${shot.screen}&showcase=1`);
    // Keep a same-origin document as the capture host; its iframe is the demo.
    const scaledHeight = shot.height * shot.display / shot.width;
    await page.setContent(`<style>
      *{box-sizing:border-box}html,body{margin:0;background:transparent}body{width:max-content}
      .capture{padding:${shot.name === 'workspace' ? 0 : 28}px;width:max-content}
      figure{margin:0;width:${shot.display + (shot.name === 'workspace' ? 0 : 20)}px;filter:${shot.name === 'workspace' ? 'none' : 'drop-shadow(0 12px 12px #11244326)'}}
      .bezel{padding:10px;background:#111a29;border:1px solid #566175;border-radius:12px 12px 0 0;box-shadow:inset 0 0 0 1px #ffffff1a}
      .screen{width:${shot.display}px;height:${scaledHeight}px;overflow:hidden;background:#f8fafc;position:relative}
      iframe{width:${shot.width}px;height:${shot.height}px;transform:scale(${shot.display / shot.width});transform-origin:top left;border:0;display:block}
      .chin{height:28px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#d4dae2,#c2cad6);border-radius:0 0 10px 10px;border:1px solid #a8b4c4}.chin img{width:16px;height:16px}
      .stand{width:25%;height:49px;margin:auto;background:linear-gradient(90deg,#a5b1c2,#e5eaf0 48%,#bac5d3);clip-path:polygon(31% 0,69% 0,78% 88%,100% 93%,100% 100%,0 100%,0 93%,22% 88%)}
      .base{width:106%;margin-left:-3%;height:17px;border-radius:1px 1px 50% 50%;background:linear-gradient(#dce2eb 5%,#b3becd 55%,#7e8c9f);border:1px solid #a9b5c5}
      .tablet .bezel{border-radius:22px;padding:10px}.tablet .screen{border-radius:12px}
      .phone .bezel{border-radius:34px;padding:10px}.phone .screen{border-radius:24px}
      .workspace .bezel{padding:0;border:0;border-radius:0}.workspace .screen{border-radius:0}
    </style><div class="capture"><figure class="${shot.name}"><div class="bezel"><div class="screen"><iframe src="${origin}/product-preview/preview.html?screen=${shot.screen}&showcase=1"></iframe></div></div>${shot.name === 'desktop' ? `<div class="chin"><img src="${origin}/zameria-icon.png" /></div><div class="stand"></div>` : shot.name === 'laptop' ? '<div class="base"></div>' : ''}</figure></div>`);
    await page.waitForFunction(() => !!document.querySelector('iframe')?.contentDocument?.querySelector('main'), { timeout: 30000 });
    const frame = page.frames().find(frame => frame.parentFrame());
    await frame.locator('main').waitFor();
    await frame.evaluate(async () => {
      await document.fonts.ready;
      // Offscreen lazy product images do not begin loading until scrolled into view.
      // Waiting on their decode promises can stall an otherwise complete mockup.
      const visibleImages = [...document.images].filter(image => {
        const bounds = image.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
      });
      await Promise.all(visibleImages.map(image => image.decode().catch(() => {})));
    });
    await page.waitForTimeout(1000);
    if (shot.screen === 'orders') {
      await frame.getByText('#1003', { exact: true }).click();
      await frame.locator('[data-sonner-toast]').waitFor({ state: 'hidden', timeout: 15000 });
    }
    if (shot.screen === 'customers') await frame.getByText('0 customers with purchases', { exact: true }).waitFor({ state: 'hidden' });
    const text = await frame.locator('main').innerText();
    if (text.length < 80 || /demo could not load|loading your/i.test(text)) throw new Error(`Incomplete ${shot.screen} demo`);
    const capture = page.locator('.capture');
    const bounds = await capture.boundingBox();
    const buffer = await capture.screenshot({ type: 'png', omitBackground: true, animations: 'disabled' });
    const file = `${shot.name}.png`;
    await writeFile(path.join(output, file), buffer);
    assets[shot.name] = { file, screen: shot.screen, width: Math.ceil(bounds.width), height: Math.ceil(bounds.height), bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') };
    console.log(`Captured ${shot.name}: ${shot.screen}, ${Math.round(buffer.length / 1024)} KB`);
    await context.close();
  }
  const receipt = { capturedAt: new Date().toISOString(), source: 'real isolated POS demo; no production requests', previewReceiptSha256: createHash('sha256').update(await readFile(path.join(root, 'product-preview/source-receipt.json'))).digest('hex'), assets };
  await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
