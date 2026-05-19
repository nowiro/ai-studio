---
id: plan.trinity-bootstrap
title: Bootstrap ai-mcp-alm + ai-mcp-devtools — "święta trójca" with ai-studio
type: plan
date: 2026-05-08
trigger: User request — create two MCP repos that complete the SDD/MCP trinity with ai-studio
status: done
closedAt: 2026-05-19
closeReason: 'Audit 2026-05-19 — `node tools/scripts/check-trinity.mjs` reports OK across 3 repos (11 baseline files). ai-mcp-alm + ai-mcp-devtools fully bootstrapped.'
owner: orchestrator
agents:
  - architect
  - frontend-developer
  - backend-developer
  - doc-writer
links:
  spec: null
  adr: docs/adr/0005-trinity-architecture.md
  reference: C:\github\devflow-ai
---

# Plan: Trinity bootstrap (ai-studio + ai-mcp-alm + ai-mcp-devtools)

## Goal

Stand up two new local repositories that, together with `ai-studio`, form a coherent "trinity" for spec-driven coding with MCP servers. Each repo has a single focused role; rules, principles, and orchestration patterns are shared (DRY).

## The trinity — roles

| Repo              | Role                                                                                                                         | What it ships                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai-studio`       | **Application starter**: where features get built. Hosts agents, workflows, slash commands.                                  | Angular 21 + Material 3 + Tailwind v4 + Phaser; the canonical `.ai/` rule set; spec-driven slash commands `/specify` `/plan` `/tasks` `/implement`.           |
| `ai-mcp-alm`      | **MCP servers for ALM via user tokens**: Jira, Confluence, Figma, Sonar, GitHub, GitLab.                                     | One MCP server per integration, sharing `libs/shared/connectors` (HTTP client, auth, types). All servers READ-FIRST; writes behind `MCP_WRITE_ENABLED` guard. |
| `ai-mcp-devtools` | **MCP server with dev-workflow tools**: read docs, analyse code, propose fixes, run Playwright, generate compliance reports. | Single MCP server exposing tools that the orchestrator in `ai-studio` calls during bug-fix / new-feature / audit workflows.                                   |

## DRY strategy across the three repos

The "trinity baseline" — files that MUST be byte-identical across all three:

- `.ai/rules/principles.md` (DRY/SOLID/KISS/YAGNI)
- `.ai/rules/core.md` (DoD + plan-first §7)
- `.ai/rules/security.md`
- `.ai/agents/orchestrator.md`
- `.ai/workflows/spec-driven.md`
- `docs/ai-workflow/plans/_template.md`

**Verification**: `tools/scripts/check-trinity.mjs` (added to ai-studio + symlink-equivalent in the others) hashes each baseline file and fails CI if hashes differ across repos. The canonical source of truth is `ai-studio`. The other two repos are SHALLOW MIRRORS of those files plus their own domain-specific rules on top.

**Sync flow**:

1. Edit baseline in `ai-studio`.
2. Copy to siblings (manual, scripted, or watchdog-style).
3. CI verifies hashes. Drift → red.

This is the simplest DRY mechanism that survives separate git repos without a publish/install pipeline.

## Scope

| In                                                                                                                                                                                                                                                                                               | Out                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `C:\github\ai-mcp-alm\` skeleton with `package.json`, `tsconfig`, `.ai/`, `.claude/`, `.github/`, `src/server-jira.ts`, `src/server-confluence.ts`, `src/server-figma.ts`, `src/server-sonar.ts`, `src/server-github.ts`, `src/server-gitlab.ts`, `src/shared/{auth,http-client,write-guard}.ts` | Production-grade connector logic — port that from `devflow-ai/libs/shared/api/`       |
| `C:\github\ai-mcp-devtools\` skeleton with same baseline + `src/server.ts` + `src/tools/{read-docs,analyze-code,propose-fix,run-playwright,compliance-report}.ts`                                                                                                                                | Full LLM-driven fix logic — agents in ai-studio decide; this repo provides PRIMITIVES |
| `ai-studio` updates: `.mcp.json` adds `alm-*` + `devtools` servers; new ADR; trinity readme                                                                                                                                                                                                      | Running `pnpm install` in either new repo (user runs it)                              |
| `tools/scripts/check-trinity.mjs` in ai-studio                                                                                                                                                                                                                                                   | A shared npm package — pragmatic copy + hash-verify is simpler                        |

## Inputs

- `C:\github\devflow-ai\apps\mcp-{atlassian,figma,github,gitlab,miro,sonar}\src\` — port pattern
- `C:\github\devflow-ai\libs\shared\api\` — connector code reference
- `ai-studio/.ai/rules/{core,principles,security}.md` — canonical baseline
- `ai-studio/.ai/agents/orchestrator.md` — canonical orchestrator role
- `ai-studio/.ai/workflows/spec-driven.md` — SDD workflow
- `ai-studio/docs/ai-workflow/plans/_template.md` — plan template
- MCP SDK: `@modelcontextprotocol/sdk`

## Tasks (DAG)

| id   | title                                                                                                                               | agent             | inputs                                                                              | outputs                                                      | done_when                                                   | parallel_with | blocked_by |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- | ------------- | ---------- |
| T001 | Bootstrap `ai-mcp-alm/` — package.json, tsconfig, prettier, eslint, gitignore, README                                               | architect         | template files from ai-studio                                                       | `C:\github\ai-mcp-alm\{package.json,tsconfig.json,...}`      | `node --check` syntax; READMEs render                       | T002          |            |
| T002 | Bootstrap `ai-mcp-devtools/` — same baseline                                                                                        | architect         | template files from ai-studio                                                       | `C:\github\ai-mcp-devtools\{package.json,tsconfig.json,...}` | same as T001                                                | T001          |            |
| T003 | Copy trinity baseline (.ai/rules/{core,principles,security}.md, orchestrator.md, spec-driven.md, \_template.md) into both new repos | doc-writer        | ai-studio canonical files                                                           | identical baseline in 2 new repos                            | byte-identical with ai-studio                               | —             | T001, T002 |
| T004 | Write domain rules: `ai-mcp-alm/.ai/rules/{mcp-server,connectors,tokens}.md`                                                        | doc-writer        | devflow-ai mcp app + libs/shared/api patterns                                       | 3 rule files                                                 | frontmatter valid; describes connector contract             | T005          | T003       |
| T005 | Write domain rules: `ai-mcp-devtools/.ai/rules/{devtools,tool-contract}.md`                                                         | doc-writer        | devflow-ai watchdog + smoke patterns                                                | 2 rule files                                                 | frontmatter valid                                           | T004          | T003       |
| T006 | Write `ai-mcp-alm/src/shared/{auth,http-client,write-guard}.ts` — skeleton with TODO ports                                          | backend-developer | devflow-ai/libs/shared/api/lib/{api-client,auth.config,security/mcp-write-guard}.ts | typed skeleton + port-from comments                          | TS compiles standalone (no runtime needed yet)              | T007          | T001, T004 |
| T007 | Write `ai-mcp-alm/src/server-{jira,confluence,figma,sonar,github,gitlab}.ts` — MCP server stubs                                     | backend-developer | T006 + devflow-ai/apps/mcp-\*/src/{main,tools}.ts                                   | 6 server stubs each registering ≥ 3 read tools               | TS compiles; tool list documented in README                 | T006          | T001, T004 |
| T008 | Write `ai-mcp-devtools/src/server.ts` + `src/tools/{read-docs,analyze-code,propose-fix,run-playwright,compliance-report}.ts`        | backend-developer | spec-kit methodology + ai-studio's audit scripts                                    | 1 server, 5 tool stubs                                       | each tool has Zod input/output schema + JSDoc               | —             | T002, T005 |
| T009 | Write CLAUDE.md, AGENTS.md, README.md in each new repo                                                                              | doc-writer        | ai-studio's variants                                                                | 6 files (3 per repo)                                         | links resolve; trinity diagram present                      | —             | T003       |
| T010 | Add `tools/scripts/check-trinity.mjs` in ai-studio + sibling repos                                                                  | backend-developer | trinity baseline file list                                                          | hash-verifying script in 3 places                            | running it across 3 repos prints `✓ trinity in sync`        | —             | T003       |
| T011 | Update `ai-studio/.mcp.json`, `.claude/settings.json` with new servers                                                              | architect         | T007 server bin paths                                                               | both files updated                                           | `pnpm ai:validate` ✅                                       | —             | T007, T008 |
| T012 | Write `ai-studio/docs/adr/0005-trinity-architecture.md`                                                                             | architect         | this plan                                                                           | new ADR `Status: accepted`                                   | references all 3 repos                                      | —             | T001–T010  |
| T013 | Write `ai-studio/docs/architecture/trinity.md` — the human-readable diagram + workflow                                              | doc-writer        | T012                                                                                | new doc                                                      | mermaid diagram renders; cross-links to both new repos work | —             | T012       |

## Validation gate

```bash
# In ai-studio
pnpm ai:validate
pnpm docs:audit
node tools/scripts/check-trinity.mjs   # NEW

# In each new repo (after install)
node --check src/**/*.ts
node tools/scripts/check-trinity.mjs   # uses path back to ai-studio
```

## Risks & mitigations

- **Risk:** baseline files drift silently between repos. **Mitigation:** `check-trinity.mjs` hashes the canonical files and CI fails on mismatch.
- **Risk:** porting connectors from devflow-ai introduces dependency bloat in ai-mcp-alm. **Mitigation:** keep `devDependencies` minimal — runtime deps only `@modelcontextprotocol/sdk`, `zod`, native `fetch`. No axios.
- **Risk:** scope creep — trying to port watchdog + AI memory store + everything from devflow-ai. **Mitigation:** this plan ships SKELETONS only with `// TODO: port from devflow-ai/libs/shared/api/lib/<file>` markers.
- **Risk:** confusing to operate three repos in parallel. **Mitigation:** `docs/architecture/trinity.md` in ai-studio is the user-facing entry point with a clear "open all three" instruction.

## Rollback

- `rm -rf C:\github\ai-mcp-alm\` and `C:\github\ai-mcp-devtools\` removes both new repos.
- ai-studio changes are additive (new ADR, new doc, new mcp.json entries, new check script). Reverting the relevant files restores ai-studio to current state.

## Run log

Per-task one-liners append to `docs/ai-workflow/runs/2026-05-08-trinity-bootstrap.md` as they execute.
