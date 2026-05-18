import { LOCALE_ID } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EMPTY } from 'rxjs';

import { CurrencyApiService } from '../../services/currency-api.service';
import { RealEstatePageComponent } from './real-estate.component';

type RealEstatePageTestApi = RealEstatePageComponent & {
  filteredListings(): { id: string; propertyType: string; city: string }[];
  selectedCountryCode(): string;
  selectedListing(): { city: string } | null;
  setCountryCode(countryCode: string): void;
  setPropertyType(propertyType: string): void;
  setPriceBand(priceBand: string): void;
  setBedrooms(bedrooms: string): void;
  selectListing(listingId: string): void;
  resetFilters(): void;
};

describe('RealEstatePageComponent', () => {
  let fixture: ComponentFixture<RealEstatePageComponent>;
  let component: RealEstatePageComponent;
  let page: RealEstatePageTestApi;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [RealEstatePageComponent],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'pl' },
        { provide: CurrencyApiService, useValue: { fetchRates: () => EMPTY } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RealEstatePageComponent);
    component = fixture.componentInstance;
    page = component as unknown as RealEstatePageTestApi;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page header and map-ready panel', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    const mapPanel = fixture.nativeElement.querySelector('.map-card');

    expect(heading?.textContent).toContain('Rynek nieruchomości w UE');
    expect(mapPanel).toBeTruthy();
  });

  it('should default to the selected country from CountryService', () => {
    expect(page.selectedCountryCode()).toBe('PL');
    expect(page.filteredListings().length).toBe(2);
  });

  it('should filter listings by property type', () => {
    page.setCountryCode('ALL');
    page.setPropertyType('house');
    fixture.detectChanges();

    expect(page.filteredListings().length).toBe(3);
    expect(page.filteredListings().every((listing) => listing.propertyType === 'house')).toBe(true);
  });

  it('should combine filters and show an empty state when nothing matches', () => {
    page.setCountryCode('PT');
    page.setPropertyType('house');
    page.setPriceBand('under-250k');
    page.setBedrooms('4');
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');

    expect(page.filteredListings().length).toBe(0);
    expect(emptyState?.textContent).toContain('Brak wyników');
  });

  it('should update the detail panel when a listing is selected', () => {
    page.setCountryCode('ALL');
    page.selectListing('pt-lisbon-innovation');
    fixture.detectChanges();

    expect(page.selectedListing()?.city).toBe('Lizbona');
    expect(fixture.nativeElement.querySelector('.selection-details')?.textContent).toContain('Lizbona');
  });

  it('should reset filters back to the default country view', () => {
    page.setCountryCode('ALL');
    page.setPropertyType('commercial');
    page.setPriceBand('750k-plus');
    fixture.detectChanges();

    page.resetFilters();
    fixture.detectChanges();

    expect(page.selectedCountryCode()).toBe('PL');
    expect(page.filteredListings().length).toBe(2);
  });
});
