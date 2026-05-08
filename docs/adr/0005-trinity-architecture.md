# 0005 — Trinity architecture (ai-studio + ai-mcp-alm + ai-mcp-devtools)

- Status: accepted
- Date: 2026-05-08
- Decision-makers: maintainers
- Consulted: orchestrator + architect agent owners
- Informed: all contributors

## Context and problem statement

Spec-driven development with AI agents needs three independent capabilities:

1. **A canonical place to keep agents, rules, workflows, and the application code itself** — that's `ai-studio`.
2. **MCP-based access to ALM systems with the user's personal tokens** — Jira, Confluence, Figma, Sonar, GitHub, GitLab. Read-first; writes guarded.
3. **MCP-based dev-workflow primitives** — read docs, run static analysis, propose a fix bundle, run Playwright, score compliance.

If we mash them into one repo, agents and connectors and dev tools all churn together. Independent release cadence and least-privilege per integration argue for separation. But duplication kills consistency.

## Decision drivers

- **Single source of truth for rules** — agents in any of the three repos should read identical `core.md`, `principles.md`, `security.md`, `orchestrator.md`, `spec-driven.md`, `_template.md`. Drift = bugs.
- **Independent release cadence** — pushing a Jira-API change shouldn't bump the Angular starter version.
- **Least privilege** — `ai-mcp-alm` holds tokens; `ai-mcp-devtools` runs local commands. Separation matches the security blast radius.
- **No new infrastructure** — no shared npm package, no git submodules. Plain repos that anyone can clone next to each other.

## Considered options

1. **One repo with three apps** (the devflow-ai shape).
2. **Three separate repos with a shared rules npm package** published from one of them.
3. **Three separate repos with copied baseline + a hash verifier** ← chosen.
4. **Three separate repos using git submodules for `.ai/`**.

## Decision outcome

Chosen **option 3**.

The "trinity baseline" — a fixed list of 6 markdown files — is byte-identical across all three repos. `tools/scripts/check-trinity.mjs` lives in each repo, finds siblings under `..`, hashes the baseline files, and fails if any hash differs from the canonical (`ai-studio`).

Sync flow:

1. Edit baseline in `ai-studio`.
2. Copy to siblings (manual; once stable, automate via `pnpm trinity:sync`).
3. CI in each sibling runs `pnpm trinity:check`. Drift → red.

This is uglier than a published package but ships in a single afternoon and survives without npm-publish credentials.

### Consequences

- ➕ Each repo can be cloned and used in isolation; siblings are detected when present, otherwise skipped.
- ➕ One canonical source for plan-first / spec-driven rules; no language about "which version of orchestrator.md is current".
- ➕ Tokens live only in `ai-mcp-alm` env; `ai-mcp-devtools` is pure-local; `ai-studio` knows neither.
- ➖ Six baseline files instead of zero; a sync step is needed when they change.
- ➖ The MCP server bin paths in `ai-studio/.mcp.json` are relative (`../ai-mcp-alm/dist/...`). The user MUST clone the trinity into the same parent directory.

## Pros and cons

### Option 1 — One repo

- ➕ Simplest dev loop.
- ➖ Coupled release cadence; rule edits force unrelated jobs to rerun.
- ➖ Tokens and connectors bundled with the app code.

### Option 2 — Shared npm package

- ➕ Cleanest DRY.
- ➖ Needs a publish/install pipeline and registry credentials before you can even ship the rules.

### Option 3 — Copied baseline + hash verifier (chosen)

- ➕ Zero infra; works offline.
- ➕ Drift is loud (CI red).
- ➖ A sync step on every baseline edit.

### Option 4 — Git submodules

- ➕ True single source.
- ➖ Submodule UX is confusing for contributors; CI complications; rebases hurt.

## Implementation plan

- [x] Bootstrap `ai-mcp-alm/` with shared infrastructure + 6 server stubs (Jira/Confluence/Figma/Sonar/GitHub/GitLab).
- [x] Bootstrap `ai-mcp-devtools/` with one server + 5 tool stubs (read_docs / analyze_code / propose_fix / run_playwright / compliance_report).
- [x] Copy 6 baseline files into both new repos.
- [x] Author `tools/scripts/check-trinity.mjs` and distribute to all three.
- [x] Update `ai-studio/.mcp.json` and `.claude/settings.json` with the 7 new MCP servers.
- [x] Write `docs/architecture/trinity.md` (human-facing entry point).
- [ ] Future: when the first real ALM call ships, port full client logic from `devflow-ai/libs/shared/api/` (Jira, Confluence, Figma, Sonar, GitHub, GitLab clients are mature there).
- [ ] Future: `pnpm trinity:sync` script that copies baselines from `ai-studio` to siblings instead of manual copy.

## References

- `C:\github\devflow-ai` — prior art (single-repo MCP servers + shared API library).
- [`docs/architecture/trinity.md`](../architecture/trinity.md) — human-facing trinity overview.
- [GitHub spec-kit](https://github.com/github/spec-kit) — spec-driven methodology this trinity supports.
- [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md) — the workflow that ties the trinity together.
