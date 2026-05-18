export interface EuLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  flagCode: string;
}

export const EU_LANGUAGES: EuLanguage[] = [
  { code: 'bg', name: 'Bułgarski', nativeName: 'Български', flag: '🇧🇬', flagCode: 'bg' },
  { code: 'cs', name: 'Czeski', nativeName: 'Čeština', flag: '🇨🇿', flagCode: 'cz' },
  { code: 'da', name: 'Duński', nativeName: 'Dansk', flag: '🇩🇰', flagCode: 'dk' },
  { code: 'de', name: 'Niemiecki', nativeName: 'Deutsch', flag: '🇩🇪', flagCode: 'de' },
  { code: 'el', name: 'Grecki', nativeName: 'Ελληνικά', flag: '🇬🇷', flagCode: 'gr' },
  { code: 'en', name: 'Angielski', nativeName: 'English', flag: '🇮🇪', flagCode: 'ie' },
  { code: 'es', name: 'Hiszpański', nativeName: 'Español', flag: '🇪🇸', flagCode: 'es' },
  { code: 'et', name: 'Estoński', nativeName: 'Eesti', flag: '🇪🇪', flagCode: 'ee' },
  { code: 'fi', name: 'Fiński', nativeName: 'Suomi', flag: '🇫🇮', flagCode: 'fi' },
  { code: 'fr', name: 'Francuski', nativeName: 'Français', flag: '🇫🇷', flagCode: 'fr' },
  { code: 'ga', name: 'Irlandzki', nativeName: 'Gaeilge', flag: '🇮🇪', flagCode: 'ie' },
  { code: 'hr', name: 'Chorwacki', nativeName: 'Hrvatski', flag: '🇭🇷', flagCode: 'hr' },
  { code: 'hu', name: 'Węgierski', nativeName: 'Magyar', flag: '🇭🇺', flagCode: 'hu' },
  { code: 'it', name: 'Włoski', nativeName: 'Italiano', flag: '🇮🇹', flagCode: 'it' },
  { code: 'lt', name: 'Litewski', nativeName: 'Lietuvių', flag: '🇱🇹', flagCode: 'lt' },
  { code: 'lv', name: 'Łotewski', nativeName: 'Latviešu', flag: '🇱🇻', flagCode: 'lv' },
  { code: 'mt', name: 'Maltański', nativeName: 'Malti', flag: '🇲🇹', flagCode: 'mt' },
  { code: 'nl', name: 'Niderlandzki', nativeName: 'Nederlands', flag: '🇳🇱', flagCode: 'nl' },
  { code: 'pl', name: 'Polski', nativeName: 'Polski', flag: '🇵🇱', flagCode: 'pl' },
  { code: 'pt', name: 'Portugalski', nativeName: 'Português', flag: '🇵🇹', flagCode: 'pt' },
  { code: 'ro', name: 'Rumuński', nativeName: 'Română', flag: '🇷🇴', flagCode: 'ro' },
  { code: 'sk', name: 'Słowacki', nativeName: 'Slovenčina', flag: '🇸🇰', flagCode: 'sk' },
  { code: 'sl', name: 'Słoweński', nativeName: 'Slovenščina', flag: '🇸🇮', flagCode: 'si' },
  { code: 'sv', name: 'Szwedzki', nativeName: 'Svenska', flag: '🇸🇪', flagCode: 'se' },
];

// 'pl' is statically present in EU_LANGUAGES above. The throw exists so TypeScript
// can prove DEFAULT_LANGUAGE is non-undefined without resorting to non-null `!`.
const defaultLanguageCandidate = EU_LANGUAGES.find((language) => language.code === 'pl');
if (!defaultLanguageCandidate) {
  throw new Error("EU_LANGUAGES is missing 'pl' — fix data/eu-languages.ts");
}
export const DEFAULT_LANGUAGE: EuLanguage = defaultLanguageCandidate;
