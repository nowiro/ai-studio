import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { filter, interval } from 'rxjs';

import { APP_VERSION } from '../version';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { HeaderComponent } from './components/header/header.component';
import { CountryService } from './services/country.service';
import { LocalizationService } from './services/localization.service';

@Component({
  selector: 'ais-root',
  imports: [RouterOutlet, RouterLink, MatDividerModule, MatTooltipModule, HeaderComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);

  protected readonly lastUpdated = signal(new Date());
  protected readonly currentYear = computed(() => this.lastUpdated().getFullYear());
  protected readonly footerLastUpdatedLabel = computed(
    () => this.localizationService.resource().footer.lastUpdatedLabel,
  );
  protected readonly formattedLastUpdated = computed(() =>
    new Intl.DateTimeFormat(this.localizationService.currentLocale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(this.lastUpdated()),
  );
  protected readonly fullLastUpdated = computed(() =>
    new Intl.DateTimeFormat(this.localizationService.currentLocale(), {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(this.lastUpdated()),
  );
  protected readonly appVersion = APP_VERSION;
  protected readonly privacyPolicyRoute = computed(() => [
    '/',
    this.countryService.selectedCountry().routeCode,
    'privacy-policy',
  ]);

  constructor() {
    this.syncCountryFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.syncCountryFromUrl(event.urlAfterRedirects);
      });

    interval(60_000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.lastUpdated.set(new Date());
      });
  }

  private syncCountryFromUrl(url: string): void {
    const countryCode = this.router.parseUrl(url).root.children['primary']?.segments[0]?.path;

    if (countryCode) {
      this.countryService.syncCountryFromRoute(countryCode);
    }
  }
}
