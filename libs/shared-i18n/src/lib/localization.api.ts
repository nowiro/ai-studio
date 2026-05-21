/**
 * LocalizationApi — signal-based wrapper around TranslocoService.
 *
 * Apps and feature libs depend on this thin facade — never on
 * `TranslocoService` directly. That keeps the i18n vendor as a swappable
 * implementation detail (ADR-0017).
 */
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class LocalizationApi {
  private readonly transloco = inject(TranslocoService);
  private readonly current = signal<string>(this.transloco.getActiveLang());

  /** Reactive signal of the currently active language code (e.g. 'pl', 'en'). */
  readonly currentLang: Signal<string> = this.current.asReadonly();

  /** List of all languages configured at app bootstrap. */
  readonly availableLangs: Signal<readonly string[]> = computed(() =>
    this.transloco.getAvailableLangs().map((l) => (typeof l === 'string' ? l : l.id)),
  );

  constructor() {
    // Keep the signal in sync with Transloco's lang change stream so consumers
    // can rely on `effect(() => api.currentLang())` rather than RxJS pipelines.
    this.transloco.langChanges$.pipe(takeUntilDestroyed()).subscribe((lang) => {
      this.current.set(lang);
    });
  }

  /**
   * Synchronous translation (use only when you have the dictionary loaded —
   * for view bindings prefer the `t` pipe so loading-state is handled).
   */
  translate(key: string, params?: Record<string, unknown>): string {
    return this.transloco.translate(key, params);
  }

  /** Switch active language. Triggers re-render of all `t` pipes (per config). */
  setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
  }
}
