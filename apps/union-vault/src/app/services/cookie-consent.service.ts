import { Injectable, signal } from '@angular/core';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'custom';

export interface CookieConsentPreferences {
  readonly status: ConsentStatus;
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly timestamp: number;
}

const CONSENT_STORAGE_KEY = 'uv_cookie_consent_v1';

const PENDING_PREFERENCES: CookieConsentPreferences = {
  status: 'pending',
  analytics: false,
  marketing: false,
  timestamp: 0,
};

/**
 * Manages GDPR cookie consent with localStorage persistence.
 * Non-essential categories (analytics, marketing) default to false
 * and are only activated after explicit user acceptance.
 */
@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly _preferences = signal<CookieConsentPreferences>(this.readStored());

  readonly preferences = this._preferences.asReadonly();

  readonly isVisible = signal<boolean>(this._preferences().status === 'pending');

  acceptAll(): void {
    this.save({ status: 'accepted', analytics: true, marketing: true, timestamp: Date.now() });
    this.isVisible.set(false);
  }

  rejectAll(): void {
    this.save({ status: 'rejected', analytics: false, marketing: false, timestamp: Date.now() });
    this.isVisible.set(false);
  }

  saveCustom(analytics: boolean, marketing: boolean): void {
    const status: ConsentStatus = analytics || marketing ? 'custom' : 'rejected';
    this.save({ status, analytics, marketing, timestamp: Date.now() });
    this.isVisible.set(false);
  }

  openBanner(): void {
    this.isVisible.set(true);
  }

  hasConsented(category: 'analytics' | 'marketing'): boolean {
    return this._preferences()[category];
  }

  private save(preferences: CookieConsentPreferences): void {
    this._preferences.set(preferences);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // localStorage may be unavailable (private browsing, storage quota)
    }
  }

  private readStored(): CookieConsentPreferences {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return PENDING_PREFERENCES;
      const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
      if (!parsed.status) return PENDING_PREFERENCES;
      return {
        status: parsed.status,
        analytics: parsed.analytics ?? false,
        marketing: parsed.marketing ?? false,
        timestamp: parsed.timestamp ?? 0,
      };
    } catch {
      return PENDING_PREFERENCES;
    }
  }
}
