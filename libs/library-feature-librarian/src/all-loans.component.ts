import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AuthService, CatalogueService, daysOverdue, type Loan, LoansService } from '@ai-studio/library-data';

interface LoanRow {
  readonly loan: Loan;
  readonly title: string;
  readonly memberName: string;
  readonly statusLabel: string;
}

@Component({
  selector: 'ais-all-loans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatTableModule],
  template: `
    <section
      class="gap-3 flex flex-col"
      data-testid="all-loans"
    >
      <h2 class="m-0 text-lg font-semibold">Wszystkie wypożyczenia</h2>
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
        <ng-container matColumnDef="due">
          <th
            *matHeaderCellDef
            mat-header-cell
          >
            Termin
          </th>
          <td
            *matCellDef="let row"
            mat-cell
          >
            {{ row.loan.dueDate }}
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th
            *matHeaderCellDef
            mat-header-cell
          >
            Status
          </th>
          <td
            *matCellDef="let row"
            mat-cell
          >
            {{ row.statusLabel }}
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th
            *matHeaderCellDef
            mat-header-cell
          >
            Akcje
          </th>
          <td
            *matCellDef="let row"
            mat-cell
          >
            @if (row.loan.status === 'active') {
              <button
                [attr.data-testid]="'return-' + row.loan.id"
                (click)="markReturned(row.loan.id)"
                matButton
                type="button"
              >
                Zwrot
              </button>
            }
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
    </section>
  `,
})
export class AllLoansComponent {
  private readonly loansService = inject(LoansService);
  private readonly catalogue = inject(CatalogueService);
  private readonly auth = inject(AuthService);

  protected readonly cols = ['title', 'member', 'due', 'status', 'actions'];

  protected readonly rows = computed<readonly LoanRow[]>(() =>
    this.loansService.loans().map((loan) => {
      const member = this.auth.members().find((m) => m.id === loan.memberId);
      return {
        loan,
        title: this.catalogue.findById(loan.bookId)?.title ?? loan.bookId,
        memberName: member ? `${member.firstName} ${member.lastName}` : loan.memberId,
        statusLabel: this.statusLabel(loan),
      };
    }),
  );

  protected markReturned(loanId: string): void {
    this.loansService.return(loanId);
  }

  private statusLabel(loan: Loan): string {
    if (loan.status === 'returned') {
      return 'Zwrócone';
    }
    return daysOverdue(loan, this.loansService.today) > 0 ? 'Przeterminowane' : 'Aktywne';
  }
}
