#!/usr/bin/env node

/**
 * bootstrap.mjs — one-command repo initialiser.
 *
 * Runs after `git clone` to:
 *   1. verify Node version against `.nvmrc`
 *   2. verify pnpm is on PATH
 *   3. install dependencies (idempotent; skips if `node_modules` already exists)
 *   4. set up git hooks (`pnpm prepare` → husky)
 *   5. run trinity baseline check (warns if siblings missing — not fatal)
 *   6. (only when `config.example.json` exists in the repo root) seed a user-profile
 *      config at `<home>/.config/nowiro/<repo>/config.json`, set `0600` on POSIX,
 *      and warn if placeholder strings are still present
 *
 * Cross-platform: pure Node stdlib, no external deps. Works identically on
 * Windows / macOS / Linux. Safe to re-run.
 *
 * Trinity invariant: this file is byte-identical across `ai-studio`,
 * `ai-mcp-alm`, `ai-mcp-devtools`. The behaviour adapts to the repo by
 * inspecting the local `package.json#name` and the presence of
 * `config.example.json`.
 *
 * Flags:
 *   --reinstall            force `pnpm install` even if node_modules exists
 *   --skip-install         do not run `pnpm install`
 *   --skip-trinity         do not run trinity:check
 *   --skip-config          do not seed user-profile config
 *   --skip-gh-extensions   do not install gh-models extension (Copilot backend for llm-call.mjs)
 *
 * @see SECURITY.md — "Token storage — user-profile config"
 * @see .ai/architecture.md
 */
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const ARGS = new Set(process.argv.slice(2));
const IS_WIN = platform() === 'win32';

// Minimal ANSI helpers — modern Windows Terminal, macOS Terminal, and most
// Linux shells handle these. Legacy cmd.exe shows the raw escape codes; we
// accept the cosmetic noise rather than pull in a dep.
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  ok: (s) => `\x1b[32m${s}\x1b[0m`,
  warn: (s) => `\x1b[33m${s}\x1b[0m`,
  err: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const findings = [];
let exitCode = 0;

function step(name) {
  process.stdout.write(`\n${c.bold(`▶ ${name}`)}\n`);
}

function log(msg) {
  process.stdout.write(`  ${msg}\n`);
}

function record(severity, msg) {
  findings.push({ severity, msg });
}

function shell(command, args = [], options = {}) {
  return spawnSync(command, args, {
    cwd: ROOT,
    stdio: options.silent ? 'pipe' : 'inherit',
    shell: IS_WIN, // Windows resolves `pnpm.cmd` only with shell-mode lookup.
    ...options,
  });
}

// ─── 1. Node ────────────────────────────────────────────────────────────────
step('Verify Node.js');
const nvmrc = existsSync(join(ROOT, '.nvmrc'))
  ? readFileSync(join(ROOT, '.nvmrc'), 'utf8').trim().replace(/^v/, '')
  : null;
const nodeMajor = process.versions.node.split('.')[0];
const requiredMajor = nvmrc?.split('.')[0];
if (requiredMajor && nodeMajor !== requiredMajor) {
  log(c.warn(`⚠ Node ${process.versions.node} but .nvmrc requires ${nvmrc}.`));
  log(c.dim('  Use nvm / volta / fnm to switch.'));
  record('warn', `Node version mismatch (have ${process.versions.node}, want ${nvmrc})`);
} else {
  log(c.ok(`✓ Node ${process.versions.node}${nvmrc ? ` (matches .nvmrc → ${nvmrc})` : ''}`));
}

// ─── 2. pnpm ────────────────────────────────────────────────────────────────
step('Verify pnpm');
const pnpmCheck = shell('pnpm', ['--version'], { silent: true });
if (pnpmCheck.status !== 0) {
  log(c.err('✗ pnpm not on PATH.') + ' Install: ' + c.bold('npm install -g pnpm@9'));
  process.exit(1);
}
const pnpmVersion = pnpmCheck.stdout.toString().trim();
log(c.ok(`✓ pnpm ${pnpmVersion}`));

// If `packageManager` in package.json pins a specific pnpm version (Corepack
// spec — exact pin only, no ranges), and the active pnpm differs, prepare
// the pinned version via Corepack. This makes fresh-clone setup on a second
// machine a one-shot affair: bootstrap reconciles the version itself instead
// of failing with a confusing "version mismatch" message from Corepack.
try {
  const pkgPath = join(ROOT, 'package.json');
  const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, 'utf8')) : {};
  const declared = pkg.packageManager;
  if (typeof declared === 'string' && declared.startsWith('pnpm@')) {
    const declaredVersion = declared.slice('pnpm@'.length);
    if (declaredVersion && declaredVersion !== pnpmVersion) {
      log(c.warn(`⚠ packageManager pins pnpm@${declaredVersion} but ${pnpmVersion} is active.`));
      const corepack = shell('corepack', ['--version'], { silent: true });
      if (corepack.status === 0) {
        log(c.dim(`  → corepack prepare pnpm@${declaredVersion} --activate`));
        const prep = shell('corepack', ['prepare', `pnpm@${declaredVersion}`, '--activate']);
        if (prep.status === 0) {
          log(c.ok(`✓ pnpm@${declaredVersion} activated via Corepack`));
        } else {
          log(c.warn('  Corepack prepare failed; continuing with active pnpm.'));
          record('warn', `pnpm version mismatch (have ${pnpmVersion}, want ${declaredVersion})`);
        }
      } else {
        log(c.dim('  Corepack not available — run manually: ') + c.bold(`corepack enable && corepack prepare pnpm@${declaredVersion} --activate`));
        record('warn', `pnpm version mismatch (have ${pnpmVersion}, want ${declaredVersion})`);
      }
    }
  }
} catch {
  // Best-effort — never block bootstrap on this check.
}

// ─── 2.5 gh CLI + gh-models extension (optional, for llm-call.mjs Copilot backend) ──
step('Verify gh CLI + gh-models extension');
if (ARGS.has('--skip-gh-extensions')) {
  log(c.dim('skipped (--skip-gh-extensions)'));
} else {
  const ghCheck = shell('gh', ['--version'], { silent: true });
  if (ghCheck.status !== 0) {
    log(c.dim('gh CLI not on PATH — Copilot provider in llm-call.mjs will be unavailable.'));
    log(c.dim('  Install: https://cli.github.com/ then re-run bootstrap.'));
  } else {
    const extList = shell('gh', ['extension', 'list'], { silent: true });
    const extOut = extList.stdout?.toString() ?? '';
    if (extList.status === 0 && /github\/gh-models/i.test(extOut)) {
      log(c.ok('✓ gh CLI + github/gh-models extension present'));
    } else {
      log(c.dim('Installing github/gh-models extension…'));
      const install = shell('gh', ['extension', 'install', 'github/gh-models'], { silent: true });
      if (install.status === 0) {
        log(c.ok('✓ github/gh-models extension installed'));
      } else {
        log(c.warn('⚠ failed to install github/gh-models — Copilot provider in llm-call.mjs unavailable.'));
        log(c.dim('  Manual: gh extension install github/gh-models'));
        record('warn', 'github/gh-models extension not installed');
      }
    }
  }
}

// ─── 3. Install deps ────────────────────────────────────────────────────────
step('Install dependencies');
if (ARGS.has('--skip-install')) {
  log(c.dim('skipped (--skip-install)'));
} else {
  const alreadyInstalled = existsSync(join(ROOT, 'node_modules'));
  if (alreadyInstalled && !ARGS.has('--reinstall')) {
    log(c.dim('node_modules exists — skipping (use --reinstall to force).'));
  } else {
    const installArgs = existsSync(join(ROOT, 'pnpm-lock.yaml')) ? ['install', '--frozen-lockfile'] : ['install'];
    const result = shell('pnpm', installArgs);
    if (result.status !== 0) {
      log(c.err('✗ pnpm install failed.'));
      process.exit(1);
    }
    log(c.ok('✓ dependencies installed'));
  }
}

// ─── 4. Husky hooks ─────────────────────────────────────────────────────────
step('Set up git hooks');
const prepare = shell('pnpm', ['prepare'], { silent: true });
if (prepare.status === 0) {
  log(c.ok('✓ husky hooks installed'));
} else {
  log(c.warn('⚠ pnpm prepare failed (no `prepare` script, or husky missing).'));
  record('warn', 'husky hooks not installed');
  exitCode = 1;
}

// ─── 5. Trinity baseline ────────────────────────────────────────────────────
if (ARGS.has('--skip-trinity')) {
  step('Trinity baseline check');
  log(c.dim('skipped (--skip-trinity)'));
} else if (existsSync(join(ROOT, 'tools/scripts/check-trinity.mjs'))) {
  step('Trinity baseline check');
  const trinity = shell('node', ['tools/scripts/check-trinity.mjs'], { silent: true });
  const trinityOut = (trinity.stdout?.toString() ?? '') + (trinity.stderr?.toString() ?? '');
  if (trinity.status === 0) {
    log(c.ok(trinityOut.trim().split('\n').pop() ?? 'trinity in sync'));
  } else {
    log(c.warn('⚠ trinity drift:'));
    for (const line of trinityOut.trim().split('\n')) log(`  ${line}`);
    record('warn', 'Trinity baseline drift');
    exitCode = 1;
  }
}

// ─── 6. User-profile config ────────────────────────────────────────────────
const examplePath = join(ROOT, 'config.example.json');
if (!ARGS.has('--skip-config') && existsSync(examplePath)) {
  step('User-profile config');

  const repoName = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).name;
  const override = process.env['NOWIRO_CONFIG_DIR']?.trim();
  const xdg = process.env['XDG_CONFIG_HOME']?.trim();
  const configDir = override
    ? resolve(override, repoName)
    : xdg
      ? resolve(xdg, 'nowiro', repoName)
      : join(homedir(), '.config', 'nowiro', repoName);
  const configPath = join(configDir, 'config.json');

  if (existsSync(configPath)) {
    log(c.ok('✓ exists') + ' ' + c.dim(configPath));
    const content = readFileSync(configPath, 'utf8');
    if (/PASTE_YOUR_/i.test(content)) {
      log(c.warn('⚠ still contains PASTE_YOUR_ placeholders — edit before use.'));
      record('warn', 'User config has placeholder tokens');
    }
  } else {
    mkdirSync(configDir, { recursive: true });
    copyFileSync(examplePath, configPath);
    if (!IS_WIN) {
      try {
        chmodSync(configPath, 0o600);
      } catch {
        // best-effort — surface as a warning later
      }
    }
    log(c.ok('✓ created') + ' ' + c.dim(configPath));
    log(c.warn('⚠ Edit the file — replace every PASTE_YOUR_… placeholder with a real token.'));
    if (IS_WIN) {
      log(c.dim('  notepad "' + configPath + '"'));
    } else {
      log(c.dim('  $EDITOR "' + configPath + '"  (file mode is 0600)'));
    }
    record('warn', 'New user config seeded — fill in tokens');
  }
}

// ─── 7. Summary ─────────────────────────────────────────────────────────────
step('Summary');
if (findings.length === 0) {
  log(c.ok('✓ All checks passed.'));
} else {
  for (const f of findings) {
    const fmt = f.severity === 'err' ? c.err : c.warn;
    log(fmt(`• ${f.msg}`));
  }
}

process.stdout.write(
  '\n' +
    c.bold('Next steps') +
    '\n' +
    c.dim('  • Edit user config (if seeded above).') +
    '\n' +
    c.dim('  • Read CLAUDE.md or .github/copilot-instructions.md.') +
    '\n' +
    c.dim('  • Run: pnpm typecheck && pnpm test') +
    '\n\n',
);

process.exit(exitCode);
