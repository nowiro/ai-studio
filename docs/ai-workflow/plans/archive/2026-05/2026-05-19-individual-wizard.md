---
id: plan.individual-wizard-next
title: individual-wizard — i18n (pl/en) + PDF export pipeline polish
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
  hub: ../../projects/individual-wizard/README.md
  bpmn: ../../bpmn/individual-wizard-submit.bpmn
---

# Plan: individual-wizard — i18n + PDF export polish

## Goal

Make the wizard usable for EN respondents: add i18n via `@angular/localize` (compile-time) with PL + EN bundles, and harden the PDF export step (jsPDF) so labels in EN do not overflow.

## Context

Per audit `individual-wizard` runs at :4203 with PESEL + RODO + frontend PDF export. PL only.

## Scope

| In                                                    | Out                                         |
| ----------------------------------------------------- | ------------------------------------------- |
| `@angular/localize` setup, two locales (pl-PL, en-US) | Server-side rendering of localized variants |
| PDF font handling: Roboto + EN-safe glyph subset      | Document signing (out of scope)             |
| Switcher in toolbar                                   | RTL languages                               |

## Tasks (DAG)

| id   | title                                                      | agent              | outputs                                               | done_when                                  |
| ---- | ---------------------------------------------------------- | ------------------ | ----------------------------------------------------- | ------------------------------------------ |
| T001 | Extract strings — `$localize` calls on all visible strings | frontend-developer | apps/individual-wizard/src/\*_/_.ts/.html             | `pnpm extract-i18n` produces complete xlf  |
| T002 | Translate PL → EN (en-US bundle)                           | doc-writer         | apps/individual-wizard/locale/messages.en-US.xlf      | xlf passes linter                          |
| T003 | Configure two locale builds + lazy-loaded route            | frontend-developer | apps/individual-wizard/angular.json or project.json   | both builds produce dist artefact          |
| T004 | Toolbar locale switcher (signal-driven)                    | frontend-developer | libs/individual-wizard-feature/.../locale-switcher.\* | switching reloads with new locale          |
| T005 | jsPDF: register Roboto font for EN glyph subset            | frontend-developer | libs/individual-wizard-feature/.../pdf-export.ts      | EN PDF renders without missing glyph boxes |
| T006 | E2E: switch to EN, fill, export PDF, assert filename       | test-engineer      | apps/individual-wizard-e2e/src/i18n.spec.ts           | green                                      |
| T007 | Update docs                                                | doc-writer         | docs/projects/individual-wizard/\*.md                 | doc-audit clean                            |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** Translation drift between PL and EN — Mitigation: CI fails if xlf source has new entries not in target.
- **Risk:** PESEL validator copy must stay PL-specific — Mitigation: validation messages always PL when the field semantics are PL-only (NIP, PESEL, REGON).

## Rollback

Locale build is additive. Falling back to PL-only = remove the en-US build target from `project.json`.
