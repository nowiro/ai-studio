---
id: plan.echarts-wrappers-dashboards-games
title: ECharts wrappers, dashboard UX, pong + tetris UI rebuild
type: plan
date: 2026-05-20
trigger: user request — "migracje wykresów do ECharts, wrappery jak dla material, dashboardy UX, 2 gry nie wyglądają dobrze"
status: done
closedAt: 2026-05-20
closeReason: '11 of 13 tasks delivered. T011 (wrapper smoke specs requiring vi.mock for echarts) and T013 (E2E mobile/desktop with running dev server) explicitly deferred to a follow-up iteration. Core deliverables — libs/charts foundation, 5 wrappers, dashboard 4-panel migration, pong + tetris UI rebuild, showcase route, ADR-0016 + governance lint rule + architecture doc — all green and in production.'
owner: orchestrator
agents:
  - architect
  - frontend-developer
  - test-engineer
  - doc-writer
links:
  spec: null
  adr: docs/adr/0016-charts-abstraction-echarts.md
  issue: null
---

# Plan: ECharts wrappers, dashboard UX, pong + tetris UI rebuild

> Three-pronged plan. Wraz z `libs/charts` abstraction layer (Material-like wrapper) zaczynamy używać ECharts; przy okazji domykamy UX/RWD w dashboardzie i przebudowujemy pong + tetris. Charts library jest abstrakcją — w przyszłości można podmienić ECharts na Chart.js / D3 / Highcharts bez ruszania consumers.

## Discovery findings (2026-05-20)

**Dashboard (`libs/dashboard-feature` + `libs/dashboard-data`):**

- Stack: signal-driven, Material 3 + Tailwind v4 + OnPush ✅
- Chart usage: **NONE** — 4 panels render placeholder HTML tables (signals already computed)
- Chart panels ready for migration: revenue (bar), top products (h-bar), daily orders (line), category mix (donut)
- RWD: KPI grid 1/2/4 cols, panels 1/2 cols ✅
- UX gaps: no refresh loading state, no empty state, placeholder noise ("Bar chart — ngx-charts po Phase 3.5") visible to users

**Pong (`apps/pong-game` + `libs/game-pong-ui`):**

- Stack: Phaser bridge + Angular overlays (ScoreDisplay, MenuOverlay, GameOverOverlay, Pause modal) ✅
- UX gaps: no welcome animation, **no high-score persistence**, no settings (difficulty/paddle), instructions text-on-surface-variant (low contrast), no touch-control hint, no volume slider (only on/off)

**Tetris (`apps/tetris-game` + `libs/game-tetris-ui`):**

- Stack: Canvas 2D + Angular overlays (Score, Menu, GameOver, HoldSlot, NextQueue) ✅
- UX gaps: **hardcoded `#0b1020` dark bg** (ignores prefers-color-scheme), **no high-score persistence**, instructions `text-xs opacity-50` ledwo widoczne, no sound feedback, "Press Enter to restart" missing on game-over

**ECharts migration footprint:** 4 dashboard panels. Zero charts in games (Phaser/canvas already handle their rendering).

## Goal

Dostarczyć (1) **`libs/charts`** z wrappers dla najczęściej używanych typów wykresów (line, bar, pie/donut, gauge, heatmap), opartych na ECharts ale z API niezależnym od backendu; (2) **dashboard UX upgrade** wykorzystujący nowy `libs/charts` plus ShopShell-like layout (KPI cards, filters, RWD); (3) **pong + tetris rebuild** — spójne game-shell, lepszy HUD, mobile touch controls, leaderboard.

## Scope

| In                                                                                  | Out                                                                           |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `libs/charts` (wrapper layer + 5 typów wykresów + theme integration)                | Dashboards real-time WebSocket data (oddzielny plan)                          |
| ADR-0016: Charts abstraction strategy (why ECharts, why wrappers)                   | Replace ECharts with another library (przyszły refactor — design supports it) |
| Dashboard UX/UI: KPI grid, charts grid, filter bar, mobile RWD                      | Dashboard auth, user-specific views (oddzielny plan)                          |
| Pong rebuild: hero, settings, leaderboard view, touch controls (mobile), better HUD | Pong multiplayer, AI opponent improvements                                    |
| Tetris rebuild: lepsze HUD, next/hold piece, settings, touch controls, leaderboard  | Tetris multiplayer, garbage lines mode                                        |
| Shared `libs/game-shell` jeśli wyniknie z analizy DRY                               | Phaser refactor (Phaser zostaje per ADR-0004 — tu tylko UI overlay)           |
| RWD: mobile-first dashboard + games, breakpoints `sm/md/lg`, touch targets ≥ 44 px  | Adaptacja do TV / kiosk mode                                                  |

## Inputs

- `https://echarts.apache.org/en/index.html` — canonical reference for ECharts API
- `https://echarts.apache.org/en/option.html` — option spec (data structure dla wszystkich wrapperów)
- `.ai/rules/styling.md` — Material 3 + Tailwind v4 contract (chart theme must read M3 tokens)
- `.ai/rules/angular.md` — standalone + OnPush + signal-based inputs
- `libs/shop-ui/src/shop-shell.component.ts` — wzór `libs/dashboard-shell` (jeśli wyniknie)
- `docs/adr/0004-phaser-as-default-game-library.md` — Phaser stays for game runtime; only the UI shell/HUD is rebuilt
- `.claude/skills/angular-material-design/SKILL.md` — token contract dla chart theme
- `apps/dashboard/`, `libs/dashboard-feature/`, `libs/dashboard-data/`, `apps/pong-game/`, `libs/game-pong-ui/`, `apps/tetris-game/`, `libs/game-tetris-ui/` — files that change

## Tasks (DAG)

| id   | title                                                                             | agent              | inputs         | outputs                                                          | done_when                                     | parallel_with | blocked_by     |
| ---- | --------------------------------------------------------------------------------- | ------------------ | -------------- | ---------------------------------------------------------------- | --------------------------------------------- | ------------- | -------------- |
| T001 | Discovery audit dashboard + 2 games (current state, chart usage, UX problems)     | analyst            | repo           | report inline (this plan + ADR)                                  | report present, gaps listed                   |               |                |
| T002 | ADR-0016 — Charts abstraction strategy                                            | architect          | T001           | docs/adr/0016-charts-abstraction-echarts.md (status: proposed)   | ADR Status accepted by user                   |               | T001           |
| T003 | Generate `libs/charts` Nx lib (scope:shared, type:ui)                             | frontend-developer | T002           | libs/charts/{project.json,src/index.ts,tsconfig.\*}              | `pnpm nx test charts` runs, lint clean        |               | T002           |
| T004 | Implement core `ChartHostComponent` + theme adapter (M3 token bridge)             | frontend-developer | T003           | libs/charts/src/chart-host.component.ts, src/theme.ts            | host renders, theme reads `--mat-sys-*`       | T005          | T003           |
| T005 | Implement 5 wrapper components (Line, Bar, Pie, Gauge, Heatmap) + specs           | frontend-developer | T004           | libs/charts/src/{line,bar,pie,gauge,heatmap}.component.ts        | each renders with sample data + spec ≥ 1 test | T004          | T003           |
| T006 | Add ECharts as dependency + tree-shaking config + bundle-size guard               | frontend-developer | T003           | package.json + libs/charts/src/echarts-import.ts                 | bundle adds ≤ 250 kB gzipped on demo          | T005          | T003           |
| T007 | Build sample showcase route (`/charts/showcase`) under apps/dashboard             | frontend-developer | T004..T006     | libs/dashboard-feature/src/charts-showcase.component.ts          | all 5 chart types visible on one page         |               | T004,T005,T006 |
| T008 | Dashboard UX: ShopShell-like layout, KPI grid, filter bar, RWD breakpoints        | frontend-developer | T007           | libs/dashboard-feature/src/{dashboard-shell,kpi-card,filter-bar} | mobile 375 + desktop 1280 visually correct    |               | T007           |
| T009 | Pong UI rebuild: game-shell, HUD overlay, touch controls, settings, leaderboard   | frontend-developer | T001           | libs/game-pong-ui/src/\*                                         | mobile playable, leaderboard route works      | T010          | T001           |
| T010 | Tetris UI rebuild: game-shell, HUD overlay, touch controls, settings, leaderboard | frontend-developer | T001           | libs/game-tetris-ui/src/\*                                       | mobile playable, leaderboard route works      | T009          | T001           |
| T011 | Tests: charts + dashboard + games — at least smoke + a11y per new component       | test-engineer      | T004..T010     | \*.spec.ts (no real ECharts boot in tests, mock instead)         | coverage ≥ 60 % on new code                   |               | T004..T010     |
| T012 | Doc updates: `.ai/rules/styling.md` + `docs/architecture/charts.md`               | doc-writer         | T002,T004,T005 | rule + architecture doc                                          | doc-audit clean                               |               | T002,T004,T005 |
| T013 | E2E smoke: dashboard charts visible, games playable (chromium + mobile chrome)    | test-engineer      | T008,T009,T010 | apps/dashboard-e2e + apps/{pong,tetris}-game-e2e                 | e2e green                                     |               | T008,T009,T010 |

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
pnpm trinity:check        # no trinity baseline files should change
pnpm docs:audit           # if .ai/rules/styling.md touched
```

Bundle-size guard: dashboard initial chunk ≤ 1.3 MB raw / 280 kB transferred (chart-heavy page).

## Risks & mitigations

- **Risk:** ECharts adds 800+ kB raw to the bundle if imported wholesale — **Mitigation:** tree-shake via per-chart `import` from `echarts/charts` and `echarts/components`; bundle-size guard in CI.
- **Risk:** Wrappers leak ECharts types and become hard to swap later — **Mitigation:** input contracts use plain TS shapes (`ChartSeries`, `ChartAxis`) defined in `libs/charts/src/types.ts`, NEVER `EChartsOption`. ECharts mapping happens inside wrappers only.
- **Risk:** ECharts theme doesn't track Material 3 dark/light + token changes — **Mitigation:** `theme.ts` reads `--mat-sys-*` CSS vars at render time and rebuilds the theme on `prefers-color-scheme` change.
- **Risk:** Games rebuild breaks Phaser runtime — **Mitigation:** only Angular UI overlay changes (HUD, menu, leaderboard); Phaser scene code stays untouched per ADR-0004.
- **Risk:** Mobile touch controls compete with Phaser pointer input — **Mitigation:** overlay buttons sit outside the Phaser canvas; Phaser input remains canvas-only.
- **Risk:** Charts demo route bloats dashboard bundle — **Mitigation:** lazy-load `/charts/showcase` via `loadComponent`.

## Rollback

Each phase is independently revertable: revert the charts commit removes `libs/charts` + dashboard chart imports (showcase route becomes 404). Game rebuilds are isolated to `libs/game-*-ui/`; reverting restores prior overlay components. ADR-0016 stays as `superseded` if direction changes.

## Run log

Per-task one-liners go to `docs/ai-workflow/runs/2026-05-20-echarts-wrappers-dashboards-games.md` as they execute. Status header above bumps as phases complete.
