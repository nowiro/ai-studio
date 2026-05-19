---
id: context.glossary
title: Glossary
type: context
version: 1.0.0
---

# Glossary

Single source of truth for project terminology. Update via PR; agents cite `[term](#term)` links.

## Project terms

| Term         | Definition                                                                            |
| ------------ | ------------------------------------------------------------------------------------- |
| AI Studio    | This monorepo. Hosts Angular apps + AI agentic workflows.                             |
| Orchestrator | Top-level agent that delegates and gates Done. Lives in `.ai/agents/orchestrator.md`. |
| Specialist   | An agent below the Orchestrator (architect, developer, …).                            |
| MCP server   | Model Context Protocol server providing capabilities to agents.                       |
| Run log      | Per-run summary file under `docs/ai-workflow/runs/`.                                  |
| ADR          | Architecture Decision Record. MADR 4.0 format under `docs/adr/`.                      |
| Spec         | User-facing capability description owned by the Analyst.                              |
| Affected     | The set of projects whose graph reaches the changed files (Nx).                       |
| Lib boundary | The public API of a lib, exposed via its `src/index.ts`.                              |

## Angular / AI terms

| Term              | Definition                                                               |
| ----------------- | ------------------------------------------------------------------------ |
| Standalone        | Component without an `@NgModule`; default in v20+, implicit in v21+.     |
| Signal            | Reactive primitive (`signal()`) replacing many RxJS use-cases.           |
| Computed          | Derived signal (`computed()`).                                           |
| Effect            | `effect()` — reactive side-effect, used sparingly.                       |
| OnPush            | Change detection strategy that only re-renders on input/signal changes.  |
| Genkit            | Google's framework for server-side AI flows.                             |
| Firebase AI Logic | Client-side SDK that proxies model calls; recommended for client AI use. |
| Tool calling      | LLM API where models invoke schema-bound functions instead of free text. |

## Domain terms

> _Replace this section as real domain language emerges._

| Term  | Definition |
| ----- | ---------- |
| _TBD_ | _TBD_      |
