import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { getCookieConsentStrings } from '../../data/cookie-consent-translations';
import type { SupportedLanguageCode } from '../../i18n/i18n.types';
import { CookieConsentService } from '../../services/cookie-consent.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'ais-cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  private readonly consentService = inject(CookieConsentService);
  private readonly countryService = inject(CountryService);

  protected readonly isVisible = this.consentService.isVisible;
  protected readonly isManageOpen = signal(false);
  protected readonly analyticsChecked = signal(false);
  protected readonly marketingChecked = signal(false);

  protected readonly strings = computed(() => {
    const langCode = this.countryService.selectedLanguage().code as SupportedLanguageCode;
    return getCookieConsentStrings(langCode);
  });

  protected readonly privacyRoute = computed(() => [
    '/',
    this.countryService.selectedCountry().routeCode,
    'privacy-policy',
  ]);

  protected acceptAll(): void {
    this.consentService.acceptAll();
  }

  protected rejectAll(): void {
    this.consentService.rejectAll();
  }

  protected openManage(): void {
    const prefs = this.consentService.preferences();
    this.analyticsChecked.set(prefs.analytics);
    this.marketingChecked.set(prefs.marketing);
    this.isManageOpen.set(true);
  }

  protected savePreferences(): void {
    this.consentService.saveCustom(this.analyticsChecked(), this.marketingChecked());
    this.isManageOpen.set(false);
  }
}
