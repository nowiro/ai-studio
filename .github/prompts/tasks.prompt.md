---
mode: agent
description: Phase 3 of spec-driven flow — orchestrator decomposes plan.md into tasks.md
tools: ['editFiles', 'search', 'problems']
---

# Tasks (Phase 3 — SDD)

Run **Phase 3** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir
- `${selection}` — optional context

## What to do

1. Switch to the **orchestrator** chat mode (or follow its role file inline).
2. Refuse if `plan.md` is missing OR the ADR (if any) is not `Status: accepted`.
3. Decompose the plan into atomic, ordered tasks in `docs/analytical/specs/<slug>/tasks.md`.
4. Each task MUST have: `id` (T001, …), `title` (imperative), `agent` (`frontend-developer` / `backend-developer` / `test-engineer` / `doc-writer` / `architect` / `security-auditor`), `inputs`, `outputs`, `done_when`, `parallel_with` (optional), `blocked_by` (optional).
5. Tasks should be 1-turn-sized. Split anything bigger.
6. The whole task list MUST form a DAG (no cycles).

## Don't

- Start implementing. Implementation is `/implement`.
- Skip `done_when`. Tasks without explicit verification are not allowed.

End-of-turn: print the task DAG as a tree and ask the user to accept before `/implement`.
