import { computed, Injectable, signal } from '@angular/core';

import {
  BASE_SORT_KEYS,
  type BaseSortKey,
  type ProductLookup,
  sortProducts,
  summariseBaseFacets,
} from '@ai-studio/shop-core';

import { applyToyFilters } from '../filters/matching.js';
import { EMPTY_TOY_FILTERS, type Toy, type ToyFilters } from '../models/toy.js';
import { TOY_CATALOGUE } from '../seed/catalogue.js';

@Injectable({ providedIn: 'root' })
export class ToyShopCatalogueService implements ProductLookup<Toy> {
  private readonly toysSignal = signal<readonly Toy[]>(TOY_CATALOGUE);
  private readonly filtersSignal = signal<ToyFilters>(EMPTY_TOY_FILTERS);
  private readonly sortSignal = signal<BaseSortKey>('popularity');

  readonly sortKeys = BASE_SORT_KEYS;
  readonly products = this.toysSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly sort = this.sortSignal.asReadonly();

  readonly filtered = computed<readonly Toy[]>(() => {
    const passed = applyToyFilters(this.toysSignal(), this.filtersSignal());
    return sortProducts(passed, this.sortSignal());
  });

  readonly facets = computed(() => summariseBaseFacets(this.toysSignal()));

  patchFilters(patch: Partial<ToyFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...patch }));
  }

  resetFilters(): void {
    this.filtersSignal.set(EMPTY_TOY_FILTERS);
  }

  setSort(next: BaseSortKey): void {
    this.sortSignal.set(next);
  }

  findById(id: string): Toy | null {
    return this.toysSignal().find((toy) => toy.id === id) ?? null;
  }
}
