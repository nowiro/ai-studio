---
id: context.tech-stack
title: Tech stack
type: context
version: 2.0.0
---

# Tech stack

| Layer            | Choice                                                          | Rationale                                                              |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Monorepo         | **Nx 21+**                                                      | Affected commands, generators, project graph, ESLint module boundaries |
| Framework        | **Angular 21** (standalone, signals, control flow, native SSR)  | Default for the team; AI rules from angular.dev/ai                     |
| Component kit    | **Angular Material 3** (`@angular/material` + `@angular/cdk`)   | First-party Material 3 with `mat.theme()`                              |
| Utility CSS      | **Tailwind CSS v4** (CSS-first, `@tailwindcss/postcss`)         | Maps utilities to Material 3 design tokens                             |
| 2D games         | **Phaser 3** (`phaser` package)                                 | Default 2D game framework; Angular shell hosts the canvas              |
| Server AI        | **Genkit** (recommended, optional)                              | First-class flows + Gemini integration, structured tool calls          |
| Client AI        | **Firebase AI Logic** (optional)                                | Secure key handling for browser-side calls                             |
| Unit / Component | **Vitest 2** via `@angular/build:unit-test` (native, Angular 21)| Replaces Karma; no Analog needed                                       |
| E2E              | **Playwright**                                                  | Cross-browser, stable selectors, MCP integration                       |
| Linting          | **ESLint 9** (flat config) + `angular-eslint` + `tailwindcss`   | Modern rules, type-aware checks, AI-friendly errors                    |
| Formatting       | **Prettier 3** + sort-imports + organize-attributes + tailwindcss | Deterministic; class-name sort                                       |
| Hooks            | **Husky 9** + **lint-staged**                                   | Lightweight gates before commit/push                                   |
| Commits          | **Commitizen** + **commitlint** (Conventional)                  | Drives semantic releases via `nx release`                              |
| Package manager  | **pnpm** (workspace-aware)                                      | Faster, lockfile compatible with CI                                    |
| Node             | **20.19+ LTS**                                                  | Locked via `.nvmrc`                                                    |
| CI               | **GitHub Actions**                                              | Built-in caching, OIDC for cloud auth                                  |
| MCP servers      | context7, playwright, nx, angular-cli                           | See `.ai/mcp.json`                                                     |

## Why these picks

- **Angular 21 native Vitest**: shipped with `@angular/build:unit-test` (stabilised in 21). `@analogjs/vitest-angular` is only required when you adopt Analog as a meta-framework, not as a test bridge. We don't need it here.
- **Material 3 + Tailwind v4**: components vs utilities — they don't compete. Material owns interactive widgets and theming; Tailwind owns layout / spacing / responsive utilities. Both speak the same design tokens via CSS variables (see `.ai/rules/styling.md`).
- **Tailwind v4 CSS-first**: no `tailwind.config.js`. Tokens live in `styles/tailwind.css` under `@theme` and bridge to `var(--mat-sys-*)` for parity with Material.
- **Playwright over Cypress**: multi-browser by default, better network stubbing, MCP support.
- **ESLint flat config**: future-proof, no `.eslintrc` deprecation surprise.
- **Nx with inferred targets**: less boilerplate in `project.json`, smarter caching.
- **Conventional Commits**: enables `nx release` to auto-version & generate changelogs.
- **Phaser 3 for 2D games**: actively maintained, mature TS types since 3.80, MIT-licensed examples repo. Game scenes live in framework-agnostic `libs/game-*` so the engine stays decoupled from Angular. See [`.ai/rules/games.md`](../rules/games.md) and [ADR 0004](../../docs/adr/0004-phaser-as-default-game-library.md).

## Versioning policy

We pin minor versions (`^21.0.0`) and let renovate / dependabot raise patches. Major bumps require an ADR.
