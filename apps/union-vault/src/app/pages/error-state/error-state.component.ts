import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';

type ErrorStateVariant = 'notFound' | 'serverError';

@Component({
  selector: 'ais-error-state-page',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStatePageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);
  protected readonly variant = (this.route.snapshot.data['variant'] as ErrorStateVariant | undefined) ?? 'notFound';

  protected readonly viewModel = computed(() => {
    const resource = this.localizationService.resource().errors;

    return this.variant === 'serverError'
      ? {
          badge: resource.serverErrorBadge,
          title: resource.serverErrorTitle,
          description: resource.serverErrorDescription,
          icon: 'error_outline',
        }
      : {
          badge: resource.notFoundBadge,
          title: resource.notFoundTitle,
          description: resource.notFoundDescription,
          icon: 'search_off',
        };
  });

  protected readonly homeRoute = computed(() => ['/', this.countryService.selectedCountry().routeCode] as const);

  protected readonly contactRoute = computed(
    () => ['/', this.countryService.selectedCountry().routeCode, 'contact'] as const,
  );

  protected readonly banksRoute = computed(
    () => ['/', this.countryService.selectedCountry().routeCode, 'banks'] as const,
  );

  protected readonly currenciesRoute = computed(
    () => ['/', this.countryService.selectedCountry().routeCode, 'currencies'] as const,
  );
}
