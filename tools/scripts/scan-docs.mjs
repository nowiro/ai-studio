#!/usr/bin/env node
/**
 * scan-docs.mjs — deterministic doc inventory.
 *
 * Walks `docs/`, `.ai/`, top-level *.md files, and emits a JSON record per file:
 *   { path, title, hasFrontmatter, frontmatter, headings, codeLanguages, links, bytes, mtime }
 *
 * Output: writes to `tmp/docs-scan.json` AND prints summary to stdout.
 * Used by:
 *   - tools/scripts/doc-audit.mjs (combined audit)
 *   - the doc-auditor agent
 *
 * Pure scan — no LLM, no network, no side effects on tracked files.
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'tmp/docs-scan.json');

const DOC_ROOTS = ['docs', '.ai'];
const ROOT_FILES = ['README.md', 'CLAUDE.md', 'AGENTS.md', 'CONTRIBUTING.md', 'SECURITY.md'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', '.nx', 'tmp', 'coverage', 'test-results']);

async function walkMd(dir, out = []) {
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walkMd(p, out);
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function scan(text) {
  const fmMatch = text.match(/^---\n([\s\S]+?)\n---/);
  const titleMatch = text.match(/^#\s+(.+)$/m);
  const headings = [...text.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => ({
    level: m[1].length,
    text: m[2].trim(),
  }));
  const codeBlocks = [...text.matchAll(/```([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
  const links = [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]);
  return {
    title: titleMatch?.[1]?.trim() ?? null,
    hasFrontmatter: !!fmMatch,
    frontmatter: fmMatch?.[1] ?? null,
    headings,
    codeLanguages: [...new Set(codeBlocks)],
    links,
  };
}

async function main() {
  const files = [];
  for (const d of DOC_ROOTS) {
    files.push(...(await walkMd(resolve(ROOT, d))));
  }
  for (const f of ROOT_FILES) {
    const p = resolve(ROOT, f);
    if (existsSync(p)) files.push(p);
  }

  const docs = [];
  for (const f of files) {
    const txt = await readFile(f, 'utf8');
    const st = await stat(f);
    docs.push({
      path: relative(ROOT, f).replace(/\\/g, '/'),
      ...scan(txt),
      bytes: st.size,
      mtime: st.mtime.toISOString(),
    });
  }

  const result = {
    scannedAt: new Date().toISOString(),
    root: ROOT.replace(/\\/g, '/'),
    count: docs.length,
    docs,
  };

  await mkdir(resolve(ROOT, 'tmp'), { recursive: true });
  await writeFile(OUT, JSON.stringify(result, null, 2));
  console.log(`✓ Scanned ${docs.length} docs → ${relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
