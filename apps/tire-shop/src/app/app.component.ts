import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { type ShopFooterSection, type ShopNavLink, ShopShellComponent } from '@ai-studio/shop-ui';
import { CartService } from '@ai-studio/tire-data';
import { CartDrawerComponent } from '@ai-studio/tire-feature-cart';

const NAV_LINKS: readonly ShopNavLink[] = [
  { label: 'Letnie', routerLink: ['/summer'] },
  { label: 'Zimowe', routerLink: ['/winter'] },
  { label: 'Całoroczne', routerLink: ['/all-season'] },
  { label: 'Promocje', routerLink: ['/promotions'] },
  { label: 'Kontakt', routerLink: ['/contact'] },
];

const FOOTER_SECTIONS: readonly ShopFooterSection[] = [
  {
    title: 'Sklep',
    links: [
      { label: 'Wszystkie opony', url: '#all' },
      { label: 'Marki', url: '#brands' },
      { label: 'Promocje', url: '#promos' },
    ],
  },
  {
    title: 'Pomoc',
    links: [
      { label: 'Dobór opon', url: '#picker' },
      { label: 'Montaż i wyważanie', url: '#mounting' },
      { label: 'Reklamacje', url: '#claims' },
    ],
  },
  {
    title: 'Polityki',
    links: [
      { label: 'Polityka prywatności', url: '#privacy' },
      { label: 'Regulamin', url: '#terms' },
      { label: 'Pliki cookies', url: '#cookies' },
    ],
  },
  {
    title: 'Kontakt',
    links: [
      { label: 'kontakt@tire-shop.example', url: 'mailto:kontakt@tire-shop.example' },
      { label: '+48 22 000 00 00', url: 'tel:+48220000000' },
      { label: 'pn–pt 8:00–17:00', url: '#hours' },
    ],
  },
];

/**
 * Root shell for the tire-shop app. Uses the shared `ais-shop-shell` layout
 * and keeps the legacy `CartService` + `CartDrawerComponent` from
 * `tire-feature-cart` for back-compat with `CartPageComponent` /
 * `CheckoutComponent` (the additive `TireCartAdapter` migration is tracked
 * as a follow-up).
 */
@Component({
  selector: 'ais-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CartDrawerComponent, RouterOutlet, ShopShellComponent],
  host: { class: 'block min-h-screen' },
  template: `
    <ais-shop-shell
      [navLinks]="navLinks"
      [cartCount]="cartCount()"
      [showSearch]="true"
      [footerSections]="footerSections"
      (cartOpenClick)="openCart()"
      brandLabel="Sklep z oponami"
      brandIcon="trip"
      footerNote="AI Studio · Demo sklepu z oponami"
    >
      <router-outlet />
    </ais-shop-shell>
    <ais-cart-drawer
      [isOpen]="cartOpen()"
      (closed)="closeCart()"
    />
  `,
})
export class AppComponent {
  private readonly cart = inject(CartService);
  protected readonly cartOpen = signal(false);
  protected readonly cartCount = computed(() => this.cart.count());
  protected readonly navLinks = NAV_LINKS;
  protected readonly footerSections = FOOTER_SECTIONS;

  protected openCart(): void {
    this.cartOpen.set(true);
  }

  protected closeCart(): void {
    this.cartOpen.set(false);
  }
}
