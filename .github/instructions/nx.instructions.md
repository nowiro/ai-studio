---
applyTo: '**/project.json,**/nx.json,**/tsconfig.base.json,**/eslint.config.mjs'
description: Nx monorepo conventions — taxonomy, tags, module boundaries, generators
---

# Nx (Copilot scope: project.json, nx.json, tsconfig.base.json, eslint.config.mjs)

Full text: [`.ai/rules/nx.md`](../../.ai/rules/nx.md).

## Project taxonomy

| Folder            | What lives there                              | Tags                             |
| ----------------- | --------------------------------------------- | -------------------------------- |
| `apps/<name>`     | Deployable Angular apps (one per binary)      | `scope:app`, `type:app`          |
| `apps/<name>-e2e` | Playwright E2E suite for the app              | `scope:app`, `type:e2e`          |
| `libs/feature/*`  | Smart features (routes, container components) | `scope:feature`, `type:feature`  |
| `libs/ui/*`       | Dumb / presentational components & primitives | `scope:ui`, `type:ui`            |
| `libs/data/*`     | API clients, stores, adapters                 | `scope:data`, `type:data-access` |
| `libs/util/*`     | Pure helpers, constants, schemas              | `scope:util`, `type:util`        |
| `libs/shared/*`   | Cross-app primitives (auth, theming, i18n)    | `scope:shared`, `type:util`      |

## Module boundaries (enforced by `@nx/enforce-module-boundaries`)

```
type:app         → type:feature, type:ui, type:data-access, type:util
type:feature     → type:ui, type:data-access, type:util
type:ui          → type:ui, type:util
type:data-access → type:data-access, type:util
type:util        → type:util
```

Apps NEVER depend on apps. Lower layers NEVER depend on higher layers.

## Generators (always prefer over hand-edits)

```bash
nx g @nx/angular:app <name>
nx g @nx/angular:lib feature/<area>
nx g @nx/angular:component <Name> --project=<lib> --change-detection=OnPush --standalone
nx g @nx/angular:service <Name> --project=<lib>
```

The orchestrator calls these via the **nx** MCP server, then adds tags. Never hand-edit `project.json` if a generator would do.

## Tagging policy

Every project carries at minimum `scope:<…>` + `type:<…>`. Optional: `domain:<billing|auth|admin|…>`, `platform:<browser|node|ssr>`.

## Affected commands

```bash
pnpm affected:lint
pnpm affected:test
pnpm affected:build
pnpm affected:e2e
```

CI uses `--base=origin/main --head=HEAD`. Caching is on for every target in `nx.json#targetDefaults`.

## Forbidden

- Cross-importing internal files of another lib (`libs/foo/src/lib/internal.ts`) — use `@ai-studio/foo` only.
- Adding global side-effects in lib `index.ts`.
- Hand-editing the lockfile.
- Skipping tags — lint will fail.

## Cross-references

- Angular conventions → [`angular.instructions.md`](angular.instructions.md)
- Testing → [`testing.instructions.md`](testing.instructions.md)
