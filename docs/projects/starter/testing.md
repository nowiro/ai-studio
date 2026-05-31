---
id: docs.starter.testing
title: Starter — testing view
type: project
status: done
date: 2026-05-29
links:
  hub: README.md
  e2e: ../../../apps/starter-e2e
---

# Starter — testing view

## E2E (Playwright)

[`apps/starter-e2e/src/home.e2e.spec.ts`](../../../apps/starter-e2e/src/home.e2e.spec.ts)
— smoke that doubles as a **fresh-clone canary**: if the starter bootstrap or the
token pipeline breaks, this fails first.

| AC   | Scenario                                | Asserts                                                                        |
| ---- | --------------------------------------- | ------------------------------------------------------------------------------ |
| AC-1 | App boots and renders the showcase      | `h1 "Starter"`, `color-token-grid`, `typography-list`, `tailwind-grid` visible |
| AC-2 | Representative token + type rows render | `token-card-primary`, `typography-row-display-large` visible                   |
| AC-3 | No client-side errors                   | zero `console.error` during load                                               |

> The "no console errors" assertion is the cheapest workspace-health signal we
> have — a broken DI graph, missing asset, or theme regression surfaces here.

## Run

```bash
pnpm nx e2e starter-e2e          # http://localhost:4221, chromium
```

Config: [`apps/starter-e2e/playwright.config.ts`](../../../apps/starter-e2e/playwright.config.ts)
— plain `defineConfig` (no `nxE2EPreset`), `testDir: ./src`, `reuseExistingServer`.
Spec files use the `*.e2e.spec.ts` suffix so Playwright's default `testMatch` picks
them up.

## Suggested next coverage

- `prefers-color-scheme: dark` snapshot of the token grid (currently light-pinned).
- axe-core pass on the showcase (wire `expectNoA11yViolations` from
  `libs/shared-test-utils`).
