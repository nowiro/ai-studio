---
mode: agent
description: Phase 4 of spec-driven flow — orchestrator executes tasks.md, gating each one
tools: ['editFiles', 'search', 'runCommands', 'runTasks', 'problems']
---

# Implement (Phase 4 — SDD)

Run **Phase 4** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir
- `${input:task:Task id (T001) or "all"}` — what to run; defaults to `all`
- `${selection}` — optional context

## What to do

1. Switch to the **orchestrator** chat mode.
2. Walk `docs/analytical/specs/<slug>/tasks.md` in topological order (respecting `blocked_by` / `parallel_with`):
   1. Delegate to the named `agent` with `inputs` + `done_when`.
   2. Validate the agent's result against `done_when`. On fail: route back. After 3 fails, escalate to user.
   3. Append one line to `docs/analytical/specs/<slug>/runs/<task-id>.log`.
3. Run the validation gate from `core.md`:
   ```bash
   pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build && pnpm ai:validate
   ```
4. Delegate to **code-reviewer**. If auth / sanitisation / deps / AI surfaces touched, also **security-auditor** (parallel).
5. Delegate to **doc-writer** for any public-API or behaviour change.

## Don't

- Claim `done:` while any validator is red.
- Skip a task's `done_when` check, even if the agent reports success.
- Bundle unrelated work into this run — file a followup instead.

End-of-turn: emit the canonical `done:` block from `core.md`. List every changed file, the spec slug, the ADR id (if any), and any followups.
