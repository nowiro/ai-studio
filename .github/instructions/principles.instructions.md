---
applyTo: '**'
description: Engineering principles — DRY, SOLID, KISS, YAGNI, composition over inheritance
---

# Engineering principles (Copilot scope: every file)

Full text: [`.ai/rules/principles.md`](../../.ai/rules/principles.md).

## The short list

| Principle                         | Apply when                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **DRY**                           | Same _knowledge_ duplicated in ≥ 3 places. (Lookalike code that changes for different reasons is **not** duplication.) |
| **KISS**                          | The simplest solution that meets today's spec wins.                                                                    |
| **YAGNI**                         | Don't build for hypothetical future needs. Add capability when the second real use case lands.                         |
| **SRP**                           | One class / component / function = one reason to change.                                                               |
| **OCP**                           | Extend via injection / strategy, not by editing growing switch statements.                                             |
| **LSP**                           | A subtype must work everywhere the supertype works.                                                                    |
| **ISP**                           | Many narrow interfaces beat one wide one.                                                                              |
| **DIP**                           | Depend on abstractions where substitution is actually useful (TestBed, adapters).                                      |
| **Composition over inheritance**  | Default. Inherit only when "is-a" truly holds.                                                                         |
| **High cohesion, low coupling**   | Things that change together live together.                                                                             |
| **Boy Scout rule**                | Small opportunistic improvements **scoped to the task** — never drive-by refactors.                                    |
| **Least Astonishment**            | A function does what its name says, no more, no less.                                                                  |
| **Fail fast**                     | Validate at the boundary (Zod). Don't silently coerce missing input.                                                   |
| **Convention over configuration** | Pick once, document, enforce via lint.                                                                                 |

When two principles conflict, **clarity wins**.

## Citing in reviews

When you flag a violation, cite the principle id (`DRY`, `SRP`, `KISS`, …) — not vague "this seems wrong".

## What this is NOT

- A checklist for every PR.
- Permission to refactor unrelated code.
- A substitute for stack-specific rules ([`angular.md`](../../.ai/rules/angular.md), [`styling.md`](../../.ai/rules/styling.md), …).
