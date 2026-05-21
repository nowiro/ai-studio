import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AisFeatureCardComponent, AisSectionComponent } from '@ai-studio/ui-kit';

import { injectT } from '../../services/language.service';

/**
 * Services section — uses `<ais-section>` + `<ais-feature-card>` from
 * `@ai-studio/ui-kit` instead of bespoke layout markup. Primitive replaces
 * what used to be ~60 lines of SCSS (.services-grid + .service-card +
 * .service-icon-wrapper + reveal animations); tone-low background now
 * comes from the section's `tone="surface-low"` input.
 */
@Component({
  selector: 'ais-services',
  standalone: true,
  imports: [AisSectionComponent, AisFeatureCardComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly t = injectT();
}
