# Architecture overview

> A bird's-eye picture of AI Studio. For decision rationale, see [ADRs](../adr/).

## TL;DR

- Nx monorepo with one or more Angular apps under `apps/`.
- Strict library taxonomy in `libs/` (`feature`, `ui`, `data`, `util`, `shared`).
- AI multi-agent layer (`.ai/` + `.claude/`) coordinates non-trivial changes.
- MCP servers (`context7`, `playwright`, `nx`, `angular-cli`) extend agents with live capabilities.
- CI runs `lint`, `typecheck`, `test`, `e2e`, `build` on **affected** projects.

## High-level diagram

```mermaid
flowchart TB
    subgraph Repo
      Apps["apps/*"] --> Feat["libs/feature/*"]
      Feat --> UI["libs/ui/*"]
      Feat --> Data["libs/data/*"]
      UI --> Util["libs/util/*"]
      Data --> Util
    end

    subgraph AI
      Orch[Orchestrator]
      Specs[Specialists]
      Orch --> Specs
    end

    subgraph MCP
      C7[context7]
      PW[playwright]
      NX[nx]
      AC[angular-cli]
    end

    AI <-- read/write --> Repo
    AI -- queries --> MCP
    Repo -. lint/test/build .-> CI[GitHub Actions]
```

## Library taxonomy

| Layer            | Allowed dependencies    | Examples                          |
| ---------------- | ----------------------- | --------------------------------- |
| `apps/*`         | feature, ui, data, util | `apps/studio`                     |
| `libs/feature/*` | ui, data, util          | `libs/feature/billing`            |
| `libs/ui/*`      | ui, util                | `libs/ui/button`, `libs/ui/forms` |
| `libs/data/*`    | data, util              | `libs/data/billing`               |
| `libs/util/*`    | util only               | `libs/util/logger`                |
| `libs/shared/*`  | util                    | `libs/shared/theme`               |

Boundary enforcement: `@nx/enforce-module-boundaries` (see `eslint.config.mjs`).

## Runtime composition

```mermaid
sequenceDiagram
    User->>App: navigate /billing
    App->>Feature(billing): lazy import
    Feature(billing)->>Data(billing): list invoices
    Data(billing)->>Backend API: GET /api/invoices
    Backend API-->>Data(billing): JSON
    Data(billing)-->>Feature(billing): typed Invoice[]
    Feature(billing)-->>App: rendered route
```

## AI layer

```mermaid
flowchart LR
    User -->|/new-feature ask| Orchestrator
    Orchestrator --> Analyst
    Orchestrator --> Architect
    Orchestrator --> Frontend
    Orchestrator --> Backend
    Orchestrator --> TestEng
    Orchestrator --> Reviewer
    Orchestrator --> SecAud
    Orchestrator --> DocW
    Frontend & Backend -. uses .-> MCP_AngularCLI
    TestEng -. uses .-> MCP_Playwright
    Orchestrator -. uses .-> MCP_NX
    Architect & Frontend & Backend & Reviewer -. fetches docs .-> MCP_Context7
```

See [`docs/ai-workflow/multi-agent-flow.md`](../ai-workflow/multi-agent-flow.md) for the protocol.

## CI pipeline

| Workflow        | Trigger            | Jobs                                               |
| --------------- | ------------------ | -------------------------------------------------- |
| `ci.yml`        | push, PR           | validate-ai, lint, typecheck, test, build          |
| `e2e.yml`       | push, PR, dispatch | Playwright on chromium, firefox, webkit            |
| `pr-checks.yml` | PR opened/edited   | Conventional commits, PR title, docs-on-API-change |
| `release.yml`   | manual dispatch    | `nx release` (dry-run by default)                  |

## Performance budget

- App initial JS: **< 200 kB gzipped**.
- E2E suite per app in CI: **< 5 min** wall-clock.
- Vitest suite per project: **< 30 s**.

## Where to next

- Pick a workflow in [.ai/workflows/](../../.ai/workflows/) for a concrete recipe.
- See [system design](system-design.md) for component-level diagrams.
