# MCP servers

> Live capabilities the agents call out to. Configured in three places and kept in sync via `pnpm ai:validate`.

| Where       | File                    | Used by                 |
| ----------- | ----------------------- | ----------------------- |
| Universal   | `.ai/mcp.json`          | source of truth         |
| Claude Code | `.claude/settings.json` | `mcpServers`            |
| VS Code     | `.vscode/mcp.json`      | VS Code MCP integration |

## Catalog

### `context7`

> Live documentation for libraries (Angular, Nx, RxJS, Vitest, Playwright, …).

- **When**: any time an agent is about to generate code that touches an API not already imported in the repo.
- **Discovery order**: 1st (always check docs before guessing).
- **Forbidden alternatives**: relying on memory, links to outdated tutorials.

### `playwright`

> Headless browser automation.

- **When**: E2E debugging, accessibility audits, visual checks.
- **Used by**: Test Engineer, Frontend Developer (during reproduction).
- **Forbidden alternatives**: hand-built screenshot scripts.

### `nx`

> Nx workspace introspection: project graph, generators, executors, affected.

- **When**: every Orchestrator task that crosses lib boundaries; every scaffolding step.
- **Used by**: Orchestrator (always), Architect (planning), developer agents (scaffolding).
- **Forbidden alternatives**: hand-editing `project.json`.

### `angular-cli`

> Angular CLI: `ng generate`, `ng add`, schematic catalog, AI hints from angular.dev/ai.

- **When**: scaffolding components, services, directives, pipes, libs.
- **Used by**: Frontend Developer, Architect.
- **Forbidden alternatives**: copy-pasting boilerplate.

## Discovery order policy

When multiple MCP calls could answer a question, prefer in this order:

1. `context7` — confirm the API is current.
2. `nx` — confirm the project graph is in the expected shape.
3. `angular-cli` — only when scaffolding.
4. `playwright` — only for browser-driven verification.

## Failure handling

If an MCP server is unavailable:

- The agent **must** declare the gap in its response.
- The agent **must not** proceed with a guess that the MCP would have verified.
- If the gap blocks progress, return a `blocked:` block to the Orchestrator.

## Adding a new MCP server

1. Add an entry to `.ai/mcp.json`.
2. Mirror it in `.claude/settings.json` and `.vscode/mcp.json`.
3. Document it here (catalog + when to use).
4. Update relevant agent role files if the new capability changes their tool use.
5. Run `pnpm ai:validate`.
