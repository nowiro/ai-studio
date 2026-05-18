import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'ais-privacy-policy',
  imports: [RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyPageComponent {
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);
  protected readonly homeRoute = computed(() => ['/', this.countryService.selectedCountry().routeCode]);
  protected readonly lastUpdated = '2026-03-20';
}
