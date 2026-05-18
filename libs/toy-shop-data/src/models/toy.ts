import type { BaseFilters, BaseProduct } from '@ai-studio/shop-core';

/** A toy for sale. Extends `BaseProduct` with kid-friendly attributes. */
export interface Toy extends BaseProduct {
  readonly ageGroup: AgeGroup;
  readonly minAge: number;
  readonly maxAge: number;
  readonly pieceCount: number | null;
  readonly genderHint: GenderHint;
  readonly batteryRequired: boolean;
  readonly safetyCertified: boolean;
}

export type AgeGroup = '0-2' | '3-5' | '6-8' | '9-12' | '13+';
export const AGE_GROUPS: readonly AgeGroup[] = ['0-2', '3-5', '6-8', '9-12', '13+'];

export type GenderHint = 'any' | 'boys' | 'girls';
export const GENDER_HINTS: readonly GenderHint[] = ['any', 'boys', 'girls'];

/** Categories used as the shop-wide "scope:toy-shop" facet. */
export const TOY_CATEGORIES: readonly string[] = [
  'building',
  'dolls',
  'vehicles',
  'plush',
  'board-games',
  'puzzles',
  'arts-crafts',
  'outdoor',
  'educational',
];

export interface ToyFilters extends BaseFilters {
  readonly ageGroups: ReadonlySet<AgeGroup>;
  readonly genderHints: ReadonlySet<GenderHint>;
  readonly batteryFreeOnly: boolean;
}

export const EMPTY_TOY_FILTERS: ToyFilters = {
  brands: new Set(),
  categories: new Set(),
  minPriceCents: null,
  maxPriceCents: null,
  inStockOnly: false,
  query: '',
  ageGroups: new Set(),
  genderHints: new Set(),
  batteryFreeOnly: false,
};
