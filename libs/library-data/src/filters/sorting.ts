import type { Book } from '../models/book.js';
import type { BookSortKey } from '../models/filters.js';
import { searchRank } from './search.js';

/** Sort books; pure, stable on id. If `query` is set, ranks by `searchRank` first. */
export function sortBooks(books: readonly Book[], sort: BookSortKey, query = ''): readonly Book[] {
  const copy = [...books];
  if (query.trim().length > 0) {
    copy.sort((a, b) => searchRank(b, query) - searchRank(a, query) || a.id.localeCompare(b.id));
    return copy;
  }
  switch (sort) {
    case 'title-asc':
      copy.sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
      return copy;
    case 'title-desc':
      copy.sort((a, b) => b.title.localeCompare(a.title) || a.id.localeCompare(b.id));
      return copy;
    case 'author-asc':
      copy.sort((a, b) => a.author.localeCompare(b.author) || a.id.localeCompare(b.id));
      return copy;
    case 'year-desc':
      copy.sort((a, b) => b.publishedYear - a.publishedYear || a.id.localeCompare(b.id));
      return copy;
    case 'year-asc':
    default:
      copy.sort((a, b) => a.publishedYear - b.publishedYear || a.id.localeCompare(b.id));
      return copy;
  }
}
