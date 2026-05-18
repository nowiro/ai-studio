import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(TEST_ROUTES)],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should display brand name in logo alt text', () => {
    const logo = fixture.nativeElement.querySelector('.toolbar-logo-full');
    expect(logo.getAttribute('alt')).toContain('UnionVault');
  });

  it('should render full logo with logo.svg', () => {
    const img = fixture.nativeElement.querySelector('.toolbar-logo-full');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('logo.svg');
  });

  it('should render mobile icon with icon.svg', () => {
    const img = fixture.nativeElement.querySelector('.toolbar-logo-icon');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('icon.svg');
  });

  it('should render country selector component', () => {
    const countrySelector = fixture.nativeElement.querySelector('ais-country-selector');
    expect(countrySelector).toBeTruthy();
  });

  it('should render language switcher component', () => {
    const languageSwitcher = fixture.nativeElement.querySelector('ais-language-switcher');
    expect(languageSwitcher).toBeTruthy();
  });

  it('should render hamburger button for mobile', () => {
    const hamburger = fixture.nativeElement.querySelector('.hamburger-button');
    expect(hamburger).toBeTruthy();
  });

  // `navItems` is `protected` (used by the template); cast to a test-only API
  // so we can read it from outside the class without making it public.
  interface HeaderTestApi {
    readonly navItems: () => readonly { route: string; label: string; icon: string }[];
  }
  const test = (): HeaderTestApi => component as unknown as HeaderTestApi;

  it('should have 5 nav items', () => {
    expect(test().navItems().length).toBe(5);
  });

  it('should expose routes for contact, banks, currencies, real-estate and discover', () => {
    expect(
      test()
        .navItems()
        .map((item) => item.route),
    ).toEqual(['contact', 'banks', 'currencies', 'real-estate', 'discover']);
  });

  it('should render navigation links as enabled buttons', () => {
    const host = fixture.nativeElement as HTMLElement;
    const desktopButtons = Array.from(host.querySelectorAll('.desktop-nav .nav-button'));
    expect(desktopButtons.length).toBe(5);
    expect(Array.from(desktopButtons).every((button) => !button.hasAttribute('disabled'))).toBe(true);
  });

  it('should have toolbar brand with routerLink to the selected country home', () => {
    const brand = fixture.nativeElement.querySelector('.toolbar-brand');
    expect(brand.getAttribute('href')).toBe('/pl');
  });
});
