#!/usr/bin/env node
/**
 * Builds a single-file digest of the .ai/ knowledge base for agents that
 * can't crawl the repo (e.g. when pasting context into a chat or upload).
 *
 * Output: tmp/ai-context.md  (gitignored)
 *
 * Usage: pnpm ai:context
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'tmp/ai-context.md');

const ORDER = ['.ai/README.md', '.ai/rules', '.ai/agents', '.ai/workflows', '.ai/prompts', '.ai/context'];

async function listMd(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => resolve(dir, e.name))
    .sort();
}

async function collect() {
  const files = [];
  for (const item of ORDER) {
    if (item.endsWith('.md')) files.push(resolve(ROOT, item));
    else files.push(...(await listMd(item)));
  }
  return files;
}

async function main() {
  const files = await collect();
  const parts = [
    '# AI Studio — context digest',
    `Generated ${new Date().toISOString()} from \`.ai/\``,
    '',
  ];
  for (const f of files) {
    if (!existsSync(f)) continue;
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    parts.push(`\n\n---\n\n## \`${rel}\`\n`);
    parts.push(await readFile(f, 'utf8'));
  }
  await mkdir(resolve(ROOT, 'tmp'), { recursive: true });
  await writeFile(OUT, parts.join('\n'));
  console.log(`✓ Wrote ${parts.length} sections to ${relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
