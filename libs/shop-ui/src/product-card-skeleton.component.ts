import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Loading placeholder that mirrors the {@link ProductCardComponent} layout
 * (square image, brand chip, title, sub-line, price row + CTA placeholder).
 *
 * Renders a soft animated-pulse skeleton using `bg-surface-container-high`
 * so it reads as Material surface tone, not as a missing image. Used in
 * catalogue grids while the data signal is still empty / loading.
 */
@Component({
  selector: 'ais-shop-product-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  template: `
    <mat-card
      class="flex h-full flex-col"
      aria-hidden="true"
      data-testid="product-card-skeleton"
    >
      <div class="animate-pulse block aspect-square bg-surface-container-high"></div>
      <div class="gap-3 pt-3 px-4 flex flex-1 flex-col">
        <div class="gap-2 flex items-center justify-between">
          <span class="h-3 w-20 rounded animate-pulse bg-surface-container-high"></span>
          <span class="h-3 w-12 rounded animate-pulse bg-surface-container-high"></span>
        </div>
        <span class="h-4 rounded animate-pulse w-3/4 bg-surface-container-high"></span>
        <span class="h-3 rounded animate-pulse w-1/2 bg-surface-container-high"></span>
        <span class="h-3 rounded animate-pulse w-1/3 bg-surface-container-high"></span>
      </div>
      <div class="gap-2 px-4 py-3 flex items-center justify-between">
        <span class="h-5 w-16 rounded animate-pulse bg-surface-container-high"></span>
        <span class="h-9 w-28 animate-pulse rounded-full bg-surface-container-high"></span>
      </div>
    </mat-card>
  `,
})
export class ProductCardSkeletonComponent {}
