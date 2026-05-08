---
description: Phase 1.5 of spec-driven flow — resolve open questions in spec.md
argument-hint: <feature-slug, optional — defaults to most-recent spec dir>
allowed-tools: Read, Glob, Grep, Edit, Write, Agent
---

Run **Phase 1.5** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Target slug: $ARGUMENTS (if empty, pick the most recent dir under `docs/analytical/specs/`).

Spawn the **analyst** subagent. Instruct it to:

1. Read `docs/analytical/specs/<slug>/spec.md`.
2. List every `[?]` marker as a numbered open question in `clarify.md` in the same dir.
3. Ask the user each question one at a time (don't batch — one decision at a time keeps the user crisp).
4. As each answer comes in, update `spec.md` in place and tick the question off in `clarify.md`.

Done when `spec.md` has zero `[?]` markers.
