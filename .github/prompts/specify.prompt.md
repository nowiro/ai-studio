---
mode: agent
description: Phase 1 of spec-driven flow — analyst writes spec.md (what & why, no tech)
tools: ['editFiles', 'search', 'problems']
---

# Specify (Faza 1 — SDD)

Uruchom **Fazę 1** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:feature:Describe the feature in one sentence}` — high-level cel
- `${input:size:T-shirt size (XS/S/M/L/XL)}` — szacowany effort
- `${selection}` — opcjonalny code context

## Co robić

1. Przełącz na personę **analyst** (załaduj `.ai/agents/analyst.md`).
2. Załaduj `.ai/rules/principles.md` i `.ai/context/personas.md`.
3. Wybierz slug (`<YYYY-MM-DD>-<kebab-feature>`) i stwórz `docs/analytical/specs/<slug>/spec.md`.
4. Łap: user story, persony (cytuj ids z personas.md), acceptance criteria (Given/When/Then gdzie użyteczne), success metrics, non-goals, open questions.
5. Markuj każdy nieresolved point z `[?]`, żeby `/clarify` pass mógł je znaleźć.

## Nie

- Pickuj tech stack. Żadnego "use Angular signals", żadnych nazw library, żadnych wersji framework — to robota `/plan`.
- Piszesz więcej niż ~1 stronę. Specs są ostre; detale należą do plan.md.
- Resolwuj open questions na własną rękę. Wymień je z `[?]`.

End-of-turn: raportuj ścieżkę do `spec.md` i czy `/clarify` jest potrzebny (jakieś markery `[?]` pozostały).
