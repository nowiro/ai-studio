import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { RevealOnScrollDirective } from '@ai-studio/shared-app-shell';

import { injectT } from '../../services/language.service';

@Component({
  selector: 'ais-services',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RevealOnScrollDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly t = injectT();
}
