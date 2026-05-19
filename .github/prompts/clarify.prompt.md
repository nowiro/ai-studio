---
mode: agent
description: Phase 1.5 of spec-driven flow — resolve open questions in spec.md
tools: ['editFiles', 'search', 'problems']
---

# Clarify (Phase 1.5 — SDD)

Run **Phase 1.5** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir under `docs/analytical/specs/`
- `${selection}` — optional context

## What to do

1. Switch to the **analyst** persona.
2. Read `docs/analytical/specs/<slug>/spec.md`.
3. List every `[?]` marker as a numbered open question in `clarify.md` (same dir).
4. Ask the user one question at a time — wait for the answer before the next.
5. As each answer arrives, update `spec.md` in place and tick the question off in `clarify.md`.

## Don't

- Batch the questions. One decision at a time keeps the user crisp.
- Speculate an answer when the user hasn't given one. Stay blocked on `[?]`.

Done when `spec.md` has zero `[?]` markers. End-of-turn lists what was resolved and what's still open.
