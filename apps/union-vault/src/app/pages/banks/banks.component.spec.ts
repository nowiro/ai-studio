import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BanksPageComponent } from './banks.component';

type BanksPageTestApi = BanksPageComponent & {
  countryFilter(): string;
  requestedAmount(): number | null;
  requestedTermMonths(): number | null;
  filteredOffers(): readonly { countryCode: string; loanType: string; rateMode: string }[];
  setCountryFilter(value: string): void;
  setLoanTypeFilter(value: string): void;
  setRateModeFilter(value: string): void;
  setRequestedAmount(value: string): void;
  setRequestedTerm(value: string): void;
  resetFilters(): void;
};

registerLocaleData(localePl);

describe('BanksPageComponent', () => {
  let fixture: ComponentFixture<BanksPageComponent>;
  let component: BanksPageComponent;
  let page: BanksPageTestApi;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [BanksPageComponent],
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'pl' }],
    }).compileComponents();

    fixture = TestBed.createComponent(BanksPageComponent);
    component = fixture.componentInstance;
    page = component as BanksPageTestApi;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page header and default PL scope', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    const chips = fixture.nativeElement.querySelector('.header-chips');

    expect(heading.textContent).toContain('Oferty kredytowe');
    expect(chips.textContent).toContain('Polska');
  });

  it('should render cards for the default filtered offers', () => {
    const cards = fixture.nativeElement.querySelectorAll('.offer-card');

    expect(cards.length).toBe(3);
  });

  it('should filter offers by country', () => {
    page.setCountryFilter('DE');
    fixture.detectChanges();

    expect(page.filteredOffers().length).toBe(2);
    expect(page.filteredOffers().every((offer: { countryCode: string }) => offer.countryCode === 'DE')).toBe(true);
  });

  it('should combine product and rate filters', () => {
    page.setCountryFilter('all');
    page.setLoanTypeFilter('mortgage');
    page.setRateModeFilter('fixed');
    fixture.detectChanges();

    const renderedCards = fixture.nativeElement.querySelectorAll('.offer-card');

    expect(renderedCards.length).toBeGreaterThan(0);
    expect(page.filteredOffers().every((offer: { loanType: string }) => offer.loanType === 'mortgage')).toBe(true);
    expect(page.filteredOffers().every((offer: { rateMode: string }) => offer.rateMode === 'fixed')).toBe(true);
  });

  it('should show empty state when amount and term do not match any offer', () => {
    page.setCountryFilter('PL');
    page.setLoanTypeFilter('cash');
    page.setRequestedAmount('500000');
    page.setRequestedTerm('360');
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');

    expect(page.filteredOffers().length).toBe(0);
    expect(emptyState).toBeTruthy();
  });

  it('should reset filters back to defaults', () => {
    page.setCountryFilter('DE');
    page.setRequestedAmount('250000');
    page.setRequestedTerm('240');
    page.resetFilters();
    fixture.detectChanges();

    expect(page.countryFilter()).toBe('PL');
    expect(page.requestedAmount()).toBeNull();
    expect(page.requestedTermMonths()).toBeNull();
  });
});
