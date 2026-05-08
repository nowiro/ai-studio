---
id: rules.nx
title: Nx monorepo rules
type: rules
scope: nx
priority: 2
version: 1.0.0
---

# Nx rules

## 1. Project taxonomy

| Folder              | What lives there                                  | Tags                            |
| ------------------- | ------------------------------------------------- | ------------------------------- |
| `apps/<name>`       | Deployable Angular apps (one per binary)          | `scope:app`, `type:app`         |
| `apps/<name>-e2e`   | Playwright E2E suite for the app                  | `scope:app`, `type:e2e`         |
| `libs/feature/*`    | Smart features (routes, container components)     | `scope:feature`, `type:feature` |
| `libs/ui/*`         | Dumb / presentational components & primitives     | `scope:ui`, `type:ui`           |
| `libs/data/*`       | API clients, stores, adapters                     | `scope:data`, `type:data-access`|
| `libs/util/*`       | Pure helpers, constants, schemas                  | `scope:util`, `type:util`       |
| `libs/shared/*`     | Cross-app primitives (auth, theming, i18n)        | `scope:shared`, `type:util`     |

## 2. Module boundaries (enforced by ESLint)

```
type:app   → type:feature, type:ui, type:data-access, type:util
type:feature → type:ui, type:data-access, type:util
type:ui    → type:ui, type:util
type:data-access → type:data-access, type:util
type:util  → type:util
```

Apps NEVER depend on apps. Lower layers NEVER depend on higher layers.

## 3. Generators (always prefer over hand-written scaffolding)

```bash
nx g @nx/angular:app <name>             # new app
nx g @nx/angular:lib feature/<area>     # new feature library
nx g @nx/angular:component <Name> --project=<lib> --change-detection=OnPush --standalone
nx g @nx/angular:service <Name> --project=<lib>
```

The Orchestrator MUST call generators via the **nx** MCP server, then add the project tags listed above. Never hand-edit `project.json` if a generator would do.

## 4. Tagging policy

Every project has at minimum:

```jsonc
// project.json
{
  "tags": ["scope:<feature|ui|data|util|shared|app>", "type:<feature|ui|data-access|util|app|e2e>"]
}
```

Optional add-ons:

- `domain:<billing|auth|admin|…>` — group by business domain.
- `platform:<browser|node|ssr>` — runtime constraint.

## 5. Affected commands

Local dev:

```bash
pnpm affected:lint
pnpm affected:test
pnpm affected:build
pnpm affected:e2e
```

CI runs the same with `--base=origin/main --head=HEAD`. Caching is on for every target listed in `nx.json#targetDefaults`.

## 6. Project graph

- **Always** consult `nx graph` (or the `nx` MCP server) before refactoring across libraries — it shows hidden coupling.
- Architectural changes that alter the graph require an ADR.

## 7. Don't

- ❌ Cross-importing internal files of another lib (`libs/foo/src/lib/internal.ts`). Use `import { … } from '@ai-studio/foo'` only.
- ❌ Adding global side-effects in lib `index.ts`.
- ❌ Hand-editing the lockfile.
- ❌ Skipping tags — lint will fail.
