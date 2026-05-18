import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EMPTY } from 'rxjs';

import { DEFAULT_COMPARE_CODES } from '../../data/eu-exchange-rates';
import { CurrencyApiService } from '../../services/currency-api.service';
import { CurrencyPageComponent } from './currency.component';

type CurrencyPageTestApi = CurrencyPageComponent & {
  fromCode(): string;
  toCode(): string;
  amount(): number;
  resolvedCompareCodes(): string[];
  swapCurrencies(): void;
  setAmount(value: string): void;
  setCompareCodes(codes: string[]): void;
  formatAmount(value: number, digits?: number): string;
};

registerLocaleData(localePl);

describe('CurrencyPageComponent', () => {
  let component: CurrencyPageComponent;
  let page: CurrencyPageTestApi;
  let fixture: ComponentFixture<CurrencyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyPageComponent],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'pl' },
        { provide: CurrencyApiService, useValue: { fetchRates: () => EMPTY } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyPageComponent);
    component = fixture.componentInstance;
    page = component as unknown as CurrencyPageTestApi;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page header', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Kursy walut');
  });

  it('should render overview cards and converter card', () => {
    const overviewCards = fixture.nativeElement.querySelectorAll('.overview-card');
    const converterCard = fixture.nativeElement.querySelector('.converter-card');

    expect(overviewCards.length).toBe(4);
    expect(converterCard).toBeTruthy();
  });

  it('should default fromCode to country currency (PLN for Poland)', () => {
    expect(page.fromCode()).toBe('PLN');
  });

  it('should have default amount 100', () => {
    expect(page.amount()).toBe(100);
  });

  it('should display converted amount', () => {
    const result = fixture.nativeElement.querySelector('.result-amount');
    expect(result).toBeTruthy();
    expect(result.textContent.trim().length).toBeGreaterThan(0);
  });

  it('should default to app aggregate source', () => {
    const sourceChip = fixture.nativeElement.querySelector('.source-chip');
    expect(sourceChip.textContent).toContain('średnia');
  });

  it('should swap currencies on swapCurrencies()', () => {
    const initialFrom = page.fromCode();
    const initialTo = page.toCode();
    page.swapCurrencies();
    expect(page.fromCode()).toBe(initialTo);
    expect(page.toCode()).toBe(initialFrom);
  });

  it('should set amount via setAmount()', () => {
    page.setAmount('250');
    expect(page.amount()).toBe(250);
  });

  it('should set amount to 0 for negative values', () => {
    page.setAmount('-10');
    expect(page.amount()).toBe(0);
  });

  it('should set amount to 0 for invalid input', () => {
    page.setAmount('abc');
    expect(page.amount()).toBe(0);
  });

  it('should render rates table with provider columns', () => {
    const table = fixture.nativeElement.querySelector('.rates-table');
    const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>);

    expect(table).toBeTruthy();
    expect(headers.some((cell) => cell.textContent?.includes('ECB'))).toBe(true);
    expect(headers.some((cell) => cell.textContent?.includes('Frankfurter'))).toBe(true);
    expect(headers.some((cell) => cell.textContent?.includes('FloatRates'))).toBe(true);
  });

  it('should display comparison rows for default compare codes', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(DEFAULT_COMPARE_CODES.length);
  });

  it('should format amount with Polish locale', () => {
    const formatted = page.formatAmount(1234.5);
    expect(formatted).toContain('1');
    expect(formatted).toContain('234');
  });

  it('should sanitize compare codes so base currency is excluded', () => {
    // fromCode defaults to PLN (Poland); PLN must be excluded from compareCodes
    page.setCompareCodes(['PLN', 'EUR', 'CZK']);
    expect(page.resolvedCompareCodes()).not.toContain('PLN');
  });

  it('should render the line chart', () => {
    const chart = fixture.nativeElement.querySelector('.trend-chart');
    expect(chart).toBeTruthy();
  });

  it('should not render the previously incorrect future timestamp', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('17:00');
  });

  it('should render country-aware legal disclaimer scaffold', () => {
    const disclaimer = fixture.nativeElement.querySelector('.disclaimer');
    expect(disclaimer.textContent).toContain('Informacja prawna');
    expect(disclaimer.textContent).toContain('Polska');
  });
});
