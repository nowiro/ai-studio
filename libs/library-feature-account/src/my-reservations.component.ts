import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AuthService, CatalogueService, LoansService, type Reservation } from '@ai-studio/library-data';

interface ReservationRow {
  readonly reservation: Reservation;
  readonly title: string;
  readonly position: number;
}

@Component({
  selector: 'ais-my-reservations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatTableModule],
  template: `
    <section
      class="gap-3 flex flex-col"
      data-testid="my-reservations"
    >
      <h2 class="m-0 text-lg font-semibold">Moje rezerwacje</h2>
      @if (rows().length === 0) {
        <p
          class="m-0 text-sm text-on-surface-variant"
          data-testid="my-reservations-empty"
        >
          Brak aktywnych rezerwacji.
        </p>
      } @else {
        <table
          [dataSource]="rows()"
          class="w-full"
          mat-table
          data-testid="my-reservations-table"
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
          <ng-container matColumnDef="position">
            <th
              *matHeaderCellDef
              mat-header-cell
            >
              Pozycja
            </th>
            <td
              *matCellDef="let row"
              mat-cell
            >
              {{ row.position }}
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
                [attr.data-testid]="'cancel-' + row.reservation.id"
                (click)="cancel(row.reservation.id)"
                matButton
                type="button"
              >
                Anuluj
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
export class MyReservationsComponent {
  private readonly auth = inject(AuthService);
  private readonly loans = inject(LoansService);
  private readonly catalogue = inject(CatalogueService);

  protected readonly cols = ['title', 'position', 'actions'];

  protected readonly rows = computed<readonly ReservationRow[]>(() => {
    const member = this.auth.currentMember();
    if (!member) {
      return [];
    }
    return this.loans.reservationsFor(member.id).map(({ reservation, position }) => ({
      reservation,
      position,
      title: this.catalogue.findById(reservation.bookId)?.title ?? reservation.bookId,
    }));
  });

  protected cancel(reservationId: string): void {
    this.loans.cancelReservation(reservationId);
  }
}
