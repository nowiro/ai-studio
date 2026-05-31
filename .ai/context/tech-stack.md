---
id: context.tech-stack
title: Tech stack
type: context
version: 3.0.0
---

# Tech stack

| Warstwa          | Wybór                                                              | Uzasadnienie                                                           |
| ---------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Monorepo         | **Nx 21+**                                                         | Affected commands, generatory, project graph, ESLint module boundaries |
| Framework        | **Angular 21** (standalone, signals, control flow, native SSR)     | Default dla zespołu; reguły AI z angular.dev/ai                        |
| Component kit    | **Angular Material 3** (`@angular/material` + `@angular/cdk`)      | First-party Material 3 z `mat.theme()`                                 |
| Utility CSS      | **Tailwind CSS v4** (CSS-first, `@tailwindcss/postcss`)            | Mapuje utilities na Material 3 design tokens                           |
| 2D games         | **Phaser 3** (pakiet `phaser`)                                     | Domyślny 2D game framework; Angular shell hostuje canvas               |
| Server AI        | **Genkit** (rekomendowany, opcjonalny)                             | First-class flows + Gemini integration, structured tool calls          |
| Client AI        | **Firebase AI Logic** (opcjonalny)                                 | Bezpieczna obsługa klucza dla browser-side calls                       |
| Unit / Component | **Vitest 2** przez `@angular/build:unit-test` (native, Angular 21) | Zastępuje Karma; Analog nie potrzebny                                  |
| E2E              | **Playwright**                                                     | Cross-browser, stabilne selektory, MCP integration                     |
| Linting          | **ESLint 9** (flat config) + `angular-eslint` + `tailwindcss`      | Modern reguły, type-aware checks, AI-friendly errors                   |
| Formatting       | **Prettier 3** + sort-imports + organize-attributes + tailwindcss  | Deterministic; class-name sort                                         |
| Hooks            | **Husky 9** + **lint-staged**                                      | Lightweight gates przed commit/push                                    |
| Commits          | **Commitizen** + **commitlint** (Conventional)                     | Napędza semantic releases przez `nx release`                           |
| Package manager  | **pnpm** (workspace-aware)                                         | Szybszy, lockfile kompatybilny z CI                                    |
| Node             | **20.19+ LTS**                                                     | Locked przez `.nvmrc`                                                  |
| CI               | **GitHub Actions**                                                 | Built-in caching, OIDC dla cloud auth                                  |
| MCP servers      | context7, playwright, nx, angular-cli                              | Patrz `.ai/mcp.json`                                                   |

## Czemu te wybory

- **Angular 21 native Vitest**: shipowane z `@angular/build:unit-test` (stabilised w 21). `@analogjs/vitest-angular` jest wymagany tylko gdy adoptujesz Analog jako meta-framework, nie jako test bridge. Nie potrzebujemy go tutaj.
- **Material 3 + Tailwind v4**: komponenty vs utilities — nie konkurują. Material jest właścicielem interactive widgets i theming; Tailwind jest właścicielem layout / spacing / responsive utilities. Oba mówią tymi samymi design tokens przez CSS variables (patrz `.ai/rules/styling.md`).
- **Tailwind v4 CSS-first**: żadnego `tailwind.config.js`. Tokeny żyją w `styles/tailwind.scss` pod `@theme` i mostują do `var(--mat-sys-*)` dla parytetu z Materialem.
- **Playwright zamiast Cypress**: multi-browser default, lepsze network stubbing, MCP support.
- **ESLint flat config**: future-proof, brak deprecation surprise z `.eslintrc`.
- **Nx z inferred targets**: mniej boilerplate w `project.json`, smarter caching.
- **Conventional Commits**: umożliwia `nx release` auto-versioning i generowanie changelogów.
- **Phaser 3 dla 2D games**: aktywnie utrzymywany, dojrzałe TS typy od 3.80, MIT-licensed examples repo. Game scenes żyją w framework-agnostic `libs/game-*`, więc engine pozostaje odcięty od Angular. Patrz [`.ai/rules/games.md`](../rules/games.md) i [ADR 0004](../../docs/adr/0004-phaser-as-default-game-library.md).

## Polityka wersjonowania

Pinujemy minor versions (`^21.0.0`); patche podnosimy **manualnie** (brak bota dependabot/renovate — repo nie używa GitHub automation). Major bumps wymagają ADR.
