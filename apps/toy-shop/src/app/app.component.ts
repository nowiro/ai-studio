import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ShopCartService } from '@ai-studio/shop-core';
import { CartDrawerComponent } from '@ai-studio/shop-ui';

@Component({
  selector: 'ais-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CartDrawerComponent,
    MatBadgeModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
  ],
  host: { class: 'block min-h-screen' },
  template: `
    <mat-sidenav-container class="min-h-screen">
      <mat-sidenav-content>
        <mat-toolbar
          class="top-0 !sticky z-10"
          color="primary"
        >
          <a
            [routerLink]="['/']"
            class="gap-2 flex items-center text-inherit no-underline"
          >
            <span class="material-symbols-outlined">toys</span>
            <span class="font-semibold">Sklep z zabawkami</span>
          </a>
          <span class="flex-1"></span>
          <button
            (click)="openCart()"
            matIconButton
            aria-label="Otwórz koszyk"
            data-testid="header-cart-button"
          >
            <span
              [matBadge]="cartCount() || null"
              class="material-symbols-outlined"
              matBadgeColor="accent"
              matBadgeSize="small"
            >
              shopping_cart
            </span>
          </button>
        </mat-toolbar>
        <main class="min-h-[calc(100vh-4rem)]">
          <router-outlet />
        </main>
        <footer class="text-sm py-4 border-t border-outline-variant text-center text-on-surface-variant">
          AI Studio · Demo sklepu z zabawkami · {{ currentYear }}
        </footer>
      </mat-sidenav-content>
      <ais-shop-cart-drawer
        [isOpen]="cartOpen()"
        (closed)="closeCart()"
      />
    </mat-sidenav-container>
  `,
})
export class AppComponent {
  private readonly cart = inject(ShopCartService);
  protected readonly cartOpen = signal(false);
  protected readonly cartCount = computed(() => this.cart.count());
  protected readonly currentYear = new Date().getFullYear();

  protected openCart(): void {
    this.cartOpen.set(true);
  }

  protected closeCart(): void {
    this.cartOpen.set(false);
  }
}
