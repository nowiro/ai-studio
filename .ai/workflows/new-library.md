---
id: workflow.new-library
title: New Library
type: workflow
trigger: 'new lib needed in the monorepo'
owner: orchestrator
version: 1.0.0
---

# Workflow: New Library

A library is added when an idea is needed by ≥ 2 consumers, or when a single consumer's surface is large enough that isolation is worth it.

## Decision matrix

| Consumers | Surface (LOC) | Verdict                          |
| --------- | ------------- | -------------------------------- |
| 1         | < 200         | Don't extract; keep in consumer. |
| 1         | ≥ 200         | Extract for isolation + testing. |
| ≥ 2       | any           | Extract.                         |

## Steps

### 0. Plan

Orchestrator creates `docs/ai-workflow/plans/<YYYY-MM-DD>-lib-<name>.md` from the template. Tasks: ADR (architect) → generate via Nx MCP → tag verification → CODEOWNERS update → first usage example → docs. Status `accepted` once the user confirms the lib placement and tags.

### 1. ADR

Architect produces an ADR with the lib's:

- name,
- scope tag (`scope:feature|ui|data|util|shared`),
- type tag (`type:feature|ui|data-access|util`),
- public API surface,
- ownership (CODEOWNERS update).

### 2. Generate

```bash
nx g @nx/angular:lib <name> \
  --directory=<scope>/<area> \
  --tags=scope:<scope>,type:<type> \
  --change-detection=OnPush \
  --standalone \
  --buildable=false
```

Library name pattern: `@ai-studio/<scope>-<area>` for ts paths; folder `libs/<scope>/<area>`.

### 3. Skeleton

```
libs/<scope>/<area>/
  src/
    index.ts            ← public API, re-exports only
    lib/
      <area>.module.ts  ← if needed; usually a `provideXxx()` function instead
      <area>.service.ts
      <area>.types.ts
  README.md
  project.json
  tsconfig*.json
  vitest.config.ts
```

### 4. Public API contract

`src/index.ts` is the **only** entry point. Consumers must not deep-import.

### 5. Tests

Test-engineer adds:

- unit tests for every export,
- one integration test per public consumer scenario.

### 6. Documentation

Doc-writer adds a `README.md` to the lib (purpose, public API, usage example, ownership) and links it from `docs/architecture/dependencies.md`.

### 7. Wire up

If the lib replaces existing code, the migration is its own follow-up PR — not bundled.
