---
description: Phase 4 of spec-driven flow — orchestrator executes tasks.md, gating each one
argument-hint: <feature-slug, optional> [<task-id|all>, defaults to "all">]
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, TodoWrite, Agent
---

Run **Phase 4** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Args: $ARGUMENTS — first token is feature slug (defaults to most-recent), second is `<task-id>` or `all` (defaults to `all`).

Spawn the **orchestrator** subagent. Instruct it to walk `tasks.md` and:

1. For each task in topological order (respecting `blocked_by` / `parallel_with`):
   - Delegate to the named `agent` with the task's `inputs` and `done_when`.
   - Validate the result against `done_when`. On fail: route back with the failure context. After 3 failures, escalate to user.
   - Append a one-liner to `docs/analytical/specs/<slug>/runs/<task-id>.log`.
2. After all tasks: run the validation gate from `core.md`:
   ```bash
   pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build && pnpm ai:validate
   ```
3. Delegate to **code-reviewer**. If the change touches auth / sanitisation / deps / AI surfaces, also delegate to **security-auditor** (in parallel).
4. Delegate to **doc-writer** for any public-API or behaviour change.

End-of-turn: emit the canonical `done:` block from `core.md`. List every changed file, the spec slug, the ADR id (if any), and any followups.

## Hard rules

- Never claim `done:` while any validator is red.
- Never skip a task's `done_when` check, even if the agent reports success.
- Never bundle unrelated work into this run — file a followup instead.
