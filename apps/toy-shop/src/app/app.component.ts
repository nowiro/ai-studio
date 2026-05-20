import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ShopCartService } from '@ai-studio/shop-core';
import { CartDrawerComponent, type ShopFooterSection, type ShopNavLink, ShopShellComponent } from '@ai-studio/shop-ui';

const NAV_LINKS: readonly ShopNavLink[] = [
  { label: '0–3 lata', routerLink: ['/age/0-3'] },
  { label: '3–6 lat', routerLink: ['/age/3-6'] },
  { label: '6+ lat', routerLink: ['/age/6+'] },
  { label: 'Edukacyjne', routerLink: ['/educational'] },
  { label: 'Promocje', routerLink: ['/promotions'] },
];

const FOOTER_SECTIONS: readonly ShopFooterSection[] = [
  {
    title: 'Wybierz wiek',
    links: [
      { label: '0–3 lata', url: '#age-0-3' },
      { label: '3–6 lat', url: '#age-3-6' },
      { label: '6+ lat', url: '#age-6+' },
    ],
  },
  {
    title: 'Pomoc',
    links: [
      { label: 'Kontakt', url: '#contact' },
      { label: 'Bezpieczeństwo zabawek', url: '#safety' },
      { label: 'Dostawa i zwroty', url: '#shipping' },
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
    title: 'Dla rodziców',
    links: [
      { label: 'Blog rodzicielski', url: '#blog' },
      { label: 'Newsletter', url: '#newsletter' },
      { label: 'Karta podarunkowa', url: '#gift-card' },
    ],
  },
];

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
      brandLabel="Sklep z zabawkami"
      brandIcon="toys"
      footerNote="AI Studio · Demo sklepu z zabawkami"
    >
      <router-outlet />
    </ais-shop-shell>
    <ais-shop-cart-drawer
      [isOpen]="cartOpen()"
      (closed)="closeCart()"
    />
  `,
})
export class AppComponent {
  private readonly cart = inject(ShopCartService);
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
