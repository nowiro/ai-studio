# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is generated from Conventional Commits via the release workflow. Manual edits should be limited to the `[Unreleased]` section.

Entries start from the next version released after this final baseline. Prior history is out of scope (dropped at consolidation to final baseline).

## [Unreleased]

### Added

- **`apps/starter`** + **`apps/starter-e2e`** — minimalna referencyjna aplikacja Angular 21 + Material 3 + Tailwind v4 do kopiowania jako template dla nowych domain apps. Port `4221`. Azure primary + Rose tertiary palette (Material 3 canonical), density `-1`, `color-scheme: light`. Boot przez `@ai-studio/shared-app-shell#bootstrapApp` (centralny crash handler). Trzy sekcje showcase: M3 color tokens (6 ról × container + on-container), M3 type scale (10 wariantów), Tailwind ↔ M3 utility bridge (`bg-primary`, `text-on-surface-variant`, …). App-level unit test (`app.spec.ts`) potwierdza mount + router-outlet; integrację pokrywa smoke E2E `home.e2e.ts` (chromium-only). Uruchomienie: `pnpm start:starter`.
- **`libs/starter-feature`** (`scope:starter,type:feature`) — lazy-loaded `STARTER_FEATURE_ROUTES` + `HomeComponent` z showcase trzech sekcji. Konsumuje `@ai-studio/ui-kit` (`AisHero`, `AisSection`) i `@ai-studio/starter-ui`.
- **`libs/starter-ui`** (`scope:starter,type:ui`) — dwa komponenty prezentacyjne: `TokenCardComponent` (M3 container/on-container demo per rola) i `TypographyRowComponent` (M3 type-scale row z Polish pangram sample). Brak `mat-*` direct imports — czysty CSS-var consumption. Jeśli wzorzec pojawi się ≥ 3× cross-apps, przenosimy do `libs/ui-kit`.

### Changed

- **`eslint.config.mjs`** — dodano `scope:starter` do `scope:app` allow list + nowy constraint block `scope:starter → [scope:shared, scope:starter, scope:util]`. Bez tego module-boundary lint odrzucałby starter-feature → starter-ui.
- **`package.json#scripts`** — dodano `start:starter` (nx serve) + dopisano `starter` do `start:all` parallel list.
- **`pnpm-workspace.yaml`** — `'@swc/core': true` (był placeholder "set this to true or false" blokujący `pnpm install` po dodaniu nowych `@nx/angular` schematic deps).
