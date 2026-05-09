# AI Studio – documentation index

> The single map of every doc in the repo. If you add a doc, link it here.

## Who is this for?

Pick your role; each entry points at the smallest set of docs that gets you productive.

| Role                        | Start here                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New contributor (human)** | [README](../README.md) → [CONTRIBUTING](../CONTRIBUTING.md) → [programming/coding-standards](programming/coding-standards.md)                                                                                                           |
| **Analyst / Product**       | [analytical/business-requirements](analytical/business-requirements.md) → [analytical/personas](analytical/personas.md) → [analytical/use-cases](analytical/use-cases.md) → [adr](adr/)                                                 |
| **Architect / Reviewer**    | [architecture/system](architecture/system.md) → [architecture/trinity](architecture/trinity.md) → [adr](adr/) → [architecture/dependencies](architecture/dependencies.md)                                                               |
| **Developer**               | [programming/coding-standards](programming/coding-standards.md) → [programming/api-guidelines](programming/api-guidelines.md) → [technical/architecture](technical/architecture.md) → [`.ai/rules/angular.md`](../.ai/rules/angular.md) |
| **Tester / QA**             | [programming/testing-strategy](programming/testing-strategy.md) → [analytical/specs](analytical/specs/) → [ai-workflow/multi-agent-flow](ai-workflow/multi-agent-flow.md) (test-engineer + test-scenario-author agents)                 |
| **DevOps / SRE**            | [technical/runbook](technical/runbook.md) → [technical/system-design](technical/system-design.md) → [`SECURITY.md`](../SECURITY.md) → [architecture/post-mortems](architecture/post-mortems/)                                           |
| **Admin / Integrator**      | [README — daily commands](../README.md) → [technical/runbook](technical/runbook.md) → [`SECURITY.md`](../SECURITY.md)                                                                                                                   |
| **Security auditor**        | [`SECURITY.md`](../SECURITY.md) → [`.ai/rules/security.md`](../.ai/rules/security.md) → [adr](adr/) → [architecture/dependencies](architecture/dependencies.md)                                                                         |
| **Claude Code agent**       | [`CLAUDE.md`](../CLAUDE.md) → [`.claude/`](../.claude/) → [`.ai/README.md`](../.ai/README.md)                                                                                                                                           |
| **GitHub Copilot agent**    | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) → [`.github/{instructions,prompts,chatmodes}/`](../.github/) → [`.ai/README.md`](../.ai/README.md)                                                              |

## Sections

### Technical

End-to-end pictures of how the system works.

- [Architecture overview](technical/architecture.md)
- [Tech stack](technical/tech-stack.md)
- [System design](technical/system-design.md)
- [Data model](technical/data-model.md)
- [API contracts](technical/api.md)
- [Operations runbook](technical/runbook.md)

### Analytical

User-facing capabilities and the reasoning behind them.

- [Business requirements](analytical/business-requirements.md)
- [User stories index](analytical/user-stories.md)
- [Use cases](analytical/use-cases.md)
- [Personas](analytical/personas.md)
- [Specs/](analytical/specs/)

### Programming

How developers (human or AI) work in this repo.

- [Coding standards](programming/coding-standards.md)
- [Engineering principles (DRY, SOLID, KISS, YAGNI)](../.ai/rules/principles.md)
- [Testing strategy](programming/testing-strategy.md)
- [Git workflow](programming/git-workflow.md)
- [API guidelines](programming/api-guidelines.md)
- [Performance budget](programming/performance.md)

### AI workflow

How the multi-agent orchestration works (driven by Claude Code AND GitHub Copilot).

- [Multi-agent flow](ai-workflow/multi-agent-flow.md)
- [Orchestration](ai-workflow/orchestration.md)
- [Agents catalog](ai-workflow/agents.md) — 11 specialists incl. Doc Auditor and Test Scenario Author
- [Prompt engineering](ai-workflow/prompt-engineering.md)
- [MCP servers](ai-workflow/mcp-servers.md)
- [Documentation audit workflow](../.ai/workflows/documentation-audit.md) — scan → report → regenerate
- [Run logs](ai-workflow/runs/)

### Architecture

System-level decisions and dependency map.

- [System architecture](architecture/system.md)
- [Dependencies](architecture/dependencies.md)
- [Tech debt register](architecture/tech-debt.md)
- [Post-mortems](architecture/post-mortems/)
- [ADRs](adr/)

## Conventions

- One sentence per source line in markdown — easier diffs.
- File paths in backticks. Code in fenced blocks with language tags.
- Diagrams in **Mermaid** (rendered by GitHub).
- Lifecycle of a doc: drafted → reviewed → kept fresh by the **doc-writer** agent on every public-API change.
