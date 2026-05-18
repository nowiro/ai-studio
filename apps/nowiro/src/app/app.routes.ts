import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Route } from '@angular/router';

import { Lang } from './i18n/translations';
import { LanguageService } from './services/language.service';

/** Placeholder rendered into the router-outlet (no visible output). */
@Component({
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LangRouteComponent {}

const setLang =
  (lang: Lang): (() => boolean) =>
  () => {
    inject(LanguageService).lang.set(lang);
    return true;
  };

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: LangRouteComponent,
    canActivate: [setLang('pl')],
  },
  {
    path: 'en',
    component: LangRouteComponent,
    canActivate: [setLang('en')],
  },
  { path: '**', redirectTo: '' },
];
