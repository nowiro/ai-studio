import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { type Book, BookstoreCatalogueService } from '@ai-studio/bookstore-data';
import { BASE_SORT_KEYS, type BaseSortKey, ShopCartService } from '@ai-studio/shop-core';
import { EmptyResultsComponent, ProductCardComponent, ShopHeroComponent } from '@ai-studio/shop-ui';

import { FilterPanelComponent } from './filter-panel.component.js';

const SORT_LABELS: Readonly<Record<BaseSortKey, string>> = {
  popularity: 'Popularność',
  'price-asc': 'Cena: rosnąco',
  'price-desc': 'Cena: malejąco',
  'rating-desc': 'Najwyżej oceniane',
  'name-asc': 'Tytuł: A–Z',
};

@Component({
  selector: 'ais-bookstore-catalogue-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyResultsComponent,
    FilterPanelComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ProductCardComponent,
    ShopHeroComponent,
  ],
  template: `
    <ais-shop-hero
      [ctaLink]="['/']"
      eyebrow="Tysiące tytułów"
      title="Twoja kolejna ulubiona książka"
      subtitle="Literatura, fantastyka, biografie, książki dla dzieci — wszystko z dostawą w 24 h."
      ctaLabel="Zobacz katalog"
    />
    <section class="gap-4 md:grid-cols-[18rem_1fr] p-4 grid">
      <ais-bookstore-filter-panel />
      <div class="gap-3 flex flex-col">
        <header class="gap-2 flex flex-wrap items-center justify-between">
          <h1
            class="text-2xl font-semibold m-0"
            data-testid="catalogue-heading"
          >
            Księgarnia ({{ catalogue.filtered().length }})
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
            title="Brak książek"
            subtitle="Żaden tytuł nie pasuje do aktywnych filtrów. Spróbuj poszerzyć kryteria."
          />
        } @else {
          <div
            class="gap-4 sm:grid-cols-2 lg:grid-cols-3 grid"
            data-testid="catalogue-grid"
          >
            @for (book of catalogue.filtered(); track book.id) {
              <ais-shop-product-card
                [product]="book"
                [detailRouterLink]="['/book', book.id]"
                [subline]="subline(book)"
                [categoryChip]="genreLabel(book.category)"
                (addToCart)="cart.addLine($event.id)"
              />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class CataloguePageComponent {
  protected readonly catalogue = inject(BookstoreCatalogueService);
  protected readonly cart = inject(ShopCartService);
  protected readonly sortKeys = BASE_SORT_KEYS;

  protected labelOf(key: BaseSortKey): string {
    return SORT_LABELS[key];
  }

  protected subline(book: Book): string {
    return `${book.author} · ${book.publishedYear}`;
  }

  protected genreLabel(category: string): string {
    return GENRE_LABELS[category] ?? category;
  }
}

const GENRE_LABELS: Readonly<Record<string, string>> = {
  fiction: 'Literatura',
  'non-fiction': 'Literatura faktu',
  fantasy: 'Fantasy',
  'sci-fi': 'Science fiction',
  mystery: 'Kryminał',
  biography: 'Biografia',
  history: 'Historia',
  science: 'Nauka',
  children: 'Dla dzieci',
  poetry: 'Poezja',
};
