import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { ShopCartService } from '@ai-studio/shop-core';
import { type Breadcrumb, BreadcrumbsComponent, PriceTagComponent, StarsRatingComponent } from '@ai-studio/shop-ui';
import { ToyShopCatalogueService } from '@ai-studio/toy-shop-data';

@Component({
  selector: 'ais-toy-shop-toy-detail',
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
    @let toy = currentToy();
    @if (toy) {
      <ais-shop-breadcrumbs [crumbs]="crumbsFor(toy.name)" />
      <article
        class="p-4 gap-6 md:grid-cols-[18rem_1fr] max-w-5xl mx-auto grid"
        data-testid="toy-detail"
      >
        <img
          [ngSrc]="toy.imageUrl"
          [alt]="toy.brand + ' ' + toy.name"
          class="rounded bg-surface-container object-cover"
          width="400"
          height="400"
          priority
        />
        <div class="gap-3 flex flex-col">
          <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">{{ toy.brand }}</p>
          <h1 class="m-0 text-2xl font-semibold">{{ toy.name }}</h1>
          <ais-shop-stars-rating
            [rating]="toy.rating"
            [reviewCount]="toy.reviewCount"
          />
          <div class="gap-2 flex flex-wrap items-center">
            <mat-chip>Wiek {{ toy.minAge }}–{{ toy.maxAge }} lat</mat-chip>
            @if (toy.pieceCount !== null) {
              <mat-chip>{{ toy.pieceCount }} elementów</mat-chip>
            }
            @if (toy.batteryRequired) {
              <mat-chip class="!bg-amber-100 !text-amber-800">Wymaga baterii</mat-chip>
            }
            @if (toy.safetyCertified) {
              <mat-chip class="!bg-emerald-100 !text-emerald-800">CE certyfikat</mat-chip>
            }
          </div>
          <p class="m-0 mt-2">{{ toy.description }}</p>
          <div class="mt-2 flex items-center justify-between">
            <ais-shop-price-tag
              [priceCents]="toy.priceCents"
              [oldPrice]="toy.oldPriceCents"
            />
            <button
              (click)="cart.addLine(toy.id)"
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
        data-testid="toy-detail-missing"
      >
        Nie znaleziono zabawki o identyfikatorze {{ id() }}.
      </div>
    }
  `,
})
export class ToyDetailComponent {
  readonly id = input.required<string>();

  private readonly catalogue = inject(ToyShopCatalogueService);
  protected readonly cart = inject(ShopCartService);

  protected readonly currentToy = computed(() => this.catalogue.findById(this.id()));

  protected crumbsFor(toyName: string): readonly Breadcrumb[] {
    return [{ label: 'Sklep', routerLink: ['/'] }, { label: toyName }];
  }
}
