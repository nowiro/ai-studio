---
id: prompt.generate-component
title: Generate component
type: prompt
target_agent: frontend-developer
version: 1.0.0
---

# Generate Component prompt

Use this template when the Orchestrator delegates a component creation.

## Variables

- `{{NAME}}` — kebab-case component name (no `-component` suffix).
- `{{LIB}}` — target lib (e.g. `feature/billing`).
- `{{SELECTOR}}` — `ais-{{NAME}}` by default.
- `{{INPUTS}}` — list `{ name, type, default }`.
- `{{OUTPUTS}}` — list `{ name, payload }`.
- `{{BEHAVIOURS}}` — bullets of observable behaviours.

## Task to the agent

You are the **frontend-developer**. Generate a new Angular standalone component `{{NAME}}` in `libs/{{LIB}}` that conforms to all rules in `.ai/rules/angular.md`.

Steps you must take, in order:

1. Run via the **angular-cli** MCP server:

   ```
   ng generate @nx/angular:component {{NAME}} \
     --project={{LIB}} \
     --change-detection=OnPush \
     --standalone \
     --display-block \
     --style=scss
   ```

2. Edit the generated `*.component.ts` to:
   - Selector: `{{SELECTOR}}`
   - Inputs (signal API): `{{INPUTS}}`
   - Outputs (signal API): `{{OUTPUTS}}`
   - Inject services with `inject()` only.
   - Implement behaviours: `{{BEHAVIOURS}}`.

3. Edit the template (`*.component.html`) to:
   - Use `@if` / `@for` / `@switch`.
   - Add `data-testid` to every interactive element.
   - Use `NgOptimizedImage` for any static `<img>`.

4. Re-export from the lib's `src/index.ts`.

5. Run `pnpm format` on the diff and self-lint with `pnpm affected:lint`.

6. Hand off to **test-engineer** with this block:

   ```yaml
   test_targets:
     - <behaviour 1>
     - <behaviour 2>
   ```

## Acceptance

Output the diff only — no prose. The Orchestrator will review.
