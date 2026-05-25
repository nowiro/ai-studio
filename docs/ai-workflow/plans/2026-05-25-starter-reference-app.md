---
id: plan.starter-reference-app
title: Build minimal Angular 21 + M3 + Tailwind v4 reference app (apps/starter)
type: plan
date: 2026-05-25
trigger: user request — "zbudowac referencyjna aplikacje, taki bootstrap aplikacji nx angular"
status: done
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
links:
  spec: null
  adr: null
  issue: null
---

# Plan: Build minimal Angular 21 + M3 + Tailwind v4 reference app (apps/starter)

## Goal

Stworzyć aplikację `apps/starter` służącą jako wzorzec startowy dla nowych Angular apps w monorepo — minimalny szkielet pokazujący kanoniczną integrację Material 3 design tokens z Tailwind v4 utilities, na bazie istniejących shared libów.

## Scope

| In                                                               | Out                                                |
| ---------------------------------------------------------------- | -------------------------------------------------- |
| `apps/starter` + `apps/starter-e2e` (Playwright smoke)           | Pełna domena CRUD                                  |
| `libs/starter-feature` (jedna route — home showcase)             | `libs/starter-data` — minimalny scope, brak danych |
| `libs/starter-ui` — token-card + typography-row components       | Custom serwery API, auth, i18n customization       |
| `mat.theme()` w `apps/starter/src/styles.scss` z Indigo+Teal     | Web Component build target (osobny ADR)            |
| Showcase: M3 color tokens, M3 typography scale, Tailwind grid    | Theme switcher light/dark (out of minimal scope)   |
| ESLint depConstraint: nowy `scope:starter` w `eslint.config.mjs` | NgRx SignalStore, RxJS data flows                  |
| Reużycie `shared-app-shell` + `ui-kit` (Hero, Section)           | Tworzenie nowych ui-kit wrapperów                  |
| `start:starter` w `package.json`                                 | Docker / Dockerfile                                |
| CHANGELOG entry + krótki wpis w głównym README                   | Pełen rejestr `docs/projects/starter/`             |

## Inputs

- `.ai/rules/nx.md` — tagi + module boundaries
- `.ai/rules/angular.md` — standalone, OnPush, signals, inject, native control flow
- `.ai/rules/styling.md §12` — ui-kit wrapping mandatory; brak `mat-*` w apps/feature
- `docs/adr/0011-ui-kit-wrapper-strategy.md` — ADR-0011 wrapping policy
- `styles/tailwind.scss` — M3 token bridge w `@theme`
- `apps/dashboard/src/styles.scss` — wzorzec `mat.theme()` (referencja)
- `libs/ui-kit/src/index.ts` — dostępne wrappery: AisHero, AisSection, AisFeatureCard, AisStatTile, AisCtaButton
- `libs/shared-app-shell/src/index.ts` — `bootstrapApp()` używane w `main.ts`
- `eslint.config.mjs:151-264` — `@nx/enforce-module-boundaries` depConstraints (do edycji)

## Tasks (DAG)

| id   | title                                                                          | agent              | inputs           | outputs                                                          | done_when                                | parallel_with | blocked_by |
| ---- | ------------------------------------------------------------------------------ | ------------------ | ---------------- | ---------------------------------------------------------------- | ---------------------------------------- | ------------- | ---------- |
| T001 | Update `eslint.config.mjs` — dodać `scope:starter` constraint                  | frontend-developer | this plan        | eslint.config.mjs                                                | `pnpm lint` zielony (na obecnym kodzie)  |               |            |
| T002 | Wygenerować `apps/starter` + `apps/starter-e2e` przez `nx g @nx/angular:app`   | frontend-developer | T001             | apps/starter/**, apps/starter-e2e/**                             | nx graph pokazuje starter; build success |               | T001       |
| T003 | Wygenerować `libs/starter-feature` (type:feature)                              | frontend-developer | T002             | libs/starter-feature/\*\*                                        | nx graph pokazuje lib; index.ts present  | T004          | T002       |
| T004 | Wygenerować `libs/starter-ui` (type:ui)                                        | frontend-developer | T002             | libs/starter-ui/\*\*                                             | nx graph pokazuje lib; index.ts present  | T003          | T002       |
| T005 | Edytować `apps/starter/src/styles.scss` — `mat.theme()`                        | frontend-developer | T002             | apps/starter/src/styles.scss                                     | build success, tokens dostępne           |               | T002       |
| T006 | Pisać `libs/starter-ui` content: TokenCard + TypographyRow                     | frontend-developer | T004             | libs/starter-ui/src/lib/{token-card,typography-row}.component.ts | komponenty exportowane via index.ts      |               | T004       |
| T007 | Pisać `libs/starter-feature` home component (token showcase)                   | frontend-developer | T003, T006       | libs/starter-feature/src/lib/home/                               | komponent renderuje hero + 3 sekcje      |               | T003, T006 |
| T008 | Wired routing: `apps/starter/src/app/app.routes.ts` lazy load                  | frontend-developer | T007             | apps/starter/src/app/app.routes.ts                               | dev server pokazuje home na `/`          |               | T007       |
| T009 | E2E smoke test — `apps/starter-e2e/src/example.e2e.ts`                         | test-engineer      | T008             | apps/starter-e2e/src/example.e2e.ts                              | `nx e2e starter-e2e` zielony             |               | T008       |
| T010 | Unit tests — `home.component.spec.ts` + ui components spec                     | test-engineer      | T006, T007       | \*.spec.ts                                                       | `nx affected:test` zielony               | T009          | T006, T007 |
| T011 | Dodać `start:starter` do `package.json`; CHANGELOG entry                       | doc-writer         | T002             | package.json, CHANGELOG.md                                       | `pnpm start:starter` działa              |               | T002       |
| T012 | Run pełen validation gate: lint + typecheck + test + e2e + build + ai:validate | code-reviewer      | T009, T010, T011 | run-log                                                          | wszystkie zielone                        |               | T009-T011  |

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
```

Plus `pnpm nx graph --file=tmp/graph.json` weryfikuje że starter app → starter-feature → starter-ui (+ shared-app-shell, ui-kit) bez cykli ani naruszeń module-boundary.

## Risks & mitigations

- **Risk:** `nx g @nx/angular:app` przy starszej wersji Nx + nowej Angular 21 może generować nieaktualny szkielet (eager bootstrap zamiast standalone). **Mitigation:** używamy `--standalone=true --changeDetection=OnPush` jawnie + porównujemy wygenerowany `app.config.ts` z `apps/dashboard/src/app/app.config.ts`; ręcznie alignujemy jeśli trzeba.
- **Risk:** generator może dodać niepotrzebne pliki test boilerplate. **Mitigation:** weryfikacja `apps/starter/src/app/` po generacji; pliki bez wartości usuwamy.
- **Risk:** `scope:starter` może łamać istniejący lint cache. **Mitigation:** `nx reset` po edycji eslint config przed pierwszym `affected:lint`.
- **Risk:** wybrany port 4221 może konfliktować z lokalnym devsem. **Mitigation:** port jest konfigurowalny przez `--port=` w nx serve; default jest startowym przykładem.

## Rollback

Aborcja środkowa: `git checkout -- .` (przed pierwszym commitem). Po commitach: `git reset --hard <pre-plan-sha>` na branchu feature, lub revert poszczególnych commitów (po jednym task per commit). ESLint config zmiana jest izolowana i revertable osobno.

## Run log

Per-task one-liners wpisywane do `docs/ai-workflow/runs/2026-05-25-starter-reference-app.md` w trakcie executions.
