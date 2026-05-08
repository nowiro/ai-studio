---
id: rules.testing
title: Testing rules — Vitest + Playwright
type: rules
scope: testing
priority: 2
version: 1.0.0
---

# Testing rules

## 1. Pyramid

```
       ▲   E2E (Playwright)        — golden-path user flows, ~5 % of total tests
      / \
     /───\ Integration (Vitest)    — multi-component / service contracts, ~25 %
    /─────\
   /───────\ Unit (Vitest)         — pure logic & single component, ~70 %
```

## 2. Naming

- **Files**: `<subject>.spec.ts` (unit/integration), `<flow>.e2e.ts` (Playwright).
- **Suites**: `describe('<Subject>', () => …)`.
- **Cases**: `it('does X when Y', …)` — third person, no "should".
- **Fixtures**: under `__fixtures__/` next to the test that owns them.

## 3. Vitest (unit / integration)

- **Angular 21 native Vitest support.** The test runner is `@angular/build:unit-test` with `runner: "vitest"` in `project.json`. **Do not** install or import `@analogjs/vitest-angular` — Analog is only needed when you adopt Analog as a meta-framework (file routing, server endpoints).
- `TestBed`, signals, and zoneless components work out of the box via the Angular runner. Tests live next to source as `*.spec.ts`.
- Prefer **`provideXxx()` over module imports** in `TestBed.configureTestingModule`.
- Don't mock what you own. Mock the network (MSW) and the clock (`vi.useFakeTimers()`); inject real services.
- Snapshot tests are last-resort — only for stable, low-noise structures (e.g. ICS export).
- `vi.spyOn(target, 'fn')`, never `vi.fn()` reassignment of object props.
- Coverage gate: 80 % statements / 75 % branches on touched files. CI fails below that.

## 4. Playwright (E2E)

- Use the **page-object** pattern. Every page object lives in `apps/<app>-e2e/src/pages/`.
- Selectors:
  1. `getByRole(...)` (preferred — exercises a11y).
  2. `getByTestId('kebab-case-id')` (use `data-testid`, never CSS classes).
  3. CSS / XPath only as last resort.
- Network: `page.route()` for stubbing; `page.waitForResponse()` for assertions on backend contracts.
- Use the **`Playwright` MCP server** during agent debugging to inspect the DOM live — agents must not invent selectors.
- Trace + screenshot retained on failure (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`).
- Run cross-browser (chromium, firefox, webkit) in CI; chromium-only on local dev.

## 5. AI-generated tests

- Every AI-generated test **must** assert a behaviour, not the implementation. Reject "calls method X" tests.
- Tests must be runnable in isolation. No reliance on test order.
- The `test-engineer` agent generates tests; `code-reviewer` blocks merge if coverage drops or tests are tautological.

## 6. Performance

- E2E suite per app: < 5 minutes wall-clock in CI.
- Unit suite per project: < 30 s.
- Use `nx affected -t test` to keep CI under budget.

## 7. Accessibility

- Run `axe-core/playwright` on every E2E suite. New `serious`/`critical` violations fail CI.
- Component-level a11y assertions go in unit tests with `@testing-library/jest-dom` matchers (via Vitest compat).
