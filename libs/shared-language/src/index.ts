/**
 * Public API for the shared language library — UI primitives every app in the
 * repo can drop in to expose a language switcher.
 *
 * The library is intentionally **state-agnostic**: each app keeps its own
 * `LanguageService` / `LocalizationService` (signal-based, route-driven,
 * persistence-aware) and pipes the current/next language down via inputs.
 * That keeps the lib free of i18n dictionaries and translation loaders —
 * those concerns differ wildly between apps (2 vs. 24 locales).
 *
 * @packageDocumentation
 */
export type { LanguageOption } from './language-option.js';
export { LanguageToggleComponent } from './language-toggle.component.js';
