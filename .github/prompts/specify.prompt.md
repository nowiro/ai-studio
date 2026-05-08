---
mode: agent
description: Phase 1 of spec-driven flow — analyst writes spec.md (what & why, no tech)
tools: ["editFiles", "search", "problems"]
---

# Specify (Phase 1 — SDD)

Run **Phase 1** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:feature:Describe the feature in one sentence}` — high-level goal
- `${input:size:T-shirt size (XS/S/M/L/XL)}` — estimated effort
- `${selection}` — optional code context

## What to do

1. Switch to the **analyst** persona (load `.ai/agents/analyst.md`).
2. Load `.ai/rules/principles.md` and `.ai/context/personas.md`.
3. Pick a slug (`<YYYY-MM-DD>-<kebab-feature>`) and create `docs/analytical/specs/<slug>/spec.md`.
4. Capture: user story, personas (cite ids from personas.md), acceptance criteria (Given/When/Then where useful), success metrics, non-goals, open questions.
5. Mark every unresolved point with `[?]` so a `/clarify` pass can find them.

## Don't

- Pick a tech stack. No "use Angular signals", no library names, no framework versions — that's `/plan`.
- Write more than ~1 page. Specs are crisp; details belong in plan.md.
- Resolve open questions on your own. List them with `[?]`.

End-of-turn: report the path to `spec.md` and whether `/clarify` is needed (any `[?]` markers left).
