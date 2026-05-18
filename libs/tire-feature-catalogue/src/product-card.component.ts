import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import type { Tire } from '@ai-studio/tire-data';
import { EuLabelComponent, PriceTagComponent, StarsRatingComponent } from '@ai-studio/tire-ui';

@Component({
  selector: 'ais-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    NgOptimizedImage,
    RouterLink,
    EuLabelComponent,
    PriceTagComponent,
    StarsRatingComponent,
  ],
  template: `
    <mat-card
      [attr.data-tire-id]="tire().id"
      class="flex h-full flex-col"
      data-testid="product-card"
    >
      <a
        [routerLink]="['/product', tire().id]"
        class="block aspect-square overflow-hidden bg-surface-container"
      >
        <img
          [ngSrc]="tire().imageUrl"
          [alt]="tire().brand + ' ' + tire().model"
          class="h-full w-full object-cover"
          width="600"
          height="600"
        />
      </a>
      <mat-card-content class="gap-2 pt-3 flex flex-1 flex-col">
        <div class="gap-2 flex items-center justify-between">
          <span class="text-xs tracking-wide text-on-surface-variant uppercase">{{ tire().brand }}</span>
          <mat-chip class="!text-xs">{{ seasonLabel() }}</mat-chip>
        </div>
        <a
          [routerLink]="['/product', tire().id]"
          class="text-base font-semibold hover:underline"
        >
          {{ tire().model }}
        </a>
        <div class="text-sm text-on-surface-variant">{{ sizeLabel() }}</div>
        <div class="flex items-center justify-between">
          <ais-stars-rating
            [rating]="tire().rating"
            [reviewCount]="tire().reviewCount"
          />
          <div class="gap-1 flex items-center">
            <ais-eu-label
              [grade]="tire().euLabel.fuel"
              axis="fuel"
            />
            <ais-eu-label
              [grade]="tire().euLabel.wet"
              axis="wet"
            />
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions class="!flex !items-center !justify-between">
        <ais-price-tag
          [priceCents]="tire().priceCents"
          [oldPrice]="tire().oldPriceCents"
        />
        <button
          (click)="onAdd()"
          matButton="filled"
          data-testid="card-add-to-cart"
        >
          <span class="material-symbols-outlined">add_shopping_cart</span>
          Do koszyka
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ProductCardComponent {
  readonly tire = input.required<Tire>();
  readonly addToCart = output<Tire>();

  protected readonly seasonLabel = computed(() => seasonLabelOf(this.tire().season));
  protected readonly sizeLabel = computed(() => {
    const size = this.tire().size;
    return `${size.width}/${size.profile} R${size.diameter} ${this.tire().speedIndex}`;
  });

  protected onAdd(): void {
    this.addToCart.emit(this.tire());
  }
}

function seasonLabelOf(season: Tire['season']): string {
  switch (season) {
    case 'summer':
      return 'Lato';
    case 'winter':
      return 'Zima';
    case 'all-season':
    default:
      return 'Całoroczna';
  }
}
