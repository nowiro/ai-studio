---
mode: agent
description: Phase 3 of spec-driven flow — orchestrator decomposes plan.md into tasks.md
tools: ['editFiles', 'search', 'problems']
---

# Tasks (Faza 3 — SDD)

Uruchom **Fazę 3** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir
- `${selection}` — opcjonalny context

## Co robić

1. Przełącz na chat mode **orchestrator** (lub śledź jego role file inline).
2. Odmów jeśli `plan.md` brakuje LUB ADR (jeśli jest) nie jest `Status: accepted`.
3. Zdekomponuj plan na atomic, ordered tasks w `docs/analytical/specs/<slug>/tasks.md`.
4. Każdy task MUSI mieć: `id` (T001, …), `title` (imperatywne), `agent` (`frontend-developer` / `backend-developer` / `test-engineer` / `doc-writer` / `architect` / `security-auditor`), `inputs`, `outputs`, `done_when`, `parallel_with` (opcjonalne), `blocked_by` (opcjonalne).
5. Taski powinny być 1-turn-sized. Rozbij cokolwiek większego.
6. Cała lista tasków MUSI formować DAG (żadnych cykli).

## Nie

- Zaczynaj implementacji. Implementacja to `/implement`.
- Pomijaj `done_when`. Taski bez jawnej weryfikacji nie są dozwolone.

End-of-turn: print task DAG jako drzewo i pytaj użytkownika o accept przed `/implement`.
