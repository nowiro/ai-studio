import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AuthService, canRenew, CatalogueService, fineGrosze, type Loan, LoansService } from '@ai-studio/library-data';
import { DueDateBadgeComponent } from '@ai-studio/library-ui';
import { formatPln } from '@ai-studio/shared-app-shell';

interface LoanRow {
  readonly loan: Loan;
  readonly title: string;
  readonly canRenew: boolean;
  readonly fineGrosze: number;
}

@Component({
  selector: 'ais-my-loans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DueDateBadgeComponent, MatButtonModule, MatTableModule],
  template: `
    <section
      class="gap-3 flex flex-col"
      data-testid="my-loans"
    >
      <h2 class="m-0 text-lg font-semibold">Moje wypożyczenia</h2>
      @if (rows().length === 0) {
        <p
          class="m-0 text-sm text-on-surface-variant"
          data-testid="my-loans-empty"
        >
          Brak aktywnych wypożyczeń.
        </p>
      } @else {
        <table
          [dataSource]="rows()"
          class="w-full"
          mat-table
          data-testid="my-loans-table"
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
              <ais-due-date-badge
                [loan]="row.loan"
                [today]="today"
              />
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
              {{ formatFine(row.fineGrosze) }}
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
              <button
                [disabled]="!row.canRenew"
                [attr.data-testid]="'renew-' + row.loan.id"
                (click)="renew(row.loan.id)"
                matButton
                type="button"
              >
                Przedłuż
              </button>
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
export class MyLoansComponent {
  private readonly auth = inject(AuthService);
  private readonly loansService = inject(LoansService);
  private readonly catalogue = inject(CatalogueService);

  protected readonly cols = ['title', 'due', 'fine', 'actions'];
  protected readonly today = this.loansService.today;

  protected readonly rows = computed<readonly LoanRow[]>(() => {
    const member = this.auth.currentMember();
    if (!member) {
      return [];
    }
    return this.loansService.activeLoansFor(member.id).map((loan) => ({
      loan,
      title: this.catalogue.findById(loan.bookId)?.title ?? loan.bookId,
      canRenew: canRenew(loan),
      fineGrosze: fineGrosze(loan, this.today),
    }));
  });

  protected formatFine(grosze: number): string {
    return grosze === 0 ? '—' : formatPln(grosze);
  }

  protected renew(loanId: string): void {
    this.loansService.renew(loanId);
  }
}
