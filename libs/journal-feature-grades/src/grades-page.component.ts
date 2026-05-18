import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { formatAverage, type Grade, GradesService, RosterService, SessionService } from '@ai-studio/journal-data';
import { GradeChipComponent } from '@ai-studio/journal-ui';

interface SubjectRow {
  readonly subjectId: string;
  readonly label: string;
  readonly grades: readonly Grade[];
  readonly averageLabel: string;
}

@Component({
  selector: 'ais-grades-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradeChipComponent, MatTableModule],
  template: `
    <section
      class="p-4 max-w-5xl mx-auto"
      data-testid="grades-page"
    >
      <h1 class="m-0 text-2xl font-semibold mb-3">Oceny ({{ termLabel() }})</h1>
      @if (rows().length === 0) {
        <p
          class="m-0 text-on-surface-variant"
          data-testid="grades-empty"
        >
          Brak ocen w wybranym trymestrze.
        </p>
      } @else {
        <table
          [dataSource]="rows()"
          class="w-full"
          mat-table
          data-testid="grades-table"
        >
          <ng-container matColumnDef="subject">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Przedmiot
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              {{ row.label }}
            </td>
          </ng-container>
          <ng-container matColumnDef="grades">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Oceny
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              <div class="gap-1 flex flex-wrap">
                @for (g of row.grades; track g.id) {
                  <ais-grade-chip [value]="g.value" />
                }
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="average">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Średnia
            </th>
            <td
              *matCellDef="let row"
              [attr.data-testid]="'grades-avg-' + row.subjectId"
              mat-cell
            >
              {{ row.averageLabel }}
            </td>
          </ng-container>
          <tr
            *matHeaderRowDef="cols"
            mat-header-row
          ></tr>
          <tr
            *matRowDef="let row; columns: cols"
            mat-row
          ></tr>
        </table>
      }
    </section>
  `,
})
export class GradesPageComponent {
  private readonly session = inject(SessionService);
  private readonly grades = inject(GradesService);
  private readonly roster = inject(RosterService);

  protected readonly cols = ['subject', 'grades', 'average'];
  protected readonly termLabel = computed(() => {
    switch (this.session.currentTerm()) {
      case 'T1':
        return 'Trymestr 1';
      case 'T2':
        return 'Trymestr 2';
      case 'T3':
        return 'Trymestr 3';
    }
  });

  protected readonly rows = computed<readonly SubjectRow[]>(() => {
    const studentGrades = this.grades.currentStudentGrades();
    const averages = this.grades.currentStudentAverages();
    const subjects = this.roster.subjects();
    const out: SubjectRow[] = [];
    for (const subject of subjects) {
      const subjectGrades = studentGrades.filter((g) => g.subjectId === subject.id);
      if (subjectGrades.length === 0) {
        continue;
      }
      out.push({
        subjectId: subject.id,
        label: subject.label,
        grades: subjectGrades,
        averageLabel: formatAverage(averages.get(subject.id) ?? null),
      });
    }
    return out;
  });
}
