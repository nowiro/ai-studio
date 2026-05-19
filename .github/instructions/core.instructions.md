---
applyTo: '**'
description: AI Studio core rules — applies to every file
---

# Core rules (Copilot scope: every file)

Full text: [`.ai/rules/core.md`](../../.ai/rules/core.md). Don't paraphrase from memory — open the file when in doubt.

## You MUST

1. Read the touched file before claiming knowledge of it.
2. Make the smallest reasonable change.
3. Cite files as `path:line`.
4. Keep `.ai/`, `.claude/` and `.github/instructions|prompts|chatmodes` in sync — they're the universal-rules + thin-wrappers architecture.
5. End every multi-step turn with a `done:` or `blocked:` block.
6. **Plan-first generation** — for anything touching ≥ 2 files OR changing behaviour, the orchestrator writes a plan markdown (`docs/ai-workflow/plans/<date>-<slug>.md` or `docs/analytical/specs/<slug>/plan.md`) BEFORE the first specialist delegation. Specialists refuse delegations without `plan:` + `task_id:` (see `.ai/rules/core.md` §7).

## You MUST NOT

- Invent file paths, function names, package versions or APIs.
- Bypass git hooks (`--no-verify`).
- Commit secrets to any tracked file (including `.ai/`, `.github/`, docs).
- Mark a task done while any validator (lint, typecheck, test, e2e, build) is red.
- Bundle a refactor with a feature or bug fix.
- Generate code, docs, tests, or scenarios as a specialist without an orchestrator-owned plan markdown referenced in your delegation.

## Definition of Done

```
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
```

All green + docs/ADR updated where behaviour changed + Conventional Commit message.
