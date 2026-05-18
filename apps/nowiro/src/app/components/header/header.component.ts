import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { LanguageToggleComponent } from '@ai-studio/shared-language';

import { LanguageService } from '../../services/language.service';
import { scrollToFragment } from '../../shared/scroll';

@Component({
  selector: 'ais-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, LanguageToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class HeaderComponent {
  protected readonly scrolled = signal(false);
  protected readonly mobileMenuOpen = signal(false);

  protected readonly langService = inject(LanguageService);
  protected readonly t = this.langService.t;

  // The toggle shows the *next* language — click swaps. Flag + label + aria
  // are derived signals so the shared `<ais-language-toggle>` only takes
  // simple inputs and stays presentation-only (state lives here).
  protected readonly nextFlag = computed(() =>
    this.langService.lang() === 'pl' ? 'assets/flags/gb.svg' : 'assets/flags/pl.svg',
  );
  protected readonly nextLabel = computed(() => (this.langService.lang() === 'pl' ? 'EN' : 'PL'));
  protected readonly langAriaLabel = computed(() =>
    this.langService.lang() === 'pl' ? 'Switch to English' : 'Przełącz na polski',
  );

  private readonly router = inject(Router);

  protected navigateLang(): void {
    void this.router.navigate([this.langService.lang() === 'pl' ? '/en' : '/']);
  }

  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  protected scrollTo(fragment: string): void {
    this.mobileMenuOpen.set(false);
    scrollToFragment(fragment);
  }
}
