import type { Loan } from '../models/loan.js';

/** Loan duration in days for a new loan. */
export const LOAN_DAYS = 14;
/** Number of renewals allowed before the librarian must return the book. */
export const MAX_RENEWALS = 1;
/** Daily overdue fine in grosze (PLN minor units). */
export const FINE_GROSZE_PER_DAY = 50;

export interface LoanIssue {
  readonly id: string;
  readonly bookId: string;
  readonly memberId: string;
  readonly today: string;
}

/** Build a fresh `Loan` for an issue request. Pure: no side effects. */
export function issueLoan(input: LoanIssue): Loan {
  const today = new Date(input.today);
  const due = new Date(today.getTime());
  due.setDate(today.getDate() + LOAN_DAYS);
  return {
    id: input.id,
    bookId: input.bookId,
    memberId: input.memberId,
    issuedAt: input.today,
    dueDate: due.toISOString().slice(0, 10),
    returnedAt: null,
    status: 'active',
    renewals: 0,
  };
}

/** Days the loan is overdue as of `today`. Negative = not yet due. */
export function daysOverdue(loan: Loan, today: string): number {
  const due = new Date(loan.dueDate);
  const now = new Date(today);
  const diffMs = now.getTime() - due.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Fine for a loan as of `today`. 0 if not overdue. */
export function fineGrosze(loan: Loan, today: string): number {
  const overdue = daysOverdue(loan, today);
  return overdue > 0 ? overdue * FINE_GROSZE_PER_DAY : 0;
}

/** True when the loan can still be renewed by the reader. */
export function canRenew(loan: Loan): boolean {
  return loan.status === 'active' && loan.renewals < MAX_RENEWALS;
}

/** Renew a loan by `LOAN_DAYS` more days. Returns a new loan record. */
export function renewLoan(loan: Loan, today: string): Loan {
  if (!canRenew(loan)) {
    return loan;
  }
  const baseline = new Date(loan.dueDate);
  const todayDate = new Date(today);
  const start = baseline.getTime() > todayDate.getTime() ? baseline : todayDate;
  const due = new Date(start.getTime());
  due.setDate(start.getDate() + LOAN_DAYS);
  return {
    ...loan,
    dueDate: due.toISOString().slice(0, 10),
    renewals: loan.renewals + 1,
  };
}

/** Mark a loan as returned. */
export function returnLoan(loan: Loan, today: string): Loan {
  if (loan.status === 'returned') {
    return loan;
  }
  return { ...loan, status: 'returned', returnedAt: today };
}
