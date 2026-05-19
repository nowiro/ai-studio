# Testing strategy

> Companion to [`.ai/rules/testing.md`](../../.ai/rules/testing.md). Same rules, but with worked examples and rationale.

## Pyramid

```
         ▲      E2E (Playwright)             — ~5 %
        /•\
       / • \
      /─────\   Integration (Vitest)         — ~25 %
     / • • • \
    /─────────\ Unit (Vitest)                — ~70 %
```

Why a pyramid? Cost scales: a unit test runs in milliseconds; an E2E in seconds. Flake risk inverts the same way.

## Unit & integration — Vitest

- Driven by Angular 21's **native** `@angular/build:unit-test` builder with `runner: "vitest"`. `TestBed`, signals, zoneless and standalone components all work out of the box. **No `@analogjs/vitest-angular` needed** — adopt Analog only if you want it as a meta-framework (file routing, server endpoints).
- One spec file per source file (`foo.ts` ↔ `foo.spec.ts`).
- Provide a fresh `TestBed` per test or use `provideXxx()` helpers.
- Don't mock what you own. Mock the network (MSW) and the clock (`vi.useFakeTimers()`).

```ts
import { TestBed } from '@angular/core/testing';

import { describe, expect, it } from 'vitest';

import { Counter } from './counter';

describe('Counter', () => {
  it('increments by 1', () => {
    const c = TestBed.inject(Counter);
    c.inc();
    expect(c.value()).toBe(1);
  });
});
```

## E2E — Playwright

- Page-object pattern in `apps/<app>-e2e/src/pages/`.
- Selectors: `getByRole` ▶ `getByTestId` ▶ CSS (last resort).
- Network stubbed via `page.route()`.
- Cross-browser matrix: chromium, firefox, webkit (CI). Local dev defaults to chromium.
- Trace + screenshot retained on failure.

## What good tests look like

- Assert behaviour observable from outside the unit (output, DOM, HTTP, signal value).
- One reason to fail per test.
- Independent of order. Independent of clock unless the test owns it.
- Names read as sentences: `it('shows the empty state when name is null', …)`.

## What bad tests look like (auto-rejected in review)

- "calls method X" tests (test implementation, not behaviour).
- Snapshots over large DOM trees.
- `sleep(n)` / `waitForTimeout`.
- Brittle CSS class selectors.
- Tests that depend on each other.

## Coverage

- Vitest collects v8 coverage; threshold 80 % statements / 75 % branches on touched files.
- E2E doesn't count toward unit coverage.
- Coverage reports uploaded as CI artefacts (`coverage/`).

## Performance

| Suite               | Budget            |
| ------------------- | ----------------- |
| Unit per project    | ≤ 30 s            |
| Integration per app | ≤ 1 min           |
| E2E per app (CI)    | ≤ 5 min wallclock |

## Running locally

```bash
pnpm test                # all
pnpm test:watch          # interactive
pnpm test:cov            # with coverage report
pnpm exec nx test <p>    # one project
pnpm exec nx e2e <a>-e2e # one E2E suite
pnpm exec nx e2e <a>-e2e --ui  # Playwright UI
```

## Accessibility

- Run `axe-core/playwright` in every E2E suite.
- New `serious`/`critical` violations fail CI.
- Component-level a11y assertions go in unit tests.
