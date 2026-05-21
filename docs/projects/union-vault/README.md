---
id: docs.projects.union-vault
title: Union-vault — project hub (under review)
type: project
status: under-review
date: 2026-05-19
links:
  app: ../../../apps/union-vault
  e2e: ../../../apps/union-vault-e2e
  plan: null
---

# Union-vault

> Standalone Angular app under `apps/union-vault`. Scope is being clarified by the analyst (see linked plan) — this page is a placeholder to surface the app in the index until the spec phase lands.

| Aspect      | Value                                                   |
| ----------- | ------------------------------------------------------- |
| Status      | under review                                            |
| App tree    | `apps/union-vault/src/app/{components,data,i18n,pages}` |
| E2E project | `apps/union-vault-e2e/`                                 |
| Decision    | continue / deprecate / fold — pending analyst spec      |

## Read first

- [`business.md`](business.md) — context until spec lands.
- [`technical.md`](technical.md) — observed architecture from source.
- [`testing.md`](testing.md) — coverage of what currently exists.

## Why this folder exists

The 2026-05-19 audit found the app + its E2E project present in the workspace but no `docs/projects/union-vault/` entry. To keep `docs/projects/README.md` index honest about every shipped app, this minimal hub now exists. Full content will be filled in once the analyst spec is accepted.
