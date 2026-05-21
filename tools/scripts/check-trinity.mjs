#!/usr/bin/env node

/**
 * check-trinity.mjs — verify the "trinity baseline" is byte-identical across
 * `ai-studio`, `ai-mcp-alm`, `ai-mcp-devtools`, and `ai-workspace`.
 *
 * The canonical source is `ai-studio`. The script:
 *   1. Hashes each baseline file in this repo.
 *   2. Looks for sibling repos at `../<name>`.
 *   3. For each found sibling, hashes the same files and compares.
 *   4. Exits 0 if all hashes match (or siblings absent — no false fails on solo dev),
 *      1 if any sibling has drift.
 *
 * Run from any of the four repos. The other three are detected as `../<sibling>`.
 *
 * NOTE: ai-workspace is a meta-repo AND trinity member. Its `.ai/rules/docs.md`
 * documents the role; `.claude/agents/` is exempt (meta-repo, no active runs).
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();

// Files that MUST be identical across the trinity.
const BASELINE = [
  '.ai/rules/core.md',
  '.ai/rules/principles.md',
  '.ai/rules/security.md',
  '.ai/rules/production-readiness.md',
  '.ai/rules/language.md',
  '.ai/rules/llm-optimization.md',
  '.ai/agents/orchestrator.md',
  '.ai/workflows/spec-driven.md',
  '.ai/architecture.md',
  'docs/ai-workflow/plans/_template.md',
  'tools/scripts/bootstrap.mjs',
];

// Directories where every entry in `.ai/<dir>/` must also exist (same filename) in `.claude/<dir>/`.
// ai-workspace is exempt — no .claude/ mirror (meta-repo, conventions only).
const CLAUDE_MIRROR_DIRS = ['agents'];

// Sibling repo names — the trinity (now 4 with ai-workspace), minus self.
const SIBLINGS = ['ai-studio', 'ai-mcp-alm', 'ai-mcp-devtools', 'ai-workspace'];

async function hash(filePath) {
  if (!existsSync(filePath)) return null;
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

function selfRepoName() {
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

  // Verify .ai/<dir>/*.md ≡ .claude/<dir>/*.md parity inside THIS repo.
  // ai-workspace is exempt — meta-repo, no .claude/ mirror.
  let mirrorDrift = false;
  if (self !== 'ai-workspace') {
    for (const dir of CLAUDE_MIRROR_DIRS) {
      const aiDir = resolve(ROOT, '.ai', dir);
      const claudeDir = resolve(ROOT, '.claude', dir);
      if (!existsSync(aiDir)) continue;
      const aiNames = (await readdir(aiDir)).filter((f) => f.endsWith('.md')).sort();
      if (!existsSync(claudeDir)) {
        console.error(`✗ ${self}: .claude/${dir}/ missing — expected mirror of .ai/${dir}/`);
        mirrorDrift = true;
        continue;
      }
      const claudeNames = (await readdir(claudeDir)).filter((f) => f.endsWith('.md')).sort();
      for (const name of aiNames) {
        if (!claudeNames.includes(name)) {
          console.error(`✗ ${self}: .claude/${dir}/${name} missing (present in .ai/${dir}/)`);
          mirrorDrift = true;
        }
      }
      for (const name of claudeNames) {
        if (!aiNames.includes(name)) {
          console.error(`✗ ${self}: .ai/${dir}/${name} missing (present in .claude/${dir}/)`);
          mirrorDrift = true;
        }
      }
    }
  }

  if (drift || mirrorDrift) {
    if (drift) {
      console.error('\nTrinity baseline has drift. Sync the offending files from the canonical (ai-studio).');
    }
    if (mirrorDrift) {
      console.error('\n.ai/<dir>/ ↔ .claude/<dir>/ parity violated. Add the missing mirror or remove the orphan.');
    }
    process.exit(1);
  }

  if (siblingsChecked === 0) {
    console.log(
      `✓ ${self}: baseline OK (no siblings checked — clone the others next to this repo to verify trinity sync).`,
    );
  } else {
    console.log(
      `✓ trinity in sync (${self} + ${siblingsChecked} sibling${siblingsChecked > 1 ? 's' : ''}, ${BASELINE.length} baseline files; .ai ↔ .claude parity OK).`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
