import type { Routes } from '@angular/router';

import { BusinessWizardPath } from '@ai-studio/business-wizard-data';

/**
 * Top-level routes for the business-wizard app.
 *
 *   `/`              → dashboard (6 tiles)
 *   `/wizard`        → stepper, defaults to step 1
 *   `/wizard/:step`  → stepper opened on the requested 1-indexed step
 *   `**`             → redirect to dashboard
 */
export const APP_ROUTES: Routes = [
  {
    path: BusinessWizardPath.Dashboard,
    pathMatch: 'full',
    loadComponent: async () =>
      import('@ai-studio/business-wizard-feature').then((m) => m.BusinessWizardDashboardComponent),
  },
  {
    path: BusinessWizardPath.Wizard,
    loadComponent: async () => import('@ai-studio/business-wizard-feature').then((m) => m.BusinessWizardShellComponent),
  },
  {
    path: BusinessWizardPath.WizardStep,
    loadComponent: async () => import('@ai-studio/business-wizard-feature').then((m) => m.BusinessWizardShellComponent),
  },
  {
    path: BusinessWizardPath.Wildcard,
    redirectTo: BusinessWizardPath.Dashboard,
  },
];
