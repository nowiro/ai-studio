import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RosterService, TimetableService, WEEK_DAY_LABELS, WEEK_DAYS, type WeekDay } from '@ai-studio/journal-data';

@Component({
  selector: 'ais-timetable-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="p-4 max-w-5xl mx-auto"
      data-testid="timetable-page"
    >
      <h1 class="m-0 text-2xl font-semibold mb-3">Plan lekcji</h1>
      <div
        class="rounded overflow-x-auto border border-outline-variant"
        data-testid="timetable-grid-wrapper"
      >
        <table
          class="text-sm w-full"
          data-testid="timetable-grid"
        >
          <thead>
            <tr class="bg-surface-container">
              <th class="px-2 py-1 text-left">Lekcja</th>
              @for (day of days; track day) {
                <th class="px-2 py-1 text-center">{{ dayLabel(day) }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of grid(); track $index; let i = $index) {
              <tr class="border-t border-outline-variant">
                <td class="px-2 py-1 font-semibold">{{ i + 1 }}</td>
                @for (cell of row; track $index) {
                  <td class="px-2 py-1 text-center">
                    @if (cell) {
                      <div class="flex flex-col items-center">
                        <span class="text-xs font-semibold">{{ subjectLabel(cell.subjectId) }}</span>
                        <span class="text-[10px] text-on-surface-variant">sala {{ cell.room }}</span>
                      </div>
                    } @else {
                      <span class="text-on-surface-variant">—</span>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class TimetablePageComponent {
  private readonly timetable = inject(TimetableService);
  private readonly roster = inject(RosterService);

  protected readonly grid = this.timetable.currentGrid;
  protected readonly days = WEEK_DAYS;

  protected dayLabel(day: WeekDay): string {
    return WEEK_DAY_LABELS[day];
  }

  protected subjectLabel(subjectId: string): string {
    return this.roster.findSubject(subjectId)?.label ?? subjectId;
  }
}
