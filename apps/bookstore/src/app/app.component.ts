import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ShopCartService } from '@ai-studio/shop-core';
import { CartDrawerComponent, type ShopFooterSection, type ShopNavLink, ShopShellComponent } from '@ai-studio/shop-ui';

const NAV_LINKS: readonly ShopNavLink[] = [
  { label: 'Katalog', routerLink: ['/'] },
  { label: 'Nowości', routerLink: ['/new'] },
  { label: 'Promocje', routerLink: ['/promotions'] },
  { label: 'Kontakt', routerLink: ['/contact'] },
];

const FOOTER_SECTIONS: readonly ShopFooterSection[] = [
  {
    title: 'O nas',
    links: [
      { label: 'O sklepie', url: '#about' },
      { label: 'Blog', url: '#blog' },
      { label: 'Kariera', url: '#careers' },
    ],
  },
  {
    title: 'Pomoc',
    links: [
      { label: 'Kontakt', url: '#contact' },
      { label: 'Najczęstsze pytania', url: '#faq' },
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
    title: 'Płatności',
    links: [
      { label: 'BLIK', url: '#blik' },
      { label: 'Przelewy24', url: '#p24' },
      { label: 'Visa / MasterCard', url: '#cards' },
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
      brandLabel="Księgarnia"
      brandIcon="menu_book"
      footerNote="AI Studio · Demo księgarni"
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
