#!/usr/bin/env node

/**
 * preinstall.mjs — guard executed before any install runs.
 *
 * Why:
 *   - This repo uses pnpm exclusively (pnpm-lock.yaml, packageManager pin).
 *     Running `npm install` or `yarn` will diverge dependencies, generate a
 *     wrong lockfile, and break trinity invariants.
 *   - The `packageManager` field pins an EXACT pnpm version (Corepack spec
 *     does not support ranges). Devs on a different pnpm minor get a
 *     confusing "mismatch" error from Corepack.
 *
 * What this does:
 *   1. Reject `npm install` / `yarn install` with a clear remediation message.
 *   2. If pnpm is used but version diverges from `packageManager`, suggest the
 *      one-line fix (`corepack prepare ...`).
 *
 * Exit codes:
 *   0 — pnpm in use, proceed.
 *   1 — wrong package manager or pnpm not installed.
 *
 * @see SECURITY.md, CONTRIBUTING.md
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

// Skip when invoked by `pnpm dlx` or CI where preinstall is intentionally
// bypassed (e.g. Renovate sandbox). This single env flag is the documented
// escape hatch.
if (process.env['SKIP_PREINSTALL_GUARD'] === '1') {
  process.exit(0);
}

const execPath = process.env['npm_execpath'] ?? '';
const userAgent = process.env['npm_config_user_agent'] ?? '';

// pnpm sets `npm_config_user_agent` to e.g. "pnpm/11.1.3 npm/? node/v22.x.x ..."
// and `npm_execpath` to the pnpm bin path. npm itself reports "npm/...".
const isPnpm = userAgent.startsWith('pnpm/') || execPath.includes('pnpm');
const isNpm = userAgent.startsWith('npm/') && !isPnpm;
const isYarn = userAgent.startsWith('yarn/');

function fail(msg) {
  // ANSI red + bold. Falls back gracefully in non-ANSI terminals.
  process.stderr.write(`\n\x1b[1;31m✗ ${msg}\x1b[0m\n\n`);
  process.exit(1);
}

if (isNpm) {
  fail(
    [
      'This repo uses pnpm exclusively (see pnpm-lock.yaml and `packageManager` in package.json).',
      '',
      '\x1b[1mFix:\x1b[0m',
      '  1. Install pnpm:    \x1b[36mnpm install -g pnpm\x1b[0m',
      '                or:  \x1b[36mcorepack enable\x1b[0m  (Node 22+ ships Corepack)',
      '  2. Use it:          \x1b[36mpnpm install\x1b[0m',
      '',
      'Or run the all-in-one bootstrap (Node-only, no extra tools):',
      '  \x1b[36mnode tools/scripts/bootstrap.mjs\x1b[0m',
    ].join('\n'),
  );
}

if (isYarn) {
  fail(
    [
      'This repo uses pnpm, not yarn. yarn.lock is not tracked here.',
      '',
      '\x1b[1mFix:\x1b[0m  install pnpm (`corepack enable`) and run `pnpm install`.',
    ].join('\n'),
  );
}

// At this point: either pnpm OR direct `node tools/scripts/preinstall.mjs`
// invocation (which is fine — the script is idempotent). We still validate
// the pnpm version when running under pnpm.
if (isPnpm) {
  try {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
    const declared = pkg.packageManager; // e.g. "pnpm@11.1.3"
    if (declared?.startsWith('pnpm@')) {
      const declaredVersion = declared.slice('pnpm@'.length);
      // `npm_config_user_agent` looks like "pnpm/11.1.2 npm/? node/v22.x.x ..."
      const m = userAgent.match(/^pnpm\/([^\s]+)/);
      const actualVersion = m?.[1];
      if (actualVersion && actualVersion !== declaredVersion) {
        // Soft warning only — Corepack itself will hard-fail before us if it
        // can't switch. This message gives the user the one-line remedy.
        process.stderr.write(
          [
            '',
            `\x1b[1;33m⚠ pnpm version mismatch: have ${actualVersion}, repo pins ${declaredVersion}\x1b[0m`,
            '',
            'If Corepack errors out next, run once:',
            `  \x1b[36mcorepack prepare pnpm@${declaredVersion} --activate\x1b[0m`,
            '',
          ].join('\n'),
        );
      }
    }
  } catch {
    // Don't block install on read errors — best-effort hint only.
  }
}

process.exit(0);
