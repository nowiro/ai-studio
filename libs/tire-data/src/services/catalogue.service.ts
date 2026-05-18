import { computed, Injectable, signal } from '@angular/core';

import { type FacetSummary, summariseFacets } from '../filters/facets.js';
import { applyFilters } from '../filters/matching.js';
import { sortTires } from '../filters/sorting.js';
import { EMPTY_FILTERS, type TireFilters, type TireSortKey } from '../models/filters.js';
import type { Tire } from '../models/tire.js';
import { TIRE_CATALOGUE } from '../seed/catalogue.js';

/**
 * Provides the immutable catalogue + the user's current facet/sort selections
 * via signals. Pure: no HTTP, no side effects beyond memory.
 */
@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private readonly tiresSignal = signal<readonly Tire[]>(TIRE_CATALOGUE);
  private readonly filtersSignal = signal<TireFilters>(EMPTY_FILTERS);
  private readonly sortSignal = signal<TireSortKey>('popularity');

  readonly tires = this.tiresSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly sort = this.sortSignal.asReadonly();

  /** Filtered + sorted view of the catalogue, re-derived on signal changes. */
  readonly filtered = computed<readonly Tire[]>(() => {
    const tires = this.tiresSignal();
    const filtered = applyFilters(tires, this.filtersSignal());
    return sortTires(filtered, this.sortSignal());
  });

  /** Facet summary built from the **unfiltered** catalogue, for chip counts. */
  readonly facets = computed<FacetSummary>(() => summariseFacets(this.tiresSignal()));

  setFilters(next: TireFilters): void {
    this.filtersSignal.set(next);
  }

  patchFilters(patch: Partial<TireFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...patch }));
  }

  resetFilters(): void {
    this.filtersSignal.set(EMPTY_FILTERS);
  }

  setSort(next: TireSortKey): void {
    this.sortSignal.set(next);
  }

  findById(id: string): Tire | null {
    return this.tiresSignal().find((tire) => tire.id === id) ?? null;
  }
}
