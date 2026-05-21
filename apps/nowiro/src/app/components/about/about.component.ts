import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AisSectionComponent, AisStatTileComponent } from '@ai-studio/ui-kit';

import { injectT } from '../../services/language.service';

/**
 * About section — uses `<ais-section>` + `<ais-stat-tile>` from ui-kit.
 * The 4 KPI tiles previously hand-rolled (.stat-card / .stat-icon /
 * .stat-value / .stat-label) collapse into one primitive call per stat.
 */
@Component({
  selector: 'ais-about',
  standalone: true,
  imports: [AisSectionComponent, AisStatTileComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly t = injectT();
}
