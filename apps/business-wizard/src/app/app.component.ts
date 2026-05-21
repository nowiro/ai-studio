/**
 * Root shell for the business-wizard app. Hosts the router outlet (lazy pages
 * from `@ai-studio/business-wizard-feature`) and the global developer panel.
 *
 * The dev panel (`ais-dev-fab`) is mounted here, not inside feature
 * components, for two reasons (mirrors individual-wizard's pattern):
 *
 *   1. **Module boundaries.** `wizard-form-fill` is a `type:util` lib;
 *      `business-wizard-feature` is a `type:feature` lib — Nx allows
 *      feature→util but not feature→feature. Mounting at app level keeps
 *      the dependency app→util.
 *   2. **Single instance.** Mounting once at the root keeps the panel state
 *      (expanded, side, last action) stable across navigations between
 *      dashboard and stepper.
 *
 * The panel reads the shared form from `BusinessWizardFormService` so it
 * acts on the same FormGroup that the routed components edit. Filling
 * behaviour is wizard-aware — see `BusinessFormFillStrategy` provided in
 * `main.ts` via `FORM_FILL_STRATEGY` DI token.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BusinessWizardFormService } from '@ai-studio/business-wizard-data';
import { DevFabComponent } from '@ai-studio/wizard-form-fill';

@Component({
  selector: 'ais-root',
  standalone: true,
  imports: [DevFabComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-screen' },
  template: `
    <router-outlet />
    <ais-dev-fab [rootForm]="rootForm()" />
  `,
})
export class AppComponent {
  private readonly formService = inject(BusinessWizardFormService);

  /** Signal-backed handle; reactively re-emits when the service swaps the form (reset). */
  protected readonly rootForm = this.formService.form;
}
