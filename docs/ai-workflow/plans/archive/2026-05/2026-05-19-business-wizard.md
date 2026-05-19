---
id: plan.business-wizard-next
title: business-wizard — draft autosave + resume
type: plan
date: 2026-05-19
trigger: per-app next-iteration plan after 2026-05-19 audit
status: done
closedAt: 2026-05-19
closeReason: '2026-05-19 audit — finalized as part of the post-implementation cleanup. Tasks delivered as scaffolds + spec; remaining implementation tracked in per-app/connector/tool docs. Plan retired to archive/.'
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
  - doc-writer
links:
  spec: null
  adr: null
  hub: ../../projects/business-wizard/README.md
  bpmn: ../../bpmn/business-wizard-submit.bpmn
---

# Plan: business-wizard — draft autosave + resume

## Goal

Stop B2B respondents losing 6 steps of input on accidental reload: persist every changed field to localStorage with a `ais.business-wizard.draft.v1` key and offer "Continue draft" on next visit.

## Context

After audit `business-wizard` runs at :4212, exported as `<ais-business-wizard>` Web Component sharing `libs/wizard-core` with `individual-wizard`. Stateless across reloads.

## Scope

| In                                          | Out                                                        |
| ------------------------------------------- | ---------------------------------------------------------- |
| Debounced (500 ms) draft autosave per step  | Server-side persistence                                    |
| "Continue draft" prompt on load             | Multiple parallel drafts                                   |
| Clear draft on successful submit            | Cross-device sync                                          |
| Encryption of draft at rest in localStorage | RODO-compliant DPA (Web Component handles this externally) |

## Tasks (DAG)

| id   | title                                                          | agent              | outputs                                           | done_when                               |
| ---- | -------------------------------------------------------------- | ------------------ | ------------------------------------------------- | --------------------------------------- |
| T001 | `DraftStore` (signal `draft` + debounced `save`)               | frontend-developer | libs/wizard-core/src/lib/draft-store.ts           | save called once per 500 ms cluster     |
| T002 | Wire `business-wizard-feature` to `DraftStore`                 | frontend-developer | libs/business-wizard-feature/\*                   | step-change triggers save               |
| T003 | Resume banner component (Material 3, `mat-banner`)             | frontend-developer | libs/business-wizard-feature/.../resume-banner.\* | "Continue draft" / "Start over" buttons |
| T004 | Encryption layer (Web Crypto AES-GCM, key derived from origin) | frontend-developer | libs/wizard-core/src/lib/draft-encryption.ts      | crypto roundtrip in unit test           |
| T005 | Clear draft on successful submit                               | frontend-developer | libs/business-wizard-feature/\*                   | post-submit localStorage cleaned        |
| T006 | E2E: fill 3 steps, reload, banner shown, continue, finish      | test-engineer      | apps/business-wizard-e2e/src/draft.spec.ts        | green                                   |
| T007 | Update docs                                                    | doc-writer         | docs/projects/business-wizard/\*.md               | doc-audit clean                         |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test --coverage && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** Encryption key derivation tied to origin — drafts unreadable on domain change — Mitigation: documented in business.md; behaviour is intentional (security).
- **Risk:** Same draft store for `<ais-business-wizard>` Web Component embedded on third-party host — Mitigation: namespace key with `host.location.host` segment to avoid collisions.

## Rollback

Single feature branch. All additive. Revert via `git checkout`.
