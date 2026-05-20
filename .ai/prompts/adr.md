---
id: prompt.adr
title: Write ADR
type: prompt
target_agent: architect
version: 2.0.0
---

# Write ADR prompt

Używaj gdy Orchestrator deleguje design decision do **architect**.

## Inputs

- `{{TOPIC}}` — krótki tytuł (≤ 60 chars).
- `{{CONTEXT}}` — linki do spec, related ADRs, recent commits.
- `{{OPTIONS}}` — przynajmniej 2 considered options, idealnie 3.

## Task

Produkuj `docs/adr/NNNN-<kebab-of-topic>.md` używając **MADR 4.0** (skeleton w `.ai/agents/architect.md#1-adr`).

Reguły:

- Status: `proposed` na first commit; flip do `accepted` dopiero gdy Orchestrator potwierdzi że reviewer + relevant stakeholders signed off.
- Każda option musi wymienić przynajmniej 2 ➕ i 2 ➖. Bądź szczery.
- "Decision outcome" cytuje, który decision driver przeważył.
- "Implementation plan" musi być PR-sized bullets (każdy ≤ 1 PR).

## Numbering

- `NNNN` = next free 4-digit number bazowane na istniejących plikach w `docs/adr/`.
- Nigdy nie reuse numeru, nawet dla superseded ADR.

## End with

Delegation suggestion do Orchestratora:

```yaml
hand_off:
  next: orchestrator
  rationale: ADR ready for review and execution
  follow_up_workflows:
    - new-feature | new-library | refactor
```
