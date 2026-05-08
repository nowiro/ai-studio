---
mode: agent
description: Regenerate docs from a doc-audit report
tools: ["editFiles", "search", "runCommands"]
---

# Regenerate docs from audit

Run **after** `audit-docs`. Reads the latest report under `tmp/doc-audit-*.md` and rewrites the affected docs.

## What to do

1. Find the latest `tmp/doc-audit-*.md` report. If absent, run the `audit-docs` prompt first.
2. Load `.ai/agents/doc-auditor.md` plus `.ai/agents/doc-writer.md`.
3. For each must-fix item:
   - **Drift**: open the doc, replace the stale section with current truth (verify against code via the touched file).
   - **Broken link**: fix or remove the link.
   - **Missing frontmatter**: add the canonical block.
   - **Undocumented public export**: append a section to the lib's `README.md` and link from `docs/architecture/dependencies.md`.
4. Re-run `pnpm docs:audit` to confirm the new state.
5. Open a single PR titled `docs(audit): regenerate from <date> report` with:
   - bullet list of changed docs,
   - link to the original audit report,
   - delta in the audit summary numbers (before/after).

## Don't

- Invent facts. If a doc claims something that's not in the code, **delete the claim** rather than rewriting it.
- Bundle structural changes (new pages, renamed sections) — those need a separate PR.
