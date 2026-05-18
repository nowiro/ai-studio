/**
 * Public API for the library data-access lib.
 * @packageDocumentation
 */
export type {
  Book,
  BookGenre,
  BookLanguage,
  Member,
  MemberRole,
  Loan,
  LoanStatus,
  Reservation,
  BookFilters,
  BookSortKey,
} from './models/index.js';
export { BOOK_GENRES, BOOK_LANGUAGES, EMPTY_FILTERS, BOOK_SORT_KEYS } from './models/index.js';
export {
  matchesFilters,
  applyFilters,
  searchRank,
  sortBooks,
  issueLoan,
  daysOverdue,
  fineGrosze,
  canRenew,
  renewLoan,
  returnLoan,
  buildAvailability,
  hasFreeCopy,
  reservationPosition,
  queueForBook,
  LOAN_DAYS,
  MAX_RENEWALS,
  FINE_GROSZE_PER_DAY,
  type BookAvailability,
} from './filters/index.js';
export { AuthService, CatalogueService, LoansService } from './services/index.js';
export { BOOK_CATALOGUE, MEMBERS, LOANS, RESERVATIONS } from './seed/seed.js';
