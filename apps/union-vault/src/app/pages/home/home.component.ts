import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';

interface HomeModuleCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly route: string;
  readonly actionLabel: string;
}

interface HomeDiscoverCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'ais-home',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);
  protected readonly resource = computed(() => this.localizationService.resource().home);
  protected readonly selectedCountryLabel = computed(() => this.localizationService.currentCountryLabel());

  protected readonly modules = computed<readonly HomeModuleCard[]>(() => {
    const modules = this.resource().modules;

    return [
      {
        icon: 'account_balance',
        title: modules.banksTitle,
        description: modules.banksDescription,
        status: modules.statusAvailable,
        route: 'banks',
        actionLabel: modules.banksAction,
      },
      {
        icon: 'currency_exchange',
        title: modules.currenciesTitle,
        description: modules.currenciesDescription,
        status: modules.statusAvailable,
        route: 'currencies',
        actionLabel: modules.currenciesAction,
      },
      {
        icon: 'real_estate_agent',
        title: modules.realEstateTitle,
        description: modules.realEstateDescription,
        status: modules.statusAvailable,
        route: 'real-estate',
        actionLabel: modules.realEstateAction,
      },
    ];
  });

  protected readonly features = computed(() => {
    const features = this.resource().features;

    return [
      { icon: 'language', label: features.languages },
      { icon: 'public', label: features.countries },
      { icon: 'update', label: features.cadence },
      { icon: 'security', label: features.compliance },
      { icon: 'map', label: features.maps },
      { icon: 'verified', label: features.sources },
    ];
  });

  protected readonly infoItems = computed(() => {
    const info = this.resource().info;

    return [
      {
        icon: 'gavel',
        title: info.complianceTitle,
        description: info.complianceDescription,
      },
      {
        icon: 'verified_user',
        title: info.sourcesTitle,
        description: info.sourcesDescription,
      },
      {
        icon: 'smart_toy',
        title: info.aiTitle,
        description: info.aiDescription,
      },
    ];
  });

  protected readonly discoverCards = computed<readonly HomeDiscoverCard[]>(() => {
    const tabs = this.localizationService.resource().discover.tabs;

    return [
      {
        icon: 'calculate',
        title: tabs.calculators.title,
        description: tabs.calculators.description,
      },
      {
        icon: 'notifications_active',
        title: tabs.alerts.title,
        description: tabs.alerts.description,
      },
      {
        icon: 'leaderboard',
        title: tabs.rankings.title,
        description: tabs.rankings.description,
      },
      {
        icon: 'compare_arrows',
        title: tabs.comparators.title,
        description: tabs.comparators.description,
      },
      {
        icon: 'gavel',
        title: tabs.lawsTaxes.title,
        description: tabs.lawsTaxes.description,
      },
      {
        icon: 'insights',
        title: tabs.investorZone.title,
        description: tabs.investorZone.description,
      },
    ];
  });

  protected moduleRoute(route: string): readonly [string, string, string] {
    return ['/', this.countryService.selectedCountry().routeCode, route];
  }

  protected readonly discoverRoute = computed(
    () => ['/', this.countryService.selectedCountry().routeCode, 'discover'] as const,
  );
}
