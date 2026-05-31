/**
 * vitest-axe demo (best-practices plan T003 — literal deliverable).
 *
 * The project's canonical unit a11y helper is `expectNoA11yViolations` (axe-core
 * directly, see `a11y.ts`). This spec additionally demonstrates the `vitest-axe`
 * matcher `toHaveNoViolations`. NOTE: vitest-axe@0.1.0 predates Vitest's current
 * matcher API — its `extend-expect` entry doesn't register, so we wire the matcher
 * manually via `expect.extend(matchers)` (jest-style, supported by Vitest 4).
 */
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers as never);

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
}

describe('vitest-axe matcher (demo)', () => {
  it('reports no violations for accessible markup', async () => {
    document.body.innerHTML = '<main><h1>Accessible</h1><button type="button" aria-label="Go">Go</button></main>';
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
