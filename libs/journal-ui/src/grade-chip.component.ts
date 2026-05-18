import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { GradeValue } from '@ai-studio/journal-data';

/** 1–6 Polish grade chip with a colour scale (1 red → 6 emerald). */
@Component({
  selector: 'ais-grade-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class.bg-red-600]="value() === 1"
      [class.bg-orange-500]="value() === 2"
      [class.bg-amber-500]="value() === 3"
      [class.bg-lime-500]="value() === 4"
      [class.bg-emerald-600]="value() === 5"
      [class.bg-emerald-700]="value() === 6"
      [attr.data-testid]="'grade-chip-' + value()"
      class="h-7 px-2 rounded font-semibold text-white text-sm inline-flex min-w-[1.75rem] items-center justify-center"
    >
      {{ value() }}
    </span>
  `,
})
export class GradeChipComponent {
  readonly value = input.required<GradeValue>();
  protected readonly variantClass = computed(() => `grade-chip-${this.value()}`);
}
