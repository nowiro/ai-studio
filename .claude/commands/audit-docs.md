---
description: Run the documentation audit workflow — scan, classify, open issues
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Run the workflow at `.ai/workflows/documentation-audit.md`.

Steps:

1. Run scanners: `pnpm docs:scan && pnpm docs:api && pnpm docs:audit`.
2. Spawn the **doc-auditor** subagent with the path to `tmp/doc-audit-<date>.md`.
3. Doc-auditor classifies findings (must-fix / should-fix / nice-to-have).
4. For must-fix and should-fix clusters → open one issue per area using `.github/ISSUE_TEMPLATE/documentation.yml`.
5. Report back with the audit verdict YAML.

Twin Copilot prompt: [`.github/prompts/audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md).
