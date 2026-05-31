/**
 * Sensitive-field wrapper around the generic {@link DraftStore}.
 *
 * Some wizard payloads (business-wizard NIP/REGON/IBAN, individual-wizard
 * PESEL, settlement amounts) must never hit localStorage in cleartext. This
 * store keeps those fields in a separate signal keyed by `wizardId + field`
 * and persists only their AES-GCM ciphertext via the parent draft store.
 *
 * Usage:
 * ```ts
 * const enc = inject(EncryptedDraftStore);
 * await enc.setPassword(userSecret);            // derives the key once
 * await enc.saveSensitive('biz', 'nip', value); // value never touches disk in cleartext
 * const back = await enc.readSensitive('biz', 'nip');
 * ```
 *
 * Threading model: methods are async because WebCrypto is async; callers must
 * await each `setPassword` / `saveSensitive` / `readSensitive`. Calling
 * `saveSensitive` or `readSensitive` before `setPassword` throws — there's
 * no implicit empty-key fallback (silent plaintext would defeat the point).
 */
import { inject, Injectable, signal } from '@angular/core';

import { decryptField, encryptField, generateKey, randomSalt } from './draft-crypto.js';
import { DraftStore } from './draft-store.js';

/** Shape persisted via the inner DraftStore for each `(wizardId, field)`. */
interface EncryptedFieldRecord {
  readonly ciphertext: string;
  readonly iv: string;
  /** Base64-encoded salt — kept here so the key can be re-derived next session. */
  readonly salt: string;
}

/** In-memory map of all encrypted records keyed by `${wizardId}::${field}`. */
type EncryptedDraftState = Record<string, EncryptedFieldRecord>;

@Injectable({ providedIn: 'root' })
export class EncryptedDraftStore {
  // The runtime `inject(DraftStore)` returns an untyped instance — re-typing
  // here preserves the generic parameter without changing DI semantics.
  readonly #inner = inject(DraftStore) as DraftStore<EncryptedDraftState>;
  readonly #key = signal<CryptoKey | null>(null);
  readonly #salt = signal<Uint8Array | null>(null);

  /**
   * Derives the AES-GCM key from `password` and a fresh random salt. Must be
   * called once before any `saveSensitive` / `readSensitive`. Calling it again
   * rotates the key (existing ciphertexts become unreadable — the caller is
   * responsible for re-encrypting them if needed).
   */
  async setPassword(password: string): Promise<void> {
    const salt = randomSalt();
    const key = await generateKey(password, salt);
    this.#salt.set(salt);
    this.#key.set(key);
  }

  /** Whether a password (and therefore a derived key) is currently held. */
  hasPassword(): boolean {
    return this.#key() !== null;
  }

  /**
   * Encrypts `value` with the current key and persists it under
   * `${wizardId}::${field}` in the inner draft store.
   *
   * @throws {Error} when {@link setPassword} has not been called.
   */
  async saveSensitive(wizardId: string, field: string, value: string): Promise<void> {
    const key = this.#requireKey();
    const salt = this.#salt();
    if (salt === null) {
      // Defensive — `#key` and `#salt` are always set together.
      throw new Error('EncryptedDraftStore: salt missing despite key being set');
    }
    const { ciphertext, iv } = await encryptField(value, key);
    const record: EncryptedFieldRecord = {
      ciphertext,
      iv,
      salt: this.#saltToBase64(salt),
    };
    const current = this.#inner.draft() ?? {};
    this.#inner.set({ ...current, [this.#composeKey(wizardId, field)]: record });
  }

  /**
   * Decrypts the value previously stored under `${wizardId}::${field}` and
   * returns it as a UTF-8 string. Returns `null` when the field has not been
   * saved yet.
   *
   * @throws {Error} when {@link setPassword} has not been called, or when the stored
   *         ciphertext fails AES-GCM authentication (wrong key / tampered).
   */
  async readSensitive(wizardId: string, field: string): Promise<string | null> {
    const key = this.#requireKey();
    const state = this.#inner.draft();
    if (state === null) {
      return null;
    }
    const composedKey = this.#composeKey(wizardId, field);
    if (!Object.prototype.hasOwnProperty.call(state, composedKey)) {
      return null;
    }
    const record = state[composedKey];
    return decryptField(record.ciphertext, record.iv, key);
  }

  #requireKey(): CryptoKey {
    const key = this.#key();
    if (key === null) {
      throw new Error('EncryptedDraftStore: password not set — call setPassword() first');
    }
    return key;
  }

  #composeKey(wizardId: string, field: string): string {
    return `${wizardId}::${field}`;
  }

  #saltToBase64(salt: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < salt.byteLength; i++) {
      binary += String.fromCharCode(salt[i]);
    }
    return btoa(binary);
  }
}
