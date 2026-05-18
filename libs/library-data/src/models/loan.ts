export type LoanStatus = 'active' | 'returned';

export interface Loan {
  readonly id: string;
  readonly bookId: string;
  readonly memberId: string;
  readonly issuedAt: string;
  readonly dueDate: string;
  readonly returnedAt: string | null;
  readonly status: LoanStatus;
  readonly renewals: number;
}

export interface Reservation {
  readonly id: string;
  readonly bookId: string;
  readonly memberId: string;
  readonly placedAt: string;
  readonly active: boolean;
}
