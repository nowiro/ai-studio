import { describe, expect, it } from 'vitest';

import type { Loan } from '../models/loan.js';
import {
  canRenew,
  daysOverdue,
  FINE_GROSZE_PER_DAY,
  fineGrosze,
  issueLoan,
  LOAN_DAYS,
  MAX_RENEWALS,
  renewLoan,
  returnLoan,
} from './loan-policy.js';

function freshLoan(overrides: Partial<Loan> = {}): Loan {
  return {
    id: 'loan-001',
    bookId: 'book-001',
    memberId: 'member-001',
    issuedAt: '2026-05-01',
    dueDate: '2026-05-15',
    returnedAt: null,
    status: 'active',
    renewals: 0,
    ...overrides,
  };
}

describe('issueLoan', () => {
  it('sets due date 14 days from today', () => {
    const loan = issueLoan({ id: 'l1', bookId: 'b1', memberId: 'm1', today: '2026-05-01' });
    expect(loan.dueDate).toBe('2026-05-15');
    expect(loan.status).toBe('active');
    expect(loan.renewals).toBe(0);
    expect(loan.returnedAt).toBeNull();
  });

  it('exposes the configured loan duration', () => {
    expect(LOAN_DAYS).toBe(14);
  });
});

describe('daysOverdue', () => {
  it('returns negative when before due date', () => {
    expect(daysOverdue(freshLoan({ dueDate: '2026-05-20' }), '2026-05-15')).toBeLessThan(0);
  });
  it('returns positive when overdue', () => {
    expect(daysOverdue(freshLoan({ dueDate: '2026-05-10' }), '2026-05-15')).toBe(5);
  });
  it('returns 0 on the due date', () => {
    expect(daysOverdue(freshLoan({ dueDate: '2026-05-15' }), '2026-05-15')).toBe(0);
  });
});

describe('fineGrosze', () => {
  it('returns 0 when not overdue', () => {
    expect(fineGrosze(freshLoan({ dueDate: '2026-05-20' }), '2026-05-15')).toBe(0);
  });
  it('charges per-day overdue rate', () => {
    expect(fineGrosze(freshLoan({ dueDate: '2026-05-10' }), '2026-05-15')).toBe(5 * FINE_GROSZE_PER_DAY);
  });
});

describe('renewLoan', () => {
  it('refuses to renew a returned loan', () => {
    const returned = freshLoan({ status: 'returned' });
    expect(renewLoan(returned, '2026-05-15')).toBe(returned);
  });

  it('refuses to renew when renewals exhausted', () => {
    const loan = freshLoan({ renewals: MAX_RENEWALS });
    expect(canRenew(loan)).toBe(false);
    expect(renewLoan(loan, '2026-05-15')).toBe(loan);
  });

  it('pushes the due date forward and increments the renewal counter', () => {
    const loan = freshLoan({ dueDate: '2026-05-15' });
    const renewed = renewLoan(loan, '2026-05-10');
    expect(renewed.dueDate).toBe('2026-05-29');
    expect(renewed.renewals).toBe(1);
  });

  it('starts the new due date from today when the original is past', () => {
    const loan = freshLoan({ dueDate: '2026-05-10' });
    const renewed = renewLoan(loan, '2026-05-15');
    expect(renewed.dueDate).toBe('2026-05-29');
  });
});

describe('returnLoan', () => {
  it('marks the loan as returned with returnedAt', () => {
    const loan = freshLoan();
    const returned = returnLoan(loan, '2026-05-12');
    expect(returned.status).toBe('returned');
    expect(returned.returnedAt).toBe('2026-05-12');
  });

  it('is idempotent if the loan is already returned', () => {
    const already = freshLoan({ status: 'returned', returnedAt: '2026-05-10' });
    expect(returnLoan(already, '2026-05-12')).toBe(already);
  });
});
