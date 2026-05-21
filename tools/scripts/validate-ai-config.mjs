#!/usr/bin/env node
/**
 * Validates the universal-rules + thin-wrappers AI configuration for ai-mcp-alm:
 *   - every markdown file under .ai/ has YAML frontmatter with id/title/type/version
 *   - .ai/mcp.json (or .mcp.json) conforms to the schema-lite expected shape
 *   - every agent in .ai/agents/ has a Claude Code counterpart in .claude/agents/
 *   - every agent in .ai/agents/ has a Copilot chat-mode in .github/chatmodes/
 *   - every rule in .ai/rules/ has a Copilot instruction in .github/instructions/
 *   - .github/copilot-instructions.md exists
 *   - every file in .github/instructions/ has frontmatter with `applyTo` + `description`
 *   - every file in .github/prompts/ has frontmatter with `mode` + `description`
 *   - every file in .github/chatmodes/ has frontmatter with `description`
 *   - parity: every command in .claude/commands/ has a Copilot prompt in .github/prompts/
 *
 * Counts in this repo: 6 agents · 9 rules · 11 commands/prompts · 6 chat-modes.
 *
 * Exits 0 on success, 1 on any failure. Used by `pnpm ai:validate` and CI.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import process from 'node:process';

const errors = [];

const must = (cond, msg) => {
  if (!cond) errors.push(msg);
};

async function listMd(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => resolve(dir, e.name));
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

  // ── 2. Claude Code agent parity (.ai/agents ↔ .claude/agents) — bi-directional ──
  // Adapted from github/spec-kit `agent-parity-governance` extension.
  // Frontmatter `claude-exempt: true` w .ai/agents/<name>.md opt-outs from this check.
  const aiAgentFiles = await listMd('.ai/agents');
  const aiAgents = aiAgentFiles.map((f) => basename(f, '.md'));
  const claudeAgents = (await listMd('.claude/agents')).map((f) => basename(f, '.md'));
  const exempts = { claude: new Set(), copilot: new Set() };
  for (const f of aiAgentFiles) {
    const fm = (await frontmatter(f)) ?? '';
    if (/^claude-exempt:\s*true/m.test(fm)) exempts.claude.add(basename(f, '.md'));
    if (/^copilot-exempt:\s*true/m.test(fm)) exempts.copilot.add(basename(f, '.md'));
  }
  for (const a of aiAgents) {
    if (exempts.claude.has(a)) continue;
    must(
      claudeAgents.includes(a),
      `Agent "${a}" defined in .ai/agents/ but missing in .claude/agents/${a}.md (use frontmatter "claude-exempt: true" to opt out)`,
    );
  }
  // Reverse: orphan in .claude/agents without source-of-truth in .ai/agents
  for (const a of claudeAgents) {
    must(
      aiAgents.includes(a),
      `Agent "${a}" present in .claude/agents/ but missing source-of-truth .ai/agents/${a}.md (Claude mirror must reference universal definition)`,
    );
  }

  // ── 3. Copilot chat-mode parity (.ai/agents ↔ .github/chatmodes) ──
  // Only top-tier agents need chatmodes (frontmatter `tier: top` lub no `tier`).
  // Lower tiers opt-in via frontmatter `copilot-exempt: true`.
  const chatmodeStems = (await listMd('.github/chatmodes'))
    .map((f) => basename(f, '.md'))
    .map((n) => (n.endsWith('.chatmode') ? n.slice(0, -'.chatmode'.length) : n));
  for (const a of aiAgents) {
    if (exempts.copilot.has(a)) continue;
    must(
      chatmodeStems.includes(a),
      `Agent "${a}" defined in .ai/agents/ but missing in .github/chatmodes/${a}.chatmode.md (use frontmatter "copilot-exempt: true" to opt out)`,
    );
  }

  // ── 3.5. Frontmatter `id` consistency cross-mirror ──
  // .ai/agents/<name>.md frontmatter `id: agent.<name>` musi pasować do mirror.
  for (const a of aiAgents) {
    const aiFm = (await frontmatter(`.ai/agents/${a}.md`)) ?? '';
    const aiIdMatch = /^id:\s*(\S+)/m.exec(aiFm);
    if (!aiIdMatch) continue; // already caught in step 1
    const aiId = aiIdMatch[1];
    const claudePath = `.claude/agents/${a}.md`;
    if (existsSync(claudePath)) {
      const claudeFm = (await frontmatter(claudePath)) ?? '';
      const claudeIdMatch = /^id:\s*(\S+)/m.exec(claudeFm);
      if (claudeIdMatch && claudeIdMatch[1] !== aiId) {
        errors.push(
          `Agent "${a}" id drift: .ai/agents/${a}.md → "${aiId}" vs .claude/agents/${a}.md → "${claudeIdMatch[1]}"`,
        );
      }
    }
  }

  // ── 4. Rule ↔ Copilot instruction parity (.ai/rules ↔ .github/instructions) ──
  const aiRules = (await listMd('.ai/rules')).map((f) => basename(f, '.md'));
  const instructionStems = (await listMd('.github/instructions'))
    .map((f) => basename(f, '.md'))
    .map((n) => (n.endsWith('.instructions') ? n.slice(0, -'.instructions'.length) : n));
  for (const r of aiRules) {
    must(
      instructionStems.includes(r),
      `Rule "${r}" defined in .ai/rules/ but missing in .github/instructions/${r}.instructions.md`,
    );
  }

  // ── 5. MCP registry sanity (.mcp.json at repo root or .ai/mcp.json) ──
  const mcpPath = existsSync('.mcp.json') ? '.mcp.json' : existsSync('.ai/mcp.json') ? '.ai/mcp.json' : null;
  if (mcpPath) {
    const mcp = JSON.parse(await readFile(mcpPath, 'utf8'));
    const servers = mcp.mcpServers ?? mcp.servers;
    must(servers && typeof servers === 'object', `${mcpPath}: missing "mcpServers"/"servers" map`);
    for (const [name, srv] of Object.entries(servers ?? {})) {
      must(srv.command, `${mcpPath}: server "${name}" missing "command"`);
      must(Array.isArray(srv.args), `${mcpPath}: server "${name}" missing "args" array`);
    }
  }

  // ── 6. Copilot wrappers exist ──
  must(existsSync('.github/copilot-instructions.md'), '.github/copilot-instructions.md is missing');

  // ── 7. .github/instructions/*.instructions.md frontmatter ──
  const instructions = await listMd('.github/instructions');
  for (const f of instructions) {
    if (!f.endsWith('.instructions.md')) continue;
    await checkKeyedFrontmatter(f, ['applyTo', 'description']);
  }

  // ── 8. .github/prompts/*.prompt.md frontmatter ──
  const prompts = await listMd('.github/prompts');
  for (const f of prompts) {
    if (!f.endsWith('.prompt.md')) continue;
    await checkKeyedFrontmatter(f, ['mode', 'description']);
  }

  // ── 9. .github/chatmodes/*.chatmode.md frontmatter ──
  const chatmodes = await listMd('.github/chatmodes');
  for (const f of chatmodes) {
    if (!f.endsWith('.chatmode.md')) continue;
    await checkKeyedFrontmatter(f, ['description']);
  }

  // ── 10. Slash command ↔ Copilot prompt parity ──
  // Every command in .claude/commands/ MUST have a twin under .github/prompts/.
  const claudeCommands = (await listMd('.claude/commands')).map((f) => basename(f, '.md'));
  const copilotPromptStems = (await listMd('.github/prompts'))
    .map((f) => basename(f, '.md'))
    .map((n) => (n.endsWith('.prompt') ? n.slice(0, -'.prompt'.length) : n));
  for (const cmd of claudeCommands) {
    must(
      copilotPromptStems.includes(cmd),
      `Slash command "${cmd}" present in .claude/commands/ but missing in .github/prompts/${cmd}.prompt.md`,
    );
  }
  // The reverse: every prompt should have a Claude twin too.
  for (const p of copilotPromptStems) {
    must(
      claudeCommands.includes(p),
      `Copilot prompt "${p}" present in .github/prompts/ but missing in .claude/commands/${p}.md`,
    );
  }

  if (errors.length === 0) {
    const counts = {
      agents: aiAgents.length,
      rules: aiRules.length,
      commands: claudeCommands.length,
      chatmodes: chatmodeStems.length,
      instructions: instructionStems.length,
      prompts: copilotPromptStems.length,
    };
    console.log(
      `✓ .ai/, .claude/, and .github/ AI configuration is valid — ` +
        `${counts.agents} agents · ${counts.rules} rules · ${counts.commands} commands · ` +
        `${counts.chatmodes} chat-modes · ${counts.instructions} instructions · ${counts.prompts} prompts`,
    );
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
