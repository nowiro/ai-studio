/**
 * Browser-native WebCrypto helpers for encrypting sensitive draft fields
 * (NIP, PESEL, kwoty, …) before they hit localStorage / IndexedDB.
 *
 * - Pure module: no Angular DI, no `node:crypto`. Uses `globalThis.crypto.subtle`
 *   so the same code runs in browsers, Node 20+ (`globalThis.crypto` is set), and
 *   under jsdom/happy-dom test environments.
 * - Key derivation: PBKDF2 (SHA-256, 100 000 iterations) → 256-bit AES-GCM key.
 * - Field encryption: AES-GCM with a fresh 12-byte IV per call. Ciphertext and
 *   IV are returned as base64 strings so they can be stored as plain JSON.
 *
 * Caller responsibilities:
 *   - Hold the derived `CryptoKey` in memory only (it's non-extractable).
 *   - Persist the salt alongside the encrypted payload so the key can be
 *     re-derived next session from the same password.
 *
 * @packageDocumentation
 */

/** PBKDF2 iteration count — calibrated for ~100 ms on a 2020-era laptop. */
const PBKDF2_ITERATIONS = 100_000;

/** AES-GCM key length in bits. */
const AES_KEY_LENGTH = 256;

/** Recommended salt length for PBKDF2 (NIST SP 800-132). */
const SALT_BYTES = 16;

/** Recommended IV length for AES-GCM (NIST SP 800-38D). */
const IV_BYTES = 12;

/**
 * Returns the WebCrypto SubtleCrypto handle, throwing a descriptive error
 * when the host environment lacks it (very old browser, missing polyfill
 * in a stripped Node runtime, …).
 */
function subtle(): SubtleCrypto {
  const c = globalThis.crypto;
  if (!c?.subtle) {
    throw new Error('draft-crypto: WebCrypto SubtleCrypto is unavailable in this environment');
  }
  return c.subtle;
}

/**
 * Derives an AES-GCM key from a user-supplied password and a per-draft salt
 * via PBKDF2/SHA-256. The returned key is non-extractable.
 */
export async function generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await subtle().importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
  return subtle().deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: AES_KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypts a UTF-8 string with AES-GCM under the given key. A fresh random
 * IV is generated per call; both `ciphertext` and `iv` are returned as
 * base64 so the result is safe to JSON-stringify.
 */
export async function encryptField(value: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = randomIv();
  const enc = new TextEncoder();
  const ct = await subtle().encrypt({ name: 'AES-GCM', iv: iv as unknown as BufferSource }, key, enc.encode(value));
  return {
    ciphertext: bufToBase64(ct),
    iv: bufToBase64(iv),
  };
}

/**
 * Decrypts a base64-encoded AES-GCM ciphertext + IV pair back to its
 * original UTF-8 string. Throws when the key is wrong or the payload
 * has been tampered with (AES-GCM authenticates the ciphertext).
 */
export async function decryptField(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
  const ctBuf = base64ToBuf(ciphertext);
  const ivBuf = base64ToBuf(iv);
  const plain = await subtle().decrypt(
    { name: 'AES-GCM', iv: ivBuf as unknown as BufferSource },
    key,
    ctBuf as unknown as BufferSource,
  );
  return new TextDecoder().decode(plain);
}

/** Returns a cryptographically random 16-byte salt for PBKDF2. */
export function randomSalt(): Uint8Array {
  const out = new Uint8Array(SALT_BYTES);
  globalThis.crypto.getRandomValues(out);
  return out;
}

/** Returns a cryptographically random 12-byte IV for AES-GCM. */
export function randomIv(): Uint8Array {
  const out = new Uint8Array(IV_BYTES);
  globalThis.crypto.getRandomValues(out);
  return out;
}

/**
 * Encodes an `ArrayBuffer` (or `Uint8Array`) to a base64 string. Works in
 * both browser (`btoa`) and Node (`Buffer`) without pulling Node typings
 * into the runtime surface.
 */
export function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // `btoa` exists in browsers and in Node 16+ globals.
  return btoa(binary);
}

/** Decodes a base64 string back to a `Uint8Array`. */
export function base64ToBuf(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}
