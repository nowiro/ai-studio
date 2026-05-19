/**
 * Signal-backed locale store for the individual-wizard.
 *
 * The wizard's locale is **runtime-switchable** (user clicks the
 * `LanguageToggleComponent` in the shell) and **persisted across reloads**
 * (localStorage). A signal-based store keeps consumers reactive without
 * forcing every component to subscribe to an RxJS stream.
 *
 * Why this lives in `individual-wizard-data` (`type:data-access`) rather
 * than in `shared-language`:
 *
 *   • `shared-language` is intentionally **state-agnostic** — see its
 *     `index.ts` comment. It ships only the toggle component + the
 *     `LanguageOption` interface. State lives per-app.
 *   • The wizard's translation table (see `./i18n.ts`) is wizard-specific —
 *     it knows nothing about the bookstore, the journal, or the shop. The
 *     store that owns the active locale is the natural home for the
 *     `Messages` derivation.
 *
 * Persistence key — `LOCALE_STORAGE_KEY` — is exported so test setups and
 * the dev-tools dashboard can clear it deterministically between scenarios.
 */
import { computed, Injectable, signal } from '@angular/core';

import { getMessages, type Locale, type Messages } from './i18n.js';

/** localStorage key under which the active locale is persisted. */
export const LOCALE_STORAGE_KEY = 'ais-wizard-locale';

/** Default locale used when nothing is persisted yet (or persistence is unavailable). */
const DEFAULT_LOCALE: Locale = 'pl';

/** Narrow guard — `localStorage` may hold any string; we only accept known locales. */
function isLocale(value: string | null): value is Locale {
  return value === 'pl' || value === 'en';
}

/**
 * Best-effort read of the persisted locale.
 *
 * Wrapped in a try/catch because:
 *   • SSR / Node environments don't define `localStorage` (would throw).
 *   • Some browsers throw on `localStorage.getItem` in private-mode tabs.
 *
 * Returning `DEFAULT_LOCALE` on any failure keeps the wizard usable even
 * when persistence is unavailable.
 */
function readPersistedLocale(): Locale {
  try {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_LOCALE;
    }
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(raw) ? raw : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/** Best-effort persist — swallow errors for the same reasons as the reader. */
function writePersistedLocale(locale: Locale): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Quota-exceeded or private-mode write — silently ignore. The signal
    // still holds the user's choice for the current session.
  }
}

/**
 * Root-scoped store for the active wizard locale.
 *
 * Consumers read `locale()` for the raw code and `messages()` for the
 * translation table — both signals, so any component reading them inside
 * a template or `computed` re-renders on change.
 *
 * Tests can construct the store via a fresh `Injector` (no TestBed needed),
 * following the same pattern as `WizardFormService` (see its spec).
 */
@Injectable({ providedIn: 'root' })
export class LocaleStore {
  private readonly current = signal<Locale>(readPersistedLocale());

  /** Active locale (read-only view of the writable signal). */
  readonly locale = computed<Locale>(() => this.current());

  /**
   * Reactive translation table for the active locale.
   * Derived from `locale()` — flips together with `setLocale`.
   */
  readonly messages = computed<Messages>(() => getMessages(this.current()));

  /**
   * Switch to a new locale and persist the choice.
   *
   * No-op when the new locale equals the current one (prevents redundant
   * signal writes and the cascade of `computed` recomputations they'd
   * trigger downstream).
   */
  setLocale(locale: Locale): void {
    if (this.current() === locale) {
      return;
    }
    this.current.set(locale);
    writePersistedLocale(locale);
  }

  /**
   * Convenience two-state toggle for the `LanguageToggleComponent` host.
   * Falls back to `setLocale` so persistence stays consistent.
   */
  toggle(): void {
    this.setLocale(this.current() === 'pl' ? 'en' : 'pl');
  }
}
