import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Single chip that summarises free / on-loan / reserved counts. */
@Component({
  selector: 'ais-availability-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class.bg-emerald-100]="state() === 'free'"
      [class.text-emerald-800]="state() === 'free'"
      [class.bg-amber-100]="state() === 'all-loaned'"
      [class.text-amber-800]="state() === 'all-loaned'"
      [class.bg-rose-100]="state() === 'overdue-only'"
      [class.text-rose-800]="state() === 'overdue-only'"
      [attr.data-testid]="'availability-' + state()"
      class="gap-1 px-2 py-1 rounded text-xs font-semibold inline-flex items-center"
    >
      <span class="material-symbols-outlined !text-base">{{ icon() }}</span>
      {{ label() }}
    </span>
  `,
})
export class AvailabilityChipComponent {
  readonly free = input.required<number>();
  readonly total = input.required<number>();

  protected readonly state = computed<'free' | 'all-loaned' | 'overdue-only'>(() => {
    if (this.free() > 0) {
      return 'free';
    }
    return 'all-loaned';
  });

  protected readonly icon = computed(() => (this.free() > 0 ? 'check_circle' : 'schedule'));
  protected readonly label = computed(() => `${this.free()}/${this.total()} dostępne`);
}
