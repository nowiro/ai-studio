#!/usr/bin/env node
/**
 * scan-public-api.mjs — extract public exports from every lib / app `src/index.ts`.
 *
 * Output: writes to `tmp/public-api.json` AND prints summary to stdout.
 *
 * Single responsibility: list what's exported. It does NOT decide whether the export
 * is documented (that's `doc-audit.mjs`).
 *
 * Pure scan — no LLM, no network.
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'tmp/public-api.json');
const SCAN_ROOTS = ['libs', 'apps'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', '.nx', 'coverage']);

async function findIndexes(dir, out = [], depth = 0) {
  if (depth > 12 || !existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await findIndexes(p, out, depth + 1);
    else if (e.isFile() && e.name === 'index.ts' && p.replace(/\\/g, '/').includes('/src/')) {
      out.push(p);
    }
  }
  return out;
}

const declarationRe =
  /^export\s+(?:type\s+|interface\s+|class\s+|abstract\s+class\s+|const\s+|function\s+|enum\s+|async\s+function\s+)([A-Za-z_$][\w$]*)/gm;
const reExportNamedRe =
  /^export\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/gm;
const reExportStarRe = /^export\s+\*\s+from\s+['"]([^'"]+)['"]/gm;

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function extractExports(text) {
  const exports = [];
  let m;

  declarationRe.lastIndex = 0;
  while ((m = declarationRe.exec(text)) !== null) {
    exports.push({ name: m[1], kind: 'declaration', line: lineOf(text, m.index) });
  }

  reExportNamedRe.lastIndex = 0;
  while ((m = reExportNamedRe.exec(text)) !== null) {
    const line = lineOf(text, m.index);
    const from = m[2];
    const names = m[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/\s+as\s+(\w+)/, (_, alias) => alias));
    for (const name of names) {
      exports.push({ name, kind: 're-export', from, line });
    }
  }

  reExportStarRe.lastIndex = 0;
  while ((m = reExportStarRe.exec(text)) !== null) {
    exports.push({ name: '*', kind: 're-export-all', from: m[1], line: lineOf(text, m.index) });
  }

  return exports;
}

async function main() {
  const indexes = [];
  for (const d of SCAN_ROOTS) {
    indexes.push(...(await findIndexes(resolve(ROOT, d))));
  }

  const apis = [];
  for (const f of indexes) {
    const txt = await readFile(f, 'utf8');
    const st = await stat(f);
    apis.push({
      path: relative(ROOT, f).replace(/\\/g, '/'),
      mtime: st.mtime.toISOString(),
      exports: extractExports(txt),
    });
  }

  const totalExports = apis.reduce((n, a) => n + a.exports.length, 0);
  const result = {
    scannedAt: new Date().toISOString(),
    root: ROOT.replace(/\\/g, '/'),
    indexCount: apis.length,
    exportCount: totalExports,
    apis,
  };

  await mkdir(resolve(ROOT, 'tmp'), { recursive: true });
  await writeFile(OUT, JSON.stringify(result, null, 2));
  console.log(`✓ Scanned ${apis.length} index files (${totalExports} exports) → ${relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
