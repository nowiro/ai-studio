import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { EuLabelGrade } from '@ai-studio/tire-data';

/** A–E grade badge in the EU label colour scale (A = green, E = red). */
@Component({
  selector: 'ais-eu-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class.bg-emerald-600]="grade() === 'A'"
      [class.bg-lime-500]="grade() === 'B'"
      [class.bg-yellow-500]="grade() === 'C'"
      [class.bg-orange-500]="grade() === 'D'"
      [class.bg-red-600]="grade() === 'E'"
      [attr.aria-label]="ariaLabel()"
      [attr.data-testid]="'eu-label-' + grade().toLowerCase()"
      class="h-7 px-2 rounded font-semibold text-white text-sm inline-flex min-w-[1.75rem] items-center justify-center shadow-sm"
    >
      {{ grade() }}
    </span>
  `,
})
export class EuLabelComponent {
  readonly grade = input.required<EuLabelGrade>();
  readonly axis = input<'fuel' | 'wet' | 'overall'>('overall');

  protected readonly ariaLabel = computed(() => `EU label ${this.axis()} grade ${this.grade()}`);
}
