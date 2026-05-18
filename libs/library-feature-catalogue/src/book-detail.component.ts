import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import { AuthService, CatalogueService, LoansService, reservationPosition } from '@ai-studio/library-data';
import { AvailabilityChipComponent, BookCoverComponent } from '@ai-studio/library-ui';

@Component({
  selector: 'ais-book-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvailabilityChipComponent, BookCoverComponent, MatButtonModule, MatChipsModule, RouterLink],
  template: `
    @let book = currentBook();
    @if (book) {
      <article
        class="p-4 gap-6 md:grid-cols-[16rem_1fr] max-w-4xl mx-auto grid"
        data-testid="book-detail"
      >
        <ais-book-cover
          [src]="book.coverUrl"
          [alt]="book.title"
          [width]="240"
          [height]="360"
        />
        <div class="gap-3 flex flex-col">
          <a
            [routerLink]="['/']"
            class="text-sm text-on-surface-variant hover:underline"
          >
            ← Wróć do katalogu
          </a>
          <h1 class="m-0 text-2xl font-semibold">{{ book.title }}</h1>
          <p class="m-0 text-on-surface-variant">{{ book.author }} · {{ book.publishedYear }}</p>
          <div class="gap-2 flex flex-wrap items-center">
            <ais-availability-chip
              [free]="availability().free"
              [total]="availability().total"
            />
            <mat-chip>{{ book.language.toUpperCase() }}</mat-chip>
            <mat-chip>{{ book.genre }}</mat-chip>
            <span class="text-xs text-on-surface-variant">ISBN {{ book.isbn }}</span>
          </div>
          <p class="m-0 mt-2">{{ book.blurb }}</p>

          <div
            class="mt-2 gap-3 flex flex-wrap items-center"
            data-testid="book-actions"
          >
            @if (currentMember(); as member) {
              @if (availability().free > 0) {
                <button
                  (click)="borrow(book.id, member.id)"
                  matButton="filled"
                  type="button"
                  data-testid="book-borrow"
                >
                  Wypożycz
                </button>
              } @else {
                <button
                  [disabled]="alreadyReserved()"
                  (click)="reserve(book.id, member.id)"
                  matButton
                  type="button"
                  data-testid="book-reserve"
                >
                  Zarezerwuj
                </button>
                @if (reservationPos() > 0) {
                  <span
                    class="text-sm text-on-surface-variant"
                    data-testid="book-reservation-position"
                  >
                    Twoja pozycja w kolejce: {{ reservationPos() }}
                  </span>
                }
              }
            } @else {
              <span
                class="text-sm text-on-surface-variant"
                data-testid="book-needs-login"
              >
                Zaloguj się, aby wypożyczyć tę książkę.
              </span>
            }
          </div>
        </div>
      </article>
    } @else {
      <div
        class="p-6 text-center text-on-surface-variant"
        data-testid="book-detail-missing"
      >
        Nie znaleziono książki o identyfikatorze {{ id() }}.
      </div>
    }
  `,
})
export class BookDetailComponent {
  readonly id = input.required<string>();

  private readonly catalogue = inject(CatalogueService);
  private readonly loans = inject(LoansService);
  private readonly auth = inject(AuthService);

  protected readonly currentMember = this.auth.currentMember;
  protected readonly currentBook = computed(() => this.catalogue.findById(this.id()));
  protected readonly availability = computed(() => {
    const map = this.loans.availability();
    return map.get(this.id()) ?? { total: 0, onLoan: 0, reserved: 0, free: 0 };
  });
  protected readonly reservationPos = computed(() => {
    const member = this.auth.currentMember();
    if (!member) {
      return 0;
    }
    return reservationPosition(this.id(), member.id, this.loans.reservations());
  });
  protected readonly alreadyReserved = computed(() => this.reservationPos() > 0);

  protected borrow(bookId: string, memberId: string): void {
    this.loans.issue(bookId, memberId);
  }

  protected reserve(bookId: string, memberId: string): void {
    this.loans.reserve(bookId, memberId);
  }
}
