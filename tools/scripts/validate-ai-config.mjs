#!/usr/bin/env node
/**
 * Validates the universal-rules + thin-wrappers AI configuration:
 *   - every markdown file under .ai/ has YAML frontmatter with id/title/type/version
 *   - .ai/mcp.json conforms to the schema-lite expected shape
 *   - every agent in .ai/agents/ has a Claude Code counterpart in .claude/agents/
 *   - .github/copilot-instructions.md exists
 *   - every file in .github/instructions/ has frontmatter with `applyTo` + `description`
 *   - every file in .github/prompts/ has frontmatter with `mode` + `description`
 *   - every file in .github/chatmodes/ has frontmatter with `description`
 *   - parity: every workflow command we expose has both a Claude slash command and a Copilot prompt
 *
 * Exits 0 on success, 1 on any failure. Used by `pnpm ai:validate` and CI.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import process from 'node:process';

const errors = [];

const must = (cond, msg) => {
  if (!cond) errors.push(msg);
};

async function listMd(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => resolve(dir, e.name));
}

async function frontmatter(file) {
  const txt = await readFile(file, 'utf8');
  const fm = txt.match(/^---\n([\s\S]+?)\n---/);
  return fm ? fm[1] : null;
}

async function checkAiFrontmatter(file) {
  const fm = await frontmatter(file);
  must(fm, `${file}: missing YAML frontmatter`);
  if (!fm) return;
  for (const key of ['id', 'title', 'type', 'version']) {
    must(new RegExp(`^${key}:\\s*\\S+`, 'm').test(fm), `${file}: frontmatter missing "${key}"`);
  }
}

async function checkKeyedFrontmatter(file, requiredKeys) {
  const fm = await frontmatter(file);
  must(fm, `${file}: missing YAML frontmatter`);
  if (!fm) return;
  for (const key of requiredKeys) {
    must(new RegExp(`^${key}:\\s*\\S+`, 'm').test(fm), `${file}: frontmatter missing "${key}"`);
  }
}

async function main() {
  // ── 1. .ai/ frontmatter (universal source of truth) ──
  const aiDirs = ['.ai/rules', '.ai/agents', '.ai/workflows', '.ai/prompts', '.ai/context'];
  const aiMd = (await Promise.all(aiDirs.map(listMd))).flat();
  await Promise.all(aiMd.map(checkAiFrontmatter));

  // ── 2. Claude Code agent parity ──
  const aiAgents = (await listMd('.ai/agents')).map((f) => basename(f, '.md'));
  const claudeAgents = (await listMd('.claude/agents')).map((f) => basename(f, '.md'));
  for (const a of aiAgents) {
    must(claudeAgents.includes(a), `Agent "${a}" defined in .ai/agents/ but missing in .claude/agents/`);
  }

  // ── 3. MCP registry sanity ──
  if (existsSync('.ai/mcp.json')) {
    const mcp = JSON.parse(await readFile('.ai/mcp.json', 'utf8'));
    must(mcp.servers && typeof mcp.servers === 'object', '.ai/mcp.json: missing "servers" map');
    for (const [name, srv] of Object.entries(mcp.servers ?? {})) {
      must(srv.command, `.ai/mcp.json: server "${name}" missing "command"`);
      must(Array.isArray(srv.args), `.ai/mcp.json: server "${name}" missing "args" array`);
      must(srv.description, `.ai/mcp.json: server "${name}" missing "description"`);
    }
  }

  // ── 4. Copilot wrappers exist ──
  must(existsSync('.github/copilot-instructions.md'), '.github/copilot-instructions.md is missing');

  // ── 5. .github/instructions/*.instructions.md frontmatter ──
  const instructions = await listMd('.github/instructions');
  for (const f of instructions) {
    if (!f.endsWith('.instructions.md')) continue;
    await checkKeyedFrontmatter(f, ['applyTo', 'description']);
  }

  // ── 6. .github/prompts/*.prompt.md frontmatter ──
  const prompts = await listMd('.github/prompts');
  for (const f of prompts) {
    if (!f.endsWith('.prompt.md')) continue;
    await checkKeyedFrontmatter(f, ['mode', 'description']);
  }

  // ── 7. .github/chatmodes/*.chatmode.md frontmatter ──
  const chatmodes = await listMd('.github/chatmodes');
  for (const f of chatmodes) {
    if (!f.endsWith('.chatmode.md')) continue;
    await checkKeyedFrontmatter(f, ['description']);
  }

  // ── 8. Slash command ↔ Copilot prompt parity ──
  // Workflow commands MUST appear in both .claude/commands/ and .github/prompts/.
  const sharedCommands = [
    'new-feature',
    'bug-fix',
    'review-pr',
    'migrate-doc',
    'audit-docs',
    'regenerate-docs',
    'generate-test-scenarios',
    'run-test-scenarios',
    // Spec-driven development (.ai/workflows/spec-driven.md)
    'specify',
    'clarify',
    'plan',
    'tasks',
    'implement',
  ];
  const claudeCommands = new Set(
    (await listMd('.claude/commands')).map((f) => basename(f, '.md')),
  );
  // Copilot prompt files end in .prompt.md → strip the suffix.
  const copilotPrompts = new Set(
    (await listMd('.github/prompts'))
      .map((f) => basename(f, '.md'))
      .map((n) => (n.endsWith('.prompt') ? n.slice(0, -'.prompt'.length) : n)),
  );
  for (const cmd of sharedCommands) {
    must(claudeCommands.has(cmd), `Shared command "${cmd}" missing in .claude/commands/${cmd}.md`);
    must(copilotPrompts.has(cmd), `Shared command "${cmd}" missing in .github/prompts/${cmd}.prompt.md`);
  }

  if (errors.length === 0) {
    console.log('✓ .ai/, .claude/, and .github/ AI configuration is valid');
    process.exit(0);
  }
  console.error('✗ AI configuration has errors:\n');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
