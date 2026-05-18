import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { EU_COUNTRIES, type EuCountry } from '../../data/eu-countries';
import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';
import {
  CREDIT_OFFERS,
  type CreditOffer,
  LOAN_TYPE_OPTIONS,
  type LoanType,
  RATE_MODE_OPTIONS,
  type RateMode,
} from './banks.data';

// CountryFilter widens to `string` (CreditOffer['countryCode'] is `string`, so
// `'all' | string` collapses). We use `string` directly and treat `'all'` as
// a runtime sentinel meaning "no country filter".
type LoanTypeFilter = 'all' | LoanType;
type RateModeFilter = 'all' | RateMode;

@Component({
  selector: 'ais-banks-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BanksPageComponent {
  private readonly countryService = inject(CountryService);
  private readonly localizationService = inject(LocalizationService);
  private readonly offerCountries = new Set(CREDIT_OFFERS.map((offer) => offer.countryCode));
  private readonly defaultCountryFilter = this.resolveDefaultCountryFilter();

  protected readonly offers = signal(CREDIT_OFFERS);
  protected readonly loanTypeOptions = LOAN_TYPE_OPTIONS;
  protected readonly rateModeOptions = RATE_MODE_OPTIONS;
  protected readonly countryFilter = signal<string>(this.defaultCountryFilter);
  protected readonly loanTypeFilter = signal<LoanTypeFilter>('all');
  protected readonly rateModeFilter = signal<RateModeFilter>('all');
  protected readonly requestedAmount = signal<number | null>(null);
  protected readonly requestedTermMonths = signal<number | null>(null);

  protected readonly countryOptions = computed(() =>
    EU_COUNTRIES.filter((country) => this.offerCountries.has(country.code)),
  );

  protected readonly filteredOffers = computed(() =>
    this.offers()
      .filter((offer) => this.countryFilter() === 'all' || offer.countryCode === this.countryFilter())
      .filter((offer) => this.loanTypeFilter() === 'all' || offer.loanType === this.loanTypeFilter())
      .filter((offer) => this.rateModeFilter() === 'all' || offer.rateMode === this.rateModeFilter())
      .filter((offer) => this.matchesRequestedAmount(offer))
      .filter((offer) => this.matchesRequestedTerm(offer))
      .slice()
      .sort((left: CreditOffer, right: CreditOffer) => {
        if (Boolean(left.badge) !== Boolean(right.badge)) {
          return left.badge ? -1 : 1;
        }

        return left.apr - right.apr;
      }),
  );

  protected readonly summary = computed(() => {
    const offers = this.filteredOffers();
    const lowestAprOffer = offers.reduce<CreditOffer | null>(
      (best: CreditOffer | null, offer: CreditOffer) => (!best || offer.apr < best.apr ? offer : best),
      null,
    );
    const fastestDecisionOffer = offers.reduce<CreditOffer | null>(
      (fastest: CreditOffer | null, offer: CreditOffer) =>
        !fastest || offer.decisionDays < fastest.decisionDays ? offer : fastest,
      null,
    );
    const widestAmountOffer = offers.reduce<CreditOffer | null>(
      (widest: CreditOffer | null, offer: CreditOffer) =>
        !widest || offer.maxAmount - offer.minAmount > widest.maxAmount - widest.minAmount ? offer : widest,
      null,
    );

    return {
      total: offers.length,
      lowestAprOffer,
      fastestDecisionOffer,
      widestAmountOffer,
    };
  });

  protected readonly hasActiveFilters = computed(
    () =>
      this.countryFilter() !== this.defaultCountryFilter ||
      this.loanTypeFilter() !== 'all' ||
      this.rateModeFilter() !== 'all' ||
      this.requestedAmount() !== null ||
      this.requestedTermMonths() !== null,
  );

  protected readonly selectedCountryLabel = computed(() => {
    if (this.countryFilter() === 'all') {
      return 'cała Unia Europejska';
    }

    return this.countryName(this.countryFilter());
  });

  protected setCountryFilter(value: string): void {
    if (value === 'all' || this.offerCountries.has(value)) {
      this.countryFilter.set(value);
    }
  }

  protected setLoanTypeFilter(value: string): void {
    if (value === 'all' || this.loanTypeOptions.some((option) => option.value === value)) {
      this.loanTypeFilter.set(value as LoanTypeFilter);
    }
  }

  protected setRateModeFilter(value: string): void {
    if (value === 'all' || this.rateModeOptions.some((option) => option.value === value)) {
      this.rateModeFilter.set(value as RateModeFilter);
    }
  }

  protected setRequestedAmount(value: string): void {
    this.requestedAmount.set(this.parsePositiveNumber(value));
  }

  protected setRequestedTerm(value: string): void {
    this.requestedTermMonths.set(this.parsePositiveNumber(value));
  }

  protected resetFilters(): void {
    this.countryFilter.set(this.defaultCountryFilter);
    this.loanTypeFilter.set('all');
    this.rateModeFilter.set('all');
    this.requestedAmount.set(null);
    this.requestedTermMonths.set(null);
  }

  protected countryName(countryCode: string): string {
    return this.findCountry(countryCode)?.name ?? countryCode;
  }

  protected countryFlag(countryCode: string): string {
    return this.findCountry(countryCode)?.flag ?? '🇪🇺';
  }

  protected loanTypeLabel(value: LoanType): string {
    return this.loanTypeOptions.find((option) => option.value === value)?.label ?? value;
  }

  protected rateModeLabel(value: RateMode): string {
    return this.rateModeOptions.find((option) => option.value === value)?.label ?? value;
  }

  protected formatMoney(value: number, currencyCode = 'EUR'): string {
    return new Intl.NumberFormat(this.localizationService.currentLocale(), {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  }

  protected formatPercent(value: number): string {
    return `${new Intl.NumberFormat(this.localizationService.currentLocale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  protected formatTermRange(minMonths: number, maxMonths: number): string {
    return `${this.formatMonths(minMonths)}–${this.formatMonths(maxMonths)}`;
  }

  private findCountry(countryCode: string): EuCountry | undefined {
    return EU_COUNTRIES.find((country) => country.code === countryCode);
  }

  private resolveDefaultCountryFilter(): string {
    const selectedCountryCode = this.countryService.selectedCountry().code;
    return this.offerCountries.has(selectedCountryCode) ? selectedCountryCode : 'all';
  }

  private matchesRequestedAmount(offer: CreditOffer): boolean {
    const amount = this.requestedAmount();
    return amount === null || (amount >= offer.minAmount && amount <= offer.maxAmount);
  }

  private matchesRequestedTerm(offer: CreditOffer): boolean {
    const term = this.requestedTermMonths();
    return term === null || (term >= offer.minTermMonths && term <= offer.maxTermMonths);
  }

  private parsePositiveNumber(value: string): number | null {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private formatMonths(months: number): string {
    if (months % 12 === 0) {
      const years = months / 12;

      if (years === 1) {
        return '1 rok';
      }

      if (years < 5) {
        return `${years} lata`;
      }

      return `${years} lat`;
    }

    return `${months} mies.`;
  }
}
