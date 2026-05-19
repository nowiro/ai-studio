# Dependency map

> Curated catalog of every external library we depend on, why we chose it, and what we'd consider as alternatives. Updated by the **doc-writer** when a lib is added/removed.

| Package                                 | Why                                      | Alternatives considered         | Notes                                        |
| --------------------------------------- | ---------------------------------------- | ------------------------------- | -------------------------------------------- |
| `@angular/*`                            | Framework                                | (none)                          | Pinned `^21.0.0`                             |
| `@angular/material`                     | Material 3 components                    | PrimeNG, Spartan-NG             | M3 only, no legacy                           |
| `@angular/cdk`                          | Component primitives (peer of Material)  | (none)                          |                                              |
| `@angular/build`                        | Angular's modern builder + native Vitest | `@angular-devkit/build-angular` | Replaces devkit in v21                       |
| `tailwindcss` v4                        | Utility CSS                              | UnoCSS, vanilla SCSS            | CSS-first config                             |
| `@tailwindcss/postcss`                  | PostCSS plugin for Tailwind v4           |                                 | Wired via `postcss.config.mjs`               |
| `prettier-plugin-tailwindcss`           | Deterministic class sorting              |                                 |                                              |
| `eslint-plugin-tailwindcss`             | Lint Tailwind utilities                  |                                 | Flag conflicting / unknown classes           |
| `@nx/*`, `nx`                           | Monorepo                                 | Lerna, Rush, Turborepo          | inferred targets                             |
| `vitest`                                | Test runner                              | Jest                            | Driven by Angular's native unit-test builder |
| `@playwright/test`                      | E2E                                      | Cypress                         | cross-browser, MCP                           |
| `@typescript-eslint/*`                  | TS lint                                  | xo                              |                                              |
| `angular-eslint`                        | Angular-specific lint                    | tslint (deprecated)             | flat config                                  |
| `eslint-plugin-sonarjs`                 | Cognitive complexity                     | xo                              |                                              |
| `eslint-plugin-unicorn`                 | Modern JS guardrails                     | xo                              |                                              |
| `eslint-plugin-rxjs-x`                  | RxJS gotchas                             | rxjs-tslint                     | only when RxJS used                          |
| `eslint-plugin-jsdoc`                   | Doc quality                              | typedoc                         | publicOnly                                   |
| `prettier`                              | Format                                   | dprint                          |                                              |
| `@trivago/prettier-plugin-sort-imports` | Deterministic import order               |                                 |                                              |
| `prettier-plugin-organize-attributes`   | Deterministic HTML attrs                 |                                 |                                              |
| `husky`                                 | Git hooks                                | lefthook                        |                                              |
| `lint-staged`                           | Run on staged files                      |                                 |                                              |
| `@commitlint/*`                         | Commit msg lint                          | gitlint                         |                                              |
| `commitizen` + `cz-*`                   | Guided commits                           |                                 |                                              |
| `postcss`                               | CSS toolchain                            |                                 | Required by Tailwind v4 plugin               |

## Adding a dependency

1. Open an ADR (`type:adr`) explaining why and what was considered.
2. Add to `package.json` with a pinned minor (`^X.Y.0`).
3. Add a row here.
4. If the lib introduces patterns, add a rule in `.ai/rules/`.

## Removing a dependency

1. Move the row to `## Removed` below with the SHA where it was dropped.
2. Note the replacement (if any).

## Removed

| Package                         | Removed in | Replacement                                  |
| ------------------------------- | ---------- | -------------------------------------------- |
| `@analogjs/platform`            | starter    | not needed; Angular 21 native SSR            |
| `@analogjs/vite-plugin-angular` | starter    | not needed; Angular 21 ships its own builder |
| `@analogjs/vitest-angular`      | starter    | `@angular/build:unit-test --runner=vitest`   |
| `@angular-devkit/build-angular` | starter    | `@angular/build` (modern builder)            |
| `vite-tsconfig-paths`           | starter    | Angular's builder resolves TS paths natively |
