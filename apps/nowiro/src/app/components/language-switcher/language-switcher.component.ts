import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LocalizationApi } from '@ai-studio/shared-i18n';

/**
 * Transloco i18n demo (best-practices plan T008 / ADR-0017).
 *
 * Smallest end-to-end proof that runtime i18n works: a PL/EN switch wired to the
 * `LocalizationApi` facade (apps never touch `TranslocoService` directly — ADR-0017
 * §wrap-before-consume). The label is resolved through the facade's `translate()`
 * against `apps/nowiro/public/assets/i18n/{pl,en}.json`; `label` re-computes when
 * `currentLang()` changes, so switching language updates the UI.
 *
 * Depends only on `LocalizationApi` (no `transloco` pipe), so consuming views stay
 * trivially testable with a stubbed facade. The rest of nowiro still uses the legacy
 * in-code dictionary (`injectT()`) — the staged-migration seam in `app.config.ts`.
 */
@Component({
  selector: 'ais-language-switcher',
  standalone: true,
  imports: [UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [attr.aria-label]="label()"
      class="gap-2 flex items-center"
      role="group"
    >
      <span class="text-sm text-on-surface-variant">{{ label() }}:</span>
      @for (lang of i18n.availableLangs(); track lang) {
        <button
          [class.font-bold]="lang === i18n.currentLang()"
          [class.underline]="lang === i18n.currentLang()"
          [attr.aria-pressed]="lang === i18n.currentLang()"
          [attr.data-testid]="'lang-' + lang"
          (click)="i18n.setLang(lang)"
          class="rounded px-2 py-1 text-sm"
          type="button"
        >
          {{ lang | uppercase }}
        </button>
      }
    </div>
  `,
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(LocalizationApi);

  /** Switcher label; re-translates on language change (reads `currentLang()` for reactivity). */
  protected readonly label = computed(() => {
    this.i18n.currentLang();
    return this.i18n.translate('nowiro.languageSwitcher');
  });
}
