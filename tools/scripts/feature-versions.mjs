#!/usr/bin/env node

/**
 * feature-versions.mjs — lista aktualnych wersji per feature z
 * `docs/analytical/specs/<slug>/spec.md` frontmatter.
 *
 * Adaptacja z github/spec-kit PR #2548 (v0.8.11 — version feature reporting).
 * Per-spec versioning daje granularny historic context bez bumpowania całego
 * repo. Realizuje `.ai/rules/llm-optimization.md` §10 (deterministyczne skrypty).
 *
 * Każdy spec.md powinien mieć frontmatter:
 *
 *   ---
 *   id: spec.<slug>
 *   feature-version: 1.2.0       # ← bumped per iteracja feature
 *   title: ...
 *   ...
 *   ---
 *
 * Skrypt skanuje docs/analytical/specs/ * /spec.md, lista versions + drift
 * detection (czy spec.md mtime > plan.md/tasks.md mtime — sygnał że spec
 * changed po accepted plan).
 *
 * Flagi:
 *   --drift            tylko report drift (spec changed post-plan)
 *   --json             emit JSON
 *
 * Exit codes:
 *   0 — wszystkie specs mają feature-version
 *   1 — co najmniej jeden spec bez feature-version frontmatter
 *
 * @see .ai/workflows/spec-driven.md Faza 1
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const ARGS = new Set(process.argv.slice(2));
const DRIFT_ONLY = ARGS.has('--drift');
const JSON_OUT = ARGS.has('--json');

const SPECS_DIR = resolve(ROOT, 'docs/analytical/specs');

if (!existsSync(SPECS_DIR)) {
  if (JSON_OUT) process.stdout.write('[]\n');
  else process.stdout.write(`(no docs/analytical/specs/ — nothing to report)\n`);
  process.exit(0);
}

const features = [];

for (const entry of readdirSync(SPECS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const dir = join(SPECS_DIR, slug);
  const specPath = join(dir, 'spec.md');
  const planPath = join(dir, 'plan.md');
  const tasksPath = join(dir, 'tasks.md');
  if (!existsSync(specPath)) continue;

  const fm = readFrontmatter(specPath);
  const version = /^feature-version:\s*(\S+)/m.exec(fm)?.[1] ?? null;
  const title = /^title:\s*(.+)$/m.exec(fm)?.[1] ?? slug;

  const specMtime = statSync(specPath).mtimeMs;
  const planMtime = existsSync(planPath) ? statSync(planPath).mtimeMs : 0;
  const tasksMtime = existsSync(tasksPath) ? statSync(tasksPath).mtimeMs : 0;

  // Drift: spec edited po plan / tasks ostatnio updated
  const drift = (planMtime > 0 && specMtime > planMtime) || (tasksMtime > 0 && specMtime > tasksMtime);

  features.push({
    slug,
    title: title.trim(),
    version,
    drift,
    specMtime: new Date(specMtime).toISOString(),
    ...(drift ? { driftReason: 'spec.md mtime > plan/tasks mtime' } : {}),
  });
}

const filtered = DRIFT_ONLY ? features.filter((f) => f.drift) : features;
const missingVersion = features.filter((f) => !f.version);

if (JSON_OUT) {
  process.stdout.write(
    JSON.stringify({ features: filtered, missingVersion: missingVersion.length }, undefined, 2) + '\n',
  );
} else {
  if (filtered.length === 0) {
    process.stdout.write(DRIFT_ONLY ? '✓ No drift detected.\n' : '(no specs found)\n');
  } else {
    process.stdout.write(`\nFeature versions:\n\n`);
    process.stdout.write(`| Feature | Version | Drift | Spec last edit |\n`);
    process.stdout.write(`| ------- | ------- | ----- | -------------- |\n`);
    for (const f of filtered) {
      const ver = f.version ?? '⚠ MISSING';
      const drift = f.drift ? '⚠ yes' : '—';
      process.stdout.write(
        `| ${f.slug} (${f.title.slice(0, 40)}) | ${ver} | ${drift} | ${f.specMtime.slice(0, 10)} |\n`,
      );
    }
  }
  if (missingVersion.length > 0) {
    process.stderr.write(`\n⚠ ${missingVersion.length} spec(s) without feature-version frontmatter:\n`);
    for (const f of missingVersion) process.stderr.write(`  - ${f.slug}\n`);
  }
}

process.exit(missingVersion.length > 0 ? 1 : 0);

function readFrontmatter(path) {
  const txt = readFileSync(path, 'utf8');
  const m = /^---\n([\s\S]+?)\n---/.exec(txt);
  return m ? m[1] : '';
}
