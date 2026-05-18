import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EuCountry } from '../../data/eu-countries';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'ais-country-selector',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountrySelectorComponent {
  protected readonly countryService = inject(CountryService);

  selectCountry(country: EuCountry): void {
    this.countryService.selectCountry(country);
  }
}
