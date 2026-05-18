import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { injectT } from '../../services/language.service';

@Component({
  selector: 'ais-about',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly t = injectT();
}
