import { matchesBaseFilters, matchesSetFacet } from '@ai-studio/shop-core';

import type { Toy, ToyFilters } from '../models/toy.js';

export function matchesToyFilters(toy: Toy, filters: ToyFilters): boolean {
  if (!matchesBaseFilters(toy, filters)) {
    return false;
  }
  if (!matchesSetFacet(filters.ageGroups, toy.ageGroup)) {
    return false;
  }
  if (!matchesSetFacet(filters.genderHints, toy.genderHint)) {
    return false;
  }
  if (filters.batteryFreeOnly && toy.batteryRequired) {
    return false;
  }
  return true;
}

export function applyToyFilters(toys: readonly Toy[], filters: ToyFilters): readonly Toy[] {
  return toys.filter((toy) => matchesToyFilters(toy, filters));
}
