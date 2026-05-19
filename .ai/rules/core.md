---
id: rules.core
title: Core rules — every agent, every task
type: rules
scope: global
priority: 1
version: 1.0.0
---

# Core rules

These rules are non-negotiable. They override anything else **except** an explicit user instruction in the chat. Lower-priority files (other rules, agent prompts, workflows) extend but never weaken them.

This file pairs with [`principles.md`](principles.md) — those are the _engineering_ principles (DRY, SOLID, KISS, YAGNI). Both load at priority 1.

## 1. Truth before action

1.1 Read the relevant code before claiming knowledge of it. Never invent file paths, function names, package versions or APIs.
1.2 When unsure, use the **context7** MCP server to fetch current upstream docs (Angular, Nx, RxJS, Vitest, Playwright). Cite the source in the response.
1.3 If a fact comes from `.ai/context/*.md`, link to the file. Memory ≠ ground truth — verify against the repo first.

## 2. Smallest reasonable change

2.1 A bug fix changes only what's needed for the bug. No drive-by refactors.
2.2 A new feature uses existing primitives before introducing new ones.
2.3 Three similar lines are better than a premature abstraction.
2.4 No half-finished implementations. If a step can't complete, surface the blocker and stop — don't paper over it.

## 3. Reversibility & blast radius

3.1 Always-safe: editing files in `apps/`, `libs/`, `docs/`; running tests, lint, typecheck, `nx graph`.
3.2 Confirm first: deleting files, force-pushing, dropping migrations, mutating shared infra, publishing packages.
3.3 Forbidden without explicit per-action user approval: `--no-verify`, `git reset --hard`, history rewrites, secret writes, opening PRs against `main` with red CI.

## 4. Definition of Done

A task is **done** only when:

- ✅ Lint passes (`pnpm affected:lint`)
- ✅ Type-check passes (`pnpm typecheck`)
- ✅ Unit tests pass with ≥80 % statement coverage on touched code (`pnpm affected:test`)
- ✅ E2E smoke green for affected apps (`pnpm affected:e2e`)
- ✅ Build succeeds (`pnpm affected:build`)
- ✅ Docs/ADR updated when behavior changes
- ✅ Conventional commit + scoped PR description

The Orchestrator MUST NOT mark `done` while any item is missing.

## 5. Communication

5.1 Be concise. State results and decisions; skip narration.
5.2 Quote file paths as `path/to/file.ts:42` so users can click through.
5.3 Surface uncertainty — say "I don't know, here's how to find out" before guessing.
5.4 At end-of-turn: one sentence on what changed, one on what's next.

## 6. Logs of record

6.1 Every multi-agent run produces an entry under `docs/ai-workflow/runs/YYYY-MM-DD-<slug>.md` summarising: requesting agent, delegations, MCP calls, files touched, validation outcome.
6.2 Architectural decisions go in `docs/adr/NNNN-<slug>.md` (MADR template).
6.3 If memory contradicts the repo, trust the repo and update memory.

## 7. Plan-first generation (HARD RULE)

7.1 **No code, doc, scenario, or test is generated without a written plan in markdown.** This applies to features, bug fixes, refactors, library scaffolding, doc regeneration, and test-scenario authoring.
7.2 **Plan locations** (pick one — pre-existing slot wins):

- SDD work → `docs/analytical/specs/<slug>/plan.md` (architect-owned).
- Everything else → `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` (orchestrator-owned). Use [`_template.md`](../../docs/ai-workflow/plans/_template.md).
- ADR-worthy changes also produce `docs/adr/NNNN-<slug>.md`.
  7.3 **Multi-agent execution.** The Orchestrator owns the plan and delegates each task to a specialist (analyst, architect, frontend/backend developer, test-engineer, test-scenario-author, doc-writer, code-reviewer, security-auditor, doc-auditor, release-manager). Specialists MUST refuse a delegation that doesn't cite a plan path.
  7.4 **Trivial-change exemption.** A single-file edit that doesn't change behaviour (typo, comment, formatting) doesn't need a plan. Anything that touches ≥ 2 files OR adds/changes behaviour requires a plan.
  7.5 **Plan status lifecycle.** `draft` → `accepted` → `in-progress` → `done` (or `aborted`). The Orchestrator must update the status field and append a one-liner to `docs/ai-workflow/runs/` when each phase closes.

## 8. Forbidden patterns

- ❌ API keys / secrets in source, comments, commit messages, or `.ai/` files.
- ❌ `any` (TypeScript) outside justified, commented exceptions.
- ❌ `console.log` in committed code (use the logger service).
- ❌ Default exports outside config files.
- ❌ Skipping the **Definition of Done** because the change "looks small".
- ❌ Generating code/docs/tests without a plan markdown referenced in the delegation (see §7).
- ❌ A specialist working solo on a multi-file change without an Orchestrator-owned plan.

---

_Source: built on top of `angular.dev/ai` recommendations and Anthropic prompt-engineering guidance._
