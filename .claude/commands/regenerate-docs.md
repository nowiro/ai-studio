---
description: Regenerate docs from the latest doc-audit report
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Run **after** `/audit-docs`.

Steps:

1. Locate the latest `tmp/doc-audit-*.md`. If none, run `/audit-docs` first.
2. Spawn the **doc-auditor** subagent in *regeneration mode* (per `.ai/agents/doc-auditor.md`).
3. For each must-fix item: doc-auditor verifies against current code and rewrites the affected section.
4. For each should-fix item: append a section to the appropriate doc (lib README, dependencies map, etc.).
5. Re-run `pnpm docs:audit` to confirm the delta.
6. Open a single PR titled `docs(audit): regenerate from <date> report` linking the original audit report and showing the before/after numbers.

Twin Copilot prompt: [`.github/prompts/regenerate-docs.prompt.md`](../../.github/prompts/regenerate-docs.prompt.md).
