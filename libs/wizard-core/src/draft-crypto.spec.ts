/**
 * Tests for the WebCrypto-backed draft encryption helpers.
 *
 * jsdom (the configured Vitest environment) provides `globalThis.crypto` and
 * `crypto.subtle` via Node 20's `node:crypto.webcrypto`, but only when the
 * Node version is recent enough. We polyfill defensively so the suite is
 * resilient to runtime quirks.
 */
import { webcrypto } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';

import {
  base64ToBuf,
  bufToBase64,
  decryptField,
  encryptField,
  generateKey,
  randomIv,
  randomSalt,
} from './draft-crypto.js';

if (!globalThis.crypto?.subtle) {
  (globalThis as { crypto: Crypto }).crypto = webcrypto as unknown as Crypto;
}

const PASSWORD = 'correct-horse-battery-staple';
const OTHER_PASSWORD = 'wrong-horse-battery-staple';

describe('draft-crypto', () => {
  let salt: Uint8Array;

  beforeAll(() => {
    // Single deterministic salt for the suite — round-trip tests don't need
    // randomness here (the IV inside `encryptField` is already random).
    salt = new Uint8Array(16);
    for (let i = 0; i < salt.length; i++) {
      salt[i] = i;
    }
  });

  it('round-trips encrypt → decrypt for a typical value', async () => {
    const key = await generateKey(PASSWORD, salt);
    const value = '1234567890';
    const { ciphertext, iv } = await encryptField(value, key);
    expect(ciphertext).not.toBe(value);
    const back = await decryptField(ciphertext, iv, key);
    expect(back).toBe(value);
  });

  it('produces different ciphertexts for the same plaintext (random IVs)', async () => {
    const key = await generateKey(PASSWORD, salt);
    const a = await encryptField('PESEL-90010112345', key);
    const b = await encryptField('PESEL-90010112345', key);
    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.iv).not.toBe(b.iv);
  });

  it('throws when decrypting with the wrong key', async () => {
    const key = await generateKey(PASSWORD, salt);
    const wrongKey = await generateKey(OTHER_PASSWORD, salt);
    const { ciphertext, iv } = await encryptField('top secret', key);
    await expect(decryptField(ciphertext, iv, wrongKey)).rejects.toBeDefined();
  });

  it('base64 conversion round-trips arbitrary bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255]);
    const b64 = bufToBase64(bytes);
    const back = base64ToBuf(b64);
    expect(Array.from(back)).toEqual(Array.from(bytes));
  });

  it('derives the same key bytes for the same password + salt (deterministic PBKDF2)', async () => {
    // Keys derived via WebCrypto are non-extractable, so we verify determinism
    // indirectly: a ciphertext produced under key #1 must decrypt under key #2
    // when both come from the same (password, salt).
    const k1 = await generateKey(PASSWORD, salt);
    const k2 = await generateKey(PASSWORD, salt);
    const { ciphertext, iv } = await encryptField('determinism check', k1);
    const back = await decryptField(ciphertext, iv, k2);
    expect(back).toBe('determinism check');
  });

  it('derives different keys for different salts (same password)', async () => {
    const otherSalt = new Uint8Array(16);
    for (let i = 0; i < otherSalt.length; i++) {
      otherSalt[i] = 255 - i;
    }
    const k1 = await generateKey(PASSWORD, salt);
    const k2 = await generateKey(PASSWORD, otherSalt);
    const { ciphertext, iv } = await encryptField('salt sensitivity', k1);
    await expect(decryptField(ciphertext, iv, k2)).rejects.toBeDefined();
  });

  it('round-trips an empty string', async () => {
    const key = await generateKey(PASSWORD, salt);
    const { ciphertext, iv } = await encryptField('', key);
    const back = await decryptField(ciphertext, iv, key);
    expect(back).toBe('');
  });

  it('round-trips a long string (>1KB)', async () => {
    const key = await generateKey(PASSWORD, salt);
    const long = 'a'.repeat(2048) + 'zażółć gęślą jaźń' + 'b'.repeat(512);
    const { ciphertext, iv } = await encryptField(long, key);
    const back = await decryptField(ciphertext, iv, key);
    expect(back).toBe(long);
    expect(back.length).toBe(long.length);
  });

  it('randomSalt returns 16 bytes and randomIv returns 12 bytes', () => {
    const s1 = randomSalt();
    const s2 = randomSalt();
    expect(s1.byteLength).toBe(16);
    expect(s2.byteLength).toBe(16);
    // Astronomically unlikely to collide.
    expect(Array.from(s1)).not.toEqual(Array.from(s2));

    const iv1 = randomIv();
    const iv2 = randomIv();
    expect(iv1.byteLength).toBe(12);
    expect(iv2.byteLength).toBe(12);
    expect(Array.from(iv1)).not.toEqual(Array.from(iv2));
  });
});
