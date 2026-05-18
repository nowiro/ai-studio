import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BASE_SORT_KEYS, type BaseSortKey, ShopCartService } from '@ai-studio/shop-core';
import { EmptyStateComponent, ProductCardComponent } from '@ai-studio/shop-ui';
import { type Tool, ToolsShopCatalogueService } from '@ai-studio/tools-shop-data';

import { FilterPanelComponent } from './filter-panel.component.js';

const SORT_LABELS: Readonly<Record<BaseSortKey, string>> = {
  popularity: 'Popularność',
  'price-asc': 'Cena: rosnąco',
  'price-desc': 'Cena: malejąco',
  'rating-desc': 'Najwyżej oceniane',
  'name-asc': 'Nazwa: A–Z',
};

@Component({
  selector: 'ais-tools-shop-catalogue-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyStateComponent,
    FilterPanelComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ProductCardComponent,
  ],
  template: `
    <section class="gap-4 md:grid-cols-[18rem_1fr] p-4 grid">
      <ais-tools-shop-filter-panel />
      <div class="gap-3 flex flex-col">
        <header class="gap-2 flex flex-wrap items-center justify-between">
          <h1
            class="text-2xl font-semibold m-0"
            data-testid="catalogue-heading"
          >
            Narzędzia ({{ catalogue.filtered().length }})
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
          <ais-shop-empty-state
            (action)="catalogue.resetFilters()"
            testId="catalogue-empty"
            icon="construction"
            message="Brak narzędzi spełniających kryteria."
            actionLabel="Wyczyść filtry"
          />
        } @else {
          <div
            class="gap-4 sm:grid-cols-2 lg:grid-cols-3 grid"
            data-testid="catalogue-grid"
          >
            @for (tool of catalogue.filtered(); track tool.id) {
              <ais-shop-product-card
                [product]="tool"
                [detailRouterLink]="['/tool', tool.id]"
                [subline]="subline(tool)"
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
  protected readonly catalogue = inject(ToolsShopCatalogueService);
  protected readonly cart = inject(ShopCartService);
  protected readonly sortKeys = BASE_SORT_KEYS;

  protected labelOf(key: BaseSortKey): string {
    return SORT_LABELS[key];
  }

  protected subline(tool: Tool): string {
    const voltage = tool.voltage !== null ? ` · ${tool.voltage} V` : '';
    return `${tool.toolType}${voltage} · ${tool.weightKg} kg`;
  }
}
