---
name: nx-generators
description: |
  Nx generator usage and tagging patterns for AI Studio. Use whenever you scaffold a new app,
  library, component, or service; whenever you decide between a `feature/`, `ui/`, `data/`,
  `util/`, or `shared/` lib; whenever you write a custom generator under `tools/generators/`;
  or when a module-boundary lint error fires. Covers `nx g @nx/angular:lib|app|component`,
  tag policy enforced by ESLint, public API via `src/index.ts`, when to write a custom
  generator, and how to inspect `nx graph` before merging cross-lib refactors. Linked to
  `.ai/rules/nx.md` (canonical).
---

# Nx generators & monorepo patterns (AI Studio)

> Reach for this skill whenever you scaffold or restructure code. Generators are not optional —
> every project, lib, component, service in the repo MUST be created via `nx g`. Hand-rolled
> scaffolding is auto-flagged by `code-reviewer` ([`.ai/rules/nx.md`](../../../.ai/rules/nx.md) §3).
>
> Stack: `nx@22.7.2`, `@nx/angular@22.7.2`, `pnpm` workspace, Angular 21. The **`nx` MCP
> server** is wired in `.claude/settings.json` — prefer its `nx_generators` tool over guessing
> the CLI.

## 1. Decision matrix — app vs lib

| Need                                             | Choose         | Command                                                 |
| ------------------------------------------------ | -------------- | ------------------------------------------------------- |
| Deployable Angular binary (one bundle per build) | `app`          | `nx g @nx/angular:app <name>`                           |
| Playwright E2E suite for an app                  | `e2e` (paired) | Created automatically with `--e2eTestRunner=playwright` |
| Routed feature with components + state           | `feature/`     | `nx g @nx/angular:lib feature/<area>`                   |
| Dumb / presentational widgets                    | `ui/`          | `nx g @nx/angular:lib ui/<name>`                        |
| API clients, signal stores, adapters             | `data/`        | `nx g @nx/angular:lib data/<domain>`                    |
| Pure helpers (validators, formatters, constants) | `util/`        | `nx g @nx/js:lib util/<name>`                           |
| Cross-app primitives (auth, theming, i18n shell) | `shared/`      | `nx g @nx/angular:lib shared/<name>`                    |

Apps live under `apps/<name>`. Libs live under `libs/<scope>/<name>` reflecting their tag.

## 2. Tag policy — every project tagged

Every `project.json` MUST carry at minimum two tags:

```jsonc
{
  "tags": ["scope:<library|tire-shop|shared|...>", "type:<app|feature|ui|data-access|util|e2e>"],
}
```

Optional adjuncts:

- `domain:<billing|auth|admin|...>` — group by business domain.
- `platform:<browser|node|ssr>` — runtime constraint.
- `framework:<angular|node|...>` — for polyglot generators (`@nx/js`).

Tags drive **module-boundary lint** ([`.ai/rules/nx.md`](../../../.ai/rules/nx.md) §2):

```
type:app          → type:feature, type:ui, type:data-access, type:util
type:feature      → type:ui, type:data-access, type:util
type:ui           → type:ui, type:util
type:data-access  → type:data-access, type:util
type:util         → type:util
```

Apps never depend on apps. Lower never depends on higher.

## 3. Scaffold a new feature library

```bash
pnpm nx g @nx/angular:lib feature/checkout \
  --directory=libs/feature/tire-shop-checkout \
  --tags="scope:tire-shop,type:feature" \
  --buildable=false \
  --changeDetection=OnPush \
  --standalone \
  --skipTests=false \
  --setParserOptionsProject=true
```

| Flag                         | Why                                                              |
| ---------------------------- | ---------------------------------------------------------------- |
| `--directory=libs/feature/X` | Nx 17+ requires explicit directory                               |
| `--tags="scope:X,type:Y"`    | Module boundaries — lint fails without                           |
| `--buildable=false`          | Default — only mark buildable when consumed by Native Federation |
| `--standalone`               | Angular 21 implicit; harmless to pass                            |
| `--changeDetection=OnPush`   | Workspace default                                                |
| `--skipTests=false`          | Vitest setup is generated alongside                              |

Then add to its `index.ts` (public API):

```ts
// libs/feature/tire-shop-checkout/src/index.ts
export { CheckoutShellComponent } from './lib/checkout-shell/checkout-shell.component';
export { TIRE_SHOP_CHECKOUT_ROUTES } from './lib/routes';
```

**Never** import via deep paths (`@ai-studio/tire-shop-checkout/src/lib/internal`) —
ESLint blocks it.

## 4. Scaffold a new app

```bash
pnpm nx g @nx/angular:app library \
  --routing=true \
  --style=scss \
  --inlineStyle=false \
  --inlineTemplate=false \
  --e2eTestRunner=playwright \
  --unitTestRunner=vitest \
  --standalone=true \
  --changeDetection=OnPush \
  --strict=true \
  --tags="scope:library,type:app" \
  --prefix=ais
```

Post-scaffold:

1. Edit `apps/library/src/index.html` to set `<base href="/" />` ([`.ai/rules/angular.md`](../../../.ai/rules/angular.md) §5).
2. Add the app's `mat.theme(...)` block to `apps/library/src/styles.scss` (see [`angular-material-design`](../angular-material-design/SKILL.md) §1).
3. Add `start:<name>` script to root `package.json`.
4. Update `docs/projects/<name>/README.md` (frontmatter + audience routing).

## 5. Component / service generators

```bash
# Component in a feature lib
pnpm nx g @nx/angular:component checkout-shell \
  --project=tire-shop-checkout \
  --change-detection=OnPush \
  --style=scss \
  --inline-style=false \
  --inline-template=false \
  --standalone

# Service in a data lib
pnpm nx g @nx/angular:service cart-store \
  --project=tire-shop-data
```

Component file naming: `<name>.component.ts`, selector `ais-<name>` (apps) / `ais<Name>` (directives).
Service file naming: `<name>.service.ts` or `<name>-store.ts` (Signal stores).

## 6. Custom generators — when to roll your own

Reach for `tools/generators/<name>/` when the boilerplate is **repository-specific** and
generates **3+ files in a deterministic shape**.

Good candidates:

- `apps/<name>` + paired `apps/<name>-e2e` + `libs/data/<name>-data` + `libs/feature/<name>-feature` (a "demo app" macro).
- A new "shop" variant (bookstore, tools-shop, toy-shop all share shop-core).
- A new wizard variant (5-step or 6-step skeleton).

Skeleton:

```ts
// tools/generators/demo-app/index.ts
import { formatFiles, generateFiles, joinPathFragments, Tree } from '@nx/devkit';

interface Schema {
  name: string;
}

export default async function (tree: Tree, schema: Schema) {
  generateFiles(tree, joinPathFragments(__dirname, 'files'), `apps/${schema.name}`, {
    name: schema.name,
    tmpl: '', // strip .__tmpl__ suffix
  });
  await formatFiles(tree);
}
```

```jsonc
// tools/generators/demo-app/schema.json
{
  "$schema": "http://json-schema.org/schema",
  "id": "DemoApp",
  "type": "object",
  "properties": {
    "name": { "type": "string", "$default": { "$source": "argv", "index": 0 } },
  },
  "required": ["name"],
}
```

Invoke:

```bash
pnpm nx workspace-generator demo-app my-new-shop
```

## 7. Public API surface — `src/index.ts` only

Every lib's `src/index.ts` is the **only** legal import surface. ESLint enforces this via
`@nx/enforce-module-boundaries`:

```ts
// libs/library-data/src/index.ts
export { LoanStore } from './lib/loan-store';
export { Book, Loan, BookGenre } from './lib/models';
export { LIBRARY_DATA_SEED } from './lib/seed';
// Never export internal helpers / private types
```

Anti-pattern:

```ts
// Forbidden — bypasses public API
import { internalHelper } from '@ai-studio/library-data/src/lib/internal';
```

If you need a helper across libs, **promote it**: move to `libs/util/<name>` and re-export.

## 8. Affected commands — local + CI

```bash
pnpm affected:lint        # ESLint on touched libs
pnpm affected:test        # Vitest on touched libs
pnpm affected:build       # Build only touched apps
pnpm affected:e2e         # Playwright on touched apps
```

CI uses `--base=origin/main --head=HEAD`. Nx caches every target listed in
`nx.json#targetDefaults`. To bust the cache: `nx reset` (rarely needed — the cache is
content-addressed).

## 9. Nx graph — read before refactor

```bash
pnpm nx graph
# Opens an interactive graph at http://localhost:4211
```

Before refactoring across libs, **always** look at the graph. Hidden coupling shows up here
even when imports look fine. Architectural changes that alter the graph require an ADR
([`.ai/rules/nx.md`](../../../.ai/rules/nx.md) §6).

For machine-readable output: `pnpm nx graph --file=tmp/graph.json`.

## 10. Generators via MCP server

Prefer the `nx` MCP server's `nx_generators` and `nx_generator_schema` tools over guessing
CLI flags:

```
nx_generators                          # list available generators
nx_generator_schema @nx/angular:lib    # get the schema for one
```

This is faster than `nx g @nx/angular:lib --help` and machine-checkable. The `angular-cli`
MCP server provides the same for `ng generate`.

## 11. Tag examples from the repo

| Project                          | Tags                                 |
| -------------------------------- | ------------------------------------ |
| `apps/library`                   | `scope:library,type:app`             |
| `apps/library-e2e`               | `scope:library,type:e2e`             |
| `libs/library-data`              | `scope:library,type:data-access`     |
| `libs/library-ui`                | `scope:library,type:ui`              |
| `libs/library-feature-catalogue` | `scope:library,type:feature`         |
| `libs/shared-app-shell`          | `scope:shared,type:util`             |
| `libs/keycloak-auth`             | `scope:shared,type:util,domain:auth` |

## 12. Anti-patterns

- Hand-rolling a lib (`mkdir libs/foo && touch project.json`). Always `nx g`.
- Missing tags. Module-boundary lint will fail.
- A `feature/` lib importing another `feature/` lib. They're peers — promote shared code to `shared/` or `data/`.
- Apps depending on apps. Apps are leaves of the graph.
- Adding files to `src/index.ts` that re-export internals (passes lint, breaks encapsulation).
- Editing `project.json` by hand when a generator would do (`nx g @nx/angular:component`).
- Adding global side-effects to a lib's `index.ts` (e.g. `Reflect.defineMetadata` at top level).
- Hand-editing `pnpm-lock.yaml`. Run the generator that depends on the new package instead.

## 13. Quick scaffold checklist

Before reporting a new lib / app done:

- [ ] Created via `pnpm nx g`?
- [ ] Tags include `scope:<...>` and `type:<...>`?
- [ ] Public API exposed only via `src/index.ts`?
- [ ] `tsconfig.spec.json` exists; Vitest runner configured in `project.json`?
- [ ] `nx graph` shows the project at the expected layer?
- [ ] Module-boundary lint passes (`pnpm affected:lint`)?
- [ ] If app: `<base href="/" />` set, `start:<name>` script added, `docs/projects/<name>/` populated?
- [ ] If lib in `feature/`: imports nothing from another `feature/` lib?

---

_Reference patterns:_

- _`apps/library` + `libs/library-{data,ui,feature-catalogue,feature-account,feature-librarian}` — full slice._
- _`tools/generators/demo-app/` — custom macro for new demos (if/when added)._
- _Cross-link: [`signal-store`](../signal-store/SKILL.md) for `libs/<x>-data` patterns; [`web-component-build`](../web-component-build/SKILL.md) for `build:element` target on apps._
