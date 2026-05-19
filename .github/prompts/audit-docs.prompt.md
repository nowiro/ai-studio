---
mode: agent
description: Audit docs against current code and produce a compliance report
tools: ['editFiles', 'search', 'runCommands']
---

# Audit docs

Follow the workflow at [`.ai/workflows/documentation-audit.md`](../../.ai/workflows/documentation-audit.md).

## What to do

1. Run the deterministic scanners:

   ```bash
   pnpm docs:scan          # tools/scripts/scan-docs.mjs
   pnpm docs:api            # tools/scripts/scan-public-api.mjs
   pnpm docs:audit          # tools/scripts/doc-audit.mjs → tmp/doc-audit-<date>.md
   ```

2. Load `.ai/agents/doc-auditor.md`. Read `tmp/doc-audit-<date>.md`.
3. For each finding, classify: **must-fix** (drift / broken link / missing frontmatter), **should-fix** (undocumented public API), **nice-to-have** (cosmetic).
4. Open one issue per cluster of related findings using `.github/ISSUE_TEMPLATE/documentation.yml`. Link the audit report.
5. End with the verdict YAML defined in the doc-auditor role file.

## Don't

- Open dozens of micro-issues — group by area / library.
- Rewrite docs in this step. Use `regenerate-docs` for that.
- Mark `done:` while must-fix items remain unaddressed.
