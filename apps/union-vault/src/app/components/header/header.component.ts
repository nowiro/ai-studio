import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';
import { CountrySelectorComponent } from '../country-selector/country-selector.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

@Component({
  selector: 'ais-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    CountrySelectorComponent,
    LanguageSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);
  protected readonly brandAriaLabel = computed(() => this.localizationService.resource().header.brandAriaLabel);
  protected readonly navigationAriaLabel = computed(
    () => this.localizationService.resource().header.navigationAriaLabel,
  );
  protected readonly mobileMenuAriaLabel = computed(
    () => this.localizationService.resource().header.mobileMenuAriaLabel,
  );
  protected readonly mobileCountryLabel = computed(() => this.localizationService.resource().header.mobileCountryLabel);

  protected readonly navItems = computed<readonly NavItem[]>(() => {
    const header = this.localizationService.resource().header;

    return [
      { label: header.navContact, icon: 'mail', route: 'contact' },
      { label: header.navBanks, icon: 'account_balance', route: 'banks' },
      { label: header.navCurrencies, icon: 'currency_exchange', route: 'currencies' },
      { label: header.navRealEstate, icon: 'real_estate_agent', route: 'real-estate' },
      { label: header.navDiscover, icon: 'hub', route: 'discover' },
    ];
  });
}
