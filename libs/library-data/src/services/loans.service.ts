import { computed, inject, Injectable, signal } from '@angular/core';

import { buildAvailability, hasFreeCopy } from '../filters/availability.js';
import { issueLoan, renewLoan, returnLoan } from '../filters/loan-policy.js';
import { reservationPosition } from '../filters/reservation-queue.js';
import type { Loan, Reservation } from '../models/loan.js';
import { LOANS, RESERVATIONS } from '../seed/seed.js';
import { CatalogueService } from './catalogue.service.js';

const TODAY = '2026-05-18';

/** Manages active loans + reservations as signals. Frontend-only state. */
@Injectable({ providedIn: 'root' })
export class LoansService {
  private readonly catalogue = inject(CatalogueService);
  private readonly loansSignal = signal<readonly Loan[]>(LOANS);
  private readonly reservationsSignal = signal<readonly Reservation[]>(RESERVATIONS);

  readonly today = TODAY;
  readonly loans = this.loansSignal.asReadonly();
  readonly reservations = this.reservationsSignal.asReadonly();

  readonly availability = computed(() =>
    buildAvailability(this.catalogue.books(), this.loansSignal(), this.reservationsSignal()),
  );

  /** Books with at least one free copy. Used by the catalogue's `availableOnly` facet. */
  readonly availabilityProbe = computed(() => {
    const snapshot = this.availability();
    return (bookId: string) => hasFreeCopy(bookId, snapshot);
  });

  constructor() {
    // Wire the catalogue's availability probe to our signal so the
    // catalogue's `filtered` view updates when loans change.
    this.catalogue.availabilityProbe.set(this.availabilityProbe());
  }

  activeLoansFor(memberId: string): readonly Loan[] {
    return this.loansSignal().filter((loan) => loan.memberId === memberId && loan.status === 'active');
  }

  loanHistoryFor(memberId: string): readonly Loan[] {
    return this.loansSignal().filter((loan) => loan.memberId === memberId);
  }

  reservationsFor(memberId: string): readonly { readonly reservation: Reservation; readonly position: number }[] {
    return this.reservationsSignal()
      .filter((r) => r.memberId === memberId && r.active)
      .map((reservation) => ({
        reservation,
        position: reservationPosition(reservation.bookId, memberId, this.reservationsSignal()),
      }));
  }

  /** Issue a book to a member. Generates the loan id deterministically. */
  issue(bookId: string, memberId: string): Loan {
    const loan = issueLoan({
      id: `loan-${(this.loansSignal().length + 1).toString().padStart(4, '0')}`,
      bookId,
      memberId,
      today: TODAY,
    });
    this.loansSignal.update((current) => [...current, loan]);
    return loan;
  }

  return(loanId: string): void {
    this.loansSignal.update((current) => current.map((loan) => (loan.id === loanId ? returnLoan(loan, TODAY) : loan)));
  }

  renew(loanId: string): void {
    this.loansSignal.update((current) => current.map((loan) => (loan.id === loanId ? renewLoan(loan, TODAY) : loan)));
  }

  reserve(bookId: string, memberId: string): Reservation {
    const reservation: Reservation = {
      id: `res-${(this.reservationsSignal().length + 1).toString().padStart(4, '0')}`,
      bookId,
      memberId,
      placedAt: TODAY,
      active: true,
    };
    this.reservationsSignal.update((current) => [...current, reservation]);
    return reservation;
  }

  cancelReservation(reservationId: string): void {
    this.reservationsSignal.update((current) =>
      current.map((r) => (r.id === reservationId ? { ...r, active: false } : r)),
    );
  }
}
