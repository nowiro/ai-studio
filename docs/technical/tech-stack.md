# Tech stack

This is the human-facing, decision-rich version of [`.ai/context/tech-stack.md`](../../.ai/context/tech-stack.md). Update both when something changes.

## Stack

| Concern            | Choice                                                          | Note                                         |
| ------------------ | --------------------------------------------------------------- | -------------------------------------------- |
| Monorepo           | **Nx 21+**                                                      | inferred targets, project graph, affected    |
| Framework          | **Angular 21**                                                  | standalone (implicit), signals, native control flow, native SSR |
| Component kit      | **Angular Material 3** + `@angular/cdk`                         | M3 only; no legacy / MDC-prefixed components |
| Utility CSS        | **Tailwind CSS v4** (CSS-first, `@tailwindcss/postcss`)         | tokens map to Material design tokens         |
| 2D games           | **Phaser 3** (`phaser`)                                         | default 2D game framework; see `.ai/rules/games.md` |
| Server / AI        | **Genkit** (optional)                                           | for AI flows, Gemini default                 |
| Package manager    | **pnpm 9**                                                       | workspace-aware, fast                        |
| Node               | **20.19+ LTS**                                                  | locked via `.nvmrc`                          |
| Tests (unit)       | **Vitest 2** via `@angular/build:unit-test` (native, Angular 21)| no Analog needed                             |
| Tests (E2E)        | **Playwright 1.49+**                                            | chromium + firefox + webkit + mobile-chrome  |
| Linting            | **ESLint 9** flat + `angular-eslint` + `tailwindcss`            | type-aware                                   |
| Formatting         | **Prettier 3** + sort-imports + organize-attributes + tailwindcss | class sort                                 |
| Hooks              | **Husky 9** + `lint-staged`                                     | pre-commit, commit-msg, pre-push             |
| Commits            | **Commitizen** + **Commitlint** (Conventional)                  | drives `nx release`                          |
| CI                 | **GitHub Actions**                                              | nx affected, matrix E2E                      |
| AI agent runtime   | **Claude Code** + IDE-agnostic `.ai/`                           | multi-agent orchestration                    |
| MCP servers        | `context7`, `playwright`, `nx`, `angular-cli`                   | live capabilities for agents                 |

## Why these picks

- **Angular 21 native Vitest**: shipped via `@angular/build:unit-test`. We don't need `@analogjs/vitest-angular` (Analog is a meta-framework — only adopt it if we want file-based routing / server endpoints).
- **Material 3 + Tailwind v4** *together*: components vs utilities, no overlap. Material owns interactive widgets (button, dialog, snackbar, table). Tailwind owns layout, spacing, typography utilities. Both speak the same design tokens via CSS variables — see [`.ai/rules/styling.md`](../../.ai/rules/styling.md).
- **Tailwind v4 CSS-first**: no `tailwind.config.js`. Tokens live in `styles/tailwind.css` under `@theme`, mapped to `var(--mat-sys-*)` for theme parity with Material.
- **Playwright over Cypress**: cross-browser, deterministic auto-waiting, MCP integration.
- **ESLint flat**: future-proof.
- **Nx with inferred targets**: less boilerplate per project, smarter caching.
- **Conventional Commits**: `nx release` computes SemVer + changelogs automatically.

## Versioning policy

- Pin minor in `package.json` (`^21.0.0`).
- Renovate / Dependabot opens grouped PRs for patches (see `.github/dependabot.yml`).
- Major bumps **require an ADR** (`type: docs(adr)`).

## Adding a new tool

1. Open an ADR (`docs/adr/`).
2. Update this file + `.ai/context/tech-stack.md`.
3. Update `.ai/rules/` if new rules apply.
4. Add VS Code extension to `.vscode/extensions.json` if relevant.

## Forbidden tools

- `tslint`, `karma`, `protractor` — replaced by ESLint, Vitest (native), Playwright.
- `lerna`, `rush` — Nx covers monorepo workflows.
- `npm` / `yarn` for installs — pnpm only.
- `@analogjs/vitest-angular` — Angular 21 has native Vitest support.
- Tailwind v3 plugin syntax (`tailwind.config.js`, `theme.extend`) — v4 is CSS-first.
