/**
 * Public API for the shared-test-utils library — cross-app testing helpers.
 *
 * This library packages testing-only utilities so we don't redeclare them per
 * lib. Keep imports narrow: don't pull DOM helpers into runtime code.
 *
 * Sub-namespaces:
 *   - `a11y`     — axe-core wrapper + WCAG rule presets for unit/jsdom (see `lib/a11y.ts`)
 *   - `a11y-e2e` — axe-core run against a live Playwright `Page` (see `lib/a11y-e2e.ts`)
 *   - `base-page`— page-object base (console-error + a11y checks) for e2e specs
 *   - future: signal helpers, fakeAsync wrappers, Material harness shorthands
 *
 * @packageDocumentation
 */
export { expectNoA11yViolations, runAxe, WCAG_AA_RULES, WCAG_AAA_RULES } from './lib/a11y.js';
export type { A11yCheckOptions } from './lib/a11y.js';
export { expectNoA11yViolationsOnPage, runAxeOnPage } from './lib/a11y-e2e.js';
export { BaseE2EPage } from './lib/base-page.js';
