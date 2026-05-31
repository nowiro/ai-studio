/**
 * a11y-e2e.ts — axe-core accessibility assertions for **Playwright e2e** specs.
 *
 * The e2e counterpart to {@link ./a11y.ts} (which runs axe-core against a jsdom
 * ComponentFixture). Here axe-core runs inside the **real browser** against the
 * live, fully-styled DOM — so it catches contrast/layout issues that only exist
 * once Material 3 tokens + Tailwind utilities have actually rendered (exactly the
 * class of runtime bug the 2026-05-29 audit found, see
 * `docs/ai-workflow/plans/2026-05-29-ux-ui-e2e-docs-audit.md` AUDIT-01/02).
 *
 * Why inject `axe.source` ourselves (no `@axe-core/playwright` wrapper):
 *   same rationale as `a11y.ts` — we already depend on `axe-core`, the engine.
 *   `axe.source` is axe-core's own page-injection string; using it avoids a
 *   wrapper dep that can bit-rot against Playwright/axe-core bumps, and keeps one
 *   engine + one rule-preset source for both the unit and e2e layers. No Node
 *   built-ins / `import.meta` so the module loads cleanly under Playwright's
 *   transform.
 *
 * Usage (per `.ai/rules/testing.md §a11y`):
 *
 * ```ts
 * import { expectNoA11yViolationsOnPage } from '@ai-studio/shared-test-utils';
 *
 * test('landing has no a11y violations', async ({ page }) => {
 *   await page.goto('/');
 *   await expectNoA11yViolationsOnPage(page);
 * });
 * ```
 *
 * NOTE: `@playwright/test` value import (`expect`) is fine for e2e; for jsdom unit
 * tests this module is simply never imported (the barrel re-exports it lazily and
 * unit specs import only the `a11y.ts` symbols).
 */
import { expect, type Page } from '@playwright/test';
import axe from 'axe-core';

import { type A11yCheckOptions } from './a11y.js';

/**
 * e2e a11y gate = WCAG 2.1 A/AA conformance (the project baseline). Axe's advisory
 * `best-practice` tag (region, heading-order, landmark structure) is intentionally
 * NOT gated in e2e — those are UX polish tracked separately, not WCAG failures. The
 * unit helper ({@link ./a11y.ts}) keeps best-practice for component-level checks.
 */
const E2E_WCAG_RULES = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

/** Minimal shape of the axe-core result we consume (axe runs in-page). */
interface AxeViolationNode {
  target: string[];
}
interface AxeViolation {
  id: string;
  help: string;
  helpUrl: string;
  impact?: string | null;
  nodes: AxeViolationNode[];
}
interface AxeRunResult {
  violations: AxeViolation[];
}

/**
 * Injects axe-core into the page (idempotent per navigation) and runs it.
 * Prefer {@link expectNoA11yViolationsOnPage} unless you need the raw result.
 */
export async function runAxeOnPage(page: Page, options: A11yCheckOptions = {}): Promise<AxeRunResult> {
  const { rules = E2E_WCAG_RULES, ruleOverrides } = options;
  const alreadyInjected = await page.evaluate(
    () => typeof (window as unknown as { axe?: unknown }).axe !== 'undefined',
  );
  if (!alreadyInjected) await page.addScriptTag({ content: axe.source });

  return page.evaluate(
    async ({ tags, overrides }) => {
      const runOptions: Record<string, unknown> = { runOnly: { type: 'tag', values: tags } };
      if (overrides) runOptions['rules'] = overrides;
      // axe is attached to window by the injected source.
      return (window as unknown as { axe: { run: (ctx: Document, o: unknown) => Promise<AxeRunResult> } }).axe.run(
        document,
        runOptions,
      );
    },
    { tags: [...rules], overrides: ruleOverrides ?? null },
  );
}

/**
 * Asserts the current page has zero axe violations under the WCAG 2.1 AA preset
 * (project baseline). Fails with a formatted rule + selector summary inline.
 */
export async function expectNoA11yViolationsOnPage(page: Page, options: A11yCheckOptions = {}): Promise<void> {
  const { violations } = await runAxeOnPage(page, options);
  const summary = violations
    .map((v) => {
      const nodes = v.nodes.map((n) => `      ${n.target.join(' > ')}`).join('\n');
      return `  [${v.id}] ${v.help} (impact: ${v.impact ?? 'unknown'})\n    ${v.helpUrl}\n${nodes}`;
    })
    .join('\n\n');
  expect(violations, `Found ${violations.length} a11y violation(s):\n\n${summary}\n`).toEqual([]);
}
