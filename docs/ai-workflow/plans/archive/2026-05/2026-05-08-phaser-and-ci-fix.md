---
id: plan.phaser-and-ci-fix
title: Add Phaser as default game library + harden CI for first-push / empty-workspace
type: plan
date: 2026-05-08
trigger: User request — push to GitHub failed CI; add Phaser as default game lib
status: done
closedAt: 2026-05-19
closeReason: 'Audit 2026-05-19 — Phaser in package.json, .ai/rules/games.md, ADR-0004 accepted, CI workflows green; run log archived.'
owner: orchestrator
agents:
  - architect
  - frontend-developer
  - doc-writer
links:
  spec: null
  adr: docs/adr/0004-phaser-as-default-game-library.md
  issue: null
---

# Plan: Phaser + CI hardening

## Goal

1. Make CI green on a fresh push that has no `pnpm-lock.yaml` and no app/lib projects yet.
2. Adopt Phaser 3 as the default 2D game framework so future game-oriented apps generate via Nx with a known stack.

## Scope

| In                                                                      | Out                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `.github/workflows/{ci,e2e,pr-checks,docs-audit,release}.yml` hardening | Generating an actual game app or lib (no app yet)                   |
| `package.json` adding `phaser` to deps                                  | Vendoring Phaser examples (link to upstream repo instead)           |
| `.ai/rules/games.md` + `.ai/context/tech-stack.md` update               | 3D / WebGPU game frameworks (Phaser 2D first; expand later via ADR) |
| `docs/adr/0004-phaser-as-default-game-library.md`                       | Removing Material/Tailwind from non-game apps                       |

## Inputs

- `.github/workflows/ci.yml:30` — `pnpm install --frozen-lockfile` fails when lockfile absent
- `.github/workflows/ci.yml:42` — `nrwl/nx-set-shas@v4` fails on first commit (no `HEAD~1`)
- All 5 workflows redundantly install dependencies even when the script doesn't need them (`pnpm ai:validate` is pure Node)
- `package.json` — currently no game framework
- `.ai/context/tech-stack.md` — needs new row for game library
- `.ai/rules/` — no `games.md` yet

## Tasks (DAG)

| id   | title                                                                                  | agent              | inputs                             | outputs                           | done_when                                                             | parallel_with | blocked_by |
| ---- | -------------------------------------------------------------------------------------- | ------------------ | ---------------------------------- | --------------------------------- | --------------------------------------------------------------------- | ------------- | ---------- |
| T001 | Harden `ci.yml` (lockfile fallback, first-push fallback, decouple validate-ai)         | frontend-developer | `.github/workflows/ci.yml`         | hardened `ci.yml`                 | yaml lint clean; logic preserves frozen install when lockfile present | T002, T003    |            |
| T002 | Harden `e2e.yml` (lockfile fallback, first-push fallback)                              | frontend-developer | `.github/workflows/e2e.yml`        | hardened `e2e.yml`                | yaml lint clean                                                       | T001, T003    |            |
| T003 | Harden `pr-checks.yml`, `release.yml`, `docs-audit.yml` (lockfile fallback)            | frontend-developer | the three workflows                | hardened workflows                | yaml lint clean                                                       | T001, T002    |            |
| T004 | Add `phaser` to `package.json` deps + `pnpm dlx` mention in scripts (no install)       | architect          | `package.json`                     | `package.json` with `phaser` line | json valid; version pinned to Phaser 3 latest stable                  |               |            |
| T005 | Write `.ai/rules/games.md` (Phaser 3 conventions, examples link, integration approach) | doc-writer         | this plan + `.ai/rules/angular.md` | `.ai/rules/games.md`              | frontmatter valid (id/title/type/version); ai:validate passes         | T004          | T004       |
| T006 | Update `.ai/context/tech-stack.md` + `docs/technical/tech-stack.md` with Phaser row    | doc-writer         | T005 output                        | both tech-stack docs              | docs:audit clean                                                      |               | T005       |
| T007 | Write `docs/adr/0004-phaser-as-default-game-library.md` (Status: accepted)             | architect          | T004, T005                         | new ADR                           | ADR file exists; references Phaser examples repo                      |               | T005       |

## Validation gate

```bash
pnpm ai:validate
pnpm docs:audit
node --check tools/scripts/*.mjs
# YAML workflows manually reviewed (no yaml-lint in repo deps)
```

## Risks & mitigations

- **Risk:** lockfile-fallback branch in CI papers over a real desync between `package.json` and `pnpm-lock.yaml`. **Mitigation:** keep `--frozen-lockfile` as the default path; non-frozen only when lockfile absent. Add a once-per-job WARNING annotation when falling back.
- **Risk:** Phaser ships a `globals.PIXI`-style API that conflicts with TypeScript strict mode. **Mitigation:** Phaser 3.80+ has first-class `@types`; pin to a version with TS support.
- **Risk:** Adding Phaser to root deps bloats install for apps that don't use it. **Mitigation:** future-proof — once a game lib exists, move `phaser` into `libs/game-engine/package.json` (project-graph-aware install). For now, root is acceptable for a starter.

## Rollback

- CI fixes: revert the workflow files (purely additive `if/else`, no behaviour change for the happy path).
- Phaser: remove the `phaser` line from `package.json`, drop `.ai/rules/games.md`, drop the ADR.

## Run log

Per-task one-liners append to `docs/ai-workflow/runs/2026-05-08-phaser-and-ci-fix.md` as they execute.
