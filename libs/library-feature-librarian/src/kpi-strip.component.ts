import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { daysOverdue, LoansService } from '@ai-studio/library-data';

@Component({
  selector: 'ais-kpi-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="gap-3 grid grid-cols-3"
      data-testid="kpi-strip"
    >
      <div class="rounded p-3 bg-surface-container">
        <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Aktywne wypożyczenia</p>
        <p class="m-0 text-2xl font-semibold">{{ activeCount() }}</p>
      </div>
      <div class="rounded p-3 bg-surface-container">
        <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Przeterminowane</p>
        <p class="m-0 text-2xl font-semibold">{{ overdueCount() }}</p>
      </div>
      <div class="rounded p-3 bg-surface-container">
        <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Aktywne rezerwacje</p>
        <p class="m-0 text-2xl font-semibold">{{ reservationsCount() }}</p>
      </div>
    </div>
  `,
})
export class KpiStripComponent {
  private readonly loans = inject(LoansService);

  protected readonly activeCount = computed(() => this.loans.loans().filter((loan) => loan.status === 'active').length);
  protected readonly overdueCount = computed(
    () =>
      this.loans.loans().filter((loan) => loan.status === 'active' && daysOverdue(loan, this.loans.today) > 0).length,
  );
  protected readonly reservationsCount = computed(() => this.loans.reservations().filter((r) => r.active).length);
}
