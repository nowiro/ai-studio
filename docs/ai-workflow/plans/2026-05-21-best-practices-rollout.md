---
id: plan.best-practices-rollout
title: Best-practices rollout — dependabot parity, release-please, vitest-axe, Pino, Transloco
type: plan
date: 2026-05-21
trigger: user request "co bys proponowal jeszcze dodac do tych projektow"
status: done
owner: orchestrator
agents:
  - frontend-developer
  - backend-developer
  - architect
  - test-engineer
  - doc-writer
links:
  spec: null
  adr: docs/adr/0017-transloco-i18n.md
  issue: null
---

# Plan: Best-practices rollout

> Pięć równoległych usprawnień wybranych z propozycji top-10 (dependency automation + release flow + a11y testing + structured logging + i18n). Plan-first per `core.md §7` — orchestrator owns, specialists delegowani wg sekcji.

## Goal

Dodać do 4-repo ecosystem (ai-workspace + ai-studio + ai-mcp-alm + ai-mcp-devtools) pięć ortogonalnych usprawnień bez naruszania trinity invariants, z deterministycznymi skryptami i mirrorem `.ai/` → `.claude/` / `.github/`.

## Scope

| In                                                                           | Out                                                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Dependabot parity (3 trinity repos kopiują wzorzec ai-studio)                | Renovate Bot (decyzja: dependabot wystarcza, brak duplikacji)             |
| release-please config + workflow `.disabled` w 4 repo                        | Aktywne CI workflowy (wszystkie `.disabled` per świadoma decyzja usera)   |
| vitest-axe helper w ai-studio (jednostkowy a11y test)                        | Storybook + Chromatic (osobna iteracja, gdy `libs/ui-kit` ma komponenty)  |
| Pino structured logging w 2 MCP repos + redaction tokenów                    | OpenTelemetry (osobny krok, monitor)                                      |
| Transloco i18n w ai-studio: `libs/i18n` wrapper + ADR-0017 + demo w `nowiro` | Transloco we wszystkich 14 apps (demo + dokumentacja, rollout per zespół) |
| Update `.ai/rules/testing.md` (vitest-axe), `styling.md` (i18n locale hints) | Refaktor 14 apps na i18n (out of scope)                                   |

## Inputs

- `C:\github\ai-studio\.github\dependabot.yml` — wzorzec do propagacji
- `C:\github\ai-studio\.github\workflows\*.yml.disabled` — konwencja "consciously disabled"
- `C:\github\ai-studio\.ai\rules\testing.md` — gdzie wstawić sekcję vitest-axe
- `C:\github\ai-mcp-alm\src\shared\http-client.ts:1-50` — gdzie `console.error()` zastąpić Pino
- `C:\github\ai-mcp-alm\src\shared\write-guard.ts` — drugie miejsce logowania
- `C:\github\ai-studio\docs\adr\` — istniejące ADR (0011 wrap UI, 0016 wrap charts) jako wzór dla 0017
- `.ai/rules/principles.md §13` — wrap before consume (dotyczy Transloco → `libs/i18n`)
- `.ai/rules/llm-optimization.md §10` — deterministyczne skrypty zamiast ad-hoc promptów
- <https://jsverse.github.io/transloco/> — kanoniczna dokumentacja Transloco
- <https://github.com/pinojs/pino> — Pino docs (redaction, child loggers)
- <https://github.com/googleapis/release-please> — release-please monorepo strategie

## Tasks (DAG)

| id   | title                                                     | agent              | inputs                         | outputs                                                                           | done_when                                 | parallel_with | blocked_by |
| ---- | --------------------------------------------------------- | ------------------ | ------------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------- | ------------- | ---------- |
| T001 | Propaguj `dependabot.yml` do 3 trinity repos              | frontend-developer | ai-studio dependabot.yml       | `.github/dependabot.yml` w 3 repo (groups dostosowane)                            | 3 pliki, parsują w gh action validator    | T002, T003    |            |
| T002 | release-please config + workflow `.disabled` w 4 repo     | frontend-developer | release-please docs            | `release-please-config.json` + `.release-please-manifest.json` + `*.disabled` × 4 | per-repo plik, manifest start 0.1.0       | T001, T003    |            |
| T003 | vitest-axe install + helper + przykład test               | test-engineer      | testing.md, package.json       | `libs/util-testing/a11y` lib + 1 spec file demo                                   | `pnpm test --filter=util-testing` green   | T001, T002    |            |
| T004 | ADR-0017 Transloco i18n                                   | architect          | ADR-0011, ADR-0016             | `docs/adr/0017-transloco-i18n.md` (Status: accepted)                              | ADR review, accepted                      |               |            |
| T005 | Pino logger w ai-mcp-alm + redaction patterns             | backend-developer  | http-client.ts, write-guard.ts | `src/shared/logger.ts` + replacements (≥ 3 call sites)                            | Test logger redacts `*token*`, `*secret*` | T006          |            |
| T006 | Pino logger propagacja do ai-mcp-devtools                 | backend-developer  | ai-mcp-alm logger.ts           | `src/shared/logger.ts` w devtools (parity)                                        | Same redact patterns                      | T005          |            |
| T007 | `libs/i18n` Nx lib + Transloco install + providers        | frontend-developer | T004 ADR decision              | `libs/i18n/src/lib/{transloco-root.module.ts, locales/{en,pl}.json}`              | Lib builds, exports `provideTransloco()`  |               | T004       |
| T008 | Demo Transloco w `nowiro` app — 1 lazy namespace          | frontend-developer | T007 lib                       | `app.config.ts` providers + 1 component z `<ais-translate>`                       | App startuje, switch language działa      |               | T007       |
| T009 | Update `.ai/rules/testing.md` (vitest-axe) + `styling.md` | doc-writer         | T003 helper, T008 i18n         | 2 update'y w `.ai/rules/`                                                         | `pnpm ai:validate` green                  |               | T003, T008 |
| T010 | Validation gate per repo + commit + push                  | orchestrator       | all                            | 4 repos commit pushed                                                             | green: lint+typecheck+test+ai:validate    |               | T001..T009 |

Tasks T001..T006 mogą iść równolegle (ortogonalne pliki). T007 → T008 sekwencyjnie. T009 + T010 na koniec.

## Validation gate

```bash
# Per repo:
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e            # tylko ai-studio
pnpm affected:build
pnpm ai:validate
pnpm trinity:check           # invariant cross-repo
pnpm a11y:check              # ai-studio
```

All green + Conventional Commit (`feat(ci):`, `feat(i18n):`, `feat(logging):`, `chore(deps):`) + ADR-0017 accepted.

## Risks & mitigations

- **Risk:** Dependabot grupy w 3 trinity repos nie mają tych samych package names — **Mitigation:** per-repo dostosowanie grup (mcp-sdk dla MCP repos, brak angular dla ai-workspace)
- **Risk:** release-please bumpuje wersje niezależnie od `nx release` w ai-studio (konflikt) — **Mitigation:** workflow `.disabled` na start; sprawdzić strategy "node" vs custom przed enable'owaniem
- **Risk:** vitest-axe wymaga jsdom 29+ — **Mitigation:** jsdom 29.1.1 już w devDependencies (sprawdzone)
- **Risk:** Pino redaction nie łapie nested tokens w nested objects — **Mitigation:** test snapshot z deeply nested obiektem + token w `data.headers.authorization`
- **Risk:** Transloco breaks Material 3 components z `aria-label` (brak interpolacji) — **Mitigation:** `<mat-label>{{ t('form.email') }}</mat-label>` pattern (string-only translate, nie HTML)
- **Risk:** ADR-0017 koliduje z preferencją Angular i18n built-in u części reviewerów — **Mitigation:** ADR opisuje trade-offs explicit (compile-time vs runtime), revisit za 6 miesięcy

## Rollback

- Per task: `git revert <SHA>` per repo (każda zmiana w osobnym commicie zgodnie z Conventional Commits)
- Transloco rollback: `pnpm remove @jsverse/transloco`, usuń `libs/i18n`, ADR-0017 → status: superseded
- Pino rollback: revert do `console.error()` (commit zachowuje pełną historię)

## Run log

Per-task one-liners są dopisywane do `docs/ai-workflow/runs/2026-05-21-best-practices-rollout.md` w trakcie wykonania. Orchestrator update'uje `status:` powyżej na każdym phase boundary.
