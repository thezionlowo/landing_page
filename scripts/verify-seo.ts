import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

const PUBLIC_ROUTES = [
  '/',
  '/woocommerce-pos',
  '/woocommerce-inventory-sync',
  '/woocommerce-pos-nigeria',
  '/industries/fashion',
  '/industries/beauty',
  '/industries/electronics',
  '/industries/supermarkets',
  '/industries/pharmacies',
  '/industries/jewelry',
  '/hardware-compatibility',
  '/woocommerce-pos-vs-traditional-pos',
  '/solutions/prevent-overselling',
  '/solutions/stock-mismatch',
  '/solutions/offline-pos',
  '/alternatives/foosales',
  '/alternatives/oliver-pos',
  '/comparisons/foosales-vs-oliver-pos',
  '/best-woocommerce-pos',
  '/solutions/multi-store-inventory-sync',
  '/features/split-payments',
  '/nigeria/lagos-retail-pos',
  '/industries/clothing-boutique-pos',
  '/industries/electronics-pos',
  '/solutions/stop-overselling-rush-hours',
  '/get-started',
  '/login',
];


interface AuditResult {
  route: string;
  fileSize: number;
  title: string;
  hasDescription: boolean;
  canonical: string;
  robots: string;
  h1: string;
  hasBreadcrumbs: boolean;
  schemaTypes: string[];
  passed: boolean;
  errors: string[];
}

async function runRegressionAudit() {
  console.log('===============================================================');
  console.log('          ZAMERIA TECHNICAL SEO REGRESSION AUDIT               ');
  console.log('===============================================================\n');

  const titlesSet = new Set<string>();
  const canonicalsSet = new Set<string>();
  const h1Set = new Set<string>();

  const results: AuditResult[] = [];
  let totalErrors = 0;

  for (const route of PUBLIC_ROUTES) {
    const filePath =
      route === '/'
        ? path.resolve(distDir, 'index.html')
        : path.resolve(distDir, route.slice(1), 'index.html');

    const errors: string[] = [];

    if (!fs.existsSync(filePath)) {
      errors.push(`File missing: ${filePath}`);
      results.push({
        route,
        fileSize: 0,
        title: '',
        hasDescription: false,
        canonical: '',
        robots: '',
        h1: '',
        hasBreadcrumbs: false,
        schemaTypes: [],
        passed: false,
        errors,
      });
      totalErrors++;
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const fileSize = Buffer.byteLength(html, 'utf8');

    // 1. Meaningful HTML check (unrendered SPA shell is ~3-4 KB, pre-rendered pages are > 10 KB)
    if (fileSize < 10000) {
      errors.push(`File size too small (${fileSize} bytes). Pre-rendering may have failed.`);
    }

    // 2. Title check
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';
    if (!title) {
      errors.push('Missing <title> tag');
    } else if (titlesSet.has(title)) {
      errors.push(`Duplicate <title>: "${title}"`);
    } else {
      titlesSet.add(title);
    }

    // 3. Meta description check
    const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/);
    const hasDescription = Boolean(descMatch && descMatch[1].length > 30);
    if (!hasDescription) {
      errors.push('Missing or too short <meta name="description">');
    }

    // 4. Canonical check
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="(.*?)"\s*\/?>/);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';
    const expectedCanonical = `https://www.zameria.co${route === '/' ? '/' : route}`;
    if (canonical !== expectedCanonical) {
      errors.push(`Canonical mismatch! Expected: ${expectedCanonical}, Found: ${canonical}`);
    } else if (canonicalsSet.has(canonical)) {
      errors.push(`Duplicate canonical URL: ${canonical}`);
    } else {
      canonicalsSet.add(canonical);
    }

    // 5. Robots check (no unintended noindex)
    const robotsMatch = html.match(/<meta\s+name="robots"\s+content="(.*?)"\s*\/?>/);
    const robots = robotsMatch ? robotsMatch[1] : '';
    if (robots.includes('noindex')) {
      errors.push(`Accidental noindex on public page: ${robots}`);
    }

    // 6. H1 check
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g);
    let h1Text = '';
    if (!h1Matches || h1Matches.length === 0) {
      errors.push('Missing <h1> element');
    } else {
      h1Text = h1Matches[0].replace(/<[^>]+>/g, '').trim();
      if (h1Matches.length > 1) {
        errors.push(`Multiple <h1> elements found (${h1Matches.length})`);
      }
      if (h1Set.has(h1Text)) {
        errors.push(`Duplicate <h1>: "${h1Text}"`);
      } else {
        h1Set.add(h1Text);
      }
    }

    // 7. Schema JSON-LD check
    const schemaMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
    let hasBreadcrumbs = false;
    const schemaTypes: string[] = [];
    if (!schemaMatch) {
      errors.push('Missing JSON-LD structured data');
    } else {
      try {
        const parsed = JSON.parse(schemaMatch[1]);
        const graph = parsed['@graph'] || [parsed];
        for (const node of graph) {
          if (node['@type']) {
            schemaTypes.push(node['@type']);
          }
          if (node['@type'] === 'BreadcrumbList') {
            hasBreadcrumbs = true;
          }
        }
      } catch (e) {
        errors.push('Invalid JSON-LD schema syntax');
      }
    }

    if (route !== '/' && !hasBreadcrumbs) {
      errors.push('Missing BreadcrumbList schema on subpage');
    }

    const passed = errors.length === 0;
    if (!passed) totalErrors += errors.length;

    results.push({
      route,
      fileSize,
      title,
      hasDescription,
      canonical,
      robots,
      h1: h1Text,
      hasBreadcrumbs,
      schemaTypes,
      passed,
      errors,
    });
  }

  // Print results table
  console.log('| Route | Size | Canonical Verified | H1 Found | Schema Types | Status |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- |');
  for (const r of results) {
    const status = r.passed ? '✅ PASS' : `❌ FAIL (${r.errors.join('; ')})`;
    const sizeKb = `${(r.fileSize / 1024).toFixed(1)} KB`;
    console.log(`| ${r.route} | ${sizeKb} | ${r.canonical.replace('https://www.zameria.co', '') || '/'} | ${r.h1.slice(0, 30)}... | ${r.schemaTypes.join(', ')} | ${status} |`);
  }

  // Check Sitemap & Robots.txt
  console.log('\n--- SITEMAP & ROBOTS.TXT VERIFICATION ---');
  const sitemapPath = path.resolve(distDir, 'sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const nonWwwCount = (sitemapContent.match(/https:\/\/zameria\.co\//g) || []).length;
  const wwwCount = (sitemapContent.match(/https:\/\/www\.zameria\.co\//g) || []).length;
  console.log(`Sitemap URLs with preferred www: ${wwwCount}`);
  console.log(`Sitemap URLs with deprecated non-www: ${nonWwwCount}`);
  if (nonWwwCount > 0) {
    console.error('❌ Sitemap contains non-www URLs!');
    totalErrors++;
  } else {
    console.log('✅ Sitemap strictly uses preferred https://www.zameria.co domain');
  }

  const robotsPath = path.resolve(distDir, 'robots.txt');
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes('Sitemap: https://www.zameria.co/sitemap.xml')) {
    console.log('✅ robots.txt points to canonical https://www.zameria.co/sitemap.xml');
  } else {
    console.error('❌ robots.txt missing correct sitemap directive!');
    totalErrors++;
  }

  // Check Category Images
  console.log('\n--- CATEGORY WEBP IMAGES AUDIT ---');
  const categoriesDir = path.resolve(distDir, 'categories');
  const categoryFiles = fs.readdirSync(categoriesDir);
  const webpFiles = categoryFiles.filter((f) => f.endsWith('.webp'));
  let totalWebpSize = 0;
  for (const file of webpFiles) {
    const size = fs.statSync(path.resolve(categoriesDir, file)).size;
    totalWebpSize += size;
    console.log(`  - ${file}: ${(size / 1024).toFixed(1)} KB`);
  }
  console.log(`Total WebP Category Images payload: ${(totalWebpSize / 1024).toFixed(1)} KB (was 4,500 KB)`);

  console.log('\n===============================================================');
  if (totalErrors === 0) {
    console.log('🏆 ALL TECHNICAL SEO FOUNDATION CHECKS PASSED WITH 0 ERRORS!');
  } else {
    console.error(`💥 AUDIT FAILED WITH ${totalErrors} ERRORS!`);
    process.exit(1);
  }
  console.log('===============================================================\n');
}

runRegressionAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
