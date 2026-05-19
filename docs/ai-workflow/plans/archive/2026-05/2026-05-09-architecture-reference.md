---
id: plan.architecture-reference
title: Apply nowiro AI Architecture Reference across the trinity
type: plan
date: 2026-05-09
trigger: 'user pasted nowiro AI Architecture Full Reference (HTML artefact); apply its recommendations to all 3 repos'
status: done
closedAt: 2026-05-19
closeReason: 'Audit 2026-05-19 — .ai/architecture.md present byte-identical in 3 repos (trinity baseline). docs/architecture/nowiro-projects-map.md, .ai/rules/production-readiness.md in place.'
owner: orchestrator
agents:
  - architect
  - doc-writer
links:
  spec: null
  adr: null
  source: file:///C:/Users/wojtek/Downloads/ai-full-reference.html
---

# Plan: nowiro AI Architecture Reference

## Goal

Adopt the nowiro AI Architecture Reference as the single canonical source for the **three primitives** (Tool/MCP/Skills), the **three layers** (RAG/MCP/Agent), the **MCP power stack**, the **production must-haves**, and the **per-project map** so every agent and human in the trinity sees one consistent picture.

## Scope

| In                                                                                                                               | Out                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ai/architecture.md` — markdown port of the artefact, trinity baseline (byte-identical in all 3 repos)                          | Renaming repositories (e.g. `ai-studio` → `studio-workspace`) — not requested; doc references the current names.                                    |
| `.ai/rules/production-readiness.md` — 6 must-haves (Permissions, Audit Logs, Monitoring, Cost Control, Human Approval, Fallback) | Implementing the must-haves in code — that is per-feature work, not documentation.                                                                  |
| `docs/architecture/nowiro-projects-map.md` — per-repo identity card matching section 7 of the artefact                           | Splitting `ai-studio` into separate `studio-workspace` + `ai-studio-dashboard` apps. The artefact distinguishes them logically; the repo stays one. |
| Add Memory MCP entry to `.ai/mcp.json` (Anthropic official). Mark Sentry / Tavily / Zapier as recommended in `architecture.md`.  | Wiring those servers up at runtime — operator decision, not code change.                                                                            |
| Update `tools/scripts/check-trinity.mjs` to include the two new baseline files.                                                  | Changing the existing 6 baseline files.                                                                                                             |
| Mirror identical files into `ai-mcp-alm` and `ai-mcp-devtools` so `pnpm trinity:check` stays green.                              | Drift-tolerant per-repo customisation in baseline files.                                                                                            |

## Inputs

- `file:///C:/Users/wojtek/Downloads/ai-full-reference.html` — the source artefact (HTML; sections 1–7).
- `tools/scripts/check-trinity.mjs` — current baseline list (6 files).
- `.ai/mcp.json` — current 4-server registry (context7, playwright, nx, angular-cli).
- `.ai/README.md` — wrapper / SoT documentation, already pruned to Claude + Copilot only.
- `CLAUDE.md` — plan-first §7 mandate; “every code/doc/test/scenario generation goes through a markdown plan”.

## Tech choices

No new libraries, no new services. Pure documentation + one JSON registry edit + one Node script edit.

| Concern                | Choice                                                                                | Rationale                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source format          | Plain markdown (mermaid for graphs)                                                   | Per `.ai/` pillars: human-readable, no proprietary formats. Mermaid renders on GitHub.                                                                |
| Diagrams               | Mermaid only                                                                          | Matches the repo-wide convention applied to spec/plan/tasks/technical docs (no ASCII-art).                                                            |
| Trinity propagation    | Add to `BASELINE` array in `check-trinity.mjs`; `pnpm trinity:check` enforces parity  | Avoids duplicate sources of truth; CI/pre-push catches drift at byte level.                                                                           |
| Per-repo customisation | `docs/architecture/nowiro-projects-map.md` is **not** a baseline file                 | Each repo legitimately highlights its own row; the file links to `.ai/architecture.md` for the canonical map.                                         |
| MCP registry edit      | Append `memory` server to `.ai/mcp.json` only in `ai-studio`; siblings stay untouched | `.ai/mcp.json` is **not** a baseline file (each repo has its own narrower registry); the recommendation lives in the canonical `.ai/architecture.md`. |

## Module taxonomy

```
ai-studio (canonical) / ai-mcp-alm / ai-mcp-devtools
├── .ai/
│   ├── architecture.md                  # NEW — trinity baseline
│   └── rules/
│       └── production-readiness.md      # NEW — trinity baseline
├── docs/
│   └── architecture/
│       └── nowiro-projects-map.md       # NEW — per-repo (not baseline)
└── tools/scripts/
    └── check-trinity.mjs                # update BASELINE array (trinity baseline itself? no — per-repo, but content stays in sync via convention)
```

## Public API surface

None — pure documentation.

## Tasks (DAG)

| id   | title                                                                              | agent        | inputs                                  | outputs                                                         | done_when                                                                                                                             | parallel_with | blocked_by |
| ---- | ---------------------------------------------------------------------------------- | ------------ | --------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| T001 | Author `.ai/architecture.md` (markdown port, mermaid diagrams) in `ai-studio`      | doc-writer   | source artefact, `.ai/README.md`        | `ai-studio/.ai/architecture.md`                                 | every section (1–7) of the artefact represented; all diagrams in mermaid; no copyright issues (port is short-form, original wording). | T002          | —          |
| T002 | Author `.ai/rules/production-readiness.md` (6 must-haves)                          | doc-writer   | source § 6 “Production Must-Haves”      | `ai-studio/.ai/rules/production-readiness.md`                   | each must-have has a "what / why / signal" trio; cross-referenced from `core.md` + `security.md`.                                     | T001          | —          |
| T003 | Update `.ai/mcp.json` — add `memory` (Anthropic official) entry                    | architect    | source § 4 “MCP Power Stack”            | `ai-studio/.ai/mcp.json`                                        | server entry validates against `$schema`; `description` cites the cross-session persistence purpose.                                  | T004          | —          |
| T004 | Author `docs/architecture/nowiro-projects-map.md` (mapa z sekcji 7)                | doc-writer   | source § 7 + repo state                 | `ai-studio/docs/architecture/nowiro-projects-map.md`            | row per repo with: identity, RAG/MCP/Skills/Agent/A2A signal, links.                                                                  | T003          | —          |
| T005 | Add `architecture.md` + `production-readiness.md` to `BASELINE` in trinity script  | architect    | T001, T002, current `check-trinity.mjs` | `ai-studio/tools/scripts/check-trinity.mjs`                     | `pnpm trinity:check` from `ai-studio` reports the two new files (will fail until T006 lands — that is the gate).                      |               | T001, T002 |
| T006 | Mirror baseline files to `ai-mcp-alm` and `ai-mcp-devtools`; mirror trinity script | architect    | T001, T002, T005                        | identical files in both siblings, identical `check-trinity.mjs` | `pnpm trinity:check` from any of the 3 repos: `✓ trinity in sync (3 + 0 siblings missing, 8 baseline files).`                         |               | T005       |
| T007 | Validation gate (lint + test + build) in each affected repo                        | orchestrator | T006                                    | n/a (CI artefacts)                                              | per-repo `pnpm` validation as required by each repo's pre-commit/pre-push hooks.                                                      |               | T006       |
| T008 | Conventional Commit per repo + push                                                | orchestrator | T007                                    | git refs                                                        | 3 commits land on `origin/main` of each repo; trinity hashes match across remote heads.                                               |               | T007       |

## Validation gate

Per repo:

```bash
# ai-studio
pnpm exec nx run-many -t lint -p game-pong game-pong-ui pong-game pong-game-e2e
pnpm exec nx test game-pong
pnpm exec nx build pong-game --configuration=production
pnpm trinity:check

# ai-mcp-alm
pnpm typecheck
pnpm trinity:check

# ai-mcp-devtools
pnpm typecheck
pnpm trinity:check
```

All green + Conventional Commit (`docs(ai): ...` or `chore(trinity): ...`).

## Risks & mitigations

- **Risk:** Copyright / attribution — the source artefact is the user's own work but the markdown port should not be a verbatim 1:1 reproduction. **Mitigation:** port preserves structure + key examples but uses original wording; we cite the source URL in the frontmatter.
- **Risk:** Repo-name confusion — the artefact mentions `studio-workspace` as a fourth project distinct from `ai-studio`. **Mitigation:** `nowiro-projects-map.md` clarifies that the workspace tier and the dashboard tier currently share one git repo (`ai-studio`); a future ADR can split them.
- **Risk:** Trinity drift after first edit — adding two baseline files means future edits must touch all 3 repos in lockstep. **Mitigation:** `check-trinity.mjs` runs in pre-push (`game-pong` etc.) so drift is caught before push.
- **Risk:** `.ai/mcp.json` divergence between repos — Memory MCP entry only landed in `ai-studio`. **Mitigation:** the file is intentionally _not_ a baseline (each repo has its own narrow registry); recommendations live in `architecture.md` which IS baseline.

## Rollback

Delete `.ai/architecture.md`, `.ai/rules/production-readiness.md`, `docs/architecture/nowiro-projects-map.md` from each repo. Revert `tools/scripts/check-trinity.mjs` to the prior `BASELINE` (6 files). Revert `.ai/mcp.json` Memory entry. Trinity stays consistent because the 6 original baseline files are untouched.

## Run log

Per-task one-liners are appended to `docs/ai-workflow/runs/2026-05-09-architecture-reference.md` as they execute.
