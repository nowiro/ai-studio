#!/usr/bin/env node
/**
 * check-trinity.mjs — verify the "trinity baseline" is byte-identical across
 * `ai-studio`, `ai-mcp-alm`, and `ai-mcp-devtools`.
 *
 * The canonical source is `ai-studio` (this repo). The script:
 *   1. Hashes each baseline file in this repo.
 *   2. Looks for sibling repos at `../ai-mcp-alm` and `../ai-mcp-devtools`.
 *   3. For each found sibling, hashes the same files and compares.
 *   4. Exits 0 if all hashes match (or siblings absent — no false fails on solo dev),
 *      1 if any sibling has drift.
 *
 * Run from any of the three repos. The other two are detected as `../<sibling>`.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();

// Files that MUST be identical across the trinity.
const BASELINE = [
  '.ai/rules/core.md',
  '.ai/rules/principles.md',
  '.ai/rules/security.md',
  '.ai/agents/orchestrator.md',
  '.ai/workflows/spec-driven.md',
  'docs/ai-workflow/plans/_template.md',
];

// Sibling repo names — the trinity, minus self.
const SIBLINGS = ['ai-studio', 'ai-mcp-alm', 'ai-mcp-devtools'];

async function hash(filePath) {
  if (!existsSync(filePath)) return null;
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

function selfRepoName() {
  // Best-effort: take the last segment of the cwd as the repo name.
  return ROOT.split(/[/\\]/).filter(Boolean).pop();
}

async function main() {
  const self = selfRepoName();
  const parent = dirname(ROOT);

  // Build the canonical hash table from this repo.
  const canonical = {};
  for (const rel of BASELINE) {
    const h = await hash(resolve(ROOT, rel));
    if (h === null) {
      console.error(`✗ ${self}: missing baseline file ${rel}`);
      process.exit(1);
    }
    canonical[rel] = h;
  }

  // Compare against siblings present on disk.
  let drift = false;
  let siblingsChecked = 0;
  for (const sibling of SIBLINGS) {
    if (sibling === self) continue;
    const siblingRoot = resolve(parent, sibling);
    if (!existsSync(siblingRoot)) continue;
    siblingsChecked += 1;
    for (const rel of BASELINE) {
      const h = await hash(resolve(siblingRoot, rel));
      if (h === null) {
        console.error(`✗ ${sibling}: missing ${rel}`);
        drift = true;
        continue;
      }
      if (h !== canonical[rel]) {
        console.error(`✗ ${sibling}: ${rel} drifted from ${self}`);
        drift = true;
      }
    }
  }

  if (drift) {
    console.error('\nTrinity baseline has drift. Sync the offending files from the canonical (ai-studio).');
    process.exit(1);
  }

  if (siblingsChecked === 0) {
    console.log(`✓ ${self}: baseline OK (no siblings checked — clone ai-mcp-alm and ai-mcp-devtools next to this repo to verify trinity sync).`);
  } else {
    console.log(`✓ trinity in sync (${self} + ${siblingsChecked} sibling${siblingsChecked > 1 ? 's' : ''}, ${BASELINE.length} baseline files).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
