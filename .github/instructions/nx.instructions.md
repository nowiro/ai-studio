---
applyTo: "**/project.json,**/nx.json,**/eslint.config.{mjs,js,ts}"
description: Nx monorepo conventions and module boundaries
---

# Nx (Copilot scope: project / nx / eslint config)

Full text: [`.ai/rules/nx.md`](../../.ai/rules/nx.md).

## Project taxonomy

| Folder              | Allowed deps                          | Tags                            |
| ------------------- | ------------------------------------- | ------------------------------- |
| `apps/*`            | feature, ui, data, util               | `scope:app`, `type:app`         |
| `apps/*-e2e`        | (E2E only)                            | `scope:app`, `type:e2e`         |
| `libs/feature/*`    | ui, data, util                        | `scope:feature`, `type:feature` |
| `libs/ui/*`         | ui, util                              | `scope:ui`, `type:ui`           |
| `libs/data/*`       | data, util                            | `scope:data`, `type:data-access`|
| `libs/util/*`       | util                                  | `scope:util`, `type:util`       |
| `libs/shared/*`     | util                                  | `scope:shared`, `type:util`     |

## Generators (use them, don't hand-edit)

```bash
nx g @nx/angular:app <name> --add-tailwind --style=scss
nx g @angular/material:ng-add --project=<app> --theme=custom --typography --animations=enabled
nx g @nx/angular:lib feature/<area> --tags=scope:feature,type:feature
nx g @nx/angular:component <Name> --project=<lib>
```

After every generator: add the project tags listed above.

## Public API rule

A library is consumed only via `@ai-studio/<scope>-<area>` (its `src/index.ts`). **Never** deep-import another lib's internals.

## Affected commands

```
pnpm affected:lint
pnpm affected:test
pnpm affected:build
pnpm affected:e2e
```

## Forbidden

- Cross-importing `libs/foo/src/lib/internal.ts`.
- Side-effects in lib `index.ts`.
- Hand-editing the lockfile.
- Skipping tags — lint will fail.
