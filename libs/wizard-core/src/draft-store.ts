import { Injectable, signal } from '@angular/core';

/**
 * Generic wizard draft store.
 *
 * - Holds the latest non-empty draft signal for an opaque payload `T`.
 * - Persistence (localStorage + optional Web Crypto AES-GCM encryption) is
 *   delegated to a sibling adapter to keep the store pure for unit testing.
 * - The store debounces writes externally — the adapter receives only
 *   commit calls; the consumer is responsible for picking the debounce
 *   interval (default 500 ms in plan 2026-05-19-business-wizard.md).
 */
@Injectable({ providedIn: 'root' })
export class DraftStore<T> {
  readonly #draft = signal<T | null>(null);

  /** Read-only current draft. */
  readonly draft = this.#draft.asReadonly();

  /** Replace the current draft. */
  set(value: T | null): void {
    this.#draft.set(value);
  }

  /** Apply a partial patch on top of the current draft. */
  patch(partial: Partial<T>): void {
    const current = this.#draft();
    if (current === null) {
      this.#draft.set(partial as T);
    } else {
      this.#draft.set({ ...current, ...partial });
    }
  }

  /** Clear the draft (called on successful submit). */
  clear(): void {
    this.#draft.set(null);
  }

  /** Whether a non-null draft is held. */
  hasDraft(): boolean {
    return this.#draft() !== null;
  }
}
