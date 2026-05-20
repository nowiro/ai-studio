import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ShopCartService } from '@ai-studio/shop-core';
import { CartDrawerComponent, type ShopFooterSection, type ShopNavLink, ShopShellComponent } from '@ai-studio/shop-ui';

const NAV_LINKS: readonly ShopNavLink[] = [
  { label: 'Elektronarzędzia', routerLink: ['/power'] },
  { label: 'Narzędzia ręczne', routerLink: ['/hand'] },
  { label: 'Akcesoria', routerLink: ['/accessories'] },
  { label: 'Promocje', routerLink: ['/promotions'] },
  { label: 'Hurt', routerLink: ['/bulk'] },
];

const FOOTER_SECTIONS: readonly ShopFooterSection[] = [
  {
    title: 'Asortyment',
    links: [
      { label: 'Wszystkie kategorie', url: '#all' },
      { label: 'Marki', url: '#brands' },
      { label: 'Hurtowe ceny', url: '#bulk' },
    ],
  },
  {
    title: 'Pomoc',
    links: [
      { label: 'Kontakt', url: '#contact' },
      { label: 'Najczęstsze pytania', url: '#faq' },
      { label: 'Serwis i gwarancja', url: '#service' },
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
    title: 'Dla firm',
    links: [
      { label: 'Konto firmowe', url: '#business' },
      { label: 'Faktury VAT', url: '#invoices' },
      { label: 'Wynajem narzędzi', url: '#rental' },
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
      brandLabel="Sklep z narzędziami"
      brandIcon="construction"
      footerNote="AI Studio · Demo sklepu z narzędziami"
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
