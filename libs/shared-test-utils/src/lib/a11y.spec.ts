/**
 * a11y.spec.ts — smoke tests for axe-core wrapper.
 *
 * Validates that:
 *   1. `expectNoA11yViolations()` passes on accessible markup
 *   2. `expectNoA11yViolations()` throws on inaccessible markup (img without alt)
 *   3. `WCAG_AA_RULES` preset is the project default
 *
 * Real-world usage examples live in `libs/shop-ui/**.spec.ts` (component a11y).
 */
import { describe, expect, it } from 'vitest';

import { expectNoA11yViolations, runAxe, WCAG_AA_RULES, WCAG_AAA_RULES } from './a11y.js';

describe('a11y helpers', () => {
  it('passes on accessible button markup', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<button type="button" aria-label="Save changes">Save</button>';
    document.body.appendChild(el);
    try {
      await expectNoA11yViolations(el);
    } finally {
      el.remove();
    }
  });

  it('detects missing alt on <img> (WCAG 1.1.1)', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="x.png">'; // intentionally missing alt
    document.body.appendChild(el);
    try {
      const results = await runAxe(el);
      const violationIds = results.violations.map((v) => v.id);
      expect(violationIds).toContain('image-alt');
    } finally {
      el.remove();
    }
  });

  it('throws on inaccessible markup with detailed summary', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="x.png">';
    document.body.appendChild(el);
    try {
      await expect(expectNoA11yViolations(el)).rejects.toThrow(/image-alt/);
    } finally {
      el.remove();
    }
  });

  it('exposes WCAG AA + AAA rule presets', () => {
    expect(WCAG_AA_RULES).toContain('wcag2aa');
    expect(WCAG_AA_RULES).toContain('wcag21aa');
    expect(WCAG_AAA_RULES).toContain('wcag2aaa');
  });
});
