import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const pos = new URL('../../zameria_web/', import.meta.url);
const result = spawnSync('npm', ['run', 'build:product-preview'], { cwd: fileURLToPath(pos), stdio: 'inherit' });
process.exitCode = result.status ?? 1;
