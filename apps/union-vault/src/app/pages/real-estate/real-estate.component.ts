import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { getCountryPreferences } from '../../data/country-preferences';
import { EU_COUNTRIES, EuCountry } from '../../data/eu-countries';
import { CountryService } from '../../services/country.service';
import { CurrencyService } from '../../services/currency.service';
import {
  AVAILABILITY_LABELS,
  BEDROOM_OPTIONS,
  PRICE_BAND_OPTIONS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPE_OPTIONS,
  REAL_ESTATE_LISTINGS,
  RealEstateBedroomsFilter,
  RealEstateListing,
  RealEstatePriceBand,
  RealEstatePropertyType,
} from './real-estate.data';

const ALL_COUNTRIES_VALUE = 'ALL';

type RealEstateCountryOption = Pick<EuCountry, 'code' | 'name' | 'flag'>;

@Component({
  selector: 'ais-real-estate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './real-estate.component.html',
  styleUrl: './real-estate.component.scss',
})
export class RealEstatePageComponent {
  protected readonly countryService = inject(CountryService);
  private readonly currencyService = inject(CurrencyService);
  private readonly countryLookup = new Map(EU_COUNTRIES.map((country) => [country.code, country]));
  protected readonly listings = REAL_ESTATE_LISTINGS;
  private readonly initialCountryCode = this.resolveInitialCountryCode();

  protected readonly propertyTypeOptions = PROPERTY_TYPE_OPTIONS;
  protected readonly priceBandOptions = PRICE_BAND_OPTIONS;
  protected readonly bedroomOptions = BEDROOM_OPTIONS;

  protected readonly selectedCountryCode = signal<string>(this.initialCountryCode);
  protected readonly selectedPropertyType = signal<'all' | RealEstatePropertyType>('all');
  protected readonly selectedPriceBand = signal<RealEstatePriceBand>('all');
  protected readonly selectedBedrooms = signal<RealEstateBedroomsFilter>('any');
  protected readonly selectedListingId = signal<string | null>(null);

  protected readonly countryOptions = computed<RealEstateCountryOption[]>(() =>
    Array.from(new Set(this.listings.map((listing) => listing.countryCode)))
      .map((countryCode) => this.countryLookup.get(countryCode))
      .filter((country): country is EuCountry => !!country)
      .sort((left, right) => left.name.localeCompare(right.name, 'pl'))
      .map(({ code, name, flag }) => ({ code, name, flag })),
  );

  protected readonly filteredListings = computed(() =>
    this.listings
      .filter((listing) => this.matchesCountry(listing))
      .filter((listing) => this.matchesPropertyType(listing))
      .filter((listing) => this.matchesPriceBand(listing))
      .filter((listing) => this.matchesBedrooms(listing))
      .sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured) || left.priceEur - right.priceEur),
  );

  protected readonly selectedListing = computed(() => {
    const currentSelection = this.selectedListingId();
    const visibleListings = this.filteredListings();
    return visibleListings.find((listing) => listing.id === currentSelection) ?? visibleListings[0] ?? null;
  });

  protected readonly overview = computed(() => {
    const visibleListings = this.filteredListings();
    const prices = visibleListings.map((listing) => listing.priceEur);
    const averagePrice = prices.length ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0;

    return {
      totalVisible: visibleListings.length,
      totalAvailable: this.listings.length,
      averagePrice,
      featuredCount: visibleListings.filter((listing) => listing.isFeatured).length,
      countriesCovered: new Set(visibleListings.map((listing) => listing.countryCode)).size,
    };
  });

  protected readonly hasResults = computed(() => this.filteredListings().length > 0);

  protected readonly hasActiveFilters = computed(
    () =>
      this.selectedCountryCode() !== this.initialCountryCode ||
      this.selectedPropertyType() !== 'all' ||
      this.selectedPriceBand() !== 'all' ||
      this.selectedBedrooms() !== 'any',
  );

  protected readonly selectedCountryLabel = computed(() => {
    const countryCode = this.selectedCountryCode();
    if (countryCode === ALL_COUNTRIES_VALUE) {
      return 'całej Unii Europejskiej';
    }

    return this.countryLookup.get(countryCode)?.name ?? 'wybranego kraju';
  });

  protected readonly localCurrencyCode = computed(() => {
    const listing = this.selectedListing();
    if (!listing) return 'EUR';
    return getCountryPreferences(listing.countryCode).defaultCurrencyCode;
  });

  protected readonly localCurrencyPrice = computed(() => {
    const listing = this.selectedListing();
    if (!listing) return null;
    const targetCode = this.localCurrencyCode();
    if (targetCode === 'EUR') return null;
    const converted = this.currencyService.convert(listing.priceEur, 'EUR', targetCode);
    return converted > 0 ? converted : null;
  });

  protected setCountryCode(countryCode: string): void {
    const availableCountryCodes = this.countryOptions().map((country) => country.code);
    this.selectedCountryCode.set(
      countryCode === ALL_COUNTRIES_VALUE || availableCountryCodes.includes(countryCode)
        ? countryCode
        : this.initialCountryCode,
    );
    this.selectedListingId.set(null);
  }

  protected setPropertyType(propertyType: string): void {
    const allowedValues = this.propertyTypeOptions.map((option) => option.value);
    this.selectedPropertyType.set(
      allowedValues.includes(propertyType as 'all' | RealEstatePropertyType)
        ? (propertyType as 'all' | RealEstatePropertyType)
        : 'all',
    );
    this.selectedListingId.set(null);
  }

  protected setPriceBand(priceBand: string): void {
    const allowedValues = this.priceBandOptions.map((option) => option.value);
    this.selectedPriceBand.set(
      allowedValues.includes(priceBand as RealEstatePriceBand) ? (priceBand as RealEstatePriceBand) : 'all',
    );
    this.selectedListingId.set(null);
  }

  protected setBedrooms(bedrooms: string): void {
    const allowedValues = this.bedroomOptions.map((option) => option.value);
    this.selectedBedrooms.set(
      allowedValues.includes(bedrooms as RealEstateBedroomsFilter) ? (bedrooms as RealEstateBedroomsFilter) : 'any',
    );
    this.selectedListingId.set(null);
  }

  protected selectListing(listingId: string): void {
    this.selectedListingId.set(listingId);
  }

  protected resetFilters(): void {
    this.selectedCountryCode.set(this.initialCountryCode);
    this.selectedPropertyType.set('all');
    this.selectedPriceBand.set('all');
    this.selectedBedrooms.set('any');
    this.selectedListingId.set(null);
  }

  protected readSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement | null)?.value ?? '';
  }

  protected countryFlag(countryCode: string): string {
    return this.countryLookup.get(countryCode)?.flag ?? '\uD83C\uDFF3\uFE0F';
  }

  protected countryName(countryCode: string): string {
    return this.countryLookup.get(countryCode)?.name ?? countryCode;
  }

  protected propertyTypeLabel(propertyType: RealEstatePropertyType): string {
    return PROPERTY_TYPE_LABELS[propertyType];
  }

  protected availabilityLabel(availability: RealEstateListing['availability']): string {
    return AVAILABILITY_LABELS[availability];
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  protected formatLocalPrice(price: number, currencyCode: string): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(price);
  }

  protected formatArea(areaSqm: number): string {
    return `${new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(areaSqm)} m\u00B2`;
  }

  protected formatCoordinates(listing: RealEstateListing): string {
    return `${listing.latitude.toFixed(4)}, ${listing.longitude.toFixed(4)}`;
  }

  private resolveInitialCountryCode(): string {
    const selectedCountryCode = this.countryService.selectedCountry().code;
    return this.listings.some((listing) => listing.countryCode === selectedCountryCode)
      ? selectedCountryCode
      : ALL_COUNTRIES_VALUE;
  }

  private matchesCountry(listing: RealEstateListing): boolean {
    return this.selectedCountryCode() === ALL_COUNTRIES_VALUE || listing.countryCode === this.selectedCountryCode();
  }

  private matchesPropertyType(listing: RealEstateListing): boolean {
    return this.selectedPropertyType() === 'all' || listing.propertyType === this.selectedPropertyType();
  }

  private matchesPriceBand(listing: RealEstateListing): boolean {
    switch (this.selectedPriceBand()) {
      case 'under-250k':
        return listing.priceEur < 250000;
      case '250k-500k':
        return listing.priceEur >= 250000 && listing.priceEur < 500000;
      case '500k-750k':
        return listing.priceEur >= 500000 && listing.priceEur < 750000;
      case '750k-plus':
        return listing.priceEur >= 750000;
      default:
        return true;
    }
  }

  private matchesBedrooms(listing: RealEstateListing): boolean {
    const minimumBedrooms = Number(this.selectedBedrooms());
    return Number.isNaN(minimumBedrooms) || listing.bedrooms >= minimumBedrooms;
  }
}
