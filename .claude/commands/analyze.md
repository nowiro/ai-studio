---
description: Phase 3.6 of spec-driven flow — non-destructive cross-artifact consistency check
argument-hint: <feature-slug, optional — defaults to most-recent spec dir>
allowed-tools: Read, Glob, Grep, Write, TodoWrite, Agent
---

Run **Phase 3.6** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Target slug: $ARGUMENTS (if empty, pick the most recent dir under `docs/analytical/specs/`).

Spawn the **architect** subagent (z code-reviewer w trybie audit). Instruct it to:

1. Refuse jeśli `spec.md` + `plan.md` + `tasks.md` nie istnieją — route do brakującej fazy.
2. Refuse jeśli `checklist.md` brakuje a feature jest oznaczony high-assurance — route do `/checklist`.
3. **Nie modyfikuj** żadnego artefaktu. To audit, nie rewrite.
4. Wykonaj 7 heurystyk z workflow §"Faza 3.6 Analyze":
   - Spec ↔ Plan coverage
   - Plan ↔ Tasks decomposition
   - Tasks ↔ Spec traceability
   - DAG integrity
   - Agent coverage
   - Rule alignment
   - Drift detection (mtime check)
5. Zapisz raport do `docs/analytical/specs/<slug>/analysis.md` w formacie `## Status` + `### Findings` (PASS/WARN/FAIL z `path:line` + `Suggested:` remedy).

End-of-turn: print summary (`<N> FAIL / <M> WARN / <K> PASS`). Jeśli FAIL > 0, NIE wolno przejść do `/implement` — route z powrotem do producing agenta. WARN ⇒ user-decision.
