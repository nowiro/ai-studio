import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Visual tone for the badge. Maps to a Tailwind colour pair. */
export type BadgeTone = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate';

/**
 * Generic role chip with a colour tone + label. Each app maps its own role
 * union (`'librarian'`, `'teacher'`, …) to `{ tone, label }` and passes them
 * in. Keeps the chip CSS in one place.
 */
@Component({
  selector: 'ais-role-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class.bg-blue-100]="tone() === 'blue'"
      [class.text-blue-800]="tone() === 'blue'"
      [class.bg-violet-100]="tone() === 'violet'"
      [class.text-violet-800]="tone() === 'violet'"
      [class.bg-emerald-100]="tone() === 'emerald'"
      [class.text-emerald-800]="tone() === 'emerald'"
      [class.bg-amber-100]="tone() === 'amber'"
      [class.text-amber-800]="tone() === 'amber'"
      [class.bg-rose-100]="tone() === 'rose'"
      [class.text-rose-800]="tone() === 'rose'"
      [class.bg-slate-100]="tone() === 'slate'"
      [class.text-slate-800]="tone() === 'slate'"
      [attr.data-testid]="testId()"
      class="px-2 py-0.5 rounded font-semibold tracking-wide inline-flex items-center text-[10px] uppercase"
    >
      {{ label() }}
    </span>
  `,
})
export class RoleBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('slate');
  /** Optional `data-testid` override. Defaults to `role-badge-{tone}`. */
  readonly testIdSuffix = input<string | null>(null);

  protected readonly testId = computed(() => `role-badge-${this.testIdSuffix() ?? this.tone()}`);
}
