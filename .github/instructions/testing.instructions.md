---
applyTo: '**/*.{spec,test}.ts,**/e2e/**/*.ts,**/playwright.config.*'
description: Vitest + Playwright testing rules
---

# Testing (Copilot scope: spec files, E2E suites, Playwright config)

Pełny tekst: [`.ai/rules/testing.md`](../../.ai/rules/testing.md).

## Piramida

- ~70 % unit (Vitest), ~25 % integration (Vitest), ~5 % E2E (Playwright).
- Coverage gate na touched files: **80 %** statements / **75 %** branches.

## Vitest — Angular 21 native

- Napędzane przez `@angular/build:unit-test` z `runner: "vitest"` w `project.json`.
- **Nie** instaluj `@analogjs/vitest-angular` — Angular runner obsługuje `TestBed`, signals, zoneless i standalone out of the box.
- Jeden spec file per source file (`foo.ts` ↔ `foo.spec.ts`).
- `provideXxx()` zamiast module imports w `TestBed.configureTestingModule`.
- Mockuj sieć (MSW) i zegar (`vi.useFakeTimers()`); injectuj realne services.
- Snapshot tests są last-resort — tylko dla stabilnych, low-noise outputs.

## Playwright

- Page-object pattern w `apps/<app>-e2e/src/pages/`.
- Selektory: `getByRole(...)` ▶ `getByTestId('kebab-case-id')` ▶ CSS (last resort).
- Network stubs przez `page.route()`; assertions na backend contracts przez `page.waitForResponse()`.
- Accessibility: `axe-core/playwright` per suite; nowe `serious`/`critical` violations fail CI.
- Trace + screenshot retained on failure.

## Test design

- Assertuj **behaviour observable from outside** unitu. Odrzucaj testy "calls method X".
- Testy muszą być runnable w izolacji; nigdy nie zależne od order.
- Nazwy czytają się jako zdania: `it('shows the empty state when name is null', …)`.

## Zabronione

- `sleep(n)` / `waitForTimeout` (używaj auto-waiting locators).
- Selektory XPath gdy `getByRole` / `getByTestId` działają.
- Brittle CSS class selectors.
- Snapshots dużych drzew DOM.
- Testy pokrywające implementation details (private fields, internal method calls).
