---
id: workflow.new-library
title: New Library
type: workflow
trigger: 'nowy lib potrzebny w monorepo'
owner: orchestrator
version: 2.0.0
---

# Workflow: New Library

Library jest dodana, gdy idea jest potrzebna przez ≥ 2 konsumentów, lub gdy surface pojedynczego konsumenta jest na tyle duży, że izolacja jest warta.

## Decision matrix

| Konsumenci | Surface (LOC) | Verdict                                |
| ---------- | ------------- | -------------------------------------- |
| 1          | < 200         | Nie ekstraktuj; trzymaj w konsumencie. |
| 1          | ≥ 200         | Ekstraktuj dla izolacji + testowania.  |
| ≥ 2        | any           | Ekstraktuj.                            |

## Kroki

### 0. Plan

Orchestrator tworzy `docs/ai-workflow/plans/<YYYY-MM-DD>-lib-<name>.md` z templatu. Tasks: ADR (architect) → generate przez Nx MCP → tag verification → CODEOWNERS update → first usage example → docs. Status `accepted` gdy użytkownik potwierdzi lib placement i tags.

### 1. ADR

Architect produkuje ADR z:

- nazwa,
- scope tag (`scope:feature|ui|data|util|shared`),
- type tag (`type:feature|ui|data-access|util`),
- public API surface,
- ownership (update CODEOWNERS).

### 2. Generate

```bash
nx g @nx/angular:lib <name> \
  --directory=<scope>/<area> \
  --tags=scope:<scope>,type:<type> \
  --change-detection=OnPush \
  --standalone \
  --buildable=false
```

Library name pattern: `@ai-studio/<scope>-<area>` dla ts paths; folder `libs/<scope>/<area>`.

### 3. Skeleton

```
libs/<scope>/<area>/
  src/
    index.ts            ← public API, tylko re-exports
    lib/
      <area>.module.ts  ← jeśli potrzebny; zwykle funkcja `provideXxx()` zamiast
      <area>.service.ts
      <area>.types.ts
  README.md
  project.json
  tsconfig*.json
  vitest.config.ts
```

### 4. Public API contract

`src/index.ts` jest **jedynym** entry point. Konsumenci nie mogą deep-importować.

### 5. Tests

Test-engineer dodaje:

- unit testy dla każdego export,
- jeden integration test per public consumer scenario.

### 6. Documentation

Doc-writer dodaje `README.md` do lib (purpose, public API, usage example, ownership) i linkuje go z `docs/architecture/dependencies.md`.

### 7. Wire up

Jeśli lib zastępuje istniejący kod, migracja jest jej własnym follow-up PR — nie bundlowana.
