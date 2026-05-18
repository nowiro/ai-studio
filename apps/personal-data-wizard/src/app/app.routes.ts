import type { Routes } from '@angular/router';

import { WizardPath } from '@ai-studio/wizard-data';

/**
 * Top-level routes for the personal-data-wizard demo.
 *
 *   `/`              → dashboard (5 tiles, deep-link entry points)
 *   `/wizard`        → stepper, defaults to step 1
 *   `/wizard/:step`  → stepper opened on the requested 1-indexed step
 *   `**`             → redirect to dashboard
 *
 * Path strings come from `WizardPath` (single source of truth defined in
 * `@ai-studio/wizard-feature`). Components consume the same module's
 * `WizardNav.*` helpers for `[routerLink]` / `router.navigate` — see
 * `.ai/rules/angular.md` §5 "Routing: no magic strings".
 *
 * `withComponentInputBinding()` (enabled in main.ts) delivers `:step` straight into
 * `WizardShellComponent.step` as an input signal — no manual `ActivatedRoute` plumbing.
 */
export const APP_ROUTES: Routes = [
  {
    path: WizardPath.Dashboard,
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/wizard-feature').then((m) => m.WizardDashboardComponent),
  },
  {
    path: WizardPath.Wizard,
    loadComponent: async () => import('@ai-studio/wizard-feature').then((m) => m.WizardShellComponent),
  },
  {
    path: WizardPath.WizardStep,
    loadComponent: async () => import('@ai-studio/wizard-feature').then((m) => m.WizardShellComponent),
  },
  {
    path: WizardPath.Wildcard,
    redirectTo: WizardPath.Dashboard,
  },
];
