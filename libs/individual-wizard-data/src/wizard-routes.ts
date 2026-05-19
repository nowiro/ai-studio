/**
 * Wizard route registry — single source of truth for every URL in the
 * individual-wizard app.
 *
 * Two surfaces, paired so renames stay typesafe:
 *
 *   • `WizardPath.*`  — raw `path:` strings, consumed by `Routes[]` in
 *                       `app.routes.ts`. These are router-internal (no leading `/`).
 *   • `WizardNav.*`   — typed `RouterLink` command arrays for use in
 *                       `[routerLink]` / `Router.navigate(...)`. Always prefixed
 *                       with `/` so they navigate absolutely from any context.
 *
 * **Why this lives in `wizard-data` (type:data-access) rather than alongside the
 * components in `wizard-feature`:** the app's `app.routes.ts` lazy-loads
 * `wizard-feature` via `loadComponent`, and Nx forbids mixing static + lazy
 * imports of the same lib. Putting the route registry here lets both the route
 * table and the (lazy-loaded) feature components import it statically.
 *
 * Following the repo convention in `form-helpers.ts → ROOT_PATHS`, we use
 * `as const` objects rather than TypeScript `enum` — better tree-shaking,
 * no runtime overhead, no namespace pollution, and the literal types fall
 * out naturally via `(typeof X)[keyof typeof X]`.
 */

/**
 * Stepper step indices (1-indexed in the URL for user-friendliness; the
 * stepper component clamps + converts to 0-indexed internally).
 */
export type WizardStepIndex = 1 | 2 | 3 | 4 | 5;

/** Route `path:` strings used to configure `Routes[]`. No leading `/`. */
export const WizardPath = {
  Dashboard: '',
  Wizard: 'wizard',
  WizardStep: 'wizard/:step',
  Wildcard: '**',
} as const;
export type WizardPath = (typeof WizardPath)[keyof typeof WizardPath];

/**
 * Navigation helpers — return RouterLink command arrays prefixed with `/`.
 *
 * Use in templates: `[routerLink]="WizardNav.wizardStep(3)"`.
 * Use in components: `this.router.navigate(WizardNav.wizardStep(3))`.
 */
export const WizardNav = {
  /** `/` — dashboard with 5 step tiles. */
  dashboard: (): readonly ['/'] => ['/'] as const,
  /** `/wizard` — stepper at default step (1). */
  wizard: (): readonly ['/wizard'] => ['/wizard'] as const,
  /** `/wizard/:step` — stepper opened on a specific step (1..5). */
  wizardStep: (step: WizardStepIndex): readonly ['/wizard', WizardStepIndex] => ['/wizard', step] as const,
} as const;
