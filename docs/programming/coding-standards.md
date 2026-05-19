# Coding standards

> Practical, opinionated rules for everything we write here. The full canonical rules for AI agents are under [`.ai/rules/`](../../.ai/rules/) — this file extends and explains them for humans.

## Core principles

1. **Read before you write.** No invented APIs, no "I think it's called X".
2. **Smallest reasonable change.** Don't bundle a refactor with a fix.
3. **Comments explain WHY, not WHAT.** Names should already say WHAT.
4. **No premature abstraction.** Three similar lines beat a generic helper.
5. **No half-finished implementations.** Either ship it or revert.

## Angular

Follows [`.ai/rules/angular.md`](../../.ai/rules/angular.md) verbatim. Key rules:

- Standalone, OnPush, `inject()`, signal APIs.
- Native control flow (`@if`, `@for`, `@switch`, `@defer`).
- `signal()` / `computed()` / `effect()` for state.
- Reactive forms only.
- `data-testid="kebab-case"` on every interactive element.
- Selector prefix `ais-` (components) / `ais` (directives).
- `NgOptimizedImage` for static images.
- No `any`, no default exports outside config, no `console.*`.

## TypeScript

- `strict: true` everywhere. No `noImplicitAny: false` exemptions.
- Prefer `interface` over `type` for object shapes (`@typescript-eslint/consistent-type-definitions`).
- `import type` for types-only imports.
- `readonly` on every field that doesn't mutate.
- `unknown` over `any`. Narrow at the boundary.
- `Result<T, E>` pattern over throwing for expected failures.

## File & folder layout

- One component per file. File name matches class kebab-cased.
- Public lib API only via `src/index.ts`. No deep imports.
- `__fixtures__/` next to the test that owns them.
- `e2e/` lives in `apps/<app>-e2e/`, never inside the app's project.

## SCSS

- One top-level selector per file = the component host.
- BEM-like naming for descendants (`.ais-card__header`, `.ais-card--ghost`).
- CSS custom properties for theming.
- No global resets in components — that's the theme lib's job.

## Naming

| Kind                 | Style         | Example                     |
| -------------------- | ------------- | --------------------------- |
| File                 | `kebab-case`  | `invoice-list.component.ts` |
| Class                | `PascalCase`  | `InvoiceListComponent`      |
| Function / variable  | `camelCase`   | `loadInvoices`              |
| Constant             | `UPPER_SNAKE` | `MAX_PAGE_SIZE`             |
| Type / Interface     | `PascalCase`  | `Invoice`                   |
| Selector (component) | `ais-…`       | `ais-invoice-list`          |
| Selector (directive) | `ais…`        | `aisAutofocus`              |
| `data-testid`        | `kebab-case`  | `invoice-row`               |

## Commits & PRs

- **Conventional Commits** required. Enforced by commitlint (see `commitlint.config.mjs`).
- One concern per PR. Reviewer-able in one sitting.
- PR title mirrors the commit subject.
- Description follows `.github/PULL_REQUEST_TEMPLATE.md`.

## Forbidden globally

- ❌ `console.log`, `alert()`, `debugger` in committed code.
- ❌ `eval`, `new Function`, dynamic imports of user-supplied paths.
- ❌ `// @ts-ignore` without a comment explaining why and a tracked issue.
- ❌ Deleting tests "because they're flaky" — fix or skip with a tracked TODO.
- ❌ Mutating signals (`signal.mutate()` is gone).
