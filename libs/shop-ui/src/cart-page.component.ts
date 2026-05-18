import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { formatPln } from '@ai-studio/shared-app-shell';
import { ShopCartService } from '@ai-studio/shop-core';

/**
 * Generic cart page reused by every shop. Lists each line with a
 * stepper + remove control, displays totals in an aside.
 */
@Component({
  selector: 'ais-shop-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, NgOptimizedImage, RouterLink],
  template: `
    <section
      class="p-4 max-w-5xl mx-auto"
      data-testid="cart-page"
    >
      <h1 class="text-2xl font-semibold m-0 mb-4">Koszyk</h1>

      @if (views().length === 0) {
        <div class="gap-3 py-16 flex flex-col items-center text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-5xl">shopping_cart_off</span>
          <p class="m-0">Twój koszyk jest pusty.</p>
          <a
            [routerLink]="catalogueRoute()"
            matButton="filled"
          >
            Wróć do katalogu
          </a>
        </div>
      } @else {
        <div class="gap-4 md:grid-cols-[1fr_22rem] grid">
          <ul class="m-0 p-0 gap-3 flex list-none flex-col">
            @for (view of views(); track view.product.id) {
              <li
                class="gap-3 p-3 rounded grid grid-cols-[6rem_1fr_auto] items-center bg-surface-container"
                data-testid="cart-line"
              >
                <img
                  [ngSrc]="view.product.imageUrl"
                  [alt]="view.product.brand + ' ' + view.product.name"
                  class="rounded object-cover"
                  width="96"
                  height="96"
                />
                <div class="gap-1 flex flex-col">
                  <span class="text-base font-semibold leading-tight">
                    {{ view.product.brand }} {{ view.product.name }}
                  </span>
                  <div class="gap-2 mt-1 flex items-center">
                    <button
                      (click)="decrement(view.product.id, view.line.quantity)"
                      matIconButton
                      aria-label="Mniej"
                      data-testid="cart-decrement"
                    >
                      <span class="material-symbols-outlined">remove</span>
                    </button>
                    <span
                      class="min-w-8 text-center"
                      data-testid="cart-quantity"
                    >
                      {{ view.line.quantity }}
                    </span>
                    <button
                      (click)="increment(view.product.id, view.line.quantity)"
                      matIconButton
                      aria-label="Więcej"
                      data-testid="cart-increment"
                    >
                      <span class="material-symbols-outlined">add</span>
                    </button>
                    <button
                      (click)="remove(view.product.id)"
                      class="!ms-2"
                      matButton
                      type="button"
                      data-testid="cart-remove"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
                <div class="font-semibold text-end">{{ format(view.subtotalCents) }}</div>
              </li>
            }
          </ul>
          <aside
            class="gap-3 p-4 rounded flex h-fit flex-col bg-surface-container"
            data-testid="cart-summary"
          >
            <h2 class="m-0 text-lg font-semibold">Podsumowanie</h2>
            <div class="text-sm flex items-center justify-between">
              <span>Liczba sztuk</span>
              <span data-testid="cart-summary-count">{{ count() }}</span>
            </div>
            <mat-divider />
            <div class="text-base flex items-center justify-between">
              <span>Razem</span>
              <strong data-testid="cart-summary-total">{{ totalLabel() }}</strong>
            </div>
            <a
              [routerLink]="checkoutRoute()"
              matButton="filled"
              data-testid="cart-page-checkout"
            >
              Przejdź do kasy
            </a>
            <button
              (click)="clear()"
              matButton
              type="button"
            >
              Wyczyść koszyk
            </button>
          </aside>
        </div>
      }
    </section>
  `,
})
export class CartPageComponent {
  private readonly cart = inject(ShopCartService);

  readonly catalogueRoute = input<string>('/');
  readonly checkoutRoute = input<string>('/checkout');

  protected readonly views = this.cart.views;
  protected readonly count = this.cart.count;
  protected readonly totalLabel = computed(() => formatPln(this.cart.totalCents()));

  protected format(cents: number): string {
    return formatPln(cents);
  }

  protected increment(productId: string, current: number): void {
    this.cart.setQuantity(productId, current + 1);
  }

  protected decrement(productId: string, current: number): void {
    this.cart.setQuantity(productId, current - 1);
  }

  protected remove(productId: string): void {
    this.cart.removeLine(productId);
  }

  protected clear(): void {
    this.cart.clear();
  }
}
