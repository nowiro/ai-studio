import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { attendanceRate, AttendanceService } from '@ai-studio/journal-data';
import { AttendanceChipComponent } from '@ai-studio/journal-ui';

@Component({
  selector: 'ais-attendance-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AttendanceChipComponent],
  template: `
    <section
      class="p-4 max-w-3xl gap-4 mx-auto flex flex-col"
      data-testid="attendance-page"
    >
      <h1 class="m-0 text-2xl font-semibold">Frekwencja</h1>
      <div
        class="gap-3 grid grid-cols-4"
        data-testid="attendance-summary"
      >
        <div class="rounded p-3 bg-surface-container">
          <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Obecności</p>
          <p class="m-0 text-2xl font-semibold">{{ counts().present }}</p>
        </div>
        <div class="rounded p-3 bg-surface-container">
          <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Nieobecności</p>
          <p class="m-0 text-2xl font-semibold">{{ counts().absent }}</p>
        </div>
        <div class="rounded p-3 bg-surface-container">
          <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Spóźnienia</p>
          <p class="m-0 text-2xl font-semibold">{{ counts().late }}</p>
        </div>
        <div class="rounded p-3 bg-surface-container">
          <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">Usprawiedliwione</p>
          <p class="m-0 text-2xl font-semibold">{{ counts().excused }}</p>
        </div>
      </div>
      <div data-testid="attendance-rate">
        Średnia obecność:
        <strong>{{ rateLabel() }}</strong>
      </div>
      <ul class="m-0 p-0 gap-1 flex list-none flex-col">
        @for (mark of attendance.currentMarks(); track mark.id) {
          <li class="gap-2 flex items-center">
            <ais-attendance-chip [status]="mark.status" />
            <span class="text-sm">{{ mark.date }} · lekcja {{ mark.period }}</span>
          </li>
        }
      </ul>
    </section>
  `,
})
export class AttendancePageComponent {
  protected readonly attendance = inject(AttendanceService);
  protected readonly counts = this.attendance.currentCounts;
  protected readonly rateLabel = computed(() => {
    const rate = attendanceRate(this.counts());
    return rate === null ? '—' : `${Math.round(rate * 100)}%`;
  });
}
