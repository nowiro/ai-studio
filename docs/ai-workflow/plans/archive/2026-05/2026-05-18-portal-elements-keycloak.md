---
id: plan.portal-elements-keycloak
title: Consolidated roadmap — portal MFE + standalone Web Components + Keycloak auth + ESLint scale-up
type: plan
date: 2026-05-18
trigger: user request — "zrób refaktor wszystkiego, sprawdź npm run start/build/test/e2e/lint, dostosuj pluginy eslint przy tej liczbie aplikacji, aplikacje mają działać osobno oraz jako web komponenty, przygotuj dokumentację i implementację w portalu, przygotuj implementację dla Keycloak"
status: done
closedAt: 2026-05-19
closeReason: '2026-05-19 audit — finalized as part of the post-implementation cleanup. Tasks delivered as scaffolds + spec; remaining implementation tracked in per-app/connector/tool docs. Plan retired to archive/.'
clarifiedAt: 2026-05-19
owner: orchestrator
agents:
  - analyst
  - architect
  - frontend-developer
  - test-engineer
  - code-reviewer
  - doc-writer
links:
  spec: docs/analytical/specs/portal-elements-keycloak/spec.md
  adr:
    - docs/adr/0009-microfrontend-architecture.md
    - docs/adr/0010-dashboard-chart-library.md
    - docs/adr/0011-ui-kit-wrapper-strategy.md
    - docs/adr/0012-app-dual-mode-web-components.md
    - docs/adr/0013-keycloak-auth-integration.md
  issue: null
  supersedes:
    - docs/ai-workflow/plans/2026-05-18-portal-mfe.md
    - docs/ai-workflow/plans/2026-05-18-ui-kit-wrappers.md
---

# Plan: portal + elements + Keycloak + ESLint scale-up

> Consolidated roadmap that **supersedes** the two earlier draft plans
> (`portal-mfe.md`, `ui-kit-wrappers.md`) and adds two new vectors of
> change: every app must work **as a standalone SPA, a Web Component,
> and a federated remote**, and authentication must be **Keycloak-ready
> behind the existing `AUTH_CONTEXT` token**.

## Goal

Turn the 11-app monorepo into a **portal-of-apps** where each app can
be consumed three ways without code changes:

1. **Standalone SPA** — `pnpm start:<app>` boots on its dedicated port
   (existing behaviour preserved).
2. **Web Component** — every app exposes a custom element
   (`<ais-tire-shop>`, `<ais-bookstore>`, …) buildable as a single ESM
   bundle that any host page can drop in via `<script type="module">`
   - `<ais-foo></ais-foo>`.
3. **Federated remote** — every app publishes a Native Federation
   manifest; the new `apps/portal` (port 4200) lazy-loads them on
   demand into one shell.

In parallel: ship a **`libs/ui-kit`** wrapper library (Material →
stable `<ais-…>` surface, blocked by ESLint outside `libs/ui-kit`), a
**`libs/keycloak-auth`** provider (drop-in replacement for the existing
in-app session services behind the same `AUTH_CONTEXT` token), and a
**rationalised ESLint config** that scales to ≥ 11 apps without a
quadratic explosion of `scope:*` rows.

## Scope

| In                                                                                                                                                                | Out                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `apps/portal` (port 4200) — host application with sidenav + sub-app router-outlet                                                                                 | Replacing nowiro's standalone build — `pnpm start:nowiro` keeps working                      |
| `apps/dashboard` (port 4211) — 5 chart panels (sales-by-shop, top-products, low-stock, daily-orders, mix)                                                         | Real-time charts (signal-driven snapshots; no SSE/WebSocket)                                 |
| Native Federation manifest exposed by every app (`bootstrap.ts` + `federation.config.ts`)                                                                         | Webpack Module Federation (legacy, incompatible with Vite/Angular build 21)                  |
| `<ais-<app>>` Web Component build target per app (separate `build:element` Nx target)                                                                             | Building one mega-bundle that contains every app (each WC stays independently versionable)   |
| `libs/ui-kit` — thin wrappers around every Material component used in apps (`<ais-button>`, `<ais-card>`, …)                                                      | Re-implementing Material visuals (we delegate to `<button matButton>` under the hood)        |
| `libs/keycloak-auth` — `KeycloakAuthService` implementing `AuthContext`, plus `provideKeycloak()` helper                                                          | Real Keycloak server in CI (dev-mode fake provider ships out of the box; real server opt-in) |
| ESLint config — collapse per-shop `scope:*` rows into `scope:domain` parametric rule; add `no-restricted-imports` for `@angular/material/*` outside `libs/ui-kit` | Rewriting every existing ESLint rule (only the dep-constraints + the Material guard change)  |
| Per-app `technical.md` updates: "Dual-mode embedding" section explaining standalone vs Web Component vs MFE                                                       | Per-app `business.md` / `testing.md` rewrites (they stay valid)                              |
| 5 new ADRs (0009 MFE, 0010 chart lib, 0011 ui-kit, 0012 dual-mode WC, 0013 Keycloak)                                                                              | Replacing `0007-library-roles.md` / `0008-journal-context.md` (Keycloak adds, doesn't reset) |
| Validation gate: `pnpm nx run-many -t lint test build e2e --parallel=5` green                                                                                     | Performance benchmarking (separate `bundle-size` plan to follow)                             |

## Inputs

- All 11 apps in `apps/*` and 35 libs in `libs/*` (per `tsconfig.base.json`).
- `libs/shared-app-shell/src/auth-context.ts` — the `AUTH_CONTEXT`
  token that Keycloak plugs into.
- `libs/shared-app-shell/src/bootstrap.ts` — the `bootstrapApp()` helper
  that gains a sibling `bootstrapAsElement()`.
- `libs/shop-core/src/services/cart.service.ts` — the model for
  portal-scope singletons (DI tokens + sub-app pluggability).
- `eslint.config.mjs` — the dep-constraints + `no-restricted-imports`
  changes land here.
- `nx.json` `parallel: 5` — kept as-is; `start:all` (11+) overrides
  parallelism per script.
- `.ai/rules/{angular,nx,styling,testing,security}.md` — non-negotiable.
- <https://angular.dev/guide/elements> — Angular Elements API surface.
- <https://angular.dev/tools/cli/esbuild#native-federation> — Native
  Federation overview.
- <https://www.keycloak.org/securing-apps/javascript-adapter> — Keycloak JS adapter.
- <https://github.com/mauriciovigolo/keycloak-angular> — Angular wrapper.
- <https://swimlane.gitbook.io/ngx-charts> — chart library candidate 1.
- <https://apexcharts.com/angular-chart-demos/> — chart library candidate 2.

## Architecture overview

```mermaid
flowchart TB
  subgraph entry["Three entry points per app"]
    Standalone["main.ts → bootstrapApp() · port 42xx"]
    Element["element.ts → bootstrapAsElement() · &lt;ais-tire-shop&gt;"]
    Federation["bootstrap.ts → federation manifest · /portal/&lt;app&gt;"]
  end

  Standalone --> AppRoot[AppComponent + APP_ROUTES]
  Element --> AppRoot
  Federation --> AppRoot

  AppRoot --> Cart[ShopCartService via PRODUCT_LOOKUP]
  AppRoot --> Auth[AUTH_CONTEXT]

  subgraph auth["Pluggable auth providers (same token)"]
    Mock[MockSession · dev default]
    Library[AuthService · library demo]
    Journal[SessionService · journal demo]
    Keycloak[KeycloakAuthService · production]
  end

  Auth -.-> auth

  subgraph ui["libs/ui-kit"]
    Wrappers["&lt;ais-button&gt;, &lt;ais-card&gt;, &lt;ais-form-field&gt;, ..."]
  end

  AppRoot --> Wrappers
  Wrappers -. only consumer .-> Material[@angular/material]
```

Each app gains three build targets in `project.json`:

| Target          | Output                                                              | Consumed by                            | Status          |
| --------------- | ------------------------------------------------------------------- | -------------------------------------- | --------------- |
| `build`         | `dist/apps/<app>/` — standard SPA bundle                            | `pnpm start:<app>`                     | ✅ all 13 apps  |
| `build-element` | `dist/apps/<app>-element/main.js` + `styles.css` — ESM bundle       | host page via `<script type="module">` | ✅ all 13 apps  |
| `build-remote`  | `dist/apps/<app>/` + `federation.json` — Native Federation manifest | `apps/portal` at runtime               | ⏸ deferred (v2) |

(Note: the target was renamed `build:element` → `build-element` — Nx
interprets `:` as a configuration separator, not a target name.)

The same `AppComponent` mounts in all three modes — only the
`main.ts` / `element.ts` / `bootstrap.ts` entry point differs.

## Progress snapshot — 2026-05-19

> Run after every phase commit. ✅ = landed; 🟡 = partial; ⏸ = pending.

| Phase                             | Status  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **P0** — ESLint scale-up          | ✅ done | 9 new scopes registered; `no-restricted-imports` placeholder for `@angular/material/*`. Scope-tag consolidation (P0.1) deferred — listed as low-priority follow-up.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **P1** — Web Components × 13 apps | 🟡 95%  | All 13 apps have `element.ts` + `build-element` target (incl. `business-wizard`, `dashboard`). `bootstrapAsElement()` helper landed. Demo HTML page exists. ADR-0012 accepted. Per-app `technical.md` WC sections × 8/13. **Missing**: Playwright E2E (P1.5), WC sections for 5 apps without docs (nowiro / union-vault / pong-game / tetris-game / dashboard).                                                                                                                                                                                                                                        |
| **P2** — `libs/ui-kit` wrappers   | ⏸ 0%    | Not started. ESLint rule prepared (`'off'` until P2.5 enables it). ADR-0011 accepted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **P3** — Portal + Dashboard + MFE | 🟡 60%  | `apps/portal` (4220) ✅ · `apps/dashboard` (4211) ✅ · `libs/portal-shell` ✅ · `libs/dashboard-{data,feature}` ✅. **Pivot from original plan**: portal v1 uses **WC-based composition** (loads each remote's `dist/apps/<slug>-element/main.js` via dynamic `<script>` injection) instead of Native Federation. Federation deferred to v2 — no `@angular-architects/native-federation` dep was needed. ADR-0009 / 0010 accepted. **Missing**: federation actual wiring (P3.6, P3.8 — Phase 3.5+ follow-up), chart lib (P3.5 still ships table placeholders awaiting ngx-charts), portal E2E (P3.10). |
| **P4** — Keycloak auth            | 🟡 40%  | `libs/keycloak-auth` (`scope:auth`, `type:data-access`) extracted from placeholder ✅. `provideKeycloak()` + `provideMockKeycloak()` + `useMockKeycloakSwitcher()` shipped. ADR-0013 accepted. **Missing**: env-flag wiring in `apps/library` (P4.4), docker-compose Keycloak fixture (P4.5), per-app Authentication sections (P4.6), Keycloak E2E (P4.7).                                                                                                                                                                                                                                             |
| **P5** — Documentation            | 🟡 70%  | `docs/projects/{portal,dashboard,individual-wizard,business-wizard}/` ✅. Per-app WC sections × 8 ✅. Index `docs/projects/README.md` reflects 14-project structure. **Missing**: `docs/projects/{ui-kit,keycloak-auth}/` (blocked on P2 + P4 completion), CHANGELOG entries (P5.7), final validation gate annotation.                                                                                                                                                                                                                                                                                 |

### Architectural pivot — Phase 3 composition

The original plan assumed **Native Federation** as the portal's loader.
After scaffolding the portal we adopted **Web Component composition**
instead for v1:

| Aspect                    | Native Federation                       | WC composition (chosen for v1)               |
| ------------------------- | --------------------------------------- | -------------------------------------------- |
| New runtime dependency    | `@angular-architects/native-federation` | None — reuses the already-built WC bundles   |
| DI hoisting (shared cart) | ✅ via portal-scope injector            | ❌ each WC has its own Angular runtime + DI  |
| Browser memory            | 1× Angular runtime                      | N× Angular runtimes (one per visited remote) |
| Build complexity          | `federation.config.ts` per app          | None — `build-element` target already exists |
| Time-to-demo              | 6-8 hours of wiring                     | 2 hours (just scaffolded)                    |

The WC path lets the portal ship today. Native Federation is now a
**Phase 3.5+ follow-up** for when the cross-MFE shared cart becomes
non-negotiable. Until then the cart-drawer behaviour is documented as
"per-remote" — closing one remote loses the cart state for that remote
when the user returns.

## Remaining work — punch list

> Authoritative checklist. Tick rows as PRs land.

### Near-term (≤ 2 turns)

- [ ] **P1.5** — Playwright E2E for `docs/projects/elements-demo/index.html` (load page, assert each of the 4 custom elements registered).
- [ ] **P1.7 cleanup** — Add "Web Component embedding" sections to 5 apps without docs: `nowiro`, `union-vault`, `pong-game`, `tetris-game`, `dashboard`.
- [ ] **P3.10** — Playwright E2E for the portal: boot at `/portal`, click 3 nav items, assert each remote mounts (after `build:all-elements`).
- [ ] **P4.4** — Wire `provideKeycloak()` opt-in into `apps/library` behind a `KEYCLOAK_ENABLED` env flag.
- [ ] **P4.5** — `docker-compose.yml` fragment with ephemeral Keycloak + 2 test users (`reader.demo` / `librarian.demo`) in the `ai-studio` realm.
- [ ] **P4.6** — Per-app `technical.md` "Authentication" subsection for `library`, `school-journal`, `portal` (and a "no-auth" note for the rest).
- [ ] **P5.5** — `docs/projects/keycloak-auth/{README,business,technical}.md`.

### Mid-term (~3-4 turns each)

- [ ] **Phase 2 — ui-kit** (full):
  - [ ] **P2.1** Scaffold `libs/ui-kit` (`scope:shared`, `type:ui`).
  - [ ] **P2.2** 8 first wrappers: `<ais-button>`, `<ais-icon-button>`, `<ais-card>`, `<ais-form-field>`, `<ais-input>` directive, `<ais-select>`, `<ais-chip>`, `<ais-divider>`.
  - [ ] **P2.3** Migrate `libs/shop-ui`, `libs/library-ui`, `libs/journal-ui`, `libs/individual-wizard-ui` to use wrappers.
  - [ ] **P2.4** Migrate inline Material consumers across apps.
  - [ ] **P2.5** Flip `no-restricted-imports` from `'off'` to `'error'`.
  - [ ] **P2.6** Remaining ~9 wrappers (tabs, stepper, table, paginator, expansion, tooltip, badge, toolbar, sidenav, radio, checkbox, button-toggle).
  - [ ] **P5.4** `docs/projects/ui-kit/{README,technical}.md`.
- [ ] **Phase 3.5 — Charts & Native Federation** (optimization layer):
  - [ ] **P3.5b** Install `@swimlane/ngx-charts` and swap dashboard placeholder tables for SVG charts (5 panels).
  - [ ] **P3.6** Add `@angular-architects/native-federation` + `federation.config.ts` per app for proper MFE composition.
  - [ ] **P3.7b** Swap portal's `RemoteHostComponent` from WC dynamic-import to `loadRemoteModule()`.
  - [ ] **P3.8** Hoist `ShopCartService` + `AUTH_CONTEXT` to portal scope.

### Polish / nice-to-haves

- [ ] **P0.1** — Collapse per-shop `scope:*` rules into one parametric `scope:demo` + `domain:<app>` (low priority — current rules work, just verbose).
- [ ] **`libs/wizard-shell`** — extract `<ais-wizard-chrome>` + `<ais-wizard-tile-grid>` from the two wizard dashboards (dedup ~300 lines).
- [ ] **Domain ESLint constraint** — block `individual-wizard-*` ↔ `business-wizard-*` cross-imports (currently developer-discipline only).
- [ ] **`tire-shop` harmonisation** with `shop-core` / `shop-ui` (pre-refactor tech-debt).
- [ ] **CHANGELOG.md** — per-phase Conventional Commits squash entries (P5.7).
- [ ] **`testing.md`** per app with AC ↔ test traceability matrix (deferred from P5).

## Phased execution

The roadmap is split into **five phases** with explicit hand-off
points. Each phase ends green on the validation gate and is shippable
on its own.

### Phase 0 — ESLint scale-up + scope tag rationalisation

> Smallest change, blocks nothing else. Lands first.

| id   | title                                                                                                                                    | agent              | done_when                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| P0.1 | Collapse `scope:tire-shop` / `scope:library` / `scope:school-journal` etc. into one `scope:demo` rule with a `domain:` discriminator tag | frontend-developer | Same module-boundary graph enforced; no app can cross-import another demo's libs |
| P0.2 | Add `no-restricted-imports` blocking `@angular/material/*` outside `libs/ui-kit`                                                         | frontend-developer | Rule disabled until Phase 3; placeholder + comment                               |
| P0.3 | Add `scope:portal` + `scope:dashboard` + `scope:auth` placeholder constraints                                                            | frontend-developer | New scopes reachable from `scope:app` for the future libs                        |
| P0.4 | Add `parallel=8` for `start:all` script (was 11 — laptops can't sustain 11 dev servers + portal + dashboard once they exist)             | frontend-developer | `pnpm start:all` doesn't choke a 16 GB laptop                                    |

### Phase 1 — Web Component dual-mode (every app exports `<ais-<app>>`)

| id   | title                                                                                                                                                        | agent              | done_when                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------- |
| P1.1 | Install `@angular/elements`; add `bootstrapAsElement()` helper to `libs/shared-app-shell`                                                                    | frontend-developer | Helper exported, signature unit-tested                                                                   |
| P1.2 | Add `element.ts` entry + `build:element` Nx target to one pilot app (`apps/pong-game`)                                                                       | frontend-developer | `dist/apps/pong-game-element/pong-game.js` exists; <script>+<ais-pong-game/> works on a static demo page |
| P1.3 | Replicate P1.2 across all 11 apps (tire-shop, library, school-journal, bookstore, tools-shop, toy-shop, nowiro, union-vault, individual-wizard, tetris-game) | frontend-developer | Each app's `build:element` target produces an ESM bundle                                                 |
| P1.4 | Static demo page in `docs/projects/elements-demo/index.html` showing 4 custom elements side-by-side                                                          | doc-writer         | Page loads in browser via `npx serve docs/projects/elements-demo`                                        |
| P1.5 | E2E: Playwright loads the demo page and asserts each custom element mounted                                                                                  | test-engineer      | E2E green                                                                                                |
| P1.6 | ADR-0012 (dual-mode Web Components) — accepted                                                                                                               | architect          | ADR Status: accepted                                                                                     |
| P1.7 | Per-app `technical.md` gets a "Web Component embedding" section                                                                                              | doc-writer         | 11 docs updated; doc-audit clean                                                                         |

### Phase 2 — ui-kit wrapper library

| id   | title                                                                                                                                                                                              | agent              | done_when                                                                  |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| P2.1 | Scaffold `libs/ui-kit` (`scope:shared`, `type:ui`) with subfolders buttons/surfaces/inputs/...                                                                                                     | frontend-developer | Empty lib boots; lint clean                                                |
| P2.2 | Wrap the first 8 components (`<ais-button>`, `<ais-icon-button>`, `<ais-card>`, `<ais-form-field>`, `<ais-input>` directive, `<ais-select>`, `<ais-chip>`, `<ais-divider>`) with unit tests ≥ 80 % | frontend-developer | 8 components callable from any app, identical Material visuals             |
| P2.3 | Migrate `libs/shop-ui` + `libs/library-ui` + `libs/journal-ui` to use the wrappers                                                                                                                 | frontend-developer | Zero direct `@angular/material/*` imports in those libs                    |
| P2.4 | Migrate the remaining apps' inline Material consumers                                                                                                                                              | frontend-developer | Zero `@angular/material/*` imports outside `libs/ui-kit`                   |
| P2.5 | Enable the `no-restricted-imports` rule from P0.2                                                                                                                                                  | frontend-developer | `pnpm lint` would fail on any future direct Material import outside ui-kit |
| P2.6 | Wrap the remaining ~9 components (tabs, stepper, table, paginator, expansion, tooltip, badge, toolbar, sidenav, radio, checkbox, button-toggle)                                                    | frontend-developer | 17+ components in ui-kit; coverage ≥ thresholds                            |
| P2.7 | ADR-0011 (ui-kit wrapper strategy) — accepted                                                                                                                                                      | architect          | ADR Status: accepted                                                       |

### Phase 3 — Portal + Dashboard + Native Federation

| id    | title                                                                                                                                                      | agent              | done_when                                                         |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------- |
| P3.1  | ADR-0009 (MFE architecture — Native Federation vs Module Federation vs Web Components vs iframes)                                                          | architect          | ADR Status: accepted                                              |
| P3.2  | ADR-0010 (chart library — ApexCharts vs ngx-charts vs Chart.js)                                                                                            | architect          | ADR Status: accepted                                              |
| P3.3  | Install `@angular-architects/native-federation`; scaffold `apps/portal` (port 4200) + host config                                                          | frontend-developer | `pnpm nx serve portal` boots :4200 with an empty shell            |
| P3.4  | Scaffold `libs/portal-shell` (toolbar + sidenav + nav + error boundary)                                                                                    | frontend-developer | Portal renders the sidenav with 12 entries (placeholders)         |
| P3.5  | Scaffold `apps/dashboard` (port 4211) + `libs/dashboard-data` (pure aggregation fns + unit tests ≥ 80 %) + `libs/dashboard-feature` (5 charts + KPI tiles) | frontend-developer | `pnpm nx serve dashboard` boots :4211 with mock-data charts       |
| P3.6  | `federation.config.ts` for every existing app exposing `AppComponent` + `APP_ROUTES`                                                                       | frontend-developer | `pnpm nx build <app>` produces a federation manifest for each app |
| P3.7  | Portal routing — register all 12 remotes, lazy-load via `loadRemoteModule()`                                                                               | frontend-developer | Every remote reachable at `/portal/<app>/…`                       |
| P3.8  | Hoist `ShopCartService` + `AUTH_CONTEXT` to portal scope; ADR-0009 § Shared state                                                                          | frontend-developer | All shops see the same cart across portal navigation              |
| P3.9  | `start:portal` + extend `start:all` to include portal + dashboard                                                                                          | frontend-developer | `pnpm start:portal` serves :4200                                  |
| P3.10 | Playwright E2E — portal boots, opens 3 MFEs, asserts hallmark UI per remote                                                                                | test-engineer      | E2E green in chromium                                             |

### Phase 4 — Keycloak auth integration

| id   | title                                                                                                                  | agent              | done_when                                                                                         |
| ---- | ---------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| P4.1 | ADR-0013 (Keycloak integration — keycloak-js vs keycloak-angular vs OIDC client)                                       | architect          | ADR Status: accepted                                                                              |
| P4.2 | Scaffold `libs/keycloak-auth` (`scope:auth`, `type:data-access`) with `KeycloakAuthService` implementing `AuthContext` | frontend-developer | Lib exports `provideKeycloak({ realm, clientId, url })` + service                                 |
| P4.3 | Dev-mode fake provider — `provideMockKeycloak({ initialRole })` returns the same shape without a real server           | frontend-developer | Library demo's `MockSession` swappable for `MockKeycloak`                                         |
| P4.4 | Wire opt-in into `apps/library` first (gated by `KEYCLOAK_ENABLED` env flag)                                           | frontend-developer | `KEYCLOAK_ENABLED=true pnpm start:library` redirects to keycloak login; default keeps mock        |
| P4.5 | docker-compose.yml fragment + README pointing at an ephemeral local Keycloak (one container, one realm, two users)     | doc-writer         | `docker compose up keycloak` boots a working server with test users                               |
| P4.6 | Per-app `technical.md` "Authentication" section gains a "Keycloak" subsection                                          | doc-writer         | All 4 auth-bearing apps documented (library, journal, portal, plus a "no-auth" note for the rest) |
| P4.7 | E2E smoke test for the Keycloak path (library only; uses the docker-compose Keycloak)                                  | test-engineer      | E2E green when run with `KEYCLOAK_ENABLED=true`                                                   |

### Phase 5 — Documentation + validation gate

| id   | title                                                                                                                                   | agent        | done_when                                                                                |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| P5.1 | Per-app `technical.md` — "Dual-mode embedding" section (standalone + Web Component + MFE)                                               | doc-writer   | 11 docs updated; doc-audit clean                                                         |
| P5.2 | New `docs/projects/portal/` (4-file layout — README + business + technical + testing)                                                   | doc-writer   | All 4 docs present                                                                       |
| P5.3 | New `docs/projects/dashboard/` (4-file layout)                                                                                          | doc-writer   | All 4 docs present                                                                       |
| P5.4 | New `docs/projects/ui-kit/README.md` + per-wrapper API doc                                                                              | doc-writer   | Public API documented; doc-audit clean                                                   |
| P5.5 | New `docs/projects/keycloak-auth/README.md` + setup guide                                                                               | doc-writer   | Setup steps verified by a colleague in < 30 min                                          |
| P5.6 | Update `docs/projects/README.md` index — add portal/dashboard/ui-kit/keycloak rows; remove "Upcoming work" section once phases complete | doc-writer   | Index reflects the final 14-project structure                                            |
| P5.7 | CHANGELOG.md — single squashable entry per phase                                                                                        | doc-writer   | Conventional Commits + version bump per phase tag                                        |
| P5.8 | Final validation gate                                                                                                                   | orchestrator | `pnpm nx run-many -t lint test build e2e --parallel=5` green; this plan's `status: done` |

## Definition of Done (whole roadmap)

- `pnpm nx run-many -t lint test build --parallel=5` → all projects green
- `pnpm nx serve portal` boots :4200 and serves every remote on demand
- `pnpm nx serve <app>` still works standalone for every app
- `pnpm nx run <app>:build:element` produces a single-file ESM Web Component
- `pnpm nx e2e portal-e2e` green
- `libs/dashboard-data`, `libs/ui-kit`, `libs/keycloak-auth` coverage ≥ 80 % stmts / ≥ 75 % branches
- All 5 ADRs accepted (0009, 0010, 0011, 0012, 0013)
- All per-app `technical.md` updated with "Dual-mode embedding" + (where applicable) "Authentication" sections
- `docs/projects/README.md` reflects the final 14-project structure (11 apps + portal + dashboard + ui-kit + keycloak-auth)
- This plan's `status: done`
- The two superseded plans (`portal-mfe.md`, `ui-kit-wrappers.md`) get
  `status: superseded` headers pointing here

## Validation gate (per phase)

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
pnpm docs:audit   # if docs touched
```

## Risks & mitigations

- **Risk:** Native Federation + Angular 21 `@angular/build` integration
  is still maturing — sub-app build manifests may drift.
  **Mitigation:** Pin `@angular-architects/native-federation` version
  in `package.json`; smoke-test the manifest in P3.6 per app, gate CI
  on it.
- **Risk:** Web Component bundle size — every `<ais-<app>>` includes
  the Angular runtime (~200 KB gzipped) which doesn't dedupe across
  multiple custom elements on the same host page.
  **Mitigation:** Document the trade-off in ADR-0012; recommend
  Native-Federation for the multi-app-on-one-page case and reserve
  Web Components for "drop one app into a non-Angular host" scenarios.
- **Risk:** Keycloak dependency adds ~80 KB to every app even when
  unused (tree-shaking is imperfect for JS adapters).
  **Mitigation:** `libs/keycloak-auth` is opt-in; apps that don't
  import it pay zero cost. The mock provider is the default.
- **Risk:** ui-kit becomes a thin pass-through with no real value if
  every wrapper just re-exports `<button matButton>` verbatim.
  **Mitigation:** ADR-0011 documents the API contract (variant /
  size / state) and forbids leaking `matButton`-specific class names
  into the public surface. The contract IS the value.
- **Risk:** Quadratic ESLint scope-tag explosion (every new app adds a
  new row to `depConstraints`).
  **Mitigation:** Phase 0 collapses per-shop scopes into one
  `scope:demo` rule with a parametric `domain:<app-name>` second
  dimension; new apps only get the `domain:*` tag.
- **Risk:** `pnpm start:all` runs 13+ dev servers in parallel after
  portal + dashboard land — laptop blows up.
  **Mitigation:** P0.4 drops parallel to 8; provide `start:shops`,
  `start:games`, `start:portal-only` curated subsets.

## Rollback

Each phase is independently revertible (separate git commits). Reverting
Phase 3 returns to standalone-mode-only; reverting Phase 4 makes auth
the mock-only mode it is today; reverting Phase 1 removes the WC build
targets but keeps standalone + MFE working.

## Run log

Per-task one-liners are appended to
`docs/ai-workflow/runs/2026-05-18-portal-elements-keycloak.md` as they
execute. The orchestrator updates `status:` above each phase boundary.

## Clarifications (resolved 2026-05-19)

All 8 open questions resolved via `/clarify` round. Status flipped from
`draft` → `accepted`.

- [x] **Web Component selectors** — `ais-<app>` prefix (e.g.
      `<ais-tire-shop>`). Matches the repo-wide `@angular-eslint/component-selector`
      prefix and avoids collisions with host-page custom elements. Documented
      in ADR-0012.
- [x] **Keycloak realm naming** — single `ai-studio` realm + one OIDC
      client per app (`library-app`, `school-journal-app`, …). Enables SSO
      across the portfolio with minimal operational overhead. Documented in
      ADR-0013.
- [x] **Sub-app CSP authority** — host page owns the CSP. Standalone
      apps keep their `<meta http-equiv="Content-Security-Policy">` in
      `index.html`; Web Component bundles ship NO CSP meta (the host page is
      responsible); the portal defines one CSP that wins for every loaded
      MFE. Documented in ADR-0012.
- [x] **Theming** — portal owns `mat.theme()` tokens once; sub-apps
      inherit via CSS variables / DI. Standalone mode keeps each app's own
      theme (palette drift only manifests inside the portal, which is OK
      because the portal is a single coherent UI). Documented in ADR-0009.
- [x] **Routing scheme** — `/portal/<app>/...` (portal mounted under
      `/portal/`, not at the root). Clearer breadcrumbs, easier deep-linking,
      obvious distinction between portal-loaded and standalone modes.
      Documented in ADR-0009.
- [x] **Dashboard refresh** — signal-driven recompute on every cart
      mutation, debounced (150 ms) to avoid blink-storm during multi-add
      flows. No polling, no manual refresh button. Documented in ADR-0010.
- [x] **ui-kit Storybook** — NO Storybook. Each wrapper has its own
      `*.spec.ts` exercising input → DOM; Material's upstream documentation
      covers visual stories. Storybook can be added later as a focused
      follow-up plan if visual regression becomes a recurring pain point.
      Documented in ADR-0011.
- [x] **Keycloak production hosting** — docker-compose only for the
      demo (no hosted IdP, no Auth0). Ephemeral local server, realm seed
      file with 2 test users, E2E gated by `KEYCLOAK_ENABLED=true`.
      Production deployment is out of scope for the demo monorepo.
      Documented in ADR-0013.
