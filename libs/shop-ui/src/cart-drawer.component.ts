import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';

import { formatPln } from '@ai-studio/shared-app-shell';
import { ShopCartService } from '@ai-studio/shop-core';

/**
 * Generic right-side cart drawer reused by every shop. Reads `ShopCartService`
 * directly; the app provides `PRODUCT_LOOKUP` so the views render with the
 * correct product join.
 */
@Component({
  selector: 'ais-shop-cart-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatSidenavModule, NgOptimizedImage],
  template: `
    <mat-sidenav
      [opened]="isOpen()"
      (openedChange)="onOpenedChange($event)"
      class="!w-[min(420px,95vw)]"
      #drawer
      mode="over"
      position="end"
      data-testid="cart-drawer"
    >
      <div class="flex h-full flex-col">
        <header class="p-4 flex items-center justify-between border-b border-outline-variant">
          <h2 class="text-lg font-semibold m-0">
            Twój koszyk
            <span class="text-sm text-on-surface-variant">({{ count() }})</span>
          </h2>
          <button
            (click)="onClose()"
            matIconButton
            type="button"
            aria-label="Zamknij koszyk"
            data-testid="cart-drawer-close"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        @if (views().length === 0) {
          <div
            class="gap-2 px-4 flex flex-1 flex-col items-center justify-center text-center text-on-surface-variant"
            data-testid="cart-drawer-empty"
          >
            <span class="material-symbols-outlined text-5xl">shopping_cart_off</span>
            <p class="m-0">Twój koszyk jest pusty.</p>
          </div>
        } @else {
          <ul class="p-3 m-0 gap-3 flex flex-1 list-none flex-col overflow-auto">
            @for (view of views(); track view.product.id) {
              <li
                class="gap-3 p-2 rounded flex items-center bg-surface-container"
                data-testid="cart-drawer-line"
              >
                <img
                  [ngSrc]="view.product.imageUrl"
                  [alt]="view.product.brand + ' ' + view.product.name"
                  class="rounded object-cover"
                  width="80"
                  height="80"
                />
                <div class="gap-0.5 flex flex-1 flex-col">
                  <span class="text-sm font-semibold leading-tight">
                    {{ view.product.brand }} {{ view.product.name }}
                  </span>
                  <span class="text-sm">{{ format(view.subtotalCents) }} ({{ view.line.quantity }} szt.)</span>
                </div>
                <button
                  (click)="remove(view.product.id)"
                  matIconButton
                  type="button"
                  aria-label="Usuń pozycję"
                  data-testid="cart-drawer-remove"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </li>
            }
          </ul>
          <footer class="p-4 gap-3 flex flex-col border-t border-outline-variant">
            <div class="text-base flex items-center justify-between">
              <span>Razem</span>
              <strong data-testid="cart-drawer-total">{{ totalLabel() }}</strong>
            </div>
            <div class="gap-2 flex">
              <button
                (click)="goToCart()"
                class="flex-1"
                matButton
                type="button"
              >
                Zobacz koszyk
              </button>
              <button
                (click)="goToCheckout()"
                class="flex-1"
                matButton="filled"
                type="button"
                data-testid="cart-drawer-checkout"
              >
                Do kasy
              </button>
            </div>
          </footer>
        }
      </div>
    </mat-sidenav>
  `,
})
export class CartDrawerComponent {
  private readonly cart = inject(ShopCartService);
  private readonly router = inject(Router);

  readonly isOpen = input<boolean>(false);
  readonly cartRoute = input<string>('/cart');
  readonly checkoutRoute = input<string>('/checkout');
  readonly closed = output<void>();

  protected readonly views = this.cart.views;
  protected readonly count = this.cart.count;
  protected readonly totalLabel = computed(() => formatPln(this.cart.totalCents()));

  protected format(cents: number): string {
    return formatPln(cents);
  }

  protected remove(productId: string): void {
    this.cart.removeLine(productId);
  }

  protected onClose(): void {
    this.closed.emit();
  }

  protected onOpenedChange(open: boolean): void {
    if (!open) {
      this.closed.emit();
    }
  }

  protected goToCart(): void {
    void this.router.navigate([this.cartRoute()]);
    this.closed.emit();
  }

  protected goToCheckout(): void {
    void this.router.navigate([this.checkoutRoute()]);
    this.closed.emit();
  }
}
