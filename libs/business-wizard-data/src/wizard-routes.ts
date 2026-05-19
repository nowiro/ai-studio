/**
 * Business-wizard route registry — single source of truth for every URL.
 *
 * Mirrors `wizard-data/src/wizard-routes.ts` but routes resolve to the
 * business components. The two registries are intentionally separate (not
 * merged into one) because each wizard has its own step count and step
 * indices may diverge.
 *
 * @packageDocumentation
 */

/** Stepper step indices (1-indexed). The business wizard has 6 steps. */
export type BusinessWizardStepIndex = 1 | 2 | 3 | 4 | 5 | 6;

/** Route `path:` strings used to configure `Routes[]`. No leading `/`. */
export const BusinessWizardPath = {
  Dashboard: '',
  Wizard: 'wizard',
  WizardStep: 'wizard/:step',
  Wildcard: '**',
} as const;
export type BusinessWizardPath = (typeof BusinessWizardPath)[keyof typeof BusinessWizardPath];

/** Navigation helpers — return RouterLink command arrays prefixed with `/`. */
export const BusinessWizardNav = {
  dashboard: (): readonly ['/'] => ['/'] as const,
  wizard: (): readonly ['/wizard'] => ['/wizard'] as const,
  wizardStep: (step: BusinessWizardStepIndex): readonly ['/wizard', BusinessWizardStepIndex] =>
    ['/wizard', step] as const,
} as const;
