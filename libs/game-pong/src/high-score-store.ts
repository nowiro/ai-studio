/**
 * Single-player high-score persistence for Pong. Signal-based, backed by
 * localStorage so the best score survives page reloads. Falls back to an
 * in-memory value when localStorage is unavailable (SSR, private mode).
 */
import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'ais.pong.high-score.v1';

@Injectable({ providedIn: 'root' })
export class PongHighScoreStore {
  private readonly state = signal<number>(this.readFromStorage());

  /** Current best — read-only signal that consumers can `()`-call. */
  readonly best = this.state.asReadonly();

  /**
   * Reports the latest run. When `runScore` beats the stored best the value
   * is persisted and `true` is returned so the caller can flash a "new record"
   * animation. Returns `false` otherwise (including ties — only strictly
   * greater scores count).
   */
  report(runScore: number): boolean {
    if (!Number.isFinite(runScore) || runScore <= this.state()) return false;
    this.state.set(runScore);
    this.writeToStorage(runScore);
    return true;
  }

  /** Reset the best back to 0 — used by settings panels / debug menus. */
  reset(): void {
    this.state.set(0);
    this.writeToStorage(0);
  }

  private readFromStorage(): number {
    if (typeof localStorage === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? Number(raw) : 0;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      return 0;
    }
  }

  private writeToStorage(value: number): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Quota / private mode — swallow; in-memory state already holds the value.
    }
  }
}
