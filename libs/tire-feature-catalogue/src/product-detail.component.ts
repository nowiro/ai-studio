import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

import { CartService, CatalogueService, formatPln } from '@ai-studio/tire-data';
import { EuLabelComponent, PriceTagComponent, StarsRatingComponent } from '@ai-studio/tire-ui';

@Component({
  selector: 'ais-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    NgOptimizedImage,
    RouterLink,
    EuLabelComponent,
    PriceTagComponent,
    StarsRatingComponent,
  ],
  template: `
    @let model = tire();
    @if (model) {
      <article
        class="p-4 gap-6 md:grid-cols-2 max-w-5xl mx-auto grid"
        data-testid="product-detail"
      >
        <div class="gap-2 flex flex-col">
          <div class="rounded aspect-square overflow-hidden bg-surface-container">
            <img
              [ngSrc]="model.imageUrl"
              [alt]="model.brand + ' ' + model.model"
              class="h-full w-full object-cover"
              width="600"
              height="600"
              priority
            />
          </div>
          <div class="gap-2 grid grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <img
                [ngSrc]="model.imageUrl + '?v=' + i"
                [alt]="'Miniatura ' + i"
                class="rounded aspect-square object-cover"
                width="150"
                height="150"
              />
            }
          </div>
        </div>

        <div class="gap-4 flex flex-col">
          <header class="gap-1 flex flex-col">
            <a
              [routerLink]="['/']"
              class="text-sm text-on-surface-variant hover:underline"
            >
              ← Wróć do katalogu
            </a>
            <p class="m-0 text-xs tracking-wide text-on-surface-variant uppercase">
              {{ model.brand }}
            </p>
            <h1 class="m-0 text-3xl font-semibold">{{ model.model }}</h1>
            <p class="m-0 text-on-surface-variant">{{ sizeLabel() }}</p>
            <ais-stars-rating
              [rating]="model.rating"
              [reviewCount]="model.reviewCount"
            />
          </header>

          <div class="gap-3 flex items-center justify-between">
            <ais-price-tag
              [priceCents]="model.priceCents"
              [oldPrice]="model.oldPriceCents"
            />
            <button
              (click)="onAdd()"
              matButton="filled"
              data-testid="add-to-cart"
            >
              <span class="material-symbols-outlined">add_shopping_cart</span>
              Dodaj do koszyka
            </button>
          </div>

          <mat-tab-group>
            <mat-tab label="Specyfikacja">
              <table class="text-sm border-spacing-y-1 w-full border-separate">
                <tbody>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Rozmiar</th>
                    <td>{{ sizeLabel() }}</td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Sezon</th>
                    <td>{{ seasonLabel() }}</td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Indeks prędkości</th>
                    <td>{{ model.speedIndex }}</td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Indeks nośności</th>
                    <td>{{ model.loadIndex }}</td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">EU paliwo</th>
                    <td>
                      <ais-eu-label
                        [grade]="model.euLabel.fuel"
                        axis="fuel"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">EU mokra nawierzchnia</th>
                    <td>
                      <ais-eu-label
                        [grade]="model.euLabel.wet"
                        axis="wet"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Hałas zewnętrzny</th>
                    <td>{{ model.euLabel.noiseDb }} dB</td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Stan magazynu</th>
                    <td>{{ stockLabel() }}</td>
                  </tr>
                  <tr>
                    <th class="pe-3 text-start text-on-surface-variant">Cena</th>
                    <td>{{ priceLabel() }}</td>
                  </tr>
                </tbody>
              </table>
            </mat-tab>

            <mat-tab label="Pasuje do mojego auta">
              <div class="gap-2 py-3 flex flex-col">
                <p class="m-0">
                  Wpisz rozmiar Twoich opon w polu obok, aby sprawdzić kompatybilność. Ten model pasuje do felg
                  <strong>{{ model.size.diameter }}"</strong>
                  przy szerokości
                  <strong>{{ model.size.width }} mm</strong>
                  i profilu
                  <strong>{{ model.size.profile }}</strong>
                  .
                </p>
              </div>
            </mat-tab>

            <mat-tab label="Opis">
              <p class="py-3 m-0">{{ model.description }}</p>
            </mat-tab>
          </mat-tab-group>
        </div>
      </article>
    } @else {
      <div
        class="p-6 text-center text-on-surface-variant"
        data-testid="product-detail-missing"
      >
        Nie znaleziono opony o identyfikatorze {{ id() }}.
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private readonly catalogue = inject(CatalogueService);
  private readonly cart = inject(CartService);

  readonly id = input.required<string>();
  protected readonly tire = computed(() => this.catalogue.findById(this.id()));
  protected readonly sizeLabel = computed(() => {
    const candidate = this.tire();
    if (!candidate) {
      return '';
    }
    return `${candidate.size.width}/${candidate.size.profile} R${candidate.size.diameter} ${candidate.speedIndex}${candidate.loadIndex}`;
  });
  protected readonly seasonLabel = computed(() => {
    switch (this.tire()?.season) {
      case 'summer':
        return 'Letnia';
      case 'winter':
        return 'Zimowa';
      case 'all-season':
        return 'Całoroczna';
      default:
        return '';
    }
  });
  protected readonly stockLabel = computed(() => {
    const stock = this.tire()?.stock ?? 0;
    return stock > 0 ? `${stock} szt.` : 'Brak';
  });
  protected readonly priceLabel = computed(() => {
    const price = this.tire()?.priceCents ?? 0;
    return formatPln(price);
  });

  protected onAdd(): void {
    const candidate = this.tire();
    if (candidate) {
      this.cart.addLine(candidate.id);
    }
  }
}
