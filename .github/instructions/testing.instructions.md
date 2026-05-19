---
applyTo: '**/*.{spec,test}.ts,**/e2e/**/*.ts,**/playwright.config.*'
description: Vitest + Playwright testing rules
---

# Testing (Copilot scope: spec files, E2E suites, Playwright config)

Full text: [`.ai/rules/testing.md`](../../.ai/rules/testing.md).

## Pyramid

- ~70 % unit (Vitest), ~25 % integration (Vitest), ~5 % E2E (Playwright).
- Coverage gate on touched files: **80 %** statements / **75 %** branches.

## Vitest — Angular 21 native

- Driven by `@angular/build:unit-test` with `runner: "vitest"` in `project.json`.
- **Do not** install `@analogjs/vitest-angular` — the Angular runner handles `TestBed`, signals, zoneless and standalone out of the box.
- One spec file per source file (`foo.ts` ↔ `foo.spec.ts`).
- `provideXxx()` over module imports in `TestBed.configureTestingModule`.
- Mock the network (MSW) and the clock (`vi.useFakeTimers()`); inject real services.
- Snapshot tests are last-resort — only for stable, low-noise outputs.

## Playwright

- Page-object pattern in `apps/<app>-e2e/src/pages/`.
- Selectors: `getByRole(...)` ▶ `getByTestId('kebab-case-id')` ▶ CSS (last resort).
- Network stubs via `page.route()`; assertions on backend contracts via `page.waitForResponse()`.
- Accessibility: `axe-core/playwright` per suite; new `serious`/`critical` violations fail CI.
- Trace + screenshot retained on failure.

## Test design

- Assert **behaviour observable from outside** the unit. Reject "calls method X" tests.
- Tests must be runnable in isolation; never depend on order.
- Names read as sentences: `it('shows the empty state when name is null', …)`.

## Forbidden

- `sleep(n)` / `waitForTimeout` (use auto-waiting locators).
- XPath selectors when `getByRole` / `getByTestId` work.
- Brittle CSS class selectors.
- Snapshots over large DOM trees.
- Tests that cover implementation details (private fields, internal method calls).
