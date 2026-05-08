---
description: Phase 3 of spec-driven flow — orchestrator decomposes plan.md into tasks.md
argument-hint: <feature-slug, optional — defaults to most-recent spec dir>
allowed-tools: Read, Glob, Grep, Edit, Write, TodoWrite, Agent
---

Run **Phase 3** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Target slug: $ARGUMENTS (if empty, pick the most recent dir under `docs/analytical/specs/`).

Spawn the **orchestrator** subagent. Instruct it to:

1. Refuse if `plan.md` is missing or the ADR (if any) is not `accepted`.
2. Decompose the plan into atomic, ordered tasks in `docs/analytical/specs/<slug>/tasks.md`.
3. Each task entry MUST have: `id` (T001, T002, …), `title` (imperative), `agent` (`frontend-developer` / `backend-developer` / `test-engineer` / `doc-writer` / `architect` / `security-auditor`), `inputs`, `outputs`, `done_when`, `parallel_with` (optional), `blocked_by` (optional).
4. Tasks should be 1-turn-sized. Split anything bigger.
5. The whole task list MUST form a DAG (no cycles).

End-of-turn: print the task DAG as a tree; ask the user to accept before `/implement`.
