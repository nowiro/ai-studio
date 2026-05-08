#!/usr/bin/env node
/**
 * doc-audit.mjs — combine docs scan + public-API scan into a markdown audit report.
 *
 * Output: writes to `tmp/doc-audit-<YYYY-MM-DD>.md` AND prints summary to stdout.
 *
 * Findings categories (mirrors `.ai/agents/doc-auditor.md`):
 *   - must-fix:     drift, broken internal link, missing frontmatter (in .ai/), stale fact (heuristic)
 *   - should-fix:   undocumented public export, dangling reference (doc names a missing symbol)
 *   - nice-to-have: heading hierarchy gap
 *
 * Pure: re-runs the scanners, then computes diffs. No LLM, no network.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, posix, relative, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const TODAY = new Date().toISOString().slice(0, 10);
const OUT = resolve(ROOT, `tmp/doc-audit-${TODAY}.md`);

function runNode(script) {
  execFileSync(process.execPath, [script], { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'] });
}

async function readJSON(p) {
  return JSON.parse(await readFile(p, 'utf8'));
}

function renderList(items, render) {
  if (items.length === 0) return '_(none)_';
  return items.map(render).join('\n');
}

/**
 * Strip the parts of a markdown doc that legitimately mention anti-patterns:
 *   - fenced code blocks (``` ... ```)
 *   - sections under "Forbidden", "Anti-patterns", "Don't", "Don'ts", "What to avoid",
 *     "Removed" (including numbered variants like "## 8. Anti-patterns") — until the next heading
 *   - lines containing negation indicators (don't, never, do not, no `X`, no longer, ❌, …)
 *   - markdown table rows — typically Do/Don't contrast examples in rule docs
 *
 * Used to reduce false positives in stale-fact / dangling-reference checks. The raw
 * doc is still scanned for broken links and missing frontmatter.
 */
const ANTI_HEADING_RE =
  /^(#{1,6})\s+(?:\d+\.\s+)?(?:Forbidden|Anti[- ]patterns?|Don'?t ?s?|What to avoid|Removed|Pitfalls|What this is NOT|What every agent MUST NOT do)\b/i;

const NEGATION_LINE_RE =
  /(?:\bdon'?t\b|\bnever\b|\bdo\s+not\b|\bno\s+longer\b|\bforbidden\b|\banti[- ]pattern\b|❌|\bdeprecated\b|\bremoved\b|\bsuperseded\b|\bnot\s+needed\b|→\s*not\s+needed|\bno\s+`)/i;

/**
 * Strip the parts of a markdown doc that legitimately mention anti-patterns:
 *   - fenced code blocks
 *   - sections under "Forbidden", "Anti-patterns", "Don't", "What to avoid",
 *     "Removed", "Pitfalls", "What this is NOT", "What every agent MUST NOT do"
 *     (including numbered variants like "## 8. Anti-patterns") — until the next heading
 *   - lines containing negation indicators (don't, never, do not, no longer, no `X`, ❌ …)
 *   - markdown table rows (`| … |`) — typically Do/Don't contrast examples in rule docs
 *
 * Inline code spans are kept so dangling-reference checks still see `Foo` mentions.
 */
function stripExamples(text) {
  // 1. Strip fenced code blocks first (multi-line — easier as regex than line walk).
  let s = text.replace(/```[\s\S]*?```/g, '');

  // 2. Walk lines: strip "anti-pattern" sections, negation lines, and table rows.
  const lines = s.split('\n');
  const out = [];
  let inAntiSection = false;
  for (const line of lines) {
    if (/^#{1,6}\s/.test(line)) {
      inAntiSection = ANTI_HEADING_RE.test(line);
      // The heading line itself is dropped if it starts an anti-section.
      if (!inAntiSection) out.push(line);
      continue;
    }
    if (inAntiSection) continue;
    if (NEGATION_LINE_RE.test(line)) continue;
    // Skip table rows — rule-doc tables are nearly always Do/Don't contrast examples.
    if (/^\s*\|/.test(line)) continue;
    out.push(line);
  }
  return out.join('\n');
}

async function main() {
  // 1. Refresh inputs (single responsibility — each scanner is its own script).
  console.log('▶ Running scan-docs.mjs');
  runNode(resolve(ROOT, 'tools/scripts/scan-docs.mjs'));
  console.log('▶ Running scan-public-api.mjs');
  runNode(resolve(ROOT, 'tools/scripts/scan-public-api.mjs'));

  const docs = await readJSON(resolve(ROOT, 'tmp/docs-scan.json'));
  const apis = await readJSON(resolve(ROOT, 'tmp/public-api.json'));

  // Build a corpus of all doc bodies once (DRY — re-read controlled to one pass).
  // Two views per doc: `corpus` is raw (used for broken-link + frontmatter checks),
  // `prose` strips fenced code + inline code + anti-pattern sections so that
  // stale-fact / dangling-reference checks don't flag legitimate "this is forbidden" mentions.
  const corpus = new Map();
  const prose = new Map();
  for (const d of docs.docs) {
    const raw = await readFile(resolve(ROOT, d.path), 'utf8');
    corpus.set(d.path, raw);
    prose.set(d.path, stripExamples(raw));
  }

  const findings = {
    mustFix: [],
    shouldFix: [],
    niceToHave: [],
    positives: [],
  };
  let auId = 0;
  const nextId = () => `AU-${String(++auId).padStart(3, '0')}`;

  // ---- must-fix: missing frontmatter on `.ai/` files ----
  for (const d of docs.docs) {
    if (d.path.startsWith('.ai/') && !d.hasFrontmatter && !d.path.endsWith('README.md')) {
      findings.mustFix.push({
        id: nextId(),
        kind: 'missing-frontmatter',
        file: d.path,
        problem: 'File under .ai/ is missing YAML frontmatter (id/title/type/version).',
        remediation: 'Add the canonical frontmatter block. See sibling files for the schema.',
      });
    }
  }

  // ---- must-fix: broken internal links ----
  // GitHub renders `../../security/advisories/...`, `../../issues`, `../../pulls`, `../../actions`
  // and similar repo-relative magic paths even though they don't exist on disk. Allow them.
  const githubMagicRe = /^\.\.\/\.\.\/(security|issues|pulls?|discussions|actions|releases|wiki|projects|labels|milestones|graphs|network|settings)/;
  for (const d of docs.docs) {
    const base = dirname(d.path);
    for (const link of d.links) {
      if (/^https?:\/\//i.test(link) || link.startsWith('#') || link.startsWith('mailto:')) continue;
      const cleaned = link.split('#')[0].split('?')[0];
      if (!cleaned) continue;
      if (githubMagicRe.test(cleaned)) continue; // GitHub-rendered paths
      const resolved = posix.normalize(posix.join(base, cleaned));
      const abs = resolve(ROOT, resolved);
      if (!existsSync(abs)) {
        findings.mustFix.push({
          id: nextId(),
          kind: 'broken-link',
          file: d.path,
          problem: `Link → \`${link}\` resolves to \`${resolved}\` which doesn't exist.`,
          remediation: 'Fix the link or remove it.',
        });
      }
    }
  }

  // ---- must-fix: stale-fact heuristics (drift markers) ----
  // Note: ADRs are excluded — they explain *why* something was removed/changed and
  // legitimately mention the old name. So are run logs (historical record).
  const driftPatterns = [
    { re: /standalone\s*:\s*true/g, why: 'standalone is implicit in Angular 21+ — drop the explicit flag.' },
    { re: /@analogjs\/vitest-angular/g, why: 'Angular 21 has native Vitest via @angular/build:unit-test — Analog test bridge no longer needed.' },
    { re: /tailwind\.config\.(js|cjs|mjs|ts)/g, why: 'Tailwind v4 is CSS-first — config lives in styles/tailwind.css under @theme, not in a JS config.' },
    { re: /\*ngIf|\*ngFor|\*ngSwitch/g, why: 'Use native control flow (@if / @for / @switch) per .ai/rules/angular.md.' },
    { re: /@HostBinding|@HostListener/g, why: 'Use the host metadata object instead of decorators per .ai/rules/angular.md.' },
    { re: /constructor\s*\(\s*(?:private|public|protected|readonly)\s+\w/g, why: 'Use inject() instead of constructor DI per .ai/rules/angular.md.' },
    { re: /@Input\s*\(\)|@Output\s*\(\)/g, why: 'Use input() / output() signal APIs instead of @Input/@Output decorators per .ai/rules/angular.md.' },
    { re: /@NgModule\s*\(/g, why: 'New code should be standalone — NgModule is legacy in Angular 21+.' },
    { re: /new BrowserAnimationsModule|BrowserAnimationsModule/g, why: 'Use provideAnimationsAsync() instead of BrowserAnimationsModule.' },
  ];
  const isHistoricalDoc = (path) =>
    path.includes('docs/adr/') || path.includes('docs/ai-workflow/runs/') || path.includes('docs/architecture/post-mortems/');

  for (const d of docs.docs) {
    if (isHistoricalDoc(d.path)) continue;
    const txt = prose.get(d.path); // skip code/anti-pattern sections
    for (const { re, why } of driftPatterns) {
      const matches = [...txt.matchAll(re)];
      if (matches.length > 0) {
        findings.mustFix.push({
          id: nextId(),
          kind: 'stale-fact',
          file: `${d.path}:${(txt.slice(0, matches[0].index).split('\n')).length}`,
          problem: `Doc mentions \`${matches[0][0]}\` (${matches.length} occurrence${matches.length > 1 ? 's' : ''}). ${why}`,
          remediation: 'Verify against current code; rewrite or remove the stale claim.',
        });
      }
    }
  }

  // ---- positive: empty workspace ----
  if (apis.exportCount === 0) {
    findings.positives.push('No public-API exports yet — undocumented-export and dangling-reference checks skipped.');
  }

  // ---- should-fix: undocumented public exports ----
  // An export is "documented" if its name (with word boundary) appears in any markdown body.
  const allBodies = [...corpus.values()].join('\n\n');
  for (const lib of apis.apis) {
    for (const ex of lib.exports) {
      if (ex.name === '*') continue;
      const re = new RegExp(`\\b${ex.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (!re.test(allBodies)) {
        findings.shouldFix.push({
          id: nextId(),
          kind: 'undocumented-export',
          file: `${lib.path}:${ex.line}`,
          problem: `Public export \`${ex.name}\` (${ex.kind}) is not mentioned in any doc.`,
          remediation: 'Mention in the lib README or relevant docs/ page.',
        });
      }
    }
  }

  // ---- should-fix: docs that name a missing symbol (dangling reference) ----
  // Skip the check entirely when the workspace has no exports yet (e.g. fresh starter
  // with no apps/libs) — every example mention would be a false positive.
  if (apis.exportCount > 0) {
    const allExportNames = new Set(
      apis.apis.flatMap((a) => a.exports.map((e) => e.name)).filter((n) => n && n !== '*'),
    );
    const codeIdentRe = /`([A-Z][A-Za-z0-9_]{2,})`/g;
    for (const d of docs.docs) {
      if (!d.path.includes('docs/') && !d.path.startsWith('.ai/')) continue;
      const txt = prose.get(d.path);
      const seen = new Set();
      let m;
      while ((m = codeIdentRe.exec(txt)) !== null) {
        const ident = m[1];
        if (seen.has(ident)) continue;
        seen.add(ident);
        if (!/(Component|Service|Store|Api|Module|Pipe|Directive|Guard|Resolver|Repository)$/.test(ident)) continue;
        if (!allExportNames.has(ident)) {
          const line = (txt.slice(0, m.index).split('\n')).length;
          findings.shouldFix.push({
            id: nextId(),
            kind: 'dangling-reference',
            file: `${d.path}:${line}`,
            problem: `Doc references \`${ident}\` which doesn't exist as a public export anywhere.`,
            remediation: 'Update the name or remove the mention.',
          });
        }
      }
    }
  }

  // ---- nice-to-have: heading hierarchy gap ----
  for (const d of docs.docs) {
    const levels = d.headings.map((h) => h.level);
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        findings.niceToHave.push({
          id: nextId(),
          kind: 'heading-gap',
          file: `${d.path}`,
          problem: `Heading level jumps from h${levels[i - 1]} to h${levels[i]} ("${d.headings[i].text}").`,
          remediation: 'Insert the intermediate heading or restructure.',
        });
        break; // one per file is enough
      }
    }
  }

  // ---- positives: docs with frontmatter that match the canonical shape ----
  const wellFormed = docs.docs.filter(
    (d) =>
      d.path.startsWith('.ai/') &&
      d.hasFrontmatter &&
      /(^|\n)id:\s*\S+/.test(d.frontmatter ?? '') &&
      /(^|\n)version:\s*\S+/.test(d.frontmatter ?? ''),
  ).length;
  if (wellFormed > 0) {
    findings.positives.push(`${wellFormed} files under .ai/ have valid frontmatter (id/version).`);
  }

  // ---- Render markdown report ----
  const md = `# Documentation audit — ${TODAY}

> Generated by \`tools/scripts/doc-audit.mjs\`. Scanners: \`scan-docs.mjs\` (${docs.count} docs) + \`scan-public-api.mjs\` (${apis.exportCount} exports across ${apis.indexCount} index files).

## Summary

| Severity      | Count |
| ------------- | ----- |
| must-fix      | ${findings.mustFix.length} |
| should-fix    | ${findings.shouldFix.length} |
| nice-to-have  | ${findings.niceToHave.length} |

${findings.positives.length > 0 ? `### Positive observations\n${findings.positives.map((p) => `- ${p}`).join('\n')}\n` : ''}

## Must-fix

${renderList(findings.mustFix, (f) => `- **${f.id}** [${f.kind}] \`${f.file}\` — ${f.problem}\n  - _Remediation:_ ${f.remediation}`)}

## Should-fix

${renderList(findings.shouldFix, (f) => `- **${f.id}** [${f.kind}] \`${f.file}\` — ${f.problem}\n  - _Remediation:_ ${f.remediation}`)}

## Nice-to-have

${renderList(findings.niceToHave, (f) => `- **${f.id}** [${f.kind}] \`${f.file}\` — ${f.problem}\n  - _Remediation:_ ${f.remediation}`)}

---

_Rerun: \`pnpm docs:audit\`. Hand to the **doc-auditor** agent to triage and decide whether to open issues or regenerate docs._
`;

  await mkdir(resolve(ROOT, 'tmp'), { recursive: true });
  await writeFile(OUT, md);
  console.log(
    `✓ Wrote ${relative(ROOT, OUT)} — must-fix: ${findings.mustFix.length}, should-fix: ${findings.shouldFix.length}, nice-to-have: ${findings.niceToHave.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
