import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { LanguageService } from './services/language.service';

@Component({
  imports: [
    RouterModule,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ExperienceComponent,
    ContactComponent,
    FooterComponent,
  ],
  selector: 'ais-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor() {
    const lang = inject(LanguageService).lang;
    effect(() => {
      document.documentElement.lang = lang();
    });
  }
}
