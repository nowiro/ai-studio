#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Render every docs/bpmn/*.bpmn into docs/bpmn/<name>.svg using bpmn-to-image.
 *
 * Usage:
 *   node tools/scripts/bpmn-render.mjs
 *
 * Exit codes:
 *   0 — all SVGs rendered successfully
 *   1 — at least one file failed (CI fails)
 *
 * Dependencies (devDependencies in package.json):
 *   bpmn-to-image (^0.10.0 or later)
 */
import { execFile } from 'node:child_process';
import { mkdir, readdir } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const bpmnDir = join(repoRoot, 'docs', 'bpmn');

async function main() {
  await mkdir(bpmnDir, { recursive: true });
  const entries = await readdir(bpmnDir);
  const bpmnFiles = entries.filter((f) => extname(f) === '.bpmn');

  if (bpmnFiles.length === 0) {
    console.log('[bpmn:render] No .bpmn files found in docs/bpmn/.');
    return;
  }

  console.log(`[bpmn:render] Rendering ${bpmnFiles.length} BPMN file(s)...`);

  let failed = 0;
  for (const file of bpmnFiles) {
    const input = join(bpmnDir, file);
    const output = join(bpmnDir, basename(file, '.bpmn') + '.svg');
    try {
      // bpmn-to-image CLI: <input>:<output> tuples
      await execFileAsync('npx', ['-y', 'bpmn-to-image', `${input}:${output}`], {
        cwd: repoRoot,
        timeout: 60_000,
      });
      console.log(`  OK ${file} -> ${basename(output)}`);
    } catch (err) {
      failed += 1;
      console.error(`  FAIL ${file}: ${err.message ?? err}`);
    }
  }

  if (failed > 0) {
    console.error(`[bpmn:render] ${failed} file(s) failed.`);
    process.exit(1);
  }
  console.log('[bpmn:render] All BPMN files rendered.');
}

main().catch((err) => {
  console.error('[bpmn:render] fatal:', err);
  process.exit(1);
});
