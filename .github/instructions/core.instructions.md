---
applyTo: '**'
description: AI Studio core rules — applies to every file
---

# Reguły core (Copilot scope: każdy plik)

Pełny tekst: [`.ai/rules/core.md`](../../.ai/rules/core.md). Nie parafrazuj z pamięci — otwórz plik, gdy masz wątpliwości.

## MUSISZ

1. Przeczytać touched plik zanim ogłosisz że go znasz.
2. Robić najmniejszą rozsądną zmianę.
3. Cytować pliki jako `path:line`.
4. Trzymać `.ai/`, `.claude/` i `.github/instructions|prompts|chatmodes` w sync — to architektura universal-rules + thin-wrappers.
5. Zakańczać każdy multi-step turn blokiem `done:` lub `blocked:`.
6. **Plan-first generation** — dla wszystkiego co dotyka ≥ 2 plików LUB zmienia behaviour, orchestrator pisze plan markdown (`docs/ai-workflow/plans/<date>-<slug>.md` lub `docs/analytical/specs/<slug>/plan.md`) PRZED pierwszą delegacją specjalisty. Specjaliści odrzucają delegacje bez `plan:` + `task_id:` (patrz `.ai/rules/core.md` §7).

## NIE WOLNO

- Wymyślać ścieżek plików, nazw funkcji, wersji pakietów ani API.
- Bypassować git hooków (`--no-verify`).
- Commitować sekretów do jakiegokolwiek tracked file (w tym `.ai/`, `.github/`, docs).
- Markować taska jako done dopóki jakikolwiek walidator (lint, typecheck, test, e2e, build) jest czerwony.
- Bundlować refactora z feature lub bug fixem.
- Generować kodu, docs, testów ani scenariuszy jako specjalista bez orchestrator-owned plan markdown referencjonowanego w twojej delegacji.

## Definition of Done

```
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
```

Wszystko zielone + docs/ADR zaktualizowane gdzie behaviour się zmienił + Conventional Commit message.
