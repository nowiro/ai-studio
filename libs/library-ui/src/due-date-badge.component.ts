import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { daysOverdue, type Loan } from '@ai-studio/library-data';

/** Coloured badge: green/amber/red depending on days-until-due. */
@Component({
  selector: 'ais-due-date-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class.bg-emerald-100]="state() === 'ok'"
      [class.text-emerald-800]="state() === 'ok'"
      [class.bg-amber-100]="state() === 'soon'"
      [class.text-amber-800]="state() === 'soon'"
      [class.bg-rose-100]="state() === 'overdue'"
      [class.text-rose-800]="state() === 'overdue'"
      [attr.data-testid]="'due-date-' + state()"
      class="gap-1 px-2 py-1 rounded text-xs font-semibold inline-flex items-center"
    >
      <span class="material-symbols-outlined !text-base">{{ icon() }}</span>
      {{ label() }}
    </span>
  `,
})
export class DueDateBadgeComponent {
  readonly loan = input.required<Loan>();
  readonly today = input.required<string>();

  protected readonly diff = computed(() => daysOverdue(this.loan(), this.today()));

  protected readonly state = computed<'ok' | 'soon' | 'overdue'>(() => {
    if (this.diff() > 0) {
      return 'overdue';
    }
    if (this.diff() > -3) {
      return 'soon';
    }
    return 'ok';
  });

  protected readonly icon = computed(() => {
    switch (this.state()) {
      case 'overdue':
        return 'warning';
      case 'soon':
        return 'schedule';
      default:
        return 'check_circle';
    }
  });

  protected readonly label = computed(() => {
    const overdue = this.diff();
    if (overdue > 0) {
      return `Po terminie (${overdue} d)`;
    }
    if (overdue === 0) {
      return 'Dziś termin zwrotu';
    }
    return `Za ${-overdue} dni`;
  });
}
