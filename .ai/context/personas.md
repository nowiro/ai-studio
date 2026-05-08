---
id: context.personas
title: Personas
type: context
version: 1.0.0
---

# Personas

Personas the Analyst MUST cite by id. Add new ones via PR.

## P-001 — Engineering Lead

- **Goal**: ship reliable Angular features fast, retain code quality, manage tech debt.
- **Pain**: PRs blocked on unclear conventions; AI tools that ignore project standards.
- **Tooling**: VS Code + JetBrains; values keyboard-first workflows.
- **Reads**: ADRs, run logs.

## P-002 — Frontend Engineer

- **Goal**: implement components without re-deriving conventions.
- **Pain**: stale docs; AI suggesting forbidden APIs like `*ngIf` / `@HostBinding` (deprecated since Angular 17 — never use).
- **Tooling**: VS Code + Angular Language Service.
- **Reads**: `.ai/rules/angular.md`, agent prompts.

## P-003 — QA / Test Engineer

- **Goal**: confidence to ship. Stable cross-browser E2E suite.
- **Pain**: flaky selectors, slow CI, brittle snapshots.
- **Tooling**: Playwright UI mode, Vitest UI.
- **Reads**: `.ai/rules/testing.md`, page-objects.

## P-004 — Product Analyst

- **Goal**: turn vague stakeholder asks into shippable specs.
- **Pain**: re-doing intake when devs disagree on scope.
- **Tooling**: Notion / Linear (mirrored to `docs/analytical/specs/`).
- **Reads**: specs, glossary.

## P-005 — Tech Writer / Doc Owner

- **Goal**: docs that stay accurate as code changes.
- **Pain**: docs drifting silently; broken links.
- **Tooling**: VS Code + markdownlint.
- **Reads**: `docs/`, especially `docs/technical/`.

## P-006 — Security Engineer

- **Goal**: no leaked secrets, no unsafe AI surfaces.
- **Pain**: model-generated code that bypasses sanitisation; new deps with CVEs.
- **Tooling**: dependency audit dashboards.
- **Reads**: `.ai/rules/security.md`, audit logs.

## Extending

When the product gains real users, replace these placeholders with real personas (interview-derived). Keep the id stable.
