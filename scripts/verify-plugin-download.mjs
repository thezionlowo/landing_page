import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const downloads = new URL('../public/downloads/', import.meta.url);
try {
  const receipt = JSON.parse(readFileSync(new URL('release.json', downloads), 'utf8'));
  const zip = readFileSync(new URL('zameria.zip', downloads));
  if (createHash('sha256').update(zip).digest('hex') !== receipt.zipSha256) throw new Error('Release checksum mismatch');
  console.log('Verified downloadable plugin release.');
} catch (error) {
  console.error('Plugin download missing or invalid. Run npm run release from the ecosystem root before building the website.', error.message);
  process.exitCode = 1;
}
