---
mode: agent
description: Phase 4 of spec-driven flow — orchestrator executes tasks.md, gating each one
tools: ['editFiles', 'search', 'runCommands', 'runTasks', 'problems']
---

# Implement (Faza 4 — SDD)

Uruchom **Fazę 4** [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir
- `${input:task:Task id (T001) or "all"}` — co uruchomić; default `all`
- `${selection}` — opcjonalny context

## Co robić

1. Przełącz na chat mode **orchestrator**.
2. Walk `docs/analytical/specs/<slug>/tasks.md` w topological order (respektując `blocked_by` / `parallel_with`):
   1. Deleguj do nazwanego `agent` z `inputs` + `done_when`.
   2. Validuj agent's result przeciw `done_when`. On fail: route back. Po 3 failach, eskaluj do użytkownika.
   3. Append one line do `docs/analytical/specs/<slug>/runs/<task-id>.log`.
3. Uruchom validation gate z `core.md`:
   ```bash
   pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build && pnpm ai:validate
   ```
4. Deleguj do **code-reviewer**. Jeśli auth / sanityzacja / deps / AI surfaces dotknięte, też **security-auditor** (równolegle).
5. Deleguj do **doc-writer** dla każdej public-API lub behaviour change.

## Nie

- Claimuj `done:` gdy jakikolwiek validator jest czerwony.
- Pomijaj check `done_when` taska, nawet jeśli agent raportuje success.
- Bundluj unrelated work w ten run — zarchiwizuj followup zamiast.

End-of-turn: emituj kanoniczny blok `done:` z `core.md`. Wymień każdy zmieniony plik, slug spec, ADR id (jeśli jest), i wszelkie followups.
