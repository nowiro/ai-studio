# Tech debt register

> Active debt entries. Each entry must be measurable and link to a tech-debt issue. Resolution moves entries to the "Resolved" section with PR links.

## Active

| Id     | Area    | Cost today                     | Cheapest fix               | Status   |
| ------ | ------- | ------------------------------ | -------------------------- | -------- |
| TD-001 | tooling | No automated prompt eval suite | Add `pnpm ai:eval` harness | proposed |

## Resolved

_(none yet)_

## Adding an entry

1. Open a `tech_debt.yml` issue. The Orchestrator routes via `.ai/workflows/tech-debt.md`.
2. The Architect (or Orchestrator if trivial) creates the row above.
3. Each PR addressing the debt links the `TD-` id.
