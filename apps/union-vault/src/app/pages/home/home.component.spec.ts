import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EU_COUNTRIES } from '../../data/eu-countries';
import { CountryService } from '../../services/country.service';
import { HomeComponent } from './home.component';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

registerLocaleData(localePl);

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let countryService: CountryService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter(TEST_ROUTES), { provide: LOCALE_ID, useValue: 'pl' }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    countryService = TestBed.inject(CountryService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero section', () => {
    const hero = fixture.nativeElement.querySelector('.hero-section');
    expect(hero).toBeTruthy();
  });

  it('should display UnionVault.eu in hero heading', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('UnionVault.eu');
  });

  it('should display selected country name in hero section', () => {
    const heroCountry = fixture.nativeElement.querySelector('.hero-country');
    expect(heroCountry.textContent).toContain('Polska');
  });

  it('should display selected country currency in hero section', () => {
    const heroCountry = fixture.nativeElement.querySelector('.hero-country');
    expect(heroCountry.textContent).toContain('PLN');
  });

  it('should render features chips section', () => {
    const features = fixture.nativeElement.querySelector('.features-section');
    expect(features).toBeTruthy();
  });

  it('should render 6 feature chips', () => {
    const chips = fixture.nativeElement.querySelectorAll('mat-chip');
    expect(chips.length).toBe(6);
  });

  it('should render 3 module cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('should render info section with 3 items', () => {
    const infoItems = fixture.nativeElement.querySelectorAll('.info-item');
    expect(infoItems.length).toBe(3);
  });

  it('should update hero country display when country changes', () => {
    const germany = EU_COUNTRIES.find((c) => c.code === 'DE')!;
    countryService.selectCountry(germany);
    fixture.detectChanges();
    const heroCountry = fixture.nativeElement.querySelector('.hero-country');
    expect(heroCountry.textContent).toContain('Germany');
  });

  // `modules` / `features` are `protected` (template-only); expose them via a
  // narrow test-only interface so the spec can read them without making the
  // component's public surface wider than necessary.
  interface HomeTestApi {
    readonly modules: () => readonly { readonly title: string }[];
    readonly features: () => readonly { readonly label: string }[];
  }
  const test = (): HomeTestApi => component as unknown as HomeTestApi;

  it('should have 3 modules defined', () => {
    expect(test().modules().length).toBe(3);
  });

  it('should render navigation actions for each module card', () => {
    const host = fixture.nativeElement as HTMLElement;
    const actionLinks = Array.from(host.querySelectorAll('.module-card mat-card-actions a')).map((link) =>
      link.getAttribute('href'),
    );

    expect(actionLinks).toEqual(['/pl/banks', '/pl/currencies', '/pl/real-estate']);
  });

  it('should have 6 features defined', () => {
    expect(test().features().length).toBe(6);
  });
});
