/**
 * Root shell for the business-wizard app. Hosts the router outlet — every
 * routed page (dashboard, stepper) is loaded lazily from
 * `@ai-studio/business-wizard-feature`.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ais-root',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-screen' },
  template: `
    <router-outlet />
  `,
})
export class AppComponent {}
