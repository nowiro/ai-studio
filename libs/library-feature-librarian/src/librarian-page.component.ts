import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AllLoansComponent } from './all-loans.component.js';
import { KpiStripComponent } from './kpi-strip.component.js';
import { OverdueListComponent } from './overdue-list.component.js';

@Component({
  selector: 'ais-librarian-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AllLoansComponent, KpiStripComponent, OverdueListComponent],
  template: `
    <section
      class="p-4 max-w-6xl gap-6 mx-auto flex flex-col"
      data-testid="librarian-page"
    >
      <h1 class="m-0 text-2xl font-semibold">Panel bibliotekarza</h1>
      <ais-kpi-strip />
      <ais-overdue-list />
      <ais-all-loans />
    </section>
  `,
})
export class LibrarianPageComponent {}
