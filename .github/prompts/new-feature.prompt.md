---
mode: agent
description: Run the full new-feature workflow (analyst → architect → dev + test in parallel → reviewer + auditor → doc-writer)
tools: ["editFiles", "search", "runCommands", "runTasks", "problems"]
---

# New feature

Run the full multi-agent flow defined in [`.ai/workflows/new-feature.md`](../../.ai/workflows/new-feature.md).

## Inputs

- `${input:feature:Describe the feature in one sentence}` — high-level goal
- `${input:size:T-shirt size (XS/S/M/L/XL)}` — estimated effort
- `${selection}` — optional code context

## What to do

1. Switch to **orchestrator** chat mode (or follow the orchestrator's instructions inline if not available).
2. Read all of `.ai/rules/`, the orchestrator role at `.ai/agents/orchestrator.md`, and the workflow at `.ai/workflows/new-feature.md`.
3. Decompose the task using the `delegate:` YAML protocol from the orchestrator role file.
4. Sequence specialists per the workflow:
   1. analyst → spec
   2. architect → ADR + generator plan
   3. nx + angular-cli generators
   4. frontend-developer + (optional) backend-developer + test-engineer in parallel
   5. code-reviewer + (when relevant) security-auditor
   6. doc-writer
5. Validate with `pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build && pnpm ai:validate`.
6. End with the `done:` block from `core.md`.

## Don't

- Skip the analyst when scope is unclear.
- Bundle unrelated cleanup into the PR.
- Mark `done:` while any validator is red.
