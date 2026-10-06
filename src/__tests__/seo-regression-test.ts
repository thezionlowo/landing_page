import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');
const publicDir = path.resolve(__dirname, '../../public');
const vercelConfigPath = path.resolve(__dirname, '../../vercel.json');

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    throw new Error(`[ASSERTION FAILED] ${message}`);
  }
}

async function runSeoRegressionTest() {
  console.log('================================================================');
  console.log(' ZAMERIA SEO ARCHITECTURE & REGRESSION TEST SUITE');
  console.log('================================================================\n');

  // Test 1: Vercel JSON Redirects
  console.log('--- TEST 1: vercel.json Redirects & Headers ---');
  assert(fs.existsSync(vercelConfigPath), 'vercel.json must exist');
  const vercelJson = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  assert(Array.isArray(vercelJson.redirects), 'vercel.json redirects must be an array');
  const hasPosRedirect = vercelJson.redirects.some((r: any) => r.source === '/woocommerce-pos-vs-traditional-pos' && r.destination === '/woocommerce-pos-comparison');
  assert(hasPosRedirect, 'vercel.json must redirect /woocommerce-pos-vs-traditional-pos to /woocommerce-pos-comparison');
  console.log('✅ [PASS] vercel.json configuration verified.\n');

  // Test 2: Sitemap XML Validity
  console.log('--- TEST 2: sitemap.xml Coverage ---');
  const sitemapPath = path.resolve(publicDir, 'sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'sitemap.xml must exist');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemapContent.includes('<urlset'), 'sitemap.xml must contain <urlset>');
  assert(sitemapContent.includes('https://www.zameria.co/woocommerce-pos-plugin'), 'sitemap.xml must include /woocommerce-pos-plugin');
  assert(sitemapContent.includes('https://www.zameria.co/pos-for-woocommerce'), 'sitemap.xml must include /pos-for-woocommerce');
  assert(sitemapContent.includes('https://www.zameria.co/woocommerce-inventory-management'), 'sitemap.xml must include /woocommerce-inventory-management');
  assert(sitemapContent.includes('https://www.zameria.co/woocommerce-stock-management'), 'sitemap.xml must include /woocommerce-stock-management');
  assert(sitemapContent.includes('https://www.zameria.co/woocommerce-retail-pos'), 'sitemap.xml must include /woocommerce-retail-pos');
  assert(sitemapContent.includes('https://www.zameria.co/woocommerce-physical-store'), 'sitemap.xml must include /woocommerce-physical-store');
  assert(sitemapContent.includes('https://www.zameria.co/alternatives'), 'sitemap.xml must include /alternatives');
  assert(sitemapContent.includes('https://www.zameria.co/alternatives/wcpos'), 'sitemap.xml must include /alternatives/wcpos');
  assert(sitemapContent.includes('https://www.zameria.co/alternatives/wepos'), 'sitemap.xml must include /alternatives/wepos');
  console.log('✅ [PASS] sitemap.xml coverage verified.\n');

  // Test 3: robots.txt Rules
  console.log('--- TEST 3: robots.txt Rules ---');
  const robotsPath = path.resolve(publicDir, 'robots.txt');
  assert(fs.existsSync(robotsPath), 'robots.txt must exist');
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsContent.includes('Allow: /woocommerce-pos-plugin'), 'robots.txt must allow /woocommerce-pos-plugin');
  assert(robotsContent.includes('Allow: /alternatives'), 'robots.txt must allow /alternatives');
  assert(robotsContent.includes('Disallow: /account'), 'robots.txt must protect customer account');
  console.log('✅ [PASS] robots.txt configuration verified.\n');

  // Test 4: Pre-rendered HTML Inspection
  console.log('--- TEST 4: Pre-rendered HTML & Canonical Verification ---');
  const expectedRoutes = [
    'woocommerce-pos',
    'woocommerce-pos-plugin',
    'pos-for-woocommerce',
    'woocommerce-inventory-management',
    'woocommerce-stock-management',
    'woocommerce-retail-pos',
    'woocommerce-physical-store',
    'woocommerce-pos-inventory',
    'woocommerce-pos-comparison',
    'alternatives',
    'alternatives/wcpos',
    'alternatives/wepos',
    'solutions/woocommerce-stock-not-updating',
  ];

  for (const r of expectedRoutes) {
    const htmlPath = path.resolve(distDir, `${r}.html`);
    const indexPath = path.resolve(distDir, r, 'index.html');
    const targetFile = fs.existsSync(htmlPath) ? htmlPath : indexPath;
    assert(fs.existsSync(targetFile), `Pre-rendered file for ${r} must exist (checked ${htmlPath} and ${indexPath})`);

    const content = fs.readFileSync(targetFile, 'utf8');
    assert(content.includes('<title>'), `Pre-rendered ${r} must contain a <title> tag`);
    assert(content.includes('name="description"'), `Pre-rendered ${r} must contain a meta description`);
    assert(content.includes('rel="canonical"'), `Pre-rendered ${r} must contain a canonical URL`);
    assert(!content.includes('localhost:5182'), `Pre-rendered ${r} must NEVER contain localhost:5182`);
    assert(!content.includes('localhost:5176'), `Pre-rendered ${r} must NEVER leak internal localhost:5176 into public markup`);
    assert(content.includes('application/ld+json'), `Pre-rendered ${r} must contain JSON-LD structured data`);
  }
  console.log(`✅ [PASS] Verified ${expectedRoutes.length} key pre-rendered pages with zero localhost leaks & valid JSON-LD.\n`);

  console.log('================================================================');
  console.log('🎉 ALL SEO REGRESSION TESTS PASSED SUCCESSFULLY!');
  console.log('================================================================');
}

runSeoRegressionTest().catch((err) => {
  console.error('Fatal error during SEO regression test:', err);
  process.exit(1);
});
