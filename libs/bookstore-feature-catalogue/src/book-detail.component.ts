import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { BookstoreCatalogueService } from '@ai-studio/bookstore-data';
import { ShopCartService } from '@ai-studio/shop-core';
import { type Breadcrumb, BreadcrumbsComponent, PriceTagComponent, StarsRatingComponent } from '@ai-studio/shop-ui';

@Component({
  selector: 'ais-bookstore-book-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbsComponent,
    MatButtonModule,
    MatChipsModule,
    NgOptimizedImage,
    PriceTagComponent,
    StarsRatingComponent,
  ],
  template: `
    @let book = currentBook();
    @if (book) {
      <ais-shop-breadcrumbs [crumbs]="crumbsFor(book.name)" />
      <article
        class="p-4 gap-6 md:grid-cols-[16rem_1fr] max-w-4xl mx-auto grid"
        data-testid="book-detail"
      >
        <img
          [ngSrc]="book.imageUrl"
          [alt]="book.brand + ' ' + book.name"
          class="rounded bg-surface-container object-cover"
          width="320"
          height="480"
          priority
        />
        <div class="gap-3 flex flex-col">
          <h1 class="m-0 text-2xl font-semibold">{{ book.name }}</h1>
          <p class="m-0 text-on-surface-variant">{{ book.author }} · {{ book.publishedYear }}</p>
          <ais-shop-stars-rating
            [rating]="book.rating"
            [reviewCount]="book.reviewCount"
          />
          <div class="gap-2 flex flex-wrap items-center">
            <mat-chip>{{ book.language.toUpperCase() }}</mat-chip>
            <mat-chip>{{ book.format }}</mat-chip>
            <mat-chip>{{ book.pageCount }} str.</mat-chip>
            <span class="text-xs text-on-surface-variant">ISBN {{ book.isbn }}</span>
          </div>
          <p class="m-0 mt-2">{{ book.description }}</p>
          <div class="mt-2 gap-3 flex items-center justify-between">
            <ais-shop-price-tag
              [priceCents]="book.priceCents"
              [oldPrice]="book.oldPriceCents"
            />
            <button
              (click)="cart.addLine(book.id)"
              matButton="filled"
              type="button"
              data-testid="add-to-cart"
            >
              <span class="material-symbols-outlined">add_shopping_cart</span>
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </article>
    } @else {
      <div
        class="p-6 text-center text-on-surface-variant"
        data-testid="book-detail-missing"
      >
        Nie znaleziono książki o identyfikatorze {{ id() }}.
      </div>
    }
  `,
})
export class BookDetailComponent {
  readonly id = input.required<string>();

  private readonly catalogue = inject(BookstoreCatalogueService);
  protected readonly cart = inject(ShopCartService);

  protected readonly currentBook = computed(() => this.catalogue.findById(this.id()));

  protected crumbsFor(bookName: string): readonly Breadcrumb[] {
    return [{ label: 'Sklep', routerLink: ['/'] }, { label: bookName }];
  }
}
