---
id: plan.form-fill-extraction
title: Extract form-fill dev tools into shared wizard-form-fill lib
type: plan
date: 2026-05-21
trigger: user request "zrob z niego biblioteke i zastousuj w aplikacji biznesowej"
status: in-progress
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
  - doc-writer
links:
  spec: null
  adr: null
  issue: null
---

# Plan: Extract form-fill dev tools into shared lib

> Strategy-pattern extraction of `libs/individual-wizard-dev-tools` → new
> `libs/wizard-form-fill` shared lib, consumed by both `individual-wizard`
> and `business-wizard` apps.

## Goal

The "Wypełnij testowymi danymi" feature (DevFabComponent + DevFormFillerService

- Polish fake data) currently lives only in individual-wizard. After this
  plan, both wizards (individual + business) reuse the same lib, with per-app
  form-shape adapters wired via DI.

## Scope

| In                                                                                    | Out                                                            |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Generic `FormFillerService` (multi-pass walker, no hard-coded factory calls)          | Visual redesign of DevFab (keep current look)                  |
| `FormFillStrategy` interface + `FORM_FILL_STRATEGY` DI token                          | New profile presets beyond Polish individual / Polish business |
| `DevFabComponent` (UI, generic — strategy-driven)                                     | Production-mode gating (dev-only toggle stays as today)        |
| Polish fake-data generators (PESEL, NIP, names, cities — pure functions)              | i18n for the FAB labels (PL stays for now)                     |
| `IndividualFormFillStrategy` w `libs/individual-wizard-data`                          | Migration of other apps (only wizard-\* apps use this feature) |
| `BusinessFormFillStrategy` w `libs/business-wizard-data` (incl. KRS/REGON generators) | Generic random text — only Polish business/individual data     |
| Wire-up w obu `app.config.ts` + `app.component.ts`                                    | Refactor of WizardFormFactory itself                           |
| Hard delete `libs/individual-wizard-dev-tools`                                        | Backward-compat re-export wrapper                              |

## Inputs

- `libs/individual-wizard-dev-tools/src/lib/dev-fab.component.ts` (283 lines, UI)
- `libs/individual-wizard-dev-tools/src/lib/dev-form-filler.service.ts` (289 lines, walker + strategy table)
- `libs/individual-wizard-dev-tools/src/lib/test-data.ts` (150+ lines, Polish generators)
- `libs/individual-wizard-data/src/lib/wizard-form-factory.ts` — methods called by service today
- `libs/business-wizard-data/src/lib/business-wizard-form-factory.ts` — target adapter
- `apps/{individual,business}-wizard/src/app/{app.config,app.component}.ts` — wire-up sites
- `.ai/rules/principles.md §13` (wrap before consume), `.ai/rules/nx.md` (tags + module boundaries)
- ADR-0011 (UI-kit wrapper strategy — same pattern: one seam, swappable backend)

## Tasks (DAG)

| id   | title                                                          | agent              | inputs        | outputs                                   | done_when                            | parallel_with | blocked_by |
| ---- | -------------------------------------------------------------- | ------------------ | ------------- | ----------------------------------------- | ------------------------------------ | ------------- | ---------- |
| T001 | Plan markdown                                                  | orchestrator       | user req      | this file                                 | accepted                             |               |            |
| T002 | Read source files                                              | frontend-developer | dev-tools lib | full understanding                        | files read                           |               | T001       |
| T003 | Scaffold `libs/wizard-form-fill` (project.json + tsconfig)     | frontend-developer | nx.md tags    | new lib skeleton                          | nx graph shows new project           |               | T002       |
| T004 | Generic `FormFillerService` + `FormFillStrategy` + token       | frontend-developer | T002, T003    | service + strategy.ts                     | tests pass, no factory imports       |               | T003       |
| T005 | Move `DevFabComponent` + Polish fake-data                      | frontend-developer | T002, T003    | dev-fab.component.ts, polish-fake-data.ts | DevFab uses Strategy via inject      | T004          | T003       |
| T006 | `IndividualFormFillStrategy` in `individual-wizard-data`       | frontend-developer | T004          | strategy class implementing interface     | typecheck                            | T007          | T004       |
| T007 | `BusinessFormFillStrategy` in `business-wizard-data`           | frontend-developer | T004          | strategy class implementing interface     | typecheck                            | T006          | T004       |
| T008 | Wire individual-wizard: app.config provider + app.component    | frontend-developer | T006, T005    | imports updated                           | individual builds                    | T009          | T005, T006 |
| T009 | Wire business-wizard: app.config provider + DevFab in template | frontend-developer | T007, T005    | imports updated, FAB visible              | business builds                      | T008          | T005, T007 |
| T010 | Delete `libs/individual-wizard-dev-tools` + clean refs         | frontend-developer | T008          | dir removed, tsconfig.base path removed   | nx graph clean, no stale refs        |               | T008       |
| T011 | Validate (typecheck + lint + test + build) + commit + push     | orchestrator       | all           | green run, pushed                         | CI-equivalent local validation green |               | T010, T009 |

## Validation gate

```bash
pnpm nx run-many -t typecheck --projects=wizard-form-fill,individual-wizard-data,business-wizard-data,individual-wizard,business-wizard
pnpm nx test wizard-form-fill
pnpm nx run-many -t lint --projects=wizard-form-fill,individual-wizard,business-wizard
pnpm nx run-many -t build --projects=individual-wizard,business-wizard
pnpm trinity:check
pnpm ai:validate
pnpm a11y:check
```

All green + Conventional Commit (`feat(wizard):`, breaking — `libs/individual-wizard-dev-tools` removed) + plan flipped to `done`.

## Risks & mitigations

- **Risk:** `BusinessWizardFormFactory` lacks methods analogous to individual's `addAddress/addPhone/...` — **Mitigation:** Strategy's `expandForm(form, mode)` is called by service; each Strategy decides what to expand. If business factory has different shape, Strategy maps modes to its own factory methods.
- **Risk:** Hard-coded `FILL_STRATEGIES` field-name table doesn't match business fields (KRS / REGON / company name) — **Mitigation:** Service consults Strategy's `resolveFieldValue()` first, falls back to generic only if Strategy returns `undefined`.
- **Risk:** Removing `libs/individual-wizard-dev-tools` breaks unrelated imports — **Mitigation:** `pnpm typecheck` + `grep -r "individual-wizard-dev-tools"` audit before delete (T010).
- **Risk:** DevFabComponent imports CDK DragDrop — bundle size delta — **Mitigation:** CDK already in business-wizard deps tree (Material requires CDK); no new transitive cost.
- **Risk:** Generic walker accidentally fills production forms — **Mitigation:** FAB itself is gated on `isDevMode()` (preserve from original). Re-verify in T005.

## Rollback

- Revert single commit per atomic operation; per-task one-liners in `docs/ai-workflow/runs/2026-05-21-form-fill-extraction.md`.
- If business-wizard regression: `git revert` T009 commit; the lib stays, business just doesn't consume it yet.

## Run log

Per-task one-liners appended live in `docs/ai-workflow/runs/2026-05-21-form-fill-extraction.md`.
