import { matchesBaseFilters, matchesSetFacet } from '@ai-studio/shop-core';

import type { Book, BookFilters } from '../models/book.js';

/**
 * Composition of generic + domain-specific predicates. Pure function;
 * unit-tested by the catalogue service spec.
 */
export function matchesBookFilters(book: Book, filters: BookFilters): boolean {
  if (!matchesBaseFilters(book, filters)) {
    return false;
  }
  if (!matchesSetFacet(filters.languages, book.language)) {
    return false;
  }
  if (!matchesSetFacet(filters.formats, book.format)) {
    return false;
  }
  if (filters.minYear !== null && book.publishedYear < filters.minYear) {
    return false;
  }
  if (filters.maxYear !== null && book.publishedYear > filters.maxYear) {
    return false;
  }
  return true;
}

export function applyBookFilters(books: readonly Book[], filters: BookFilters): readonly Book[] {
  return books.filter((book) => matchesBookFilters(book, filters));
}
