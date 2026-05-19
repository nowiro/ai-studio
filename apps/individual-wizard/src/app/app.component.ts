/**
 * Root shell — hosts the routed pages (dashboard / stepper) and the global
 * developer panel.
 *
 * The dev panel (`ais-dev-fab`) is mounted here, not inside individual feature
 * components, for two reasons:
 *
 *   1. **Module boundaries.** `wizard-dev-tools` is a `type:feature` lib;
 *      `wizard-feature` is also `type:feature` — Nx forbids feature→feature
 *      imports. Mounting at app level keeps the dependency app→feature.
 *   2. **Single instance.** Mounting once at the root keeps the panel state
 *      (expanded, side, last action) stable across navigations between
 *      dashboard and stepper.
 *
 * The panel reads the shared form from `WizardFormService` so it acts on the
 * same FormGroup that the routed components edit.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WizardFormService } from '@ai-studio/individual-wizard-data';
import { DevFabComponent } from '@ai-studio/individual-wizard-dev-tools';

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
  private readonly formService = inject(WizardFormService);

  /** Signal-backed handle; reactively re-emits when the service swaps the form (reset). */
  protected readonly rootForm = this.formService.form;
}
