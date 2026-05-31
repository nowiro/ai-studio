import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LocalizationApi, TPipe } from '@ai-studio/shared-i18n';

/**
 * Transloco i18n demo (best-practices plan T008 / ADR-0017).
 *
 * Smallest end-to-end proof that runtime i18n works: a PL/EN switch wired to the
 * `LocalizationApi` facade (apps never touch `TranslocoService` directly — ADR-0017
 * §wrap-before-consume). The label is rendered through the Transloco pipe (`| transloco`,
 * async-safe during dictionary load) against `apps/nowiro/public/assets/i18n/{pl,en}.json`.
 * Switching language re-renders every `transloco` pipe in the tree (reRenderOnLangChange).
 *
 * The rest of nowiro still uses the legacy in-code dictionary (`injectT()`); this is the
 * staged-migration seam called out in `apps/nowiro/src/app/app.config.ts`.
 */
@Component({
  selector: 'ais-language-switcher',
  standalone: true,
  imports: [TPipe, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [attr.aria-label]="'nowiro.languageSwitcher' | transloco"
      class="gap-2 flex items-center"
      role="group"
    >
      <span class="text-sm text-on-surface-variant">{{ 'nowiro.languageSwitcher' | transloco }}:</span>
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
}
