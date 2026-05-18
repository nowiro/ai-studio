/**
 * Bookstore domain — `Book` extends `BaseProduct` from `@ai-studio/shop-core`.
 * @packageDocumentation
 */
export type { Book, BookFilters, BookLanguage, BookFormat } from './models/index.js';
export { BOOK_LANGUAGES, BOOK_FORMATS, BOOK_GENRES, EMPTY_BOOK_FILTERS } from './models/index.js';
export { matchesBookFilters, applyBookFilters } from './filters/index.js';
export { BookstoreCatalogueService } from './services/index.js';
export { BOOK_CATALOGUE } from './seed/catalogue.js';
