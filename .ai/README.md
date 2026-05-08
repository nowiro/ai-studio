# `.ai/` — AI Studio Knowledge Base

This directory is the **single source of truth** for every AI agent that touches this repository.
Editor-, IDE- and CLI-agnostic. Files here are committed to git and reviewed like code.

```
.ai/
├── README.md          ← this file
├── mcp.json           ← MCP server registry (context7, playwright, nx, angular-cli)
├── rules/             ← global rules every agent must obey
│   ├── core.md            (cross-cutting principles)
│   ├── principles.md      (DRY, SOLID, KISS, YAGNI — golden engineering rules)
│   ├── angular.md         (Angular v21+ AI rules from angular.dev/ai)
│   ├── styling.md         (Material 3 + Tailwind v4 interop)
│   ├── testing.md         (Vitest via @angular/build:unit-test + Playwright)
│   ├── nx.md              (monorepo boundaries)
│   └── security.md        (OWASP / API key handling)
├── agents/            ← agent role definitions (system prompts)
│   ├── orchestrator.md
│   ├── analyst.md
│   ├── architect.md
│   ├── frontend-developer.md
│   ├── backend-developer.md
│   ├── test-engineer.md
│   ├── test-scenario-author.md
│   ├── code-reviewer.md
│   ├── doc-writer.md
│   ├── doc-auditor.md
│   ├── security-auditor.md
│   └── release-manager.md
├── workflows/         ← multi-agent flows (orchestrator playbooks)
│   ├── new-feature.md
│   ├── bug-fix.md
│   ├── refactor.md
│   ├── new-library.md
│   ├── tech-debt.md
│   ├── documentation-audit.md
│   └── incident-response.md
├── prompts/           ← reusable prompt templates
│   ├── generate-component.md
│   ├── generate-library.md
│   ├── write-spec.md
│   ├── review-pr.md
│   └── adr.md
└── context/           ← long-lived project context for agents
    ├── glossary.md
    ├── personas.md
    ├── domain-model.md
    └── tech-stack.md
```

## Per-tool wrappers

`.ai/` is the universal source. Each AI tool gets a thin wrapper that **points** at `.ai/` instead of duplicating it:

| Tool             | Wrapper location                                                                 |
| ---------------- | -------------------------------------------------------------------------------- |
| Claude Code      | [`CLAUDE.md`](../CLAUDE.md), [`.claude/`](../.claude/) (subagents, slash, hooks) |
| GitHub Copilot   | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md), [`.github/instructions/`](../.github/instructions/), [`.github/prompts/`](../.github/prompts/), [`.github/chatmodes/`](../.github/chatmodes/) |
| Any other agent  | [`AGENTS.md`](../AGENTS.md) (open AGENTS.md convention)                           |
| VS Code MCP      | [`.vscode/mcp.json`](../.vscode/mcp.json)                                         |

`pnpm ai:validate` enforces parity across these locations.

## Pillars

1. **Plain markdown.** Every file is human-readable; no proprietary formats.
2. **Reproducible.** Same `.ai/` → same agent behaviour across IDEs.
3. **Layered.** `rules/` (must), `agents/` (role), `workflows/` (flow), `prompts/` (recipe).
4. **Multi-agent.** A single **Orchestrator** delegates to specialists. See [`agents/orchestrator.md`](agents/orchestrator.md) and [`docs/ai-workflow/multi-agent-flow.md`](../docs/ai-workflow/multi-agent-flow.md).
5. **MCP-first.** External capabilities come through MCP servers declared in [`mcp.json`](mcp.json).

## Loading order (precedence)

When an agent assembles its working context, files are loaded **in this order**, with later files overriding earlier ones:

1. `rules/core.md`
2. `rules/<domain>.md` for the touched stack(s)
3. `agents/<role>.md` (the agent's own system prompt)
4. `workflows/<workflow>.md` (only if invoked via a workflow)
5. `context/*.md` referenced explicitly
6. `prompts/<template>.md` selected for the task
7. User message (highest precedence)

## Editing

- Treat `.ai/` like production code: PR review, CODEOWNERS, semantic commits (`docs(agent): …`).
- Validate with `pnpm ai:validate` before committing — checks frontmatter, broken links, MCP registry.
- Bump the version footer in any file you change so agents can detect drift.

## Privacy & secrets

`.ai/` **never** contains API keys, tokens or PII. Secrets live in `.env.local` (gitignored).
See [`rules/security.md`](rules/security.md).
