---
id: plan.ui-kit-wrappers
title: Extract Material + 3rd-party UI components into a wrapper library (libs/ui-kit)
type: plan
date: 2026-05-18
trigger: user request — "wszystkie komponenty materialowe które są używane lub inne komponenty z innych bibliotek przenieś do biblioteki — zrobimy do nich wrappery, żeby jeśli w przyszłości będzie konieczność wymiany Angular Material, było to łatwiejsze"
status: superseded
closedAt: 2026-05-19
closeReason: 'Already superseded prior to 2026-05-19 audit; retired to archive/ as part of plans cleanup.'
supersededBy: docs/ai-workflow/plans/2026-05-18-portal-elements-keycloak.md
supersededReason: Merged with portal-mfe.md + Web Components + Keycloak into one consolidated roadmap plan. The ui-kit work lives as Phase 2 in the new plan.
owner: orchestrator
agents:
  - analyst
  - architect
  - frontend-developer
  - test-engineer
  - code-reviewer
  - doc-writer
links:
  spec: docs/analytical/specs/ui-kit/spec.md
  adr: docs/adr/0011-ui-kit-wrapper-strategy.md
  issue: null
---

# Plan: ui-kit wrapper library

## Goal

Centralise every Angular Material (and third-party) component
currently consumed across the 11 apps into a single
`libs/ui-kit` library that exposes **thin wrappers** with a stable,
framework-agnostic API. The goal isn't to hide Material — it's to
**provide a single seam** so a future swap to Headless UI, Spartan,
PrimeNG, or a hand-rolled set is a localised change inside `libs/ui-kit`
rather than a 50-file PR across every app.

## Scope

| In                                                                                                                         | Out                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| New `libs/ui-kit` (`scope:shared`, `type:ui`) — wraps every Material component used in apps                                | Wrapping `NgOptimizedImage`, `RouterLink`, `RouterOutlet` (Angular built-ins)                 |
| Per-component **stable input/output contract** (e.g. `<ais-button variant="filled">…</ais-button>`)                        | Re-implementing Material visuals (we keep delegating to `<button matButton>` underneath)      |
| Migrate `tire-ui`, `library-ui`, `journal-ui`, `shop-ui`, `shared-app-shell` and every app shell to use `<ais-…>` wrappers | Migrating the 11 apps' `index.html` Material font-family declarations                         |
| ADR documenting the contract + when to add a new wrapper vs use raw Material                                               | Custom Material theme overrides — those live in `styles/tailwind.scss`                        |
| Test suite that exercises the wrapper API (input → DOM attribute on the wrapped element)                                   | Visual-regression tests (kept as a `docs:roadmap` follow-up)                                  |
| All 11 apps' `technical.md` reference the wrapper API in their lib graph                                                   | Removing direct Material imports from `libs/shop-ui`, `tire-feature-*` (covered in this plan) |
| ESLint rule (or doc-only) discouraging direct `@angular/material/*` imports outside `libs/ui-kit`                          | Stylistic refactors unrelated to the wrap (e.g. switching to Tailwind v5)                     |

## Inputs

- Existing Material consumers (grep `@angular/material` across the repo
  to enumerate components):
  - `MatButton`, `MatButtonModule`, `MatIconButton` (every app)
  - `MatCard`, `MatCardModule` (product cards, book cover, KPI tiles)
  - `MatChip`, `MatChipsModule` (badges, role chips, attribute chips)
  - `MatCheckbox`, `MatCheckboxModule` (filter panels)
  - `MatFormField`, `MatFormFieldModule` (every form input)
  - `MatInput`, `MatInputModule` (every text input)
  - `MatSelect`, `MatSelectModule` (sort dropdown, login mock)
  - `MatRadio`, `MatRadioModule` (delivery method)
  - `MatTabs`, `MatTabsModule` (product detail tabs)
  - `MatTable`, `MatTableModule` (library MatTable, journal grades)
  - `MatPaginator`, `MatPaginatorModule` (library catalogue)
  - `MatExpansionPanel`, `MatExpansionModule` (filter facets)
  - `MatStepper`, `MatStepperModule` (4-step checkout)
  - `MatBadge`, `MatBadgeModule` (cart count badge)
  - `MatToolbar`, `MatToolbarModule` (every app shell)
  - `MatSidenav`, `MatSidenavModule` (cart drawer)
  - `MatDivider`, `MatDividerModule` (summary aside)
  - `MatTooltip`, `MatTooltipModule` (union-vault)
  - `MatButtonToggle`, `MatButtonToggleModule` (term switcher)
- `.ai/rules/{angular,styling}.md` — selector / OnPush / signal rules
- <https://material.angular.io> — Material API reference (the source of truth for the wrapped contract)
- <https://github.com/spartan-ng/ui> — example of a Material alternative
  the future could swap to (proves the wrapper pattern is worth it)

## Architecture

```
libs/ui-kit                       (scope:shared, type:ui)
  ├ src/
  │  ├ buttons/
  │  │  ├ button.component.ts         <ais-button variant="text|filled|outlined|tonal" [disabled]
  │  │  └ icon-button.component.ts    <ais-icon-button>
  │  ├ surfaces/
  │  │  ├ card.component.ts           <ais-card>
  │  │  ├ divider.component.ts        <ais-divider>
  │  │  └ badge.directive.ts          [aisBadge]="count"
  │  ├ navigation/
  │  │  ├ toolbar.component.ts        <ais-toolbar color="primary">
  │  │  ├ sidenav.component.ts        <ais-sidenav opened="…" mode="over|side">
  │  │  ├ tabs.component.ts           <ais-tabs> + <ais-tab label="…">
  │  │  └ stepper.component.ts        <ais-stepper orientation="vertical|horizontal">
  │  ├ inputs/
  │  │  ├ form-field.component.ts     <ais-form-field label="…">
  │  │  ├ text-input.directive.ts     [aisInput]
  │  │  ├ select.component.ts         <ais-select [options]="…">
  │  │  ├ radio-group.component.ts    <ais-radio-group>
  │  │  ├ checkbox.component.ts       <ais-checkbox>
  │  │  └ button-toggle-group.component.ts
  │  ├ data/
  │  │  ├ table.component.ts          <ais-table> wrapping MatTable
  │  │  ├ paginator.component.ts      <ais-paginator>
  │  │  └ chip.component.ts           <ais-chip>
  │  ├ overlay/
  │  │  ├ expansion-panel.component.ts<ais-expansion-panel>
  │  │  └ tooltip.directive.ts        [aisTooltip]="…"
  │  ├ tokens/
  │  │  └ ui-kit-config.ts            InjectionToken with global defaults
  │  └ index.ts                       Public API barrel
  └ project.json + tsconfig.{json,lib,spec}.json + vitest.config.ts

eslint.config.mjs depConstraints — Add an ESLint rule
(`no-restricted-imports`) that forbids importing `@angular/material/*`
outside `libs/ui-kit`. The wrapper lib is the only consumer of the
underlying framework.

Each wrapper is a standalone Angular 21 component:
- OnPush change detection.
- `input()` + `output()` signal-based API (no `@Input()` decorators).
- `ais-` selector prefix per repo convention.
- Forwards `content`-projected children.
- Forwards relevant ARIA + accessibility attributes via host bindings.
- TypeDoc comment on every public input/output.

Optional v2: a `UiKitConfig` injection token lets apps tweak global
defaults (default button variant, default form-field appearance) so
the wrappers stay declarative without bloated input lists.
```

### Migration model

Each app migrates in three steps:

1. Add `@ai-studio/ui-kit` as a dependency in the app's lib graph.
2. Replace `<button matButton>…</button>` with `<ais-button>…</ais-button>`.
   Replace `<mat-form-field>` with `<ais-form-field>`. Replace
   `<mat-table>` with `<ais-table>`. Etc.
3. Remove the original `@angular/material/*` imports from the file.
4. Re-run the affected app's tests + E2E.

Migration is **per-app and per-file** — there's no big bang. Once the
final app's `MatButton` is gone, the ESLint rule is flipped from
`warn` to `error`.

## Component inventory (estimated)

About 20 Material primitives are used. The wrapper count after consolidation
will be ~17 (some Material entries collapse into one wrapper, e.g.
`<ais-button>` covers button variants).

| Material module        | Wrapper                                     | Where it appears                                                |
| ---------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `MatButton`            | `<ais-button>`                              | every app shell, product cards, filter panels, checkout buttons |
| `MatIconButton`        | `<ais-icon-button>`                         | header cart-button, drawer close, table actions                 |
| `MatCard`              | `<ais-card>`                                | product cards, KPI tiles                                        |
| `MatChip`              | `<ais-chip>`                                | role badges, attribute chips, category chips                    |
| `MatChipSet`           | (auto via `<ais-chip>`)                     | chip group containers                                           |
| `MatCheckbox`          | `<ais-checkbox>`                            | every filter panel                                              |
| `MatFormField`         | `<ais-form-field>`                          | every form input                                                |
| `MatInput`             | `[aisInput]`                                | every text field                                                |
| `MatSelect`            | `<ais-select>`                              | sort dropdown, login mock, grade editor                         |
| `MatRadio`             | `<ais-radio-group>` + `<ais-radio>`         | delivery method                                                 |
| `MatTabs`              | `<ais-tabs>` + `<ais-tab>`                  | product detail                                                  |
| `MatTable`             | `<ais-table>`                               | library + journal tables                                        |
| `MatPaginator`         | `<ais-paginator>`                           | library catalogue                                               |
| `MatExpansionPanel`    | `<ais-expansion-panel>`                     | filter panels                                                   |
| `MatStepper`           | `<ais-stepper>`                             | 4-step checkout                                                 |
| `MatBadge`             | `[aisBadge]`                                | cart count                                                      |
| `MatToolbar`           | `<ais-toolbar>`                             | every app shell                                                 |
| `MatSidenav`           | `<ais-sidenav>` + `<ais-sidenav-container>` | cart drawer, school-journal                                     |
| `MatDivider`           | `<ais-divider>`                             | summary asides                                                  |
| `MatTooltip`           | `[aisTooltip]`                              | union-vault, library                                            |
| `MatButtonToggleGroup` | `<ais-button-toggle-group>`                 | term switcher                                                   |

(Non-Material components reviewed and **not** wrapped: `NgOptimizedImage`,
`RouterLink`, `RouterOutlet`, `ReactiveFormsModule` directives. They're
Angular built-ins; wrapping them buys nothing.)

## Tasks (DAG)

| id   | title                                                                                         | agent              | inputs              | outputs                                      | done_when                                              | parallel_with   | blocked_by |
| ---- | --------------------------------------------------------------------------------------------- | ------------------ | ------------------- | -------------------------------------------- | ------------------------------------------------------ | --------------- | ---------- |
| T001 | Spec — inventory of Material components in use + per-component API contract                   | analyst            | grep + reference UX | docs/analytical/specs/ui-kit/spec.md         | No `[?]` markers; AC table complete                    |                 |            |
| T002 | ADR — wrap-everything vs wrap-on-demand; ESLint enforcement strategy                          | architect          | T001                | docs/adr/0011-ui-kit-wrapper-strategy.md     | ADR Status: accepted                                   |                 | T001       |
| T003 | Scaffold `libs/ui-kit` (project.json, tsconfig.json, src/index.ts, vitest.config.ts)          | frontend-developer | T002                | libs/ui-kit/\*\*                             | `pnpm nx lint ui-kit` clean                            |                 | T002       |
| T004 | Build `buttons/` wrappers (`<ais-button>`, `<ais-icon-button>`)                               | frontend-developer | T003                | libs/ui-kit/src/buttons/\*\*                 | Unit tests cover variant + disabled + click forwarding | T005, T006      | T003       |
| T005 | Build `surfaces/` wrappers (`<ais-card>`, `<ais-divider>`, `[aisBadge]`)                      | frontend-developer | T003                | libs/ui-kit/src/surfaces/\*\*                | Unit tests                                             | T004, T006      | T003       |
| T006 | Build `inputs/` wrappers (form-field, text-input, select, radio, checkbox, button-toggle)     | frontend-developer | T003                | libs/ui-kit/src/inputs/\*\*                  | Unit tests                                             | T004, T005      | T003       |
| T007 | Build `navigation/` wrappers (toolbar, sidenav, tabs, stepper)                                | frontend-developer | T003                | libs/ui-kit/src/navigation/\*\*              | Unit tests                                             | T008            | T003       |
| T008 | Build `data/` wrappers (`<ais-table>`, `<ais-paginator>`, `<ais-chip>`)                       | frontend-developer | T003                | libs/ui-kit/src/data/\*\*                    | Unit tests                                             | T007            | T003       |
| T009 | Build `overlay/` wrappers (`<ais-expansion-panel>`, `[aisTooltip]`)                           | frontend-developer | T003                | libs/ui-kit/src/overlay/\*\*                 | Unit tests                                             |                 | T003       |
| T010 | Migrate `libs/shop-ui` to consume `ui-kit`                                                    | frontend-developer | T004..T009          | libs/shop-ui/\*\*                            | `pnpm nx test shop-core --coverage` still green        | T011..T014      | T004..T009 |
| T011 | Migrate `libs/tire-ui` + `libs/tire-feature-*` to consume `ui-kit`                            | frontend-developer | T004..T009          | libs/tire-ui/**, libs/tire-feature-\*/**     | `pnpm nx e2e tire-shop-e2e` green                      | T010, T012-14   | T004..T009 |
| T012 | Migrate `libs/library-*` to consume `ui-kit`                                                  | frontend-developer | T004..T009          | libs/library-\*/\*\*                         | `pnpm nx e2e library-e2e` green                        | T010-11, T13-14 | T004..T009 |
| T013 | Migrate `libs/journal-*` to consume `ui-kit`                                                  | frontend-developer | T004..T009          | libs/journal-\*/\*\*                         | `pnpm nx e2e school-journal-e2e` green                 | T010-12, T14    | T004..T009 |
| T014 | Migrate `libs/shared-app-shell` (mock-login, role-badge) + every app shell to `ui-kit`        | frontend-developer | T004..T009          | libs/shared-app-shell/**, apps/\*/src/app/** | All apps build clean                                   | T010-13         | T004..T009 |
| T015 | Wire ESLint `no-restricted-imports` rule blocking `@angular/material/*` outside `libs/ui-kit` | frontend-developer | T010..T014          | eslint.config.mjs                            | `pnpm nx lint` fails on a deliberate violation         |                 | T010..T014 |
| T016 | Vitest tests — wrapper input → DOM contract, accessibility forwarding                         | test-engineer      | T004..T009 hand-off | libs/ui-kit/src/\*_/_.spec.ts                | Coverage ≥ 80 % stmts / ≥ 75 % branches                |                 | T010..T015 |
| T017 | Code review — focus on accessibility regression (ARIA forwarding) + bundle size               | code-reviewer      | T010..T016 diff     | review verdict                               | verdict: approved                                      |                 | T010..T016 |
| T018 | Update every `docs/projects/<app>/technical.md` lib graph + public-API tables                 | doc-writer         | T017 accepted PR    | docs/projects/\*/technical.md                | All 11 apps document `ui-kit` as a dep                 |                 | T017       |
| T019 | Write `docs/projects/ui-kit/` (4-doc layout)                                                  | doc-writer         | T017                | docs/projects/ui-kit/\*\*                    | All 4 docs present                                     |                 | T017       |
| T020 | CHANGELOG + README + this plan's `status: done`                                               | doc-writer         | T018, T019          | CHANGELOG.md, this file                      | doc-audit clean                                        |                 | T018, T019 |

## Definition of Done

- `libs/ui-kit` exports every Material wrapper used across the repo
- `pnpm nx run-many -t lint test build --parallel=3` → all projects green
- All E2E specs (`tire-shop-e2e`, `library-e2e`, `school-journal-e2e`,
  `bookstore-e2e`, `tools-shop-e2e`, `toy-shop-e2e`, future
  `portal-e2e`) green
- `libs/ui-kit` coverage ≥ 80 % stmts / ≥ 75 % branches
- Zero direct `@angular/material/*` imports outside `libs/ui-kit`
  (verified by the ESLint rule)
- Spec + ADR-0011 linked and accepted
- This plan's `status: done`
- `docs/projects/ui-kit/` 4-doc set authored

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
pnpm docs:audit
```

## Risks & mitigations

- **Risk:** Accessibility regressions — Material's ARIA wiring is rich;
  forgetting to forward an attribute breaks screen readers.
  **Mitigation:** Use `inheritAttrs` pattern + axe-core checks in Vitest.
  ADR-0011 mandates ARIA fidelity as a hard acceptance criterion.
- **Risk:** Bundle size increases because Material is now imported in
  one shared lib and tree-shaking has fewer entry points.
  **Mitigation:** Each wrapper file imports only the Material module it
  uses (no barrel re-imports inside `ui-kit`). Bundle budget check in
  T017.
- **Risk:** Wrapper API drift — different apps want different defaults
  (e.g. button `variant="filled"` in shop-ui, `variant="text"` in
  union-vault).
  **Mitigation:** Per-component sane defaults documented in JSDoc; opt-
  in `UiKitConfig` injection token for overrides.
- **Risk:** Migration breaks subtle CSS (e.g. dropping `class` props
  through to the inner Material element).
  **Mitigation:** All wrappers use `:host` selectors + forward host
  classes to the inner element with `host: { '[class]': '…' }`.
  Visual smoke in E2E covers the per-page layout; bigger visual-
  regression is a roadmap item.
- **Risk:** Future swap to a different lib still requires per-wrapper
  rewrite work — we save app code, not framework decisions.
  **Mitigation:** Document this honestly in ADR-0011. The seam is
  worth it because the swap stays inside one lib (~17 components ×
  ~30 lines each), not 60+ files across every app.

## Rollback

Revert the migration commits per app. The wrapper lib itself can stay
as a published surface even if some apps decide to inline Material
again — the ESLint rule's enforcement is the only thing to remove.

## Run log

Per-task one-liners go into
`docs/ai-workflow/runs/2026-05-18-ui-kit-wrappers.md` as they execute.

## Open questions

(Resolve during `/clarify`.)

- [?] **`UiKitConfig` injection token v1?** Or defer to v2 once we see
  which defaults actually drift across apps?
- [?] **Style customisation surface** — let consumers pass `class` /
  `[ngClass]` to the wrapper and forward, or expose a fixed set of
  variants per component? Forwarding is flexible but couples to
  Material's internal class names.
- [?] **What about `cdk` primitives** (`A11yModule`, `DragDropModule`,
  `OverlayModule`)? Currently unused. Add to scope if/when consumed.
- [?] **Per-component TestBed harness** vs minimal DOM tests? Material's
  own `MatButtonHarness` etc. could be re-used inside `ui-kit` tests.
- [?] **Documentation site / Storybook?** Plays well with the wrapper
  contract but adds a new dependency. Defer to a follow-up plan?
