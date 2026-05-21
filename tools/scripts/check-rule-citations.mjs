#!/usr/bin/env node

/**
 * check-rule-citations.mjs — sprawdza czy commit messages w aktualnym branchu
 * cytują regułę inżynierską z `.ai/rules/`.
 *
 * Realizuje wymaganie z `.ai/workflows/spec-driven.md` Faza 4 (constitution
 * loading) — code-reviewer odrzuca PR bez rule citation. Adaptacja z
 * github/spec-kit PR #2460.
 *
 * Konwencja citation w commit message body / PR description / runs/*.log:
 *   - Rule id: SRP, DRY, KISS, YAGNI, SOLID-D, OCP, LSP, ISP, …
 *   - File reference: principles.md §13, styling.md §12, llm-optimization.md §10
 *
 * Wyjątek: commit subject z [trivial] flag pomija check (typo / format-only /
 * bump dependency bez API change).
 *
 * Flagi:
 *   --base=<ref>     base ref dla diff (default: origin/main)
 *   --strict         fail też na warnings (default: warning na missing, fail
 *                    tylko gdy 0 citations w całym range)
 *   --json           output jako JSON
 *
 * Exit codes:
 *   0 — wszystkie commity (poza [trivial]) cytują regułę
 *   1 — co najmniej jeden commit poza [trivial] bez citation
 *
 * @see .ai/workflows/spec-driven.md Faza 4
 * @see .ai/rules/principles.md (lista reguł cytowanych)
 */
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const ARGS = new Set(process.argv.slice(2));
const BASE = [...ARGS].find((a) => a.startsWith('--base='))?.split('=')[1] ?? 'origin/main';
const STRICT = ARGS.has('--strict');
const JSON_OUT = ARGS.has('--json');

// ── Rule id patterns ────────────────────────────────────────────────────────
// Match standard SOLID acronyms, principle abbreviations, file references.
const CITATION_PATTERNS = [
  /\b(DRY|KISS|YAGNI|SRP|OCP|LSP|ISP|SOLID-?D|DIP)\b/i,
  /\bprinciples\.md\b/i,
  /\b\w+\.md\s*§\s*\d+/i, // e.g. "styling.md §12"
  /\b(boy[-\s]?scout|least[-\s]?astonishment|fail[-\s]?fast|composition[-\s]?over[-\s]?inheritance)\b/i,
];

const TRIVIAL_PATTERN = /\[trivial\]/i;

function hasCitation(text) {
  return CITATION_PATTERNS.some((re) => re.test(text));
}

function isTrivial(subject) {
  return TRIVIAL_PATTERN.test(subject);
}

// ── Fetch commits ──────────────────────────────────────────────────────────
const commits = listCommits(BASE);

if (commits.length === 0) {
  if (JSON_OUT) {
    process.stdout.write(JSON.stringify({ commits: [], summary: { ok: 0, missing: 0, trivial: 0, total: 0 } }) + '\n');
  } else {
    process.stdout.write(`✓ No commits ahead of ${BASE} — nothing to check.\n`);
  }
  process.exit(0);
}

const findings = commits.map((c) => analyse(c));
const summary = {
  total: findings.length,
  ok: findings.filter((f) => f.status === 'ok').length,
  missing: findings.filter((f) => f.status === 'missing').length,
  trivial: findings.filter((f) => f.status === 'trivial').length,
};

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ commits: findings, summary }, undefined, 2) + '\n');
} else {
  for (const f of findings) {
    const icon = f.status === 'ok' ? '✓' : f.status === 'trivial' ? '↪' : '✗';
    process.stdout.write(
      `  ${icon} ${f.sha.slice(0, 8)} ${f.status === 'ok' ? f.matched : f.status === 'trivial' ? '[trivial]' : 'no citation'} — ${f.subject}\n`,
    );
  }
  process.stdout.write(
    `\nSummary: ✓ ${summary.ok}  ↪ ${summary.trivial}  ✗ ${summary.missing}  (total ${summary.total})\n`,
  );
}

// Exit logic
if (summary.missing === 0) {
  process.exit(0);
}
if (STRICT) {
  process.exit(1);
}
// Default: fail only if NO commit cites a rule (probably a feature without governance).
if (summary.ok === 0) {
  process.stderr.write('\n✗ Zero commits cite any rule — feature lacks constitution alignment.\n');
  process.exit(1);
}
process.stderr.write(`\n⚠ ${summary.missing} commit(s) lack rule citation (use --strict to fail).\n`);
process.exit(0);

// ── Helpers ────────────────────────────────────────────────────────────────

function listCommits(base) {
  const res = spawnSync('git', ['log', `${base}..HEAD`, '--format=%H|%s|%b%x00'], { encoding: 'utf8' });
  if (res.status !== 0) return [];
  return res.stdout
    .split('\0')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [sha, subject, ...bodyParts] = entry.split('|');
      return { sha, subject: subject ?? '', body: bodyParts.join('|') };
    });
}

function analyse(commit) {
  if (isTrivial(commit.subject)) {
    return { sha: commit.sha, subject: commit.subject, status: 'trivial' };
  }
  const fullText = `${commit.subject}\n${commit.body}`;
  for (const re of CITATION_PATTERNS) {
    const m = re.exec(fullText);
    if (m) return { sha: commit.sha, subject: commit.subject, status: 'ok', matched: m[0] };
  }
  return { sha: commit.sha, subject: commit.subject, status: 'missing' };
}
