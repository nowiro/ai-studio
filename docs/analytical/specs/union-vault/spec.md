---
id: spec.union-vault
title: union-vault — scope clarification spec
type: spec
status: draft
date: 2026-05-19
audience: [product, analyst, architect]
trigger: '2026-05-19 audit — apps/union-vault exists in workspace but lacks docs/projects/ entry and acceptance criteria'
links:
  plan: ../../ai-workflow/plans/2026-05-19-union-vault.md
  hub: ../../projects/union-vault/README.md
---

# Spec — union-vault scope clarification

> This spec answers the question "what is `apps/union-vault` for, and should the workspace keep it." It is intentionally a **clarification spec**, not a feature spec: the deliverable is an accepted decision, not new functionality.

## Problem statement

The 2026-05-19 audit found `apps/union-vault` + `apps/union-vault-e2e` shipped at the same parity as the demo apps (Angular 21 standalone, i18n, multiple pages) but no `docs/projects/union-vault/` page, no plan history, and no entry in stakeholder roadmaps. Three outcomes are on the table — continue, deprecate, or fold into another app — and the decision unblocks the documentation contract for every demo.

## Observed state (read-only)

| Aspect         | Finding                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------- |
| App tree       | `apps/union-vault/src/app/{components,data,i18n,pages}` — full Angular 21 standalone layout |
| E2E project    | `apps/union-vault-e2e/src/example.spec.ts` — placeholder spec only                          |
| Libraries      | No `libs/union-vault-*` discovered — the app is not yet decomposed                          |
| Build target   | Included in `pnpm start:all` (assumed; confirm in spec acceptance)                          |
| Recent commits | None tied directly to `apps/union-vault` since the 2026-05-19 audit branch                  |

## Personas affected

| ID    | Role               | Why they care                                                      |
| ----- | ------------------ | ------------------------------------------------------------------ |
| P-OWN | Repo owner         | Decides whether to invest further or remove                        |
| P-DEV | Frontend developer | If continued: needs scope to plan libraries / state                |
| P-PM  | PM / sales         | If continued: needs persona + demo script for stakeholder showings |

## Open questions (analyst to resolve)

- **Q1:** Why was `apps/union-vault` created originally? (Search commit history for `union-vault` keyword; cite original PR if found.)
- **Q2:** Does `union-vault` correspond to a real domain (credit union, vault custody, treasury management)?
- **Q3:** If continued, does it integrate with `apps/portal` MFE host?
- **Q4:** What is the headline single-screen user journey?
- **Q5:** If folded, into which existing demo? (Most plausible candidate: `business-wizard` if it is a B2B onboarding flow.)
- **Q6:** If deprecated, what happens to the i18n bundles in `src/app/i18n/`?

## Decision (to be filled by analyst + repo owner)

```yaml
decision:
  outcome: continue | deprecate | fold
  rationale: <one paragraph>
  agreedBy: <names>
  agreedOn: <ISO date>
```

## Acceptance criteria

| ID   | Given                                    | When                                            | Then                                                                                  |
| ---- | ---------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| AC-1 | analyst has read `apps/union-vault/src/` | spec is filled                                  | every Q1..Q6 has a non-`[?]` answer                                                   |
| AC-2 | analyst has interviewed repo owner       | decision section is filled                      | one of `continue`, `deprecate`, `fold` is chosen with rationale                       |
| AC-3 | decision is `continue`                   | analyst writes a follow-up feature spec         | `docs/analytical/specs/<YYYY-MM-DD>-union-vault-<feature>/spec.md` exists             |
| AC-4 | decision is `deprecate`                  | architect issues ADR + removes from `start:all` | new ADR `Status: accepted`; `package.json` `start:all` no longer mentions union-vault |
| AC-5 | decision is `fold`                       | architect issues ADR + migration steps          | ADR `Status: accepted`; migration tasks land in a new plan                            |

## Non-goals

- Implementing new features on `union-vault` while the decision is open.
- Refactoring the existing `apps/union-vault/` code.
- Redesigning the i18n bundles.

## Success metrics

| Metric                              | Target                                     |
| ----------------------------------- | ------------------------------------------ |
| Decision accepted (yes/no)          | yes                                        |
| `docs/projects/union-vault/` status | matches decision (continue/deprecate/fold) |
| `start:all` consistency             | only mentions apps that the decision keeps |
