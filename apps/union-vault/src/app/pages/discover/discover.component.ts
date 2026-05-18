import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';

type DiscoverTabId = 'calculators' | 'alerts' | 'rankings' | 'comparators' | 'lawsTaxes' | 'investorZone';

interface DiscoverTabView {
  readonly id: DiscoverTabId;
  readonly icon: string;
  readonly route: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly searchPlaceholder: string;
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly cards: readonly {
    readonly title: string;
    readonly description: string;
    readonly metric: string;
    readonly actionLabel: string;
  }[];
}

@Component({
  selector: 'ais-discover-page',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, RouterLink],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverPageComponent {
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);
  protected readonly activeTab = signal<DiscoverTabId>('calculators');
  protected readonly searchQuery = signal('');

  protected readonly resource = computed(() => this.localizationService.resource().discover);

  protected readonly tabs = computed<readonly DiscoverTabView[]>(() => {
    const tabs = this.resource().tabs;

    return [
      { id: 'calculators', icon: 'calculate', route: 'banks', ...tabs.calculators },
      { id: 'alerts', icon: 'notifications_active', route: 'currencies', ...tabs.alerts },
      { id: 'rankings', icon: 'leaderboard', route: 'discover', ...tabs.rankings },
      { id: 'comparators', icon: 'compare_arrows', route: 'discover', ...tabs.comparators },
      { id: 'lawsTaxes', icon: 'gavel', route: 'contact', ...tabs.lawsTaxes },
      { id: 'investorZone', icon: 'insights', route: 'real-estate', ...tabs.investorZone },
    ];
  });

  protected readonly currentTab = computed(
    () => this.tabs().find((tab) => tab.id === this.activeTab()) ?? this.tabs()[0],
  );

  protected readonly filteredCards = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase();
    const tab = this.currentTab();

    if (!query) {
      return tab.cards;
    }

    return tab.cards.filter((card) =>
      `${card.title} ${card.description} ${card.metric} ${card.actionLabel}`.toLocaleLowerCase().includes(query),
    );
  });

  protected selectTab(tabId: DiscoverTabId): void {
    this.activeTab.set(tabId);
    this.searchQuery.set('');
  }

  protected updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  protected cardRoute(route: string): readonly [string, string, string] {
    return ['/', this.countryService.selectedCountry().routeCode, route];
  }
}
