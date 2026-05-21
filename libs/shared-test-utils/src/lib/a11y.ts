/**
 * a11y.ts — axe-core wrapper for component / DOM accessibility assertions.
 *
 * Complements the static `pnpm a11y:check` scanner (regex over templates,
 * see `tools/scripts/a11y-check.mjs`) with **runtime** axe-core checks against
 * rendered ComponentFixture nativeElement. Catches issues regex misses:
 *   - contrast ratios (computed colors)
 *   - label-input associations (DOM relationships)
 *   - aria-roles consistency in dynamic templates
 *
 * Why axe-core directly (not `vitest-axe`):
 *   `vitest-axe@0.1.0` is unmaintained (last release 2022, vitest 0.16 era).
 *   axe-core is the underlying engine — calling it directly avoids the wrapper
 *   bit-rot and gives us full control over rule presets without an extra dep.
 *
 * Pattern (per `.ai/rules/testing.md §a11y`):
 *
 * ```ts
 * import { expectNoA11yViolations } from '@ai-studio/shared-test-utils';
 *
 * it('button has no accessibility violations', async () => {
 *   const fixture = TestBed.createComponent(MyButtonComponent);
 *   fixture.detectChanges();
 *   await expectNoA11yViolations(fixture.nativeElement);
 * });
 * ```
 *
 * The rule presets `WCAG_AA_RULES` / `WCAG_AAA_RULES` are passed as
 * `runOnly: { type: 'tag', values: WCAG_AA_RULES }` per axe-core config.
 * See <https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter>.
 *
 * @see .claude/skills/accessibility-a11y/SKILL.md
 * @see tools/scripts/a11y-check.mjs (static counterpart)
 */
import axe, { type AxeResults, type ElementContext, type RunOptions } from 'axe-core';

/** WCAG 2.1 Level AA tags — default project baseline. */
export const WCAG_AA_RULES = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] as const;

/** WCAG 2.1 Level AAA tags — opt-in for high-stakes views (e.g. legal/medical). */
export const WCAG_AAA_RULES = [
  'wcag2a',
  'wcag2aa',
  'wcag2aaa',
  'wcag21a',
  'wcag21aa',
  'wcag21aaa',
  'best-practice',
] as const;

export interface A11yCheckOptions {
  /** Override default WCAG AA tag list. */
  rules?: readonly string[];
  /** Per-rule overrides (e.g. `{ 'color-contrast': { enabled: false } }`). */
  ruleOverrides?: RunOptions['rules'];
}

/**
 * Runs axe-core against `target` and returns the full result for assertions.
 * Prefer {@link expectNoA11yViolations} unless you need granular result access.
 */
export async function runAxe(target: ElementContext, options: A11yCheckOptions = {}): Promise<AxeResults> {
  const { rules = WCAG_AA_RULES, ruleOverrides } = options;
  const runOptions: RunOptions = {
    runOnly: { type: 'tag', values: [...rules] },
    ...(ruleOverrides ? { rules: ruleOverrides } : {}),
  };
  return axe.run(target, runOptions);
}

/**
 * Asserts that `target` has zero a11y violations under the given rule preset.
 * Default preset is WCAG 2.1 AA (project baseline per `.ai/rules/styling.md §8`).
 *
 * Throws an Error with formatted violation summary on failure so vitest output
 * shows the offending rule + node selector inline.
 */
export async function expectNoA11yViolations(target: ElementContext, options: A11yCheckOptions = {}): Promise<void> {
  const results = await runAxe(target, options);
  if (results.violations.length === 0) return;

  const summary = results.violations
    .map((v) => {
      const nodes = v.nodes.map((n) => `      ${n.target.join(' > ')}`).join('\n');
      return `  [${v.id}] ${v.help} (impact: ${v.impact ?? 'unknown'})\n    ${v.helpUrl}\n${nodes}`;
    })
    .join('\n\n');

  throw new Error(
    `Found ${results.violations.length} a11y violation(s):\n\n${summary}\n\n` +
      `See https://dequeuniversity.com/rules/axe/ for rule details.`,
  );
}
