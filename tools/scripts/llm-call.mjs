#!/usr/bin/env node

/**
 * llm-call.mjs — unified dual-provider LLM call wrapper for deterministic scripts.
 *
 * Trinity baseline #12. Byte-identical across `ai-studio`, `ai-mcp-alm`,
 * `ai-mcp-devtools`, `ai-workspace`. Hybrid scripts (scaffold, audit,
 * regenerate-docs) call this for the "judgment" sub-problem inside an
 * otherwise deterministic pipeline.
 *
 * Two providers, same interface:
 *   - claude  → @anthropic-ai/sdk (Claude Haiku 4.5 default)
 *   - copilot → `gh models run` (GitHub Models CLI; requires `gh extension install github/gh-models`)
 *   - mock    → fixture file in tools/scripts/.fixtures/<sha>.json (CI-friendly, zero network)
 *
 * Predictability gates:
 *   - temperature defaults to 0
 *   - structured output via JSON schema → enforced via Claude tool-use or
 *     instruction-pinned JSON for gh models
 *   - cache key = SHA256(system + user + schema + model + provider), persisted
 *     to tools/scripts/.cache/llm-calls/<sha>.json — identical input → identical output
 *   - every call logged to tools/scripts/.cache/llm-calls/audit.jsonl
 *   - Claude system prompt marked `cache_control: ephemeral` for 5-min prompt cache
 *
 * Headless-only — every input comes from a CLI flag or function arg.
 *
 * Usage as a module (preferred for hybrid scripts):
 *
 *   import { llmCall } from './llm-call.mjs';
 *
 *   const result = await llmCall({
 *     system: 'You are a technical writer.',
 *     user: 'Write a one-line elevator pitch for repo "ai-utils".',
 *     schema: { type: 'object', required: ['pitch'], properties: { pitch: { type: 'string' } } },
 *   });
 *   console.log(result.pitch);
 *
 * Usage as CLI (useful for ad-hoc + shell scripts):
 *
 *   node tools/scripts/llm-call.mjs \
 *     --system="You are a technical writer." \
 *     --user="Write a one-line pitch for ai-utils" \
 *     --schema='{"type":"object","properties":{"pitch":{"type":"string"}}}'
 *
 * Environment:
 *   ANTHROPIC_API_KEY   Claude provider auth (required for provider=claude)
 *   ANTHROPIC_MODEL     Override default Claude model (claude-haiku-4-5-20251001)
 *   GH_MODELS_MODEL     Override default gh model (openai/gpt-4o-mini)
 *   LLM_PROVIDER        Force provider (claude | copilot | mock | auto)
 *
 * @see conventions.md §2 (Trinity) and §9 (Skrypty deterministyczne)
 * @see .ai/rules/llm-optimization.md §10
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const IS_WIN = process.platform === 'win32';

const CACHE_DIR = resolve(ROOT, 'tools/scripts/.cache/llm-calls');
const FIXTURE_DIR = resolve(ROOT, 'tools/scripts/.fixtures/llm-calls');
const AUDIT_LOG = resolve(CACHE_DIR, 'audit.jsonl');

const DEFAULT_CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const DEFAULT_GH_MODEL = 'openai/gpt-4o-mini';
const DEFAULT_MAX_TOKENS = 2048;

/**
 * Programmatic entry point. Always returns a parsed object (the structured
 * response) when a schema is given, or `{ text }` when not.
 *
 * @param {object} opts
 * @param {string} opts.system        System prompt (the "role" instructions).
 * @param {string} opts.user          User message (the actual task input).
 * @param {object} [opts.schema]      JSON schema for structured output. Top-level must be `type: 'object'`.
 * @param {string} [opts.model]       Override default model for the chosen provider.
 * @param {('claude'|'copilot'|'mock'|'auto')} [opts.provider='auto']
 * @param {number} [opts.maxTokens=2048]
 * @param {number} [opts.temperature=0]
 * @param {boolean} [opts.noCache=false]   Bypass cache (still writes new entry).
 * @returns {Promise<object>}
 */
export async function llmCall({
  system,
  user,
  schema,
  model,
  provider = 'auto',
  maxTokens = DEFAULT_MAX_TOKENS,
  temperature = 0,
  noCache = false,
}) {
  if (typeof system !== 'string' || system.length === 0)
    throw new Error('llmCall: `system` must be a non-empty string');
  if (typeof user !== 'string' || user.length === 0) throw new Error('llmCall: `user` must be a non-empty string');

  const resolvedProvider = resolveProvider(provider);
  const resolvedModel =
    model ??
    (resolvedProvider === 'copilot'
      ? (process.env['GH_MODELS_MODEL'] ?? DEFAULT_GH_MODEL)
      : (process.env['ANTHROPIC_MODEL'] ?? DEFAULT_CLAUDE_MODEL));

  const sha = cacheKeyFor({ system, user, schema, model: resolvedModel, provider: resolvedProvider });
  const cachePath = resolve(CACHE_DIR, `${sha}.json`);

  if (!noCache && existsSync(cachePath)) {
    const cached = JSON.parse(readFileSync(cachePath, 'utf8'));
    audit({ provider: resolvedProvider, model: resolvedModel, sha, latencyMs: 0, cacheHit: true });
    return cached.response;
  }

  // Mock provider: lookup fixture, error if missing.
  if (resolvedProvider === 'mock') {
    const fixturePath = resolve(FIXTURE_DIR, `${sha}.json`);
    if (!existsSync(fixturePath)) {
      throw new Error(
        `Mock fixture missing: ${fixturePath}\n` +
          `Record one with: LLM_PROVIDER=claude node tools/scripts/llm-call.mjs ... > ${fixturePath}`,
      );
    }
    const response = JSON.parse(readFileSync(fixturePath, 'utf8'));
    audit({ provider: 'mock', model: resolvedModel, sha, latencyMs: 0, cacheHit: false });
    return response;
  }

  const t0 = Date.now();
  let response;
  if (resolvedProvider === 'claude') {
    response = await callClaude({ system, user, schema, model: resolvedModel, maxTokens, temperature });
  } else {
    response = await callCopilot({ system, user, schema, model: resolvedModel, maxTokens });
  }
  const latencyMs = Date.now() - t0;

  if (schema) validateAgainstSchema(response, schema);

  if (!noCache) {
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(
      cachePath,
      JSON.stringify(
        { provider: resolvedProvider, model: resolvedModel, ts: new Date().toISOString(), response },
        null,
        2,
      ),
    );
  }

  audit({ provider: resolvedProvider, model: resolvedModel, sha, latencyMs, cacheHit: false });
  return response;
}

// ─── Provider resolution ────────────────────────────────────────────────────

function resolveProvider(provider) {
  const envOverride = process.env['LLM_PROVIDER'];
  if (envOverride && ['claude', 'copilot', 'mock', 'auto'].includes(envOverride)) {
    provider = envOverride;
  }
  if (provider === 'mock') return 'mock';
  if (provider === 'claude') return 'claude';
  if (provider === 'copilot') return 'copilot';

  // auto: prefer Claude (Haiku 4.5 default, structured output via tool-use is more reliable).
  if (process.env['ANTHROPIC_API_KEY']) return 'claude';
  if (hasGhWithModels()) return 'copilot';
  throw new Error(
    'No LLM provider available. Set ANTHROPIC_API_KEY (Claude), or install gh CLI + run ' +
      '`gh extension install github/gh-models` (Copilot), or set LLM_PROVIDER=mock with fixtures.',
  );
}

let ghChecked = false;
let ghModelsAvailable = false;
function hasGhWithModels() {
  if (ghChecked) return ghModelsAvailable;
  ghChecked = true;
  const versionCheck = spawnSync('gh', ['--version'], { encoding: 'utf8', shell: IS_WIN });
  if (versionCheck.status !== 0) return false;
  const extCheck = spawnSync('gh', ['extension', 'list'], { encoding: 'utf8', shell: IS_WIN });
  if (extCheck.status !== 0) return false;
  ghModelsAvailable = /github\/gh-models/i.test(extCheck.stdout ?? '');
  return ghModelsAvailable;
}

// ─── Claude backend ─────────────────────────────────────────────────────────

async function callClaude({ system, user, schema, model, maxTokens, temperature }) {
  let Anthropic;
  try {
    Anthropic = (await import('@anthropic-ai/sdk')).default;
  } catch {
    throw new Error('@anthropic-ai/sdk is not installed. Run: pnpm add -D @anthropic-ai/sdk');
  }
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const client = new Anthropic({ apiKey });

  // Structured output via single-tool tool_choice — most reliable for JSON.
  if (schema) {
    const result = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      tools: [{ name: 'submit_result', description: 'Submit the structured result.', input_schema: schema }],
      tool_choice: { type: 'tool', name: 'submit_result' },
      messages: [{ role: 'user', content: user }],
    });
    for (const block of result.content) {
      if (block.type === 'tool_use' && block.name === 'submit_result') {
        return block.input;
      }
    }
    throw new Error('Claude did not return a `submit_result` tool_use block');
  }

  const result = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
  });
  const text = result.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
  return { text };
}

// ─── Copilot / gh models backend ────────────────────────────────────────────

async function callCopilot({ system, user, schema, model, maxTokens }) {
  // gh models run reads the prompt from stdin and writes to stdout.
  // We prepend schema-pinning instructions when structured output is needed.
  // (`gh-models` does not have a native --schema flag as of mid-2026.)
  const promptText = schema
    ? `${user}\n\n---\nRespond ONLY with a single JSON object matching this JSON schema. ` +
      `No prose, no code fences, no commentary.\n\nSchema:\n${JSON.stringify(schema)}`
    : user;

  const args = ['models', 'run', '--system-prompt', system, '--max-tokens', String(maxTokens), model];
  const proc = spawnSync('gh', args, { input: promptText, encoding: 'utf8', shell: IS_WIN });
  if (proc.status !== 0) {
    throw new Error(`gh models run failed (exit ${proc.status}): ${proc.stderr || proc.stdout}`);
  }
  const raw = (proc.stdout ?? '').trim();
  if (!schema) return { text: raw };

  // Tolerate fenced output even though we asked not to.
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonText = fenced ? fenced[1] : raw;
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`gh models returned non-JSON for schema request:\n${raw}\n\nParse error: ${err.message}`);
  }
}

// ─── Schema validation (lightweight; no ajv dep) ────────────────────────────

function validateAgainstSchema(value, schema) {
  if (schema.type === 'object') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`Schema violation: expected object, got ${describe(value)}`);
    }
    for (const required of schema.required ?? []) {
      if (!(required in value)) throw new Error(`Schema violation: missing required field "${required}"`);
    }
    for (const [key, propSchema] of Object.entries(schema.properties ?? {})) {
      if (key in value) validateAgainstSchema(value[key], propSchema);
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) throw new Error(`Schema violation: expected array, got ${describe(value)}`);
    if (schema.items) for (const item of value) validateAgainstSchema(item, schema.items);
  } else if (schema.type === 'string' && typeof value !== 'string') {
    throw new Error(`Schema violation: expected string, got ${describe(value)}`);
  } else if (schema.type === 'number' && typeof value !== 'number') {
    throw new Error(`Schema violation: expected number, got ${describe(value)}`);
  } else if (schema.type === 'boolean' && typeof value !== 'boolean') {
    throw new Error(`Schema violation: expected boolean, got ${describe(value)}`);
  }
}

function describe(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

// ─── Cache + audit ──────────────────────────────────────────────────────────

function cacheKeyFor({ system, user, schema, model, provider }) {
  const payload = JSON.stringify({ system, user, schema: schema ?? null, model, provider });
  return createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

function audit(entry) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    appendFileSync(AUDIT_LOG, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n');
  } catch {
    // Best-effort; audit failure must never break the call itself.
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const isMain = (() => {
  try {
    return fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? '');
  } catch {
    return false;
  }
})();

if (isMain) {
  const ARGS = parseArgs(process.argv.slice(2));
  if (ARGS.flags.has('help') || ARGS.flags.has('h')) {
    printHelp();
    process.exit(0);
  }
  if (!ARGS.system || !ARGS.user) {
    printHelp();
    process.stderr.write('\n✗ --system and --user are required\n');
    process.exit(1);
  }
  let schema;
  try {
    schema = ARGS.schema ? JSON.parse(ARGS.schema) : undefined;
  } catch (err) {
    process.stderr.write(`✗ --schema is not valid JSON: ${err.message}\n`);
    process.exit(1);
  }
  try {
    const result = await llmCall({
      system: ARGS.system,
      user: ARGS.user,
      schema,
      model: ARGS.model,
      provider: ARGS.provider,
      maxTokens: ARGS['max-tokens'] ? Number(ARGS['max-tokens']) : DEFAULT_MAX_TOKENS,
      temperature: ARGS.temperature ? Number(ARGS.temperature) : 0,
      noCache: ARGS.flags.has('no-cache'),
    });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } catch (err) {
    process.stderr.write(`✗ ${err.message}\n`);
    process.exit(1);
  }
}

function parseArgs(argv) {
  const out = { flags: new Set() };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [k, v] = arg.slice(2).split(/=(.*)/s);
    if (v === undefined) out.flags.add(k);
    else out[k] = v;
  }
  return out;
}

function printHelp() {
  process.stdout.write(`llm-call.mjs — unified dual-provider LLM wrapper (trinity baseline #12)

Usage:
  node tools/scripts/llm-call.mjs --system="..." --user="..." [--schema='{...}'] [flags]

Required:
  --system=<text>          System prompt
  --user=<text>            User message

Optional:
  --schema=<json>          JSON schema for structured output (top-level type:object)
  --model=<name>           Override provider default
  --provider=<name>        claude | copilot | mock | auto (default: auto, also via LLM_PROVIDER env)
  --max-tokens=<n>         Default ${DEFAULT_MAX_TOKENS}
  --temperature=<n>        Default 0 (deterministic)
  --no-cache               Bypass cache lookup (still writes new entry)
  --help, -h               Show this help

Environment:
  ANTHROPIC_API_KEY        Claude provider credential
  ANTHROPIC_MODEL          Override Claude default (${DEFAULT_CLAUDE_MODEL})
  GH_MODELS_MODEL          Override gh models default (${DEFAULT_GH_MODEL})
  LLM_PROVIDER             Force provider (overrides --provider)

Output:
  JSON object to stdout (response body when --schema given, otherwise {text}).
  Errors to stderr; non-zero exit on failure.

Cache:
  tools/scripts/.cache/llm-calls/<sha>.json    Per-call cache
  tools/scripts/.cache/llm-calls/audit.jsonl   Append-only audit log
  tools/scripts/.fixtures/llm-calls/<sha>.json Fixtures consulted in mock mode
`);
}
