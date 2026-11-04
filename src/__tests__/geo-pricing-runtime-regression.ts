/** Exercise compiled production ESM in plain Node: no Vite, tsx or network. */
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const root = process.cwd();
const directory = mkdtempSync(path.join(tmpdir(), 'zameria-pricing-runtime-'));
try {
  writeFileSync(path.join(directory, 'package.json'), '{"type":"module"}');
  symlinkSync(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
  for (const file of ['api/pricing.ts', 'api/account/[...path].ts', 'api/webhook/paystack.ts', 'server/accountSession.ts', 'server/signupLead.ts', 'src/lib/geoPricing.ts', 'src/services/geoPricingService.ts']) {
    const output = path.join(directory, file.replace(/\.ts$/, '.js'));
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, ts.transpileModule(readFileSync(path.join(root, file), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText);
  }
  const runner = path.join(directory, 'cases.mjs');
  writeFileSync(runner, readFileSync(path.join(root, 'src/__tests__/helpers/geo-runtime-cases.mjs')));
  const result = spawnSync(process.execPath, [runner], { cwd: directory, encoding: 'utf8', timeout: 20000 });
  assert.equal(result.status, 0, result.stdout + result.stderr + (result.error?.message || ''));
  console.log(result.stdout.trim());
} finally {
  rmSync(directory, { recursive: true, force: true });
}
