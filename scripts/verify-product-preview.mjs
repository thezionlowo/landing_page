import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const preview = new URL('../public/product-preview/', import.meta.url);
const pos = new URL('../../zameria_web/', import.meta.url);
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
try {
  const receipt = JSON.parse(readFileSync(new URL('source-receipt.json', preview), 'utf8'));
  if (!receipt.sources?.['package-lock.json']) throw new Error('Preview receipt must include the POS dependency lockfile.');
  if (!receipt.interactive || !receipt.sampleData || receipt.theme !== 'original-pos') throw new Error('Expected an interactive sample store using the original POS theme.');
  for (const [name, checksum] of Object.entries(receipt.assets)) {
    if (hash(new URL(name, preview)) !== checksum) throw new Error(`Preview asset changed: ${name}`);
  }
  if (existsSync(new URL('src/productPreview.tsx', pos))) {
    for (const [name, checksum] of Object.entries(receipt.sources)) {
      if (hash(new URL(name, pos)) !== checksum) throw new Error(`POS source changed: ${name}`);
    }
  }
  console.log('Verified preview is built from current POS screens with the original POS theme.');
} catch (error) {
  console.error('Product preview missing or stale. Run npm run refresh:product-preview.', error.message);
  process.exitCode = 1;
}
