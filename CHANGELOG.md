# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is maintained by hand per Keep a Changelog; commit messages follow Conventional Commits. Record changes under `[Unreleased]` as they land (no release-automation workflow — see the dependency/release note below).

Entries start from the next version released after this final baseline. Prior history is out of scope (dropped at consolidation to final baseline).

## [Unreleased]

### Added

- **`apps/starter`** + **`apps/starter-e2e`** — minimalna referencyjna aplikacja Angular 21 + Material 3 + Tailwind v4 do kopiowania jako template dla nowych domain apps. Port `4221`. Azure primary + Rose tertiary palette (Material 3 canonical), density `-1`, `color-scheme: light`. Boot przez `@ai-studio/shared-app-shell#bootstrapApp` (centralny crash handler). Trzy sekcje showcase: M3 color tokens (6 ról × container + on-container), M3 type scale (10 wariantów), Tailwind ↔ M3 utility bridge (`bg-primary`, `text-on-surface-variant`, …). App-level unit test (`app.spec.ts`) potwierdza mount + router-outlet; integrację pokrywa smoke E2E `home.e2e.ts` (chromium-only). Uruchomienie: `pnpm start:starter`.
- **`libs/starter-feature`** (`scope:starter,type:feature`) — lazy-loaded `STARTER_FEATURE_ROUTES` + `HomeComponent` z showcase trzech sekcji. Konsumuje `@ai-studio/ui-kit` (`AisHero`, `AisSection`) i `@ai-studio/starter-ui`.
- **`libs/starter-ui`** (`scope:starter,type:ui`) — dwa komponenty prezentacyjne: `TokenCardComponent` (M3 container/on-container demo per rola) i `TypographyRowComponent` (M3 type-scale row z Polish pangram sample). Brak `mat-*` direct imports — czysty CSS-var consumption. Jeśli wzorzec pojawi się ≥ 3× cross-apps, przenosimy do `libs/ui-kit`.
- **i18n demo (ADR-0017)** — `LanguageSwitcherComponent` (`apps/nowiro`) z runtime PL/EN switch przez fasadę `LocalizationApi` (`@ai-studio/shared-i18n`), label przez pipe `transloco`. Demonstruje staged-migration Transloco obok legacy in-code dictionary; build AOT zielony.
- **E2E a11y fixture** — `@ai-studio/shared-test-utils`: `expectNoA11yViolationsOnPage()` (wstrzykuje `axe.source`, bez wrapper-deps) + `BaseE2EPage` (console-errors + a11y). Helper gotowy w libie; **adopcja w e2e odłożona** — projekty `*-e2e` są nietagowane, więc `@nx/enforce-module-boundaries` blokuje import liba. Follow-up: nadać im `type:e2e` + regułę boundary.
- **`tsconfig.spec.json`** w `libs/shared-test-utils` i `libs/wizard-form-fill` (`exclude: []`) — pliki `*.spec.ts` są teraz type-aware lintowalne (wcześniej dziedziczyły `exclude: **/*.spec.ts` i wywalały lint).

### Changed

- **`eslint.config.mjs`** — dodano `scope:starter` do `scope:app` allow list + nowy constraint block `scope:starter → [scope:shared, scope:starter, scope:util]`. Bez tego module-boundary lint odrzucałby starter-feature → starter-ui.
- **`package.json#scripts`** — dodano `start:starter` (nx serve) + dopisano `starter` do `start:all` parallel list.
- **`pnpm-workspace.yaml`** — `'@swc/core': true` (był placeholder "set this to true or false" blokujący `pnpm install` po dodaniu nowych `@nx/angular` schematic deps).
- **`tools/scripts/doc-audit.mjs`** — hardening detekcji `stale-fact`: `NEGATION_LINE_RE` rozszerzony o polskie zakazy (`bez`, `żadnego`, `niepotrzebne`, `nie instaluj/importuj/używaj`) + `instead of` / `not in`; plany (`docs/ai-workflow/plans/`) wykluczone jak ADR-y i run-logi. `docs:audit` must-fix **14 → 2** (oba benign, zero realnych broken-linków).
- **`nowiro-e2e` / `union-vault-e2e`** — pozostają jako smoke-testy (boot + heading + brak console-errors); axe-fixture dostępny w libie, do adopcji po otagowaniu projektów e2e.
- **`docs/analytical/specs/*`** — sekcja „E2E coverage" (mapowanie scenariuszy/AC → pliki e2e) w `library-app`, `school-journal`, `tire-shop`, `union-vault`.
- **`.ai/rules/{testing,styling}.md` + `shared-i18n`** — poprawiona nazwa pipe Transloco `| t` → `| transloco`; udokumentowany e2e helper a11y.
- **`.gitignore`** — robocze artefakty zadań (`docs/ai-workflow/plans`, `docs/ai-workflow/runs`, `docs/analytical/specs`) są **local-only**; scaffolding (`_template`, `.gitkeep`) pozostaje commitowany.

### Removed

- **Automatyzacja GitHub release/zależności** — `.github/dependabot.yml`, `release-please-config.json`, `.release-please-manifest.json`. Per decyzja projektowa repo **nie używa GitHub Actions / workflow automation**; release i bump zależności są manualne (Conventional Commits + ręczny tag / `nx release`).
