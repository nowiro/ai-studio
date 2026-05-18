import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import {
  AuthService,
  CatalogueService,
  daysOverdue,
  fineGrosze,
  type Loan,
  LoansService,
} from '@ai-studio/library-data';
import { formatPln } from '@ai-studio/shared-app-shell';

interface OverdueRow {
  readonly loan: Loan;
  readonly title: string;
  readonly memberName: string;
  readonly days: number;
  readonly fineLabel: string;
}

@Component({
  selector: 'ais-overdue-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule],
  template: `
    <section
      class="gap-3 flex flex-col"
      data-testid="overdue-list"
    >
      <h2 class="m-0 text-lg font-semibold">Przeterminowane</h2>
      @if (rows().length === 0) {
        <p
          class="m-0 text-sm text-on-surface-variant"
          data-testid="overdue-list-empty"
        >
          Brak przeterminowanych wypożyczeń.
        </p>
      } @else {
        <table
          [dataSource]="rows()"
          class="w-full"
          mat-table
        >
          <ng-container matColumnDef="title">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Tytuł
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              {{ row.title }}
            </td>
          </ng-container>
          <ng-container matColumnDef="member">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Czytelnik
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              {{ row.memberName }}
            </td>
          </ng-container>
          <ng-container matColumnDef="days">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Dni
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              {{ row.days }}
            </td>
          </ng-container>
          <ng-container matColumnDef="fine">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Kara
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              {{ row.fineLabel }}
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
export class OverdueListComponent {
  private readonly loans = inject(LoansService);
  private readonly catalogue = inject(CatalogueService);
  private readonly auth = inject(AuthService);

  protected readonly cols = ['title', 'member', 'days', 'fine'];

  protected readonly rows = computed<readonly OverdueRow[]>(() => {
    const today = this.loans.today;
    return this.loans
      .loans()
      .filter((loan) => loan.status === 'active' && daysOverdue(loan, today) > 0)
      .map((loan) => {
        const member = this.auth.members().find((m) => m.id === loan.memberId);
        return {
          loan,
          title: this.catalogue.findById(loan.bookId)?.title ?? loan.bookId,
          memberName: member ? `${member.firstName} ${member.lastName}` : loan.memberId,
          days: daysOverdue(loan, today),
          fineLabel: formatPln(fineGrosze(loan, today)),
        };
      });
  });
}
