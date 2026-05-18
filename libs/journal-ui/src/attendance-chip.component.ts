import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ATTENDANCE_LABELS, type AttendanceStatus } from '@ai-studio/journal-data';

@Component({
  selector: 'ais-attendance-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class.bg-emerald-100]="status() === 'present'"
      [class.text-emerald-800]="status() === 'present'"
      [class.bg-rose-100]="status() === 'absent'"
      [class.text-rose-800]="status() === 'absent'"
      [class.bg-amber-100]="status() === 'late'"
      [class.text-amber-800]="status() === 'late'"
      [class.bg-sky-100]="status() === 'excused'"
      [class.text-sky-800]="status() === 'excused'"
      [attr.data-testid]="'attendance-chip-' + status()"
      class="px-2 py-0.5 rounded text-xs font-semibold inline-flex items-center"
    >
      {{ label() }}
    </span>
  `,
})
export class AttendanceChipComponent {
  readonly status = input.required<AttendanceStatus>();
  protected readonly label = computed(() => ATTENDANCE_LABELS[this.status()]);
}
