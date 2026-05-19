---
mode: agent
description: Scaffold a new Nx library following the new-library workflow (ADR → generator → docs)
tools: ['editFiles', 'search', 'runCommands', 'runTasks', 'problems']
---

# New library

Run the new-library workflow from [`.ai/workflows/new-library.md`](../../.ai/workflows/new-library.md).

## Inputs

- `${input:name:Library name (kebab-case, no scope folder)}` — e.g. `billing`
- `${input:scope:Nx scope (feature|ui|data|util|shared)}` — e.g. `data`
- `${input:type:Lib type (feature|ui|data-access|util)}` — e.g. `data-access`

## What to do

1. Switch to **architect** chat mode (or follow the architect's role inline if not available). Load `.ai/agents/architect.md`, `.ai/rules/nx.md`, `.ai/rules/angular.md`, `.ai/rules/principles.md`.
2. Write an ADR at `docs/adr/NNNN-<slug>.md` (MADR 4.0) — context, considered options, decision, consequences. Status: `proposed`.
3. List the exact `nx g …` invocation in the ADR's `generators:` block (per `.ai/agents/architect.md`).
4. Switch to **orchestrator** chat mode. Write the orchestrator-owned plan at `docs/ai-workflow/plans/<YYYY-MM-DD>-new-lib-<name>.md` using the template.
5. Run the generator via the **nx** MCP server (`nx g @nx/angular:lib <scope>/<name> --tags=scope:<scope>,type:<type>`).
6. Verify tags + module-boundary lint clean (`pnpm affected:lint`).
7. Hand off to **doc-writer** to add the lib's `README.md` and link from `docs/architecture/dependencies.md`.
8. Flip the ADR Status to `accepted`. Validate via `pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:build && pnpm ai:validate`.

## Don't

- Skip the ADR — every new lib needs one.
- Hand-edit `project.json` if the generator would do it.
- Forget tags — `@nx/enforce-module-boundaries` will fail.
- Add global side-effects in the lib's `src/index.ts`.
