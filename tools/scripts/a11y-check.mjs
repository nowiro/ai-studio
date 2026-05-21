#!/usr/bin/env node

/**
 * a11y-check.mjs — deterministyczny static scan HTML templates (apps + libs)
 * za common a11y anti-patterns z `.claude/skills/accessibility-a11y/SKILL.md §14`.
 *
 * Per `.ai/rules/llm-optimization.md §10` (deterministyczne skrypty zamiast
 * ad-hoc promptów). Static scan łapie 80% issues zanim aplikacja w ogóle
 * uruchomi axe-core w E2E (axe = runtime, ten skrypt = static).
 *
 * Detected patterns:
 *
 *   A1 (error)   `(click)="..."` bez tabindex / role / key handler
 *                — div-as-button anti-pattern (SKILL §14)
 *
 *   A2 (error)   `<input placeholder="...">` w `<mat-form-field>` bez
 *                `<mat-label>` — placeholder-as-label anti-pattern
 *
 *   A3 (error)   `<img>` bez `alt` (alt="" jest OK dla decorative)
 *
 *   A4 (warn)    `<button mat-icon-button>` bez `aria-label` lub
 *                `matTooltip` — icon-only przycisk bez nazwy dla SR
 *
 *   A5 (warn)    `outline: none` w SCSS bez `:focus-visible` override
 *                (focus invisible dla keyboard users)
 *
 *   A6 (info)    Hard-coded color hex (`#xxx`) zamiast `var(--mat-sys-*)`
 *                tokenu — może łamać dark mode / theme contract
 *
 * Flagi:
 *   --json              JSON output zamiast text
 *   --severity=<err|warn|info>  filtr per severity
 *   --root=<path>       custom root (default: cwd; skanuje apps/ + libs/)
 *
 * Exit codes:
 *   0 — zero errors (warnings OK)
 *   1 — co najmniej jeden error
 *
 * @see .claude/skills/accessibility-a11y/SKILL.md §14 Anti-patterns
 * @see .ai/rules/styling.md §13-§17
 */
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const SEVERITY = arg('--severity', null);
const SCAN_ROOT = resolve(ROOT, arg('--root', '.'));

function arg(flag, def) {
  const a = ARGS.find((x) => x.startsWith(`${flag}=`));
  return a ? a.split('=', 2)[1] : def;
}

const findings = [];
const IGNORE = new Set(['node_modules', 'dist', '.nx', 'coverage', '.angular', 'out-tsc', 'tmp']);

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (IGNORE.has(e.name) || e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile()) scan(full);
  }
}

function scan(file) {
  const ext = extname(file);
  if (!['.html', '.ts', '.scss', '.css'].includes(ext)) return;
  if (file.includes('.spec.') || file.includes('e2e/') || file.includes('e2e\\')) return;

  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    return;
  }

  if (ext === '.html' || ext === '.ts') {
    checkHtmlContent(file, content);
  }
  if (ext === '.scss' || ext === '.css') {
    checkScssContent(file, content);
  }
}

function checkHtmlContent(file, content) {
  // A1: (click)="..." na NIE-button/link element bez tabindex/role
  // Match full tag (od `<x` do `>`), żeby attrs PO `(click)=` też były sprawdzane.
  const clickRe = /<(\w+)\b([\s\S]*?)>/g;
  let m;
  while ((m = clickRe.exec(content)) !== null) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    if (!/\(click\)=/.test(attrs)) continue;
    const interactiveTags = [
      'button',
      'a',
      'mat-button',
      'mat-icon-button',
      'mat-flat-button',
      'mat-stroked-button',
      'mat-fab',
      'mat-mini-fab',
      'input',
    ];
    if (interactiveTags.includes(tag)) continue;
    if (/\btabindex=/i.test(attrs)) continue;
    if (/\brole=["'](?:button|link|tab|menuitem|option|presentation)["']/i.test(attrs)) continue;
    const line = posToLine(content, m.index);
    findings.push({
      rule: 'A1',
      severity: 'error',
      file: relative(ROOT, file),
      line,
      message: `<${tag}> z (click) bez tabindex — div-as-button anti-pattern`,
      hint: `Użyj <button mat-button> lub dodaj tabindex="0" role="button" (keydown.enter)`,
    });
  }

  // A2: <input placeholder="..."> w <mat-form-field> bez <mat-label>
  const formFieldRe = /<mat-form-field\b[^>]*>([\s\S]*?)<\/mat-form-field>/gi;
  while ((m = formFieldRe.exec(content)) !== null) {
    const inner = m[1];
    if (!/placeholder=/i.test(inner)) continue;
    if (/<mat-label\b/i.test(inner)) continue;
    const line = posToLine(content, m.index);
    findings.push({
      rule: 'A2',
      severity: 'error',
      file: relative(ROOT, file),
      line,
      message: `<input placeholder="..."> w <mat-form-field> bez <mat-label>`,
      hint: `Dodaj <mat-label>etykieta</mat-label>. Placeholder NIE jest etykietą dla screen reader.`,
    });
  }

  // A3: <img> bez alt (alt="" jest OK dla decorative)
  // Angular: support [alt]= (property binding) i (alt)= (rare). Multi-line tags OK.
  const imgRe = /<img\b([\s\S]*?)\/?>/gi;
  while ((m = imgRe.exec(content)) !== null) {
    const attrs = m[1];
    if (/(?:^|\s)(?:\[)?alt(?:\])?=/i.test(attrs)) continue;
    const line = posToLine(content, m.index);
    findings.push({
      rule: 'A3',
      severity: 'error',
      file: relative(ROOT, file),
      line,
      message: `<img> bez atrybutu alt`,
      hint: `Dodaj alt="opis" lub alt="" dla decorative images.`,
    });
  }

  // A4: <button mat-icon-button> bez aria-label / matTooltip
  const iconBtnRe = /<button\b([^>]*?)mat-icon-button\b([^>]*)>/gi;
  while ((m = iconBtnRe.exec(content)) !== null) {
    const attrs = m[1] + ' ' + m[2];
    if (/aria-label=/i.test(attrs) || /matTooltip=/i.test(attrs) || /\[attr\.aria-label\]=/i.test(attrs)) continue;
    const line = posToLine(content, m.index);
    findings.push({
      rule: 'A4',
      severity: 'warn',
      file: relative(ROOT, file),
      line,
      message: `<button mat-icon-button> bez aria-label / matTooltip`,
      hint: `Dodaj aria-label="akcja" lub matTooltip="akcja".`,
    });
  }
}

function checkScssContent(file, content) {
  // A5: outline: none bez :focus-visible override
  // Skip gdy outline: none jest WEWNĄTRZ &:focus-visible { ... } (legit box-shadow replacement)
  // lub gdy :focus-visible jest w pobliżu (override poniżej).
  const outlineNoneRe = /outline\s*:\s*(none|0)\s*;/gi;
  let m;
  while ((m = outlineNoneRe.exec(content)) !== null) {
    // Look back 500 chars for enclosing :focus-visible { (jeśli jesteśmy w block, OK)
    const before = content.slice(Math.max(0, m.index - 500), m.index);
    const lastFocusVisible = before.lastIndexOf(':focus-visible');
    if (lastFocusVisible !== -1) {
      const afterFocusVisible = before.slice(lastFocusVisible);
      const opensBraces = (afterFocusVisible.match(/\{/g) ?? []).length;
      const closesBraces = (afterFocusVisible.match(/\}/g) ?? []).length;
      if (opensBraces > closesBraces) continue; // wewnątrz :focus-visible block
    }
    // Look forward 2000 chars for sibling :focus-visible override
    const restAfter = content.slice(m.index, m.index + 2000);
    if (/:focus-visible/.test(restAfter)) continue;
    const line = posToLine(content, m.index);
    findings.push({
      rule: 'A5',
      severity: 'warn',
      file: relative(ROOT, file),
      line,
      message: `outline: none bez :focus-visible override`,
      hint: `Dodaj &:focus-visible { outline: 2px solid var(--mat-sys-primary); outline-offset: 2px; }`,
    });
  }

  // A6: Hard-coded hex color
  const hexRe = /(?<![\w-])#[0-9a-fA-F]{3,8}\b/g;
  while ((m = hexRe.exec(content)) !== null) {
    const lineStart = content.lastIndexOf('\n', m.index) + 1;
    const lineText = content.slice(lineStart, content.indexOf('\n', m.index));
    if (lineText.trim().startsWith('//')) continue;
    const line = posToLine(content, m.index);
    findings.push({
      rule: 'A6',
      severity: 'info',
      file: relative(ROOT, file),
      line,
      message: `Hard-coded color ${m[0]}`,
      hint: `Użyj var(--mat-sys-*) tokenu. Patrz angular-material-design SKILL §3.`,
    });
  }
}

function posToLine(content, pos) {
  return content.slice(0, pos).split('\n').length;
}

// ── Run ────────────────────────────────────────────────────────────────────
walk(SCAN_ROOT);

const filtered = SEVERITY ? findings.filter((f) => f.severity === SEVERITY) : findings;
const summary = {
  total: filtered.length,
  error: filtered.filter((f) => f.severity === 'error').length,
  warn: filtered.filter((f) => f.severity === 'warn').length,
  info: filtered.filter((f) => f.severity === 'info').length,
};

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ findings: filtered, summary }, undefined, 2) + '\n');
} else if (filtered.length === 0) {
  process.stdout.write('✓ a11y static scan: zero issues.\n');
} else {
  const byFile = {};
  for (const f of filtered) {
    byFile[f.file] = byFile[f.file] || [];
    byFile[f.file].push(f);
  }
  for (const [file, list] of Object.entries(byFile).sort()) {
    process.stdout.write(`\n${file}:\n`);
    for (const f of list) {
      const icon = f.severity === 'error' ? '✗' : f.severity === 'warn' ? '⚠' : 'ⓘ';
      process.stdout.write(`  ${icon} :${f.line} [${f.rule}] ${f.message}\n`);
      process.stdout.write(`     ${f.hint}\n`);
    }
  }
  process.stdout.write(
    `\nSummary: ✗ ${summary.error}  ⚠ ${summary.warn}  ⓘ ${summary.info}  (total ${summary.total})\n`,
  );
}

process.exit(summary.error > 0 ? 1 : 0);
