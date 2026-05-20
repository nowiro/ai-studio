---
id: prompt.generate-component
title: Generate component
type: prompt
target_agent: frontend-developer
version: 2.0.0
---

# Generate Component prompt

Używaj tego templatu gdy Orchestrator deleguje component creation.

## Variables

- `{{NAME}}` — kebab-case nazwa komponentu (bez sufiksu `-component`).
- `{{LIB}}` — target lib (np. `feature/billing`).
- `{{SELECTOR}}` — `ais-{{NAME}}` domyślnie.
- `{{INPUTS}}` — lista `{ name, type, default }`.
- `{{OUTPUTS}}` — lista `{ name, payload }`.
- `{{BEHAVIOURS}}` — bullets observable behaviours.

## Task do agenta

Jesteś **frontend-developer**. Generuj nowy Angular standalone component `{{NAME}}` w `libs/{{LIB}}`, który zgadza się ze wszystkimi regułami w `.ai/rules/angular.md`.

Kroki, które musisz wykonać, w kolejności:

1. Uruchom przez serwer **angular-cli** MCP:

   ```
   ng generate @nx/angular:component {{NAME}} \
     --project={{LIB}} \
     --change-detection=OnPush \
     --standalone \
     --display-block \
     --style=scss
   ```

2. Edytuj generowany `*.component.ts` żeby:
   - Selector: `{{SELECTOR}}`
   - Inputs (signal API): `{{INPUTS}}`
   - Outputs (signal API): `{{OUTPUTS}}`
   - Injectuj services tylko z `inject()`.
   - Implementuj behaviours: `{{BEHAVIOURS}}`.

3. Edytuj template (`*.component.html`) żeby:
   - Użyć `@if` / `@for` / `@switch`.
   - Dodać `data-testid` do każdego interactive elementu.
   - Użyć `NgOptimizedImage` dla każdego statycznego `<img>`.

4. Re-export z `src/index.ts` lib.

5. Uruchom `pnpm format` na diff i self-lint z `pnpm affected:lint`.

6. Hand off do **test-engineer** z tym blokiem:

   ```yaml
   test_targets:
     - <behaviour 1>
     - <behaviour 2>
   ```

## Acceptance

Output tylko diff — żadnej prozy. Orchestrator zreviewuje.
