---
mode: agent
description: Phase 2 of spec-driven flow — architect writes plan.md (tech & architecture)
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# Plan (Faza 2 — SDD)

Uruchom **Fazę 2** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir
- `${selection}` — opcjonalny code context

## Co robić

1. Przełącz na personę **architect** (załaduj `.ai/agents/architect.md`).
2. Odmów jeśli `spec.md` nadal ma markery `[?]` — skieruj użytkownika do `/clarify` najpierw.
3. Załaduj `.ai/rules/principles.md` + `.ai/rules/{angular,nx,security,testing}.md` + spec.
4. Inspectuj aktualny Nx graph; konsultuj Angular docs dla każdego unfamiliar API.
5. Napisz `docs/analytical/specs/<slug>/plan.md` z:
   - Tech additions (z ADR ref jeśli non-trivial)
   - Module taxonomy — apps + libs targets i tags
   - Public API surface (eksporty `src/index.ts`)
   - Data model + contracts (linkuj subdir `contracts/` dla API design)
   - Risks + mitigations
   - Generator plan — dokładne komendy `nx generate …`
6. Jeśli zmiana zasługuje na ADR, draft `docs/adr/NNNN-<slug>.md` jako `Status: proposed`.

## Nie

- Dekomponować na taski tutaj — to robota `/tasks`.
- Pomijać generator plan. Hand-edytowany `project.json` jest zabroniony.

End-of-turn: prezentuj 5-bullet plan summary i pytaj użytkownika o accept przed przejściem do `/tasks`.
