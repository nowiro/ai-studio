---
id: prompt.adr
title: Write ADR
type: prompt
target_agent: architect
version: 1.0.0
---

# Write ADR prompt

Use when the Orchestrator delegates a design decision to the **architect**.

## Inputs

- `{{TOPIC}}` — short title (≤ 60 chars).
- `{{CONTEXT}}` — links to spec, related ADRs, recent commits.
- `{{OPTIONS}}` — at least 2 considered options, ideally 3.

## Task

Produce `docs/adr/NNNN-<kebab-of-topic>.md` using **MADR 4.0** (skeleton in `.ai/agents/architect.md#1-adr`).

Rules:

- Status: `proposed` on first commit; flip to `accepted` only after Orchestrator confirms reviewer + relevant stakeholders signed off.
- Each option must list at least 2 ➕ and 2 ➖. Be honest.
- "Decision outcome" cites which decision driver tipped the balance.
- "Implementation plan" must be PR-sized bullets (each ≤ 1 PR).

## Numbering

- `NNNN` = next free 4-digit number based on existing files in `docs/adr/`.
- Never reuse a number, even for a superseded ADR.

## End with

A delegation suggestion to the Orchestrator:

```yaml
hand_off:
  next: orchestrator
  rationale: ADR ready for review and execution
  follow_up_workflows:
    - new-feature | new-library | refactor
```
