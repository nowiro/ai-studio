import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { injectT } from '../../services/language.service';

@Component({
  selector: 'ais-contact',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly t = injectT();

  protected readonly companyData = {
    name: 'NOWIRO',
    nip: '554 258 35 84',
    regon: '340824232',
    address: 'ul. Boiskowa 5E',
    city: '52-126 Wrocław',
    activeSince: '2010',
  };
}
