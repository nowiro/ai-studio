---
applyTo: '**/project.json,**/nx.json,**/tsconfig.base.json,**/eslint.config.mjs'
description: Nx monorepo conventions — taxonomy, tags, module boundaries, generators
---

# Nx (Copilot scope: project.json, nx.json, tsconfig.base.json, eslint.config.mjs)

Pełny tekst: [`.ai/rules/nx.md`](../../.ai/rules/nx.md).

## Taksonomia projektów

| Folder            | Co tam żyje                                   | Tags                             |
| ----------------- | --------------------------------------------- | -------------------------------- |
| `apps/<name>`     | Deployowalne Angular apps (jeden per binary)  | `scope:app`, `type:app`          |
| `apps/<name>-e2e` | Playwright E2E suite dla app                  | `scope:app`, `type:e2e`          |
| `libs/feature/*`  | Smart features (routes, container components) | `scope:feature`, `type:feature`  |
| `libs/ui/*`       | Dumb / presentational components & primitives | `scope:ui`, `type:ui`            |
| `libs/data/*`     | API clients, stores, adapters                 | `scope:data`, `type:data-access` |
| `libs/util/*`     | Pure helpers, constants, schemas              | `scope:util`, `type:util`        |
| `libs/shared/*`   | Cross-app primitives (auth, theming, i18n)    | `scope:shared`, `type:util`      |

## Module boundaries (wymuszane przez `@nx/enforce-module-boundaries`)

```
type:app         → type:feature, type:ui, type:data-access, type:util
type:feature     → type:ui, type:data-access, type:util
type:ui          → type:ui, type:util
type:data-access → type:data-access, type:util
type:util        → type:util
```

Apps NIGDY nie zależą od apps. Niższe warstwy NIGDY nie zależą od wyższych.

## Generatory (zawsze wybieraj zamiast hand-edits)

```bash
nx g @nx/angular:app <name>
nx g @nx/angular:lib feature/<area>
nx g @nx/angular:component <Name> --project=<lib> --change-detection=OnPush --standalone
nx g @nx/angular:service <Name> --project=<lib>
```

Orchestrator wywołuje je przez serwer **nx** MCP, potem dodaje tagi. Nigdy nie hand-edytuj `project.json` jeśli generator załatwiłby sprawę.

## Polityka tagowania

Każdy projekt nosi minimum `scope:<…>` + `type:<…>`. Opcjonalne: `domain:<billing|auth|admin|…>`, `platform:<browser|node|ssr>`.

## Affected commands

```bash
pnpm affected:lint
pnpm affected:test
pnpm affected:build
pnpm affected:e2e
```

CI używa `--base=origin/main --head=HEAD`. Caching jest on dla każdego targetu w `nx.json#targetDefaults`.

## Zabronione

- Cross-importing internal plików innego liba (`libs/foo/src/lib/internal.ts`) — używaj tylko `@ai-studio/foo`.
- Dodawanie global side-effects w `index.ts` liba.
- Hand-editowanie lockfile.
- Pomijanie tagów — lint will fail.

## Cross-references

- Konwencje Angular → [`angular.instructions.md`](angular.instructions.md)
- Testing → [`testing.instructions.md`](testing.instructions.md)
