import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EuLanguage } from '../../data/eu-languages';
import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'ais-language-switcher',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, UpperCasePipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);
  protected readonly triggerAriaLabel = computed(() =>
    this.localizationService.translate('languageSwitcher.ariaLabel'),
  );
  protected readonly menuTitle = computed(() => this.localizationService.translate('languageSwitcher.menuTitle'));
  protected readonly selectedTooltip = computed(() =>
    this.localizationService.translate('languageSwitcher.selectedTooltip', {
      language: this.countryService.selectedLanguage().nativeName,
    }),
  );

  selectLanguage(language: EuLanguage): void {
    this.countryService.selectLanguage(language);
  }
}
