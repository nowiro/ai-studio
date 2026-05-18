# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is generated from Conventional Commits via the release workflow. Manual edits should be limited to the `[Unreleased]` section.

## [Unreleased]

### Changed

- **Extracted cross-app primitives into `@ai-studio/shared-app-shell`** —
  library + school-journal duplicated the same role-allow directive,
  role-guard factory, role-badge chip and mock-login dropdown. They now
  live once in the shared lib:
  - `AUTH_CONTEXT` — DI token + `AuthContext` interface
    (`role: Signal<string | null>`). Each app provides its service via
    `{ provide: AUTH_CONTEXT, useExisting: AuthService }` in `main.ts`.
  - `<RoleAllowDirective>` (selector `*aisRoleAllow`) and
    `roleGuard(allowed, redirectTo)` — generic, read the role from
    `AUTH_CONTEXT`.
  - `<ais-role-badge>` — generic chip with `tone` (one of `blue`,
    `violet`, `emerald`, `amber`, `rose`, `slate`) and `label` inputs.
  - `<ais-mock-login>` — generic profile-picker dropdown driven by a
    `MockLoginProfile[]` input + `profileSelected` output. Apps
    provide thin wrappers that map their domain member type to
    `MockLoginProfile`.
  - `formatPln(grosze)` — single cached `pl-PL` currency formatter
    used by `library-feature-account/my-loans` and
    `library-feature-librarian/overdue-list` (was inlined
    `Intl.NumberFormat` × 2 before). `tire-data` keeps its own thin
    copy with a clear rationale comment — it's `type:data-access` and
    we don't want to pull Angular Material into Node-only unit tests
    via the shared barrel.
- **`shared-app-shell` is now tagged `type:ui` + `type:util`** so
  `type:data-access` libs may depend on it for utility re-exports
  without violating module boundaries.
- **`libs/library-ui` and `libs/journal-ui` slimmed down** to just
  their app-specific presentational components. `journal-ui` keeps a
  tiny `JOURNAL_ROLE_TONES` / `JOURNAL_ROLE_LABELS` map that
  translates the app's role enum to the shared badge contract.

### Added

- **School-journal demo app** (`apps/school-journal`, port **4207**) —
  Librus/Vulcan-style virtual class register with four roles (student /
  parent / teacher / admin) and six supporting libs under
  `scope:school-journal`:
  - `libs/journal-data` — domain models (`Student`, `Teacher`,
    `Subject`, `Grade`, `AttendanceMark`, `TimetableSlot`, `Term`,
    `JournalMember`), pure logic (`subjectAverages`, `termFromDate`,
    `buildTimetableGrid`, `hasConflict`, `tallyAttendance`,
    `attendanceRate`, `dailyCounts`), 2-class × ~20-student seed and
    five signal-driven services (`SessionService`, `GradesService`,
    `AttendanceService`, `TimetableService`, `RosterService`). 30 unit
    tests on the pure layer (≥80 % thresholds enforced).
  - `libs/journal-ui` — `<ais-grade-chip>`, `<ais-attendance-chip>`,
    `<ais-journal-role-badge>`, `*aisJournalRoleAllow` structural
    directive, `journalRoleGuard()` `CanMatchFn` factory.
  - `libs/journal-feature-shell` — `<ais-journal-dashboard>` with
    mock-login dropdown, term switcher and role-aware nav cards.
  - `libs/journal-feature-timetable` — bespoke 5-day × 8-period grid
    rendered from the active class section.
  - `libs/journal-feature-grades` — student view grouped by subject
    with weighted averages, plus a teacher-only `<ais-grade-editor>`.
  - `libs/journal-feature-attendance` — summary tiles + chronological
    chip strip of recent marks.
- **`start:school-journal` script** + `start:all` now serves **8** apps
  in parallel (nowiro 4200 / union-vault 4201 / pong-game 4202 /
  personal-data-wizard 4203 / tetris-game 4204 / tire-shop 4205 /
  library 4206 / school-journal 4207).
- **Spec + ADR for school-journal** under
  `docs/analytical/specs/school-journal/` and
  `docs/adr/0008-journal-context.md` (singleton `SessionService` as
  source of truth for role + class + term context; signals on top).
- **Library demo app** (`apps/library`, port **4206**) — small-library
  system with reader / librarian role-based views and four supporting
  libs under `scope:library`:
  - `libs/library-data` (`type:data-access` + `type:util`) — models
    (`Book`, `Member`, `Loan`, `Reservation`), pure logic
    (`matchesFilters`, `sortBooks`, `searchRank`, `issueLoan`,
    `daysOverdue`, `fineGrosze`, `canRenew`, `renewLoan`,
    `returnLoan`, `buildAvailability`, `reservationPosition`,
    `queueForBook`), 60-book seed dataset across 9 languages + 10
    genres, and three signal-driven services (`AuthService`,
    `CatalogueService`, `LoansService`). 44 unit tests on the pure
    layer (≥80 % thresholds enforced).
  - `libs/library-ui` (`type:ui`) — `<ais-availability-chip>`,
    `<ais-due-date-badge>`, `<ais-book-cover>`, `<ais-role-badge>`,
    `*aisRoleAllow` structural directive, and the `roleGuard()`
    `CanMatchFn` factory.
  - `libs/library-feature-catalogue` (`type:feature`) — paginated
    MatTable catalogue with sort + facets (genre / language /
    availability) and a `<ais-book-detail>` view with borrow / reserve
    actions.
  - `libs/library-feature-account` (`type:feature`) — mock-login
    dropdown, "moje wypożyczenia" table with overdue badges + renew,
    "moje rezerwacje" with queue positions.
  - `libs/library-feature-librarian` (`type:feature`) — KPI strip
    (active / overdue / reservations), overdue list, all-loans table
    with mark-returned action.
- **`start:library` script** + `start:all` now serves **7** apps in
  parallel (nowiro 4200 / union-vault 4201 / pong-game 4202 /
  personal-data-wizard 4203 / tetris-game 4204 / tire-shop 4205 /
  library 4206).
- **Spec + ADR for library-app** under `docs/analytical/specs/library-app/`
  and `docs/adr/0007-library-roles.md` (defence-in-depth role gating:
  `CanMatchFn` guard + structural directive, both reading the same
  `AuthService` signal).
- **Tire-shop demo app** (`apps/tire-shop`, port **4205**) — a tire-retail
  e-commerce front-end with four supporting libs under `scope:tire-shop`:
  - `libs/tire-data` (`type:data-access` + `type:util`) — domain models
    (`Tire`, `CartLine`, `OrderDraft`, …), pure filter/sort functions
    (`matchesFilters`, `sortTires`, `summariseFacets`, `buildCartView`,
    `cartTotal`, `formatPln`), the seed catalogue (60 SKUs across 18
    brands) and two signal-driven services: `CatalogueService` (facet
    state + `filtered = computed(...)` view) and `CartService` (signal +
    localStorage adapter, versioned key `ais.tire-shop.cart.v1`).
    35 unit tests cover the pure-function module (100 % stmts / 91 %
    branches, ≥80 % thresholds enforced).
  - `libs/tire-ui` (`type:ui`) — presentational components: A–E
    `<ais-eu-label>` badge, `<ais-price-tag>` (PLN + struck-through old
    price), `<ais-stars-rating>` (Material symbols), `<ais-tire-size-input>`
    (3-field width / profile / diameter).
  - `libs/tire-feature-catalogue` (`type:feature`) —
    `<ais-catalogue-page>` (filter panel + sort dropdown + responsive
    card grid + empty-state), `<ais-product-card>`,
    `<ais-product-detail>` (gallery, spec table, "fits my car" tab,
    description), `<ais-filter-panel>` (brand / size / season / EU label
    / price / in-stock facets).
  - `libs/tire-feature-cart` (`type:feature`) — `<ais-cart-drawer>`
    (header-mounted right sidenav), `<ais-cart-page>` (line items +
    quantity steppers + summary aside), `<ais-checkout>` (4-step
    Material stepper: contact → delivery → invoice → summary; typed
    Reactive Forms with cross-step validation; mock order number on
    submit).
- **`start:tire-shop` script** + `start:all` now serves **6** apps in
  parallel (nowiro 4200 / union-vault 4201 / pong-game 4202 /
  personal-data-wizard 4203 / tetris-game 4204 / tire-shop 4205).
- **Spec + ADR for tire-shop** under `docs/analytical/specs/tire-shop/`
  and `docs/adr/0006-tire-shop-state.md` (signals + services +
  localStorage, no NgRx).
- **Tetris game** (`apps/tetris-game`, port **4204**) with two supporting libs:
  - `libs/game-tetris` (`scope:game-tetris`, `type:util`) — framework-agnostic
    logic: 7-bag randomiser (seedable LCG, reproducible), SRS-lite rotation
    (no kicks v1), gravity table (Guideline curve), Tetris-Guideline scoring
    (1/2/3/4-line clears with level multiplier), pure-function board/collision/
    rotation utilities, and a deterministic `TetrisState` runner with event-
    emitter pattern. 55 unit tests cover the logic core (≥80 % coverage
    thresholds enforced in `vitest.config.ts`).
  - `libs/game-tetris-ui` (`scope:game-tetris`, `type:ui`) — Angular 21
    standalone components driven by signals: `<ais-tetris-host>` (canvas
    render + RAF loop + keyboard input), `<ais-tetris-score>`,
    `<ais-tetris-next-queue>`, `<ais-tetris-hold-slot>`,
    `<ais-tetris-menu>` (idle/paused), `<ais-tetris-game-over>`. Hold +
    ghost-piece preview + 3-piece next queue + level/lines/score HUD.
- **`start:tetris-game` script** + `start:all` now serves **5** apps in
  parallel (nowiro 4200 / union-vault 4201 / pong-game 4202 /
  personal-data-wizard 4203 / tetris-game 4204).
- **Plan docs** for upcoming demo apps under `docs/ai-workflow/plans/`:
  - `2026-05-18-tetris-game.md` (status: done, this release)
  - `2026-05-18-tire-shop.md` (status: done, this release)
  - `2026-05-18-library-app.md` (status: draft — catalogue + reader/
    librarian role-based views + MatTable-heavy admin, port 4206)
  - `2026-05-18-school-journal.md` (status: draft — virtual class register
    with timetable / grades / attendance / 4-role auth, port 4207)
- **Marketing app `nowiro`** (port 4200) — landing page with header, hero, services, experience, about, contact sections; PL/EN language toggle; auto-cropped favicon pipeline (`tools/scripts/generate-favicon.py`).
- **Marketing app `union-vault`** (port 4201) — single-page-app port of UnionVault.eu with 24-language switcher, real-estate and EU benefits sections.
- **Shared library `@ai-studio/shared-language`** — reusable two-state `<ais-language-toggle>` component (Material 3 button + flag icon) consumable by every app via inputs (`flagSrc`, `label`, `ariaLabel`, `(languageToggle)` output). Apps keep their own `LanguageService`; the lib is state-agnostic.
- **`SECURITY.md`** — full Angular security checklist (24 items from <https://angular.dev/best-practices/security>) with per-app CSP summary and notes on HTTP-only directives (`frame-ancestors`, `report-uri`, `sandbox`).
- **`start:all` script** — runs all four apps in parallel via `nx run-many -t serve --projects=nowiro,union-vault,pong-game,personal-data-wizard --parallel=4`.

### Changed

- **Dependency bumps to latest stable across the entire workspace (2026-05-18):**
  - **Framework:** Angular 21.2.10/12 → 21.2.11/13 (all packages), Nx 21.6.11 → 22.7.2 (via `nx migrate latest` + `--run-migrations`), Tailwind 4.2.4 → 4.3.0, Phaser **3.90.0 → 4.1.0**, jspdf **3.0.4 → 4.2.1**, `zone.js` 0.15.1 → 0.16.2.
  - **TypeScript:** 5.9.3 → **6.0.3**. `tsconfig.base.json` now omits the deprecated `baseUrl` and ships relative `paths` (each prefixed with `./`).
  - **ESLint:** 9.39.4 → **10.4.0** (+ `@eslint/js`). `eslint-plugin-import` 2.32.0 → **`eslint-plugin-import-x` 4.16.2** (fork; original abandoned, incompatible with ESLint 10's linter API). `eslint-config-prettier` 9.1.2 → 10.1.8.
  - **Vitest / Vite:** vitest 3.2.4 → 4.1.6 (+ `@vitest/coverage-v8`), vite 7.3.2 → 8.0.13, jsdom 25 → 29 (required peer for `@angular/build@21.2.11`).
  - **ESLint plugins:** `eslint-plugin-jsdoc` 50.8 → 62.9, `eslint-plugin-unicorn` 56 → 64, `eslint-plugin-playwright` 1.8 → 2.10, `eslint-plugin-rxjs-x` 0.7 → 1.0, `angular-eslint` 21.3 → 21.4.
  - **Tooling:** `@commitlint/{cli,config-conventional}` 19.8 → 21.0, `lint-staged` 15.5 → 17.0, `globals` 15.15 → 17.6, `markdownlint-cli2` 0.14 → 0.22, `prettier-plugin-tailwindcss` 0.6.14 → 0.8.0, `@trivago/prettier-plugin-sort-imports` 4.3 → 6.0.
  - **Patches:** `@types/node` 22.19 → 25.8, `jiti` 2.4.2 → 2.7.0, `@playwright/test` 1.59 → 1.60.
- `packageManager` bumped from `pnpm@9.15.0` to `pnpm@11.1.2`. New `pnpm-workspace.yaml` records the `allowBuilds` allow-list (esbuild, lmdb, nx, core-js, less, `@parcel/watcher`, msgpackr-extract, unrs-resolver — pnpm 11 now blocks lifecycle scripts by default).

### Fixed

- **Node ESM-strict migration:** all `vitest.config.ts` (game-pong, wizard-data, wizard-dev-tools, wizard-util-validators) and `playwright.config.ts` (nowiro-e2e, union-vault-e2e) now reconstruct `__dirname`/`__filename` via `fileURLToPath(import.meta.url)` — required by Node ESM-strict / TS 6 / Vitest 4 running config files as true ES modules.
- **Phaser 4 API removal:** `libs/game-pong/src/scenes/boot.scene.ts` no longer calls `TextureManager.generate('white', …)` (method removed in Phaser 4). It was dead code anyway — the paddles/ball are rendered as coloured `Phaser.GameObjects.Rectangle` primitives, not textured sprites.
- **Wizard FormControl typing** (`libs/wizard-feature/src/steps/step-summary.component.ts`): the terms-consent getter is now typed `FormControl<boolean>` instead of `AbstractControl` so Angular 21's `strictTemplates` resolves the `(change)` binding.

### Security

- Angular security checklist documented in `SECURITY.md` (24 items, per-app CSP summary, HTTP-header notes).
- Workspace CSP meta tags on all four apps (`default-src 'self'`, restricted `script-src`, `style-src` with Google Fonts allow-list, `connect-src 'self'`, `base-uri 'self'`, `form-action 'self'`).

[Unreleased]: https://github.com/nowiro/ai-studio/commits/main
