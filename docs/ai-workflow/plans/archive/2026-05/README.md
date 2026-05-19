---
id: docs.ai-workflow.plans.archive.2026-05
title: 2026-05 plan archive
type: index
status: living
date: 2026-05-19
---

# 2026-05 — plan archive

> Closed plans from May 2026. 25 entries spanning trinity bootstrap, BPMN/skills delivery, and per-app next-iteration roadmaps.

## Index

### Trinity foundations (closed before audit cleanup)

| Plan                                                                               | Outcome                                                                                                        |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`2026-05-08-phaser-and-ci-fix.md`](2026-05-08-phaser-and-ci-fix.md)               | Phaser in `package.json`, CI hardened, ADR-0004 accepted                                                       |
| [`2026-05-08-trinity-bootstrap.md`](2026-05-08-trinity-bootstrap.md)               | `ai-mcp-alm` + `ai-mcp-devtools` repos stood up, baseline parity verified                                      |
| [`2026-05-09-architecture-reference.md`](2026-05-09-architecture-reference.md)     | `.ai/architecture.md` adopted across the trinity                                                               |
| [`2026-05-15-personal-data-wizard.md`](2026-05-15-personal-data-wizard.md)         | `individual-wizard` 5-step Reactive Forms demo shipped                                                         |
| [`2026-05-18-library-app.md`](2026-05-18-library-app.md)                           | Library demo with reader / librarian roles + MatTable                                                          |
| [`2026-05-18-school-journal.md`](2026-05-18-school-journal.md)                     | Multi-context school-journal demo                                                                              |
| [`2026-05-18-tire-shop.md`](2026-05-18-tire-shop.md)                               | Faceted tire-shop demo (legacy checkout — migration in 2026-05-19 follow-up)                                   |
| [`2026-05-18-tetris-game.md`](2026-05-18-tetris-game.md)                           | Tetris logic + UI libs + app; E2E completed in follow-up                                                       |
| [`2026-05-18-portal-elements-keycloak.md`](2026-05-18-portal-elements-keycloak.md) | Portal + Web Components + Keycloak + ESLint scale-up roadmap; remaining Native Federation rollout in follow-up |
| [`2026-05-18-portal-mfe.md`](2026-05-18-portal-mfe.md)                             | Superseded by `portal-elements-keycloak.md`                                                                    |
| [`2026-05-18-ui-kit-wrappers.md`](2026-05-18-ui-kit-wrappers.md)                   | Superseded by `portal-elements-keycloak.md`                                                                    |

### 2026-05-19 audit cleanup — per-app / per-connector / per-tool plans

Each plan delivered scaffolds (specs, BPMN, library skeletons, store classes, manifest, Keycloak compose) and was retired in the same audit session. Implementation details remaining in each plan are tracked in the relevant `docs/projects/<x>/README.md`.

| Plan                                                                 | Scope                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`2026-05-19-bookstore.md`](2026-05-19-bookstore.md)                 | Reviews + ratings persistence (review-store delivered)         |
| [`2026-05-19-business-wizard.md`](2026-05-19-business-wizard.md)     | Draft autosave (DraftStore delivered)                          |
| [`2026-05-19-dashboard.md`](2026-05-19-dashboard.md)                 | Cross-MFE BroadcastChannel (MfeBus delivered)                  |
| [`2026-05-19-individual-wizard.md`](2026-05-19-individual-wizard.md) | i18n PL/EN + PDF font polish (plan + scope)                    |
| [`2026-05-19-library.md`](2026-05-19-library.md)                     | Keycloak swap (docker-compose + realm seed delivered)          |
| [`2026-05-19-nowiro.md`](2026-05-19-nowiro.md)                       | docs/projects/nowiro/ entry + GA4 plan                         |
| [`2026-05-19-pong-game.md`](2026-05-19-pong-game.md)                 | docs/projects/pong-game/ entry + tournament roadmap            |
| [`2026-05-19-portal.md`](2026-05-19-portal.md)                       | Native Federation manifest discovery (manifest.json delivered) |
| [`2026-05-19-school-journal.md`](2026-05-19-school-journal.md)       | Parent persona + notifications stub                            |
| [`2026-05-19-tetris-game.md`](2026-05-19-tetris-game.md)             | E2E scaffold delivered + InputController roadmap               |
| [`2026-05-19-tire-shop.md`](2026-05-19-tire-shop.md)                 | Legacy checkout migration to shop-core/shop-ui                 |
| [`2026-05-19-tools-shop.md`](2026-05-19-tools-shop.md)               | B2B bulk pricing                                               |
| [`2026-05-19-toy-shop.md`](2026-05-19-toy-shop.md)                   | EU toy safety badges + age gate                                |
| [`2026-05-19-union-vault.md`](2026-05-19-union-vault.md)             | Spec phase (`docs/analytical/specs/union-vault/` delivered)    |

## Reading order for newcomers

1. `2026-05-08-trinity-bootstrap.md` — why the workspace has three repos.
2. `2026-05-09-architecture-reference.md` — the Tool/MCP/Skill primitives.
3. `2026-05-18-portal-elements-keycloak.md` — biggest plan, demonstrates the SDD flow end-to-end.
4. Any `2026-05-19-*.md` — short next-iteration roadmaps per app.
