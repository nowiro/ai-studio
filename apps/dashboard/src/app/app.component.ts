import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DashboardPageComponent } from '@ai-studio/dashboard-feature';

@Component({
  selector: 'ais-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardPageComponent],
  template: `
    <ais-dashboard-page />
  `,
})
export class AppComponent {}
