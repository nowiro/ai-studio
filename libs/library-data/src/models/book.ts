/** A book record in the catalogue. */
export interface Book {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly genre: BookGenre;
  readonly language: BookLanguage;
  readonly publishedYear: number;
  readonly coverUrl: string;
  readonly blurb: string;
  readonly totalCopies: number;
}

export type BookGenre =
  | 'fiction'
  | 'non-fiction'
  | 'fantasy'
  | 'sci-fi'
  | 'mystery'
  | 'biography'
  | 'history'
  | 'science'
  | 'children'
  | 'poetry';

export type BookLanguage = 'pl' | 'en' | 'de' | 'fr' | 'es';

export const BOOK_GENRES: readonly BookGenre[] = [
  'fiction',
  'non-fiction',
  'fantasy',
  'sci-fi',
  'mystery',
  'biography',
  'history',
  'science',
  'children',
  'poetry',
];

export const BOOK_LANGUAGES: readonly BookLanguage[] = ['pl', 'en', 'de', 'fr', 'es'];
