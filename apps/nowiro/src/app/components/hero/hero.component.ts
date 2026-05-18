import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { injectT } from '../../services/language.service';
import { scrollToFragment } from '../../shared/scroll';

@Component({
  selector: 'ais-hero',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly t = injectT();
  protected readonly scrollTo = scrollToFragment;
}
