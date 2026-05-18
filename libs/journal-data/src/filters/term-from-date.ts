import type { Term, TermId } from '../models/index.js';

/**
 * Return the term whose `[startDate, endDate]` range contains `today`, or
 * `null` if today is outside all ranges.
 */
export function termFromDate(terms: readonly Term[], today: string): Term | null {
  for (const term of terms) {
    if (today >= term.startDate && today <= term.endDate) {
      return term;
    }
  }
  return null;
}

/** True iff `today` falls inside the given term. */
export function isInTerm(term: Term, today: string): boolean {
  return today >= term.startDate && today <= term.endDate;
}

/** Format a term id for display ("Trymestr 1", "Trymestr 2"...). */
export function termLabel(termId: TermId): string {
  switch (termId) {
    case 'T1':
      return 'Trymestr 1';
    case 'T2':
      return 'Trymestr 2';
    case 'T3':
      return 'Trymestr 3';
  }
}
