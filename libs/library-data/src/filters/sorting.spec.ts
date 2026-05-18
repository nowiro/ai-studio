import { describe, expect, it } from 'vitest';

import type { Book } from '../models/book.js';
import { sortBooks } from './sorting.js';

function book(id: string, overrides: Partial<Book> = {}): Book {
  return {
    id,
    title: 'T',
    author: 'A',
    isbn: id,
    genre: 'fiction',
    language: 'en',
    publishedYear: 2000,
    coverUrl: '',
    blurb: '',
    totalCopies: 1,
    ...overrides,
  };
}

describe('sortBooks', () => {
  const a = book('a', { title: 'Alpha', author: 'Aaron', publishedYear: 2000 });
  const b = book('b', { title: 'Beta', author: 'Bea', publishedYear: 1990 });
  const c = book('c', { title: 'Gamma', author: 'Carl', publishedYear: 2020 });
  const list = [c, a, b];

  it('does not mutate input', () => {
    const before = [...list];
    sortBooks(list, 'title-asc');
    expect(list).toEqual(before);
  });

  it('sorts by title asc', () => {
    expect(sortBooks(list, 'title-asc').map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('sorts by title desc', () => {
    expect(sortBooks(list, 'title-desc').map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('sorts by author asc', () => {
    expect(sortBooks(list, 'author-asc').map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('sorts by year asc', () => {
    expect(sortBooks(list, 'year-asc').map((x) => x.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by year desc', () => {
    expect(sortBooks(list, 'year-desc').map((x) => x.id)).toEqual(['c', 'a', 'b']);
  });

  it('ranks search-query matches first when query is non-empty', () => {
    expect(sortBooks(list, 'title-asc', 'beta').map((x) => x.id)).toEqual(['b', 'a', 'c']);
  });
});
