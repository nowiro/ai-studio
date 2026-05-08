---
description: Phase 1 of spec-driven flow — analyst writes spec.md (what & why, no tech)
argument-hint: <one-line feature description>
allowed-tools: Read, Glob, Grep, Edit, Write, Agent
---

Run **Phase 1** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Feature: $ARGUMENTS

Spawn the **analyst** subagent. Pass the description and instruct it to:

1. Load `.ai/rules/principles.md` and `.ai/context/personas.md`.
2. Pick a slug (`<YYYY-MM-DD>-<kebab-feature>`) and create `docs/analytical/specs/<slug>/spec.md`.
3. Capture: user story, personas (cite ids), acceptance criteria (Given/When/Then where useful), success metrics, non-goals, open questions.
4. **No tech choices.** No "use signals", no "Angular X", no library picks — that's `/plan`.
5. Mark every unresolved point with `[?]` so `/clarify` can find them.

End-of-turn: report the path to `spec.md` and whether `/clarify` is needed (any `[?]` markers left).
