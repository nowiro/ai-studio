---
mode: agent
description: Phase 1.5 of spec-driven flow — resolve open questions in spec.md
tools: ['editFiles', 'search', 'problems']
---

# Clarify (Faza 1.5 — SDD)

Uruchom **Fazę 1.5** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir pod `docs/analytical/specs/`
- `${selection}` — opcjonalny context

## Co robić

1. Przełącz na personę **analyst**.
2. Read `docs/analytical/specs/<slug>/spec.md`.
3. Wymień każdy marker `[?]` jako numbered open question w `clarify.md` (ten sam dir).
4. Pytaj użytkownika jedno pytanie na raz — czekaj na odpowiedź przed następnym.
5. Gdy każda odpowiedź przychodzi, update `spec.md` in place i odhacz pytanie w `clarify.md`.

## Nie

- Batchuj pytań. Jedna decyzja na raz trzyma użytkownika ostro.
- Spekuluj odpowiedzi gdy użytkownik nie udzielił. Pozostań blocked na `[?]`.

Done gdy `spec.md` ma zero markerów `[?]`. End-of-turn wymienia co zostało resolved a co jest jeszcze open.
