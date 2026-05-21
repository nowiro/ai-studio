/**
 * Public API for the shared-test-utils library — cross-app testing helpers.
 *
 * This library packages testing-only utilities so we don't redeclare them per
 * lib. Keep imports narrow: don't pull DOM helpers into runtime code.
 *
 * Sub-namespaces:
 *   - `a11y`   — vitest-axe wrapper + WCAG rule presets (see `lib/a11y.ts`)
 *   - future: signal helpers, fakeAsync wrappers, Material harness shorthands
 *
 * @packageDocumentation
 */
export { expectNoA11yViolations, runAxe, WCAG_AA_RULES, WCAG_AAA_RULES } from './lib/a11y.js';
export type { A11yCheckOptions } from './lib/a11y.js';
