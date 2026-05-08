#!/usr/bin/env node
/**
 * Claude Code Stop hook.
 *
 * Appends a one-line entry to docs/ai-workflow/runs/YYYY-MM-DD.md with:
 *   - timestamp
 *   - last user prompt (truncated)
 *   - tool counts
 *
 * Plain markdown so humans can review the log. Best-effort.
 */
import { mkdir, appendFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { stdin } from 'node:process';

const decoder = new TextDecoder();
let raw = '';
for await (const chunk of stdin) raw += decoder.decode(chunk);

let evt;
try {
  evt = JSON.parse(raw || '{}');
} catch {
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const dest = resolve(`docs/ai-workflow/runs/${today}.md`);
const ts = new Date().toISOString().slice(11, 19);

const userPrompt = (evt?.user_prompt ?? '').replace(/\s+/g, ' ').slice(0, 140);
const toolCounts = evt?.tool_counts
  ? Object.entries(evt.tool_counts)
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')
  : '';

const line = `- \`${ts}\` — ${userPrompt || '(no prompt)'} — _${toolCounts || 'n/a'}_\n`;

try {
  await mkdir(dirname(dest), { recursive: true });
  await appendFile(dest, line);
} catch {
  /* best effort */
}
process.exit(0);
