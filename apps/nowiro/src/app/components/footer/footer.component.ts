import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { injectT } from '../../services/language.service';

@Component({
  selector: 'ais-footer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly t = injectT();
  protected readonly currentYear = computed(() => new Date().getFullYear());
}
