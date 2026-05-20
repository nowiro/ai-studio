---
id: context.glossary
title: Glossary
type: context
version: 2.0.0
---

# Glossary

Single source of truth dla project terminology. Update przez PR; agenci cytują linki `[term](#term)`.

## Terminy projektu

| Term         | Definition                                                                            |
| ------------ | ------------------------------------------------------------------------------------- |
| AI Studio    | To monorepo. Hostuje Angular apps + AI agentic workflows.                             |
| Orchestrator | Top-level agent, który deleguje i bramkuje Done. Żyje w `.ai/agents/orchestrator.md`. |
| Specialist   | Agent poniżej Orchestratora (architect, developer, …).                                |
| MCP server   | Model Context Protocol server dostarczający capabilities agentom.                     |
| Run log      | Per-run summary file pod `docs/ai-workflow/runs/`.                                    |
| ADR          | Architecture Decision Record. Format MADR 4.0 pod `docs/adr/`.                        |
| Spec         | User-facing capability description ownerowany przez Analyst.                          |
| Affected     | Set projektów, których graph dosięga zmienionych plików (Nx).                         |
| Lib boundary | Public API liba, wystawiane przez `src/index.ts`.                                     |

## Terminy Angular / AI

| Term              | Definition                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| Standalone        | Komponent bez `@NgModule`; default w v20+, implicit w v21+.             |
| Signal            | Reactive primitive (`signal()`) zastępujący wiele use-case'ów RxJS.     |
| Computed          | Derived signal (`computed()`).                                          |
| Effect            | `effect()` — reactive side-effect, używany oszczędnie.                  |
| OnPush            | Change detection strategy renderująca tylko na zmianach input/signal.   |
| Genkit            | Framework Google dla server-side AI flows.                              |
| Firebase AI Logic | Client-side SDK proxujący model calls; rekomendowany dla client AI use. |
| Tool calling      | LLM API, gdzie modele inwokują schema-bound funkcje zamiast free text.  |

## Terminy domenowe

> _Wymień tę sekcję gdy realny domain language się ujawni._

| Term  | Definition |
| ----- | ---------- |
| _TBD_ | _TBD_      |
