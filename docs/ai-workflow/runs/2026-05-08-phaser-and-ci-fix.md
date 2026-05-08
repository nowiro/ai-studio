---
plan: docs/ai-workflow/plans/2026-05-08-phaser-and-ci-fix.md
date: 2026-05-08
status: done
---

# Run log — Phaser + CI fix

- T001 ✅ ci.yml hardened — added lockfile fallback (`if [ -f pnpm-lock.yaml ]; then ... else --no-frozen-lockfile`), `nrwl/nx-set-shas@v4` with `error-on-no-successful-workflow: false`, and per-job `nx show projects` empty-workspace skip. validate-ai + docs-audit jobs decoupled from `pnpm install` (pure Node).
- T002 ✅ e2e.yml hardened — same lockfile fallback; added `nx show projects --with-target=e2e` skip when no e2e projects exist (avoids running Playwright on empty workspace).
- T003 ✅ release.yml + pr-checks.yml + docs-audit.yml updated with the same lockfile fallback. docs-audit.yml now skips `pnpm install` entirely (scanners are pure Node).
- T004 ✅ `phaser ^3.87.0` added to `package.json` dependencies (between `@angular/ssr` and `rxjs`).
- T005 ✅ `.ai/rules/games.md` authored — Phaser-3-only, project-layout (apps/<name>-game + libs/game-<name> + libs/game-engine + libs/game-<name>-ui), Angular bridge pattern with `viewChild` + `DestroyRef`, perf budget (60 fps, < 4 ms/update), test pyramid for games, forbidden patterns.
- T006 ✅ Both tech-stack docs updated — new "2D games" row pointing at `phaser`, plus the rationale paragraph linking to the ADR.
- T007 ✅ ADR 0004 written, `Status: accepted`. Open follow-up flagged: when the first game lib lands, move `phaser` from root deps into `libs/game-engine/package.json`.

## Validators after run

- `pnpm ai:validate` ✅
- `pnpm docs:audit` ✅ — must-fix 0, should-fix 0, nice-to-have 0 (75 docs)

## Followups

- Run `pnpm install` locally and commit the generated `pnpm-lock.yaml` for reproducible CI.
- When first game lib is generated, move `phaser` out of root deps per the open ADR follow-up.
