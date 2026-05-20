---
mode: agent
description: Phase 5 (opcjonalna) of spec-driven flow — most do GitHub Issues
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# TasksToIssues (Faza 5 — SDD)

Uruchom **Fazę 5** (opcjonalną) [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir

## Co robić

1. Przełącz na personę **release-manager**.
2. Odmów jeśli `tasks.md` nie istnieje — route do `/tasks`.
3. Odmów jeśli `gh auth status` nie jest zalogowane — poproś użytkownika o `gh auth login`.
4. Read `tasks.md` i `docs/analytical/specs/<slug>/issues.log` (jeśli istnieje).
5. Dla każdego taska bez wpisu w `issues.log`:
   - `gh issue create --title "[<slug>] T00X — <title>" --body "<from done_when + inputs + outputs>" --label "spec-driven,<agent>"`.
   - Append `T00X → #<issue-number>` do `issues.log`.
6. Update każdego taska w `tasks.md`: dodaj `issue: #<n>` field.
7. Dla taska oznaczonego `status: done` w `runs/<task-id>.log`: zamknij issue (`gh issue close #<n> --comment "Closed by /implement at <commit-sha>"`).

## Kiedy używać

- Repo jest na GitHub (✓ wszystkie 4 nasze repo).
- Iteracja ma ≥ 5 tasków + cross-team visibility ma znaczenie.
- Pomiń dla solo work, krótkich iteracji, lub gdy GH issues są poza compliance scope.

## Nie

- Twórz duplicate issues — zawsze sprawdź `issues.log` najpierw.
- Usuwaj `issues.log` — to audit trail.
- Pisz `issue: #<n>` ręcznie w `tasks.md` — orchestrator robi to atomically.

End-of-turn: print summary (`<N> issues created, <M> closed, <K> already existed`); linkuj do GitHub Project board jeśli skonfigurowany.
