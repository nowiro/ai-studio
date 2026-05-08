#!/usr/bin/env node
/**
 * Claude Code PostToolUse hook.
 *
 * Reads the JSON event from stdin and, when an Edit/Write touched a TS/HTML/SCSS
 * file inside apps/ or libs/, runs prettier + eslint --fix on it.
 * Best-effort: never blocks the agent, never throws.
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
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

const filePath = evt?.tool_input?.file_path ?? evt?.tool_input?.path;
if (!filePath) process.exit(0);

const isCodeFile = /\.(ts|html|scss|css|md|json|mjs|cjs)$/.test(filePath);
const inProject = /[\\/](apps|libs|tools|docs|\.ai|\.github|\.claude)[\\/]/.test(filePath);
if (!isCodeFile || !inProject) process.exit(0);

const abs = resolve(filePath);
if (!existsSync(abs)) process.exit(0);

const run = (cmd, args) =>
  new Promise((res) => {
    execFile(cmd, args, { windowsHide: true }, () => res());
  });

await run('pnpm', ['exec', 'prettier', '--write', abs]);
if (/\.(ts|html)$/.test(abs)) {
  await run('pnpm', ['exec', 'eslint', '--fix', abs]);
}
process.exit(0);
