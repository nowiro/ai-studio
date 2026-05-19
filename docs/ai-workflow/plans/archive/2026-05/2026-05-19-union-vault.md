---
id: plan.union-vault-next
title: union-vault — purpose definition + docs/projects entry
type: plan
date: 2026-05-19
trigger: 'audit 2026-05-19 — apps/union-vault exists without docs/projects/ entry'
status: done
closedAt: 2026-05-19
closeReason: '2026-05-19 audit — finalized as part of the post-implementation cleanup. Tasks delivered as scaffolds + spec; remaining implementation tracked in per-app/connector/tool docs. Plan retired to archive/.'
owner: orchestrator
agents:
  - analyst
  - frontend-developer
  - doc-writer
links:
  spec: null
  adr: null
  hub: null
---

# Plan: union-vault — purpose definition + docs/projects entry

## Goal

Decide what `apps/union-vault` is for (audit found the app exists at the same parity as the other 13 but has no per-project documentation), author `docs/projects/union-vault/`, and either confirm the current scope or schedule a deprecation if it has been superseded.

## Context

Per audit `apps/union-vault` + `apps/union-vault-e2e` exist. **No** `docs/projects/union-vault/`. **No** referencing plan in `docs/ai-workflow/plans/`. Build target presumably exists (it shows up in `start:all`).

## Scope

| In                                                                 | Out                                |
| ------------------------------------------------------------------ | ---------------------------------- |
| Spec phase: analyst clarifies original intent                      | New features before scope is clear |
| `docs/projects/union-vault/{README,business,technical,testing}.md` | Premature redesign                 |
| Decision: continue / deprecate / fold into another app             | Branding choices                   |

## Tasks (DAG)

| id   | title                                                                                                                              | agent              | outputs                                      | done_when                         |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------- | --------------------------------- |
| T001 | `/specify union-vault` — analyst reads `apps/union-vault/src` + commit history; writes `docs/analytical/specs/union-vault/spec.md` | analyst            | docs/analytical/specs/union-vault/spec.md    | spec exists, no `[?]` markers     |
| T002 | Stakeholder decision: continue / deprecate / fold                                                                                  | analyst            | spec.md decision section                     | one of three options chosen       |
| T003 | (if continue) Author `docs/projects/union-vault/` quartet                                                                          | doc-writer         | docs/projects/union-vault/\*.md              | doc-audit clean                   |
| T004 | (if deprecate) Mark in docs/architecture/tech-debt.md + `start:all` removed                                                        | frontend-developer | docs/architecture/tech-debt.md, package.json | start:all no longer references it |
| T005 | (if fold) ADR + migration steps                                                                                                    | architect          | docs/adr/NNNN-union-vault-fold.md            | ADR Status: accepted              |
| T006 | Update CHANGELOG and README                                                                                                        | doc-writer         | CHANGELOG.md, README.md                      | minor entry                       |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** Removing union-vault breaks a hidden dependency — Mitigation: `nx graph` review before T004.
- **Risk:** Spec drift from actual code — Mitigation: analyst reads code first, then asks questions only on unresolved ambiguity.

## Rollback

Spec-phase is read-only on code. T003/T004/T005 are mutually exclusive; rollback = revert chosen path.
