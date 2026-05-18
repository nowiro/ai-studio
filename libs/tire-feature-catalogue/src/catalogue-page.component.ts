import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { CartService, CatalogueService, type Tire, TIRE_SORT_KEYS, type TireSortKey } from '@ai-studio/tire-data';

import { FilterPanelComponent } from './filter-panel.component.js';
import { ProductCardComponent } from './product-card.component.js';

const SORT_LABELS: Readonly<Record<TireSortKey, string>> = {
  popularity: 'Popularność',
  'price-asc': 'Cena: rosnąco',
  'price-desc': 'Cena: malejąco',
  'eu-label': 'EU label (najlepsze)',
  'rating-desc': 'Najwyżej oceniane',
};

@Component({
  selector: 'ais-catalogue-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FilterPanelComponent,
    ProductCardComponent,
  ],
  template: `
    <section class="gap-4 md:grid-cols-[18rem_1fr] p-4 grid">
      <ais-filter-panel />
      <div class="gap-3 flex flex-col">
        <header class="gap-2 flex flex-wrap items-center justify-between">
          <div class="gap-3 flex items-center">
            <h1
              class="text-2xl font-semibold m-0"
              data-testid="catalogue-heading"
            >
              Opony ({{ results().length }})
            </h1>
          </div>
          <mat-form-field
            class="min-w-56"
            appearance="outline"
            subscriptSizing="dynamic"
          >
            <mat-label>Sortuj</mat-label>
            <mat-select
              [value]="sort()"
              (valueChange)="onSortChange($event)"
              data-testid="catalogue-sort"
            >
              @for (key of sortKeys; track key) {
                <mat-option [value]="key">{{ labelOf(key) }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </header>

        @if (results().length === 0) {
          <div
            class="gap-3 py-16 flex flex-col items-center text-center text-on-surface-variant"
            data-testid="catalogue-empty"
          >
            <span class="material-symbols-outlined text-5xl">search_off</span>
            <p class="m-0">Brak opon spełniających kryteria.</p>
            <button
              (click)="resetFilters()"
              matButton="filled"
            >
              Wyczyść filtry
            </button>
          </div>
        } @else {
          <div
            class="gap-4 sm:grid-cols-2 lg:grid-cols-3 grid"
            data-testid="catalogue-grid"
          >
            @for (tire of results(); track tire.id) {
              <ais-product-card
                [tire]="tire"
                (addToCart)="onAdd($event)"
              />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class CataloguePageComponent {
  private readonly catalogue = inject(CatalogueService);
  private readonly cart = inject(CartService);

  protected readonly sortKeys = TIRE_SORT_KEYS;
  protected readonly sort = this.catalogue.sort;
  protected readonly results = this.catalogue.filtered;

  protected readonly hasResults = computed(() => this.results().length > 0);

  protected labelOf(key: TireSortKey): string {
    return SORT_LABELS[key];
  }

  protected onSortChange(key: TireSortKey): void {
    this.catalogue.setSort(key);
  }

  protected resetFilters(): void {
    this.catalogue.resetFilters();
  }

  protected onAdd(tire: Tire): void {
    this.cart.addLine(tire.id);
  }
}
