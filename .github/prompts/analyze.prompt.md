---
mode: agent
description: Phase 3.6 of spec-driven flow — non-destructive cross-artifact consistency check
tools: ['editFiles', 'search', 'problems']
---

# Analyze (Faza 3.6 — SDD)

Uruchom **Fazę 3.6** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir

## Co robić

1. Przełącz na personę **architect** (z code-reviewer w trybie audit).
2. Odmów jeśli `spec.md` + `plan.md` + `tasks.md` nie istnieją.
3. Odmów jeśli `checklist.md` brakuje a feature jest high-assurance — route do `/checklist`.
4. **Nie modyfikuj** żadnego artefaktu. To audit, nie rewrite.
5. Wykonaj 7 heurystyk z workflow §"Faza 3.6 Analyze":
   - Spec ↔ Plan coverage
   - Plan ↔ Tasks decomposition
   - Tasks ↔ Spec traceability
   - DAG integrity
   - Agent coverage
   - Rule alignment
   - Drift detection (mtime check)
6. Zapisz raport do `docs/analytical/specs/<slug>/analysis.md`: `## Status` + `### Findings` (PASS/WARN/FAIL z `path:line` + `Suggested:`).

## Nie

- Modyfikuj `spec.md` / `plan.md` / `tasks.md` w tej fazie — analyze jest read-only.
- Wprowadzaj FAIL findings bez `Suggested:` remedy.
- Przechodź do `/implement` gdy istnieje jakikolwiek `FAIL` — route z powrotem do producing agenta.

End-of-turn: print summary (`<N> FAIL / <M> WARN / <K> PASS`). FAIL > 0 blokuje `/implement`.
