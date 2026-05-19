/**
 * `LocaleStore` tests run without TestBed — we build a fresh `Injector` per
 * test, mirroring the pattern used by `wizard-form.service.spec.ts`. This
 * keeps the suite fast and avoids `initTestEnvironment` boilerplate.
 *
 * `localStorage` is mocked via a vitest spy on `window.localStorage`. The
 * mock is reset between tests so each one starts from a clean slate.
 */
import { Injector } from '@angular/core';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EN_MESSAGES, PL_MESSAGES } from './i18n.js';
import { LOCALE_STORAGE_KEY, LocaleStore } from './locale-store.js';

/** In-memory localStorage stub — supports the subset of the API LocaleStore touches. */
function createStorageMock(initial: Record<string, string> = {}): Storage {
  const data = new Map<string, string>(Object.entries(initial));
  return {
    get length(): number {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => {
      data.delete(key);
    },
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  } satisfies Storage;
}

function installStorageMock(initial: Record<string, string> = {}): Storage {
  const mock = createStorageMock(initial);
  // jsdom sets `localStorage` as a property on `window`; we override it for the test.
  vi.stubGlobal('localStorage', mock);
  return mock;
}

function makeStore(): LocaleStore {
  // Fresh injector per test — gives us a fresh store that re-reads
  // localStorage in its constructor.
  const injector = Injector.create({ providers: [LocaleStore] });
  return injector.get(LocaleStore);
}

describe('LocaleStore', () => {
  beforeEach(() => {
    installStorageMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to "pl" when localStorage holds nothing', () => {
    const store = makeStore();
    expect(store.locale()).toBe('pl');
  });

  it('messages() returns PL_MESSAGES by default', () => {
    const store = makeStore();
    expect(store.messages()).toBe(PL_MESSAGES);
  });

  it('setLocale("en") updates the locale signal', () => {
    const store = makeStore();
    store.setLocale('en');
    expect(store.locale()).toBe('en');
  });

  it('messages() reactively flips to EN_MESSAGES after setLocale("en")', () => {
    const store = makeStore();
    expect(store.messages()).toBe(PL_MESSAGES);
    store.setLocale('en');
    expect(store.messages()).toBe(EN_MESSAGES);
  });

  it('setLocale persists the new locale to localStorage', () => {
    const storage = installStorageMock();
    const store = makeStore();
    store.setLocale('en');
    expect(storage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
  });

  it('hydrates from localStorage on init', () => {
    installStorageMock({ [LOCALE_STORAGE_KEY]: 'en' });
    const store = makeStore();
    expect(store.locale()).toBe('en');
    expect(store.messages()).toBe(EN_MESSAGES);
  });

  it('falls back to "pl" when persisted value is malformed', () => {
    installStorageMock({ [LOCALE_STORAGE_KEY]: 'de' });
    const store = makeStore();
    expect(store.locale()).toBe('pl');
  });

  it('toggle() flips between pl and en', () => {
    const store = makeStore();
    store.toggle();
    expect(store.locale()).toBe('en');
    store.toggle();
    expect(store.locale()).toBe('pl');
  });

  it('setLocale is a no-op when the locale is unchanged (no redundant writes)', () => {
    const storage = installStorageMock();
    const setItemSpy = vi.spyOn(storage, 'setItem');
    vi.stubGlobal('localStorage', storage);

    const store = makeStore();
    // First write — the locale actually changes.
    store.setLocale('en');
    expect(setItemSpy).toHaveBeenCalledTimes(1);

    // Second write with same value — should short-circuit.
    store.setLocale('en');
    expect(setItemSpy).toHaveBeenCalledTimes(1);
  });

  it('survives a localStorage read that throws (private-mode safety)', () => {
    // Stub a storage whose getItem throws — the store must still construct.
    const broken: Storage = {
      ...createStorageMock(),
      getItem: () => {
        throw new Error('SecurityError');
      },
    };
    vi.stubGlobal('localStorage', broken);
    const store = makeStore();
    expect(store.locale()).toBe('pl');
  });
});
