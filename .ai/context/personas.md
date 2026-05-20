---
id: context.personas
title: Personas
type: context
version: 2.0.0
---

# Personas

Persony, które Analyst MUSI cytować po id. Dodawaj nowe przez PR.

## P-001 — Engineering Lead

- **Cel**: shipuj reliable Angular features szybko, utrzymuj code quality, zarządzaj tech debt.
- **Ból**: PR zablokowane na niejasnych konwencjach; AI narzędzia ignorujące project standards.
- **Tooling**: VS Code + JetBrains; ceni keyboard-first workflows.
- **Czyta**: ADRs, run logs.

## P-002 — Frontend Engineer

- **Cel**: implementuj komponenty bez ponownego wyprowadzania konwencji.
- **Ból**: stale docs; AI sugerujący forbidden APIs jak `*ngIf` / `@HostBinding` (deprecated od Angular 17 — nigdy nie używać).
- **Tooling**: VS Code + Angular Language Service.
- **Czyta**: `.ai/rules/angular.md`, agent prompts.

## P-003 — QA / Test Engineer

- **Cel**: pewność żeby shipnąć. Stabilny cross-browser E2E suite.
- **Ból**: flaky selectors, slow CI, brittle snapshots.
- **Tooling**: Playwright UI mode, Vitest UI.
- **Czyta**: `.ai/rules/testing.md`, page-objects.

## P-004 — Product Analyst

- **Cel**: zamień mgliste prośby stakeholderów w shippable specs.
- **Ból**: re-doing intake gdy devs nie zgadzają się na scope.
- **Tooling**: Notion / Linear (mirrorowane do `docs/analytical/specs/`).
- **Czyta**: specs, glossary.

## P-005 — Tech Writer / Doc Owner

- **Cel**: docs, które pozostają dokładne gdy kod się zmienia.
- **Ból**: docs po cichu odpływające; broken links.
- **Tooling**: VS Code + markdownlint.
- **Czyta**: `docs/`, szczególnie `docs/technical/`.

## P-006 — Security Engineer

- **Cel**: żadnych zleakowanych sekretów, żadnych unsafe AI surfaces.
- **Ból**: model-generated code obchodzący sanityzację; nowe deps z CVEs.
- **Tooling**: dependency audit dashboards.
- **Czyta**: `.ai/rules/security.md`, audit logs.

## Extending

Gdy produkt zyska realnych użytkowników, wymień te placeholdery na realne persony (interview-derived). Trzymaj id stabilnie.
