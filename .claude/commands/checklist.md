---
description: Phase 3.5 of spec-driven flow — quality gate dla jakości requirements ("unit tests for English")
argument-hint: <feature-slug, optional — defaults to most-recent spec dir>
allowed-tools: Read, Glob, Grep, Edit, Write, TodoWrite, Agent
---

Run **Phase 3.5** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Target slug: $ARGUMENTS (if empty, pick the most recent dir under `docs/analytical/specs/`).

Spawn the **orchestrator** subagent. Instruct it to:

1. Refuse if `spec.md` + `plan.md` + `tasks.md` nie istnieją — route do brakującej fazy.
2. Spawn dual-review: **analyst** (cytuje persony, AC, success metrics) + **architect** (cytuje generator plan, risks, module taxonomy).
3. Wygeneruj `docs/analytical/specs/<slug>/checklist.md` z core itemami CL001–CL010 z workflow (z dodatkami CL011+ gdy applicable — security/public-API/AI surfaces).
4. Każdy item ma kontekst (`spec.md:42` lub `plan.md:T003`); zaznacz `[x]` po weryfikacji lub `N/A` z uzasadnieniem.
5. Brak `[ ]` unchecked po dual review → pass; jakikolwiek `[ ]` → route z powrotem do producing agenta.

End-of-turn: print checklist summary (pass count, fail count, N/A count); pytaj użytkownika o accept przed `/analyze`.
