import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { RevealOnScrollDirective } from '@ai-studio/shared-app-shell';

import { injectT } from '../../services/language.service';

@Component({
  selector: 'ais-experience',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatIconModule, RevealOnScrollDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  protected readonly t = injectT();
}
