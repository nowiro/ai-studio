---
description: Phase 5 (opcjonalna) of spec-driven flow — most do GitHub Issues, mapuje tasks.md → gh issues
argument-hint: <feature-slug, optional — defaults to most-recent spec dir>
allowed-tools: Read, Glob, Grep, Edit, Write, Bash, TodoWrite, Agent
---

Run **Phase 5** (opcjonalna) of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Target slug: $ARGUMENTS (if empty, pick the most recent dir under `docs/analytical/specs/`).

Spawn the **release-manager** subagent (lub orchestrator self-runs). Instruct it to:

1. Refuse jeśli `tasks.md` nie istnieje — route do `/tasks`.
2. Refuse jeśli `gh auth status` nie jest zalogowane — poproś użytkownika o `gh auth login`.
3. Read `tasks.md` i `docs/analytical/specs/<slug>/issues.log` (jeśli istnieje).
4. Dla każdego taska bez wpisu w `issues.log`:
   - Stwórz GH issue: `gh issue create --title "[<slug>] T00X — <title>" --body "<from done_when + inputs + outputs>" --label "spec-driven,<agent>"`.
   - Append `T00X → #<issue-number>` do `issues.log`.
5. Update każdego taska w `tasks.md`: dodaj `issue: #<n>` field.
6. Dla taska oznaczonego `status: done` w `runs/<task-id>.log`: zamknij issue (`gh issue close #<n> --comment "Closed by /implement at <commit-sha>"`).

End-of-turn: print summary (`<N> issues created, <M> closed, <K> already existed`). Linkuj do GitHub Project board jeśli skonfigurowany.

## Don't

- Tworzyć duplicate issues — zawsze sprawdź `issues.log` najpierw.
- Usuwać `issues.log` — to audit trail.
- Pisać `issue: #<n>` ręcznie w `tasks.md` — orchestrator robi to atomically po `gh issue create` success.
- Uruchamiać dla solo work / krótkich iteracji (< 5 tasks) — overhead > zysk.
