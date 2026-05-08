# 0001 — Multi-agent orchestration with `.ai/` and `.claude/`

- Status: accepted
- Date: 2026-05-07
- Decision-makers: maintainers
- Consulted: AI working group
- Informed: all contributors

## Context and problem statement

We want AI agents to participate in development without breaking conventions, and we want the conventions to be readable by **any** AI tool, not only Claude Code. The team uses several IDEs.

## Decision drivers

- IDE-agnostic configuration.
- Reproducibility across runs and environments.
- Auditability: every multi-agent change leaves a trail.
- Boring tech: plain markdown + JSON.

## Considered options

1. Tool-specific config only (e.g. `.cursor/rules` or `.claude/`).
2. Universal `.ai/` knowledge base + thin per-tool wrappers.
3. Single mega-prompt in CLAUDE.md.

## Decision outcome

Chosen **option 2**: a universal `.ai/` directory + thin Claude Code wrappers in `.claude/`. Other IDEs (Cursor, Copilot, …) can point at the same `.ai/` files. The Orchestrator reads from `.ai/` first, then any tool-specific overrides.

### Consequences

- ➕ Same rules apply across IDEs.
- ➕ AI changes are PR-reviewable like any other config.
- ➖ Two locations to keep in sync; mitigated by `pnpm ai:validate`.

## Pros and cons of the options

### Option 1 — Tool-specific only

- ➕ Tool features are first-class.
- ➖ Conventions diverge across IDEs.

### Option 2 — Universal `.ai/`

- ➕ Reproducible.
- ➕ Plain markdown.
- ➖ Tool features lag (need a wrapper).

### Option 3 — Single mega-prompt

- ➕ Simple.
- ➖ Unmaintainable beyond a handful of rules.

## Implementation plan

- [x] `.ai/` skeleton (rules, agents, workflows, prompts, context).
- [x] `.claude/agents/` mirrors of every `.ai/agents/` role.
- [x] `.vscode/mcp.json` for VS Code MCP integration.
- [x] `pnpm ai:validate` checks parity.
- [ ] Add prompt eval harness (TD-001).

## References

- `.ai/README.md`
- `docs/ai-workflow/multi-agent-flow.md`
- upstream: <https://angular.dev/ai>
