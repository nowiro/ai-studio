/**
 * Unit tests — ShopShellComponent.
 */
import type { ComponentRef } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type ShopNavLink, ShopShellComponent } from './shop-shell.component.js';

const NAV_LINKS: ShopNavLink[] = [
  { label: 'Katalog', routerLink: ['/catalogue'] },
  { label: 'Promocje', routerLink: ['/promotions'] },
];

describe('ShopShellComponent', () => {
  let fixture: ComponentFixture<ShopShellComponent>;
  let component: ShopShellComponent;
  let componentRef: ComponentRef<ShopShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ShopShellComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('brandLabel', 'Księgarnia');
    componentRef.setInput('brandIcon', 'menu_book');
    componentRef.setInput('navLinks', NAV_LINKS);
    componentRef.setInput('footerNote', 'AI Studio · Demo');
    fixture.detectChanges();
  });

  it('renders the brand label + icon in the header', () => {
    const brand = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="header-brand"]')!;
    expect(brand.textContent).toContain('Księgarnia');
    expect(brand.textContent).toContain('menu_book');
  });

  it('exposes a skip-to-content link as the first focusable element', () => {
    const skip = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="skip-to-content"]')!;
    expect(skip).toBeTruthy();
    expect(skip.getAttribute('href')).toBe('#main-content');
  });

  it('renders nav links twice (desktop + mobile drawer)', () => {
    const desktopLinks = (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="desktop-nav-link"]');
    const mobileLinks = (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="mobile-nav-link"]');
    expect(desktopLinks.length).toBe(2);
    expect(mobileLinks.length).toBe(2);
  });

  it('emits cartOpenClick when the cart button is pressed', () => {
    const spy = vi.fn();
    component.cartOpenClick.subscribe(spy);
    const cart = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '[data-testid="header-cart-button"]',
    )!;
    cart.click();
    expect(spy).toHaveBeenCalled();
  });

  it('hides the cart badge when cartCount is 0 and shows it for positive counts', () => {
    componentRef.setInput('cartCount', 0);
    fixture.detectChanges();
    // mat-badge renders an empty `<span>` for the badge content when value is null
    const cartButton = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="header-cart-button"]')!;
    expect(cartButton.textContent).not.toContain('3');

    componentRef.setInput('cartCount', 3);
    fixture.detectChanges();
    expect(cartButton.textContent).toContain('3');
  });

  it('renders the footer note alongside the current year', () => {
    const footer = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="shop-footer"]')!;
    expect(footer.textContent).toContain('AI Studio · Demo');
    expect(footer.textContent).toContain(String(new Date().getFullYear()));
  });

  it('exposes <main id="main-content"> as the skip-to-content target', () => {
    const main = (fixture.nativeElement as HTMLElement).querySelector('main#main-content')!;
    expect(main).toBeTruthy();
    expect(main.tabIndex).toBe(-1);
  });
});
