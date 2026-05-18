import { computed, inject, Injectable, signal } from '@angular/core';

import { AppTranslations, Lang, translations } from '../i18n/translations';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>('pl');
  readonly t = computed<AppTranslations>(() => translations[this.lang()]);

  toggle(): void {
    this.lang.update((l) => (l === 'pl' ? 'en' : 'pl'));
  }
}

export const injectT = (): LanguageService['t'] => inject(LanguageService).t;
