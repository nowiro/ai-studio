import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BASE_SORT_KEYS, type BaseSortKey, ShopCartService } from '@ai-studio/shop-core';
import { EmptyResultsComponent, ProductCardComponent } from '@ai-studio/shop-ui';
import { type Toy, ToyShopCatalogueService } from '@ai-studio/toy-shop-data';

import { FilterPanelComponent } from './filter-panel.component.js';

const SORT_LABELS: Readonly<Record<BaseSortKey, string>> = {
  popularity: 'Popularność',
  'price-asc': 'Cena: rosnąco',
  'price-desc': 'Cena: malejąco',
  'rating-desc': 'Najwyżej oceniane',
  'name-asc': 'Nazwa: A–Z',
};

@Component({
  selector: 'ais-toy-shop-catalogue-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyResultsComponent,
    FilterPanelComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ProductCardComponent,
  ],
  template: `
    <section class="gap-4 md:grid-cols-[18rem_1fr] p-4 grid">
      <ais-toy-shop-filter-panel />
      <div class="gap-3 flex flex-col">
        <header class="gap-2 flex flex-wrap items-center justify-between">
          <h1
            class="text-2xl font-semibold m-0"
            data-testid="catalogue-heading"
          >
            Sklep z zabawkami ({{ catalogue.filtered().length }})
          </h1>
          <mat-form-field
            class="min-w-56"
            appearance="outline"
            subscriptSizing="dynamic"
          >
            <mat-label>Sortuj</mat-label>
            <mat-select
              [value]="catalogue.sort()"
              (valueChange)="catalogue.setSort($event)"
              data-testid="catalogue-sort"
            >
              @for (key of sortKeys; track key) {
                <mat-option [value]="key">{{ labelOf(key) }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </header>

        @if (catalogue.filtered().length === 0) {
          <ais-shop-empty-results
            (clear)="catalogue.resetFilters()"
            title="Brak zabawek"
            subtitle="Żadna zabawka nie pasuje do aktywnych filtrów. Spróbuj poszerzyć kryteria."
          />
        } @else {
          <div
            class="gap-4 sm:grid-cols-2 lg:grid-cols-3 grid"
            data-testid="catalogue-grid"
          >
            @for (toy of catalogue.filtered(); track toy.id) {
              <ais-shop-product-card
                [product]="toy"
                [detailRouterLink]="['/toy', toy.id]"
                [subline]="subline(toy)"
                [categoryChip]="ageLabel(toy.ageGroup)"
                (addToCart)="cart.addLine($event.id)"
                cartLabel="Do koszyka"
              />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class CataloguePageComponent {
  protected readonly catalogue = inject(ToyShopCatalogueService);
  protected readonly cart = inject(ShopCartService);
  protected readonly sortKeys = BASE_SORT_KEYS;

  protected labelOf(key: BaseSortKey): string {
    return SORT_LABELS[key];
  }

  protected subline(toy: Toy): string {
    return toy.pieceCount === null
      ? `Wiek ${toy.minAge}–${toy.maxAge} lat`
      : `Wiek ${toy.minAge}–${toy.maxAge} lat · ${toy.pieceCount} elementów`;
  }

  protected ageLabel(age: Toy['ageGroup']): string {
    switch (age) {
      case '0-2':
        return '0–2';
      case '3-5':
        return '3–5';
      case '6-8':
        return '6–8';
      case '9-12':
        return '9–12';
      case '13+':
        return '13+';
    }
  }
}
