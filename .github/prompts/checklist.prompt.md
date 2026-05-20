---
mode: agent
description: Phase 3.5 of spec-driven flow — quality gate dla jakości requirements ("unit tests for English")
tools: ['editFiles', 'search', 'problems']
---

# Checklist (Faza 3.5 — SDD)

Uruchom **Fazę 3.5** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir

## Co robić

1. Przełącz na chat mode **orchestrator**.
2. Odmów jeśli `spec.md` + `plan.md` + `tasks.md` nie istnieją — route do brakującej fazy.
3. Wykonaj dual review (persona **analyst** sprawdza spec, persona **architect** sprawdza plan + tasks).
4. Wygeneruj `docs/analytical/specs/<slug>/checklist.md` z items CL001–CL010 (core) + CL011+ gdy applicable (security/public-API/AI surfaces).
5. Każdy item ma kontekst (`spec.md:42` lub `plan.md:T003`).
6. Pass criterion: zero `[ ]` unchecked po dual review.

## Nie

- Generuj checklisty bez kontekstu (`path:line` jest obowiązkowe per item).
- Markuj `[x]` bez weryfikacji w pliku źródłowym.
- Pomijaj `N/A` w uzasadnieniu — każdy `N/A` ma reason w nawiasie.

End-of-turn: print summary (`<N> pass, <M> fail, <K> N/A`); pytaj użytkownika o accept przed `/analyze`.
