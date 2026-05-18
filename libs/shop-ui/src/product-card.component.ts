import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import type { BaseProduct } from '@ai-studio/shop-core';

import { PriceTagComponent } from './price-tag.component.js';
import { StarsRatingComponent } from './stars-rating.component.js';

/**
 * Generic product card reused by every shop demo. Shows image + brand +
 * name + sub-line + price + rating + "add to cart" CTA. Routes via the
 * provided `detailRouterLink` array (e.g. `['/product', tire.id]`).
 */
@Component({
  selector: 'ais-shop-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    NgOptimizedImage,
    RouterLink,
    PriceTagComponent,
    StarsRatingComponent,
  ],
  template: `
    <mat-card
      [attr.data-product-id]="product().id"
      class="flex h-full flex-col"
      data-testid="product-card"
    >
      <a
        [routerLink]="detailRouterLink()"
        class="block aspect-square overflow-hidden bg-surface-container"
      >
        <img
          [ngSrc]="product().imageUrl"
          [alt]="product().brand + ' ' + product().name"
          class="h-full w-full object-cover"
          width="600"
          height="600"
        />
      </a>
      <mat-card-content class="gap-2 pt-3 flex flex-1 flex-col">
        <div class="gap-2 flex items-center justify-between">
          <span class="text-xs tracking-wide text-on-surface-variant uppercase">
            {{ product().brand }}
          </span>
          @if (categoryChip(); as chip) {
            <mat-chip class="!text-xs">{{ chip }}</mat-chip>
          }
        </div>
        <a
          [routerLink]="detailRouterLink()"
          class="text-base font-semibold hover:underline"
        >
          {{ product().name }}
        </a>
        @if (subline(); as sub) {
          <div class="text-sm text-on-surface-variant">{{ sub }}</div>
        }
        <ais-shop-stars-rating
          [rating]="product().rating"
          [reviewCount]="product().reviewCount"
        />
      </mat-card-content>
      <mat-card-actions class="!flex !items-center !justify-between">
        <ais-shop-price-tag
          [priceCents]="product().priceCents"
          [oldPrice]="product().oldPriceCents"
        />
        <button
          (click)="addToCart.emit(product())"
          matButton="filled"
          data-testid="card-add-to-cart"
        >
          <span class="material-symbols-outlined">add_shopping_cart</span>
          {{ cartLabel() }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ProductCardComponent<T extends BaseProduct = BaseProduct> {
  readonly product = input.required<T>();
  /** Router link for the product detail page (e.g. `['/product', id]`). */
  readonly detailRouterLink = input.required<readonly (string | number)[]>();
  /** Optional sub-line (e.g. tire size, page count). */
  readonly subline = input<string | null>(null);
  /** Optional category chip (e.g. season label). */
  readonly categoryChip = input<string | null>(null);
  /** Override the cart CTA label per shop. */
  readonly cartLabel = input<string>('Do koszyka');

  readonly addToCart = output<T>();
}
