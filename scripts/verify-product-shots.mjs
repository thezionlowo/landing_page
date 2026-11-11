import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../public/', import.meta.url);
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const receipt = JSON.parse(readFileSync(new URL('product-shots/receipt.json', root), 'utf8'));
if (receipt.previewReceiptSha256 !== hash(new URL('product-preview/source-receipt.json', root))) throw new Error('Product shots are stale. Run npm run refresh:product-shots.');
if (Object.keys(receipt.assets).length !== 5 || new Set(Object.values(receipt.assets).map(asset => asset.screen)).size !== 5) throw new Error('Expected five distinct POS screens.');
for (const asset of Object.values(receipt.assets)) {
  if (asset.sha256 !== hash(new URL(`product-shots/${asset.file}`, root))) throw new Error(`Product shot changed: ${asset.file}`);
}
console.log('Verified five combined product images from the current isolated POS preview.');
