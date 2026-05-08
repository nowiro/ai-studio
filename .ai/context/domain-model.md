---
id: context.domain-model
title: Domain model
type: context
version: 1.0.0
---

# Domain model

> Replace this placeholder once the first real feature lands. Keep entities small and aligned with the database / API.

## Bounded contexts

```mermaid
flowchart LR
    A[Studio Workspace] -->|owns| F[Feature library]
    A -->|exposes| AI[AI Workflow]
    AI -->|invokes| MCP[MCP servers]
    F -->|uses| D[Data lib]
    D -->|talks to| API[(Backend API)]
```

## Entities

| Entity   | Owner lib                | Notes                                              |
| -------- | ------------------------ | -------------------------------------------------- |
| Workspace | `libs/data/workspace`    | Top-level container the user works in.             |
| Project   | `libs/data/project`      | Belongs to a workspace.                            |
| Run       | `libs/data/agent-run`    | One execution of the orchestrator's workflow.      |

> Adjust as the schema solidifies. Keep this in lock-step with `docs/architecture/data-model.md`.
