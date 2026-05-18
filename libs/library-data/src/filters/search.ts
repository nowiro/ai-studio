import type { Book } from '../models/book.js';
import type { BookFilters } from '../models/filters.js';

/** Decide whether a book matches all active facets + free-text query. */
export function matchesFilters(book: Book, filters: BookFilters, isAvailable: (bookId: string) => boolean): boolean {
  return (
    matchesSet(filters.genres, book.genre) &&
    matchesSet(filters.languages, book.language) &&
    matchesYear(filters.minYear, filters.maxYear, book.publishedYear) &&
    matchesAvailable(filters.availableOnly, book, isAvailable) &&
    matchesQuery(book, filters.query)
  );
}

function matchesSet<T>(set: ReadonlySet<T>, value: T): boolean {
  return set.size === 0 || set.has(value);
}

function matchesYear(min: number | null, max: number | null, year: number): boolean {
  if (min !== null && year < min) {
    return false;
  }
  if (max !== null && year > max) {
    return false;
  }
  return true;
}

function matchesAvailable(availableOnly: boolean, book: Book, isAvailable: (bookId: string) => boolean): boolean {
  return !availableOnly || isAvailable(book.id);
}

function matchesQuery(book: Book, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return true;
  }
  const haystack = `${book.title} ${book.author} ${book.isbn}`.toLowerCase();
  return haystack.includes(needle);
}

/** Apply filters to a list. Returns a new array. */
export function applyFilters(
  books: readonly Book[],
  filters: BookFilters,
  isAvailable: (bookId: string) => boolean,
): readonly Book[] {
  return books.filter((book) => matchesFilters(book, filters, isAvailable));
}

/**
 * Score how well a book matches a free-text query. Exact ISBN match scores
 * highest, then title prefix, then author prefix, then substring matches.
 * Used by the sort layer when the user types in the search bar.
 */
export function searchRank(book: Book, query: string): number {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return 0;
  }
  if (book.isbn.toLowerCase() === needle) {
    return 1000;
  }
  if (book.title.toLowerCase().startsWith(needle)) {
    return 500;
  }
  if (book.author.toLowerCase().startsWith(needle)) {
    return 250;
  }
  if (book.title.toLowerCase().includes(needle)) {
    return 100;
  }
  if (book.author.toLowerCase().includes(needle)) {
    return 50;
  }
  return 0;
}
