import { type SupportedLanguageCode, type TranslationModule } from './i18n.types';
import plTranslation from './translations/pl.translation';

export const DEFAULT_TRANSLATION = plTranslation;

export const TRANSLATION_LOADERS: Readonly<Record<SupportedLanguageCode, () => Promise<TranslationModule>>> = {
  bg: () => import('./translations/bg.translation').then((module) => module.default),
  cs: () => import('./translations/cs.translation').then((module) => module.default),
  da: () => import('./translations/da.translation').then((module) => module.default),
  de: () => import('./translations/de.translation').then((module) => module.default),
  el: () => import('./translations/el.translation').then((module) => module.default),
  en: () => import('./translations/en.translation').then((module) => module.default),
  es: () => import('./translations/es.translation').then((module) => module.default),
  et: () => import('./translations/et.translation').then((module) => module.default),
  fi: () => import('./translations/fi.translation').then((module) => module.default),
  fr: () => import('./translations/fr.translation').then((module) => module.default),
  ga: () => import('./translations/ga.translation').then((module) => module.default),
  hr: () => import('./translations/hr.translation').then((module) => module.default),
  hu: () => import('./translations/hu.translation').then((module) => module.default),
  it: () => import('./translations/it.translation').then((module) => module.default),
  lt: () => import('./translations/lt.translation').then((module) => module.default),
  lv: () => import('./translations/lv.translation').then((module) => module.default),
  mt: () => import('./translations/mt.translation').then((module) => module.default),
  nl: () => import('./translations/nl.translation').then((module) => module.default),
  pl: () => Promise.resolve(plTranslation),
  pt: () => import('./translations/pt.translation').then((module) => module.default),
  ro: () => import('./translations/ro.translation').then((module) => module.default),
  sk: () => import('./translations/sk.translation').then((module) => module.default),
  sl: () => import('./translations/sl.translation').then((module) => module.default),
  sv: () => import('./translations/sv.translation').then((module) => module.default),
};
