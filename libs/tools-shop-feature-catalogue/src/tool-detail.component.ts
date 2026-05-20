import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { ShopCartService } from '@ai-studio/shop-core';
import { type Breadcrumb, BreadcrumbsComponent, PriceTagComponent, StarsRatingComponent } from '@ai-studio/shop-ui';
import { ToolsShopCatalogueService } from '@ai-studio/tools-shop-data';

@Component({
  selector: 'ais-tools-shop-tool-detail',
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
    @let tool = currentTool();
    @if (tool) {
      <ais-shop-breadcrumbs [crumbs]="crumbsFor(tool.name)" />
      <article
        class="p-4 gap-6 md:grid-cols-[18rem_1fr] max-w-5xl mx-auto grid"
        data-testid="tool-detail"
      >
        <img
          [ngSrc]="tool.imageUrl"
          [alt]="tool.brand + ' ' + tool.name"
          class="rounded bg-surface-container object-cover"
          width="400"
          height="400"
          priority
        />
        <div class="gap-3 flex flex-col">
          <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">{{ tool.brand }}</p>
          <h1 class="m-0 text-2xl font-semibold">{{ tool.name }}</h1>
          <ais-shop-stars-rating
            [rating]="tool.rating"
            [reviewCount]="tool.reviewCount"
          />
          <div class="gap-2 flex flex-wrap items-center">
            <mat-chip>{{ tool.toolType }}</mat-chip>
            <mat-chip>{{ tool.powerSource }}</mat-chip>
            @if (tool.voltage !== null) {
              <mat-chip>{{ tool.voltage }} V</mat-chip>
            }
            <mat-chip>{{ tool.weightKg }} kg</mat-chip>
            <mat-chip>Gwarancja {{ tool.warrantyMonths }} mies.</mat-chip>
          </div>
          <p class="m-0 mt-2">{{ tool.description }}</p>
          <p class="m-0 text-xs text-on-surface-variant">SKU: {{ tool.skuCode }}</p>
          <div class="mt-2 flex items-center justify-between">
            <ais-shop-price-tag
              [priceCents]="tool.priceCents"
              [oldPrice]="tool.oldPriceCents"
            />
            <button
              (click)="cart.addLine(tool.id)"
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
        data-testid="tool-detail-missing"
      >
        Nie znaleziono narzędzia o identyfikatorze {{ id() }}.
      </div>
    }
  `,
})
export class ToolDetailComponent {
  readonly id = input.required<string>();

  private readonly catalogue = inject(ToolsShopCatalogueService);
  protected readonly cart = inject(ShopCartService);

  protected readonly currentTool = computed(() => this.catalogue.findById(this.id()));

  protected crumbsFor(toolName: string): readonly Breadcrumb[] {
    return [{ label: 'Sklep', routerLink: ['/'] }, { label: toolName }];
  }
}
