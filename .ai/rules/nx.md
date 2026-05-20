---
id: rules.nx
title: Reguły monorepo Nx
type: rules
scope: nx
priority: 2
version: 2.0.0
---

# Reguły Nx

## 1. Taksonomia projektów

| Folder            | Co tam żyje                                   | Tagi                             |
| ----------------- | --------------------------------------------- | -------------------------------- |
| `apps/<name>`     | Deployowalne Angular apps (jeden per binary)  | `scope:app`, `type:app`          |
| `apps/<name>-e2e` | Playwright E2E suite dla app                  | `scope:app`, `type:e2e`          |
| `libs/feature/*`  | Smart features (routes, container components) | `scope:feature`, `type:feature`  |
| `libs/ui/*`       | Dumb / presentational components & primitives | `scope:ui`, `type:ui`            |
| `libs/data/*`     | API clients, stores, adapters                 | `scope:data`, `type:data-access` |
| `libs/util/*`     | Pure helpers, constants, schemas              | `scope:util`, `type:util`        |
| `libs/shared/*`   | Cross-app primitives (auth, theming, i18n)    | `scope:shared`, `type:util`      |

## 2. Module boundaries (wymuszane przez ESLint)

```
type:app   → type:feature, type:ui, type:data-access, type:util
type:feature → type:ui, type:data-access, type:util
type:ui    → type:ui, type:util
type:data-access → type:data-access, type:util
type:util  → type:util
```

Apps NIGDY nie zależą od apps. Niższe warstwy NIGDY nie zależą od wyższych.

## 3. Generatory (zawsze wybieraj zamiast hand-written scaffolding)

```bash
nx g @nx/angular:app <name>             # new app
nx g @nx/angular:lib feature/<area>     # new feature library
nx g @nx/angular:component <Name> --project=<lib> --change-detection=OnPush --standalone
nx g @nx/angular:service <Name> --project=<lib>
```

Orchestrator MUSI wywoływać generatory przez serwer **nx** MCP, potem dodawać project tags wymienione powyżej. Nigdy nie hand-edytuj `project.json` jeśli generator załatwiłby sprawę.

## 4. Polityka tagowania

Każdy projekt ma minimum:

```jsonc
// project.json
{
  "tags": ["scope:<feature|ui|data|util|shared|app>", "type:<feature|ui|data-access|util|app|e2e>"],
}
```

Opcjonalne add-ons:

- `domain:<billing|auth|admin|…>` — grupuj wg business domain.
- `platform:<browser|node|ssr>` — runtime constraint.

## 5. Affected commands

Local dev:

```bash
pnpm affected:lint
pnpm affected:test
pnpm affected:build
pnpm affected:e2e
```

CI uruchamia to samo z `--base=origin/main --head=HEAD`. Caching jest on dla każdego targetu wymienionego w `nx.json#targetDefaults`.

## 6. Project graph

- **Zawsze** konsultuj `nx graph` (lub serwer `nx` MCP) przed refactorem cross-library — pokazuje ukryte sprzężenie.
- Zmiany architektoniczne, które zmieniają graph, wymagają ADR.

## 7. Nie

- ❌ Cross-importing internal plików innego liba (`libs/foo/src/lib/internal.ts`). Używaj tylko `import { … } from '@ai-studio/foo'`.
- ❌ Dodawanie global side-effects w `index.ts` liba.
- ❌ Hand-edytowanie lockfile.
- ❌ Pomijanie tagów — lint will fail.
