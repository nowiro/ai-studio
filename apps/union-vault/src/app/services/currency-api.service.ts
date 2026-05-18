import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of, tap } from 'rxjs';

const CACHE_STORAGE_KEY = 'uv_fx_rates_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface RateCacheEntry {
  rates: Record<string, number>;
  timestamp: number;
}

interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface FloatRateEntry {
  code: string;
  rate: number;
  inverseRate: number;
}

/**
 * Fetches live EUR exchange rates with a 1-hour localStorage cache.
 *
 * Primary source:  Frankfurter API — ECB-based, free, no API key required.
 * Fallback source: FloatRates JSON feed — free, no API key required.
 *
 * Note: Fixer.io (mentioned in the original requirements) requires a paid
 * API key; FloatRates is used as an equivalent free alternative.
 */
@Injectable({ providedIn: 'root' })
export class CurrencyApiService {
  private readonly http = inject(HttpClient);

  private readonly FRANKFURTER_URL = 'https://api.frankfurter.dev/v1/latest?base=EUR';
  private readonly FLOATRATES_URL = 'https://www.floatrates.com/daily/eur.json';

  /** Emits current EUR rates keyed by currency code (e.g. { PLN: 4.27, ... }). */
  fetchRates(): Observable<Record<string, number>> {
    const cached = this.readCache();
    if (cached) return of(cached);

    return this.http.get<FrankfurterResponse>(this.FRANKFURTER_URL).pipe(
      map((response) => ({ ...response.rates, EUR: 1 })),
      tap((rates) => this.writeCache(rates)),
      catchError(() => this.fetchFloatRates()),
    );
  }

  private fetchFloatRates(): Observable<Record<string, number>> {
    return this.http.get<Record<string, FloatRateEntry>>(this.FLOATRATES_URL).pipe(
      map((response) => {
        const rates: Record<string, number> = { EUR: 1 };
        for (const [code, entry] of Object.entries(response)) {
          rates[code.toUpperCase()] = entry.rate;
        }
        return rates;
      }),
      tap((rates) => this.writeCache(rates)),
      catchError(() => of({})),
    );
  }

  private readCache(): Record<string, number> | null {
    try {
      const stored = localStorage.getItem(CACHE_STORAGE_KEY);
      if (!stored) return null;
      const entry = JSON.parse(stored) as RateCacheEntry;
      if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
      return entry.rates;
    } catch {
      return null;
    }
  }

  private writeCache(rates: Record<string, number>): void {
    try {
      const entry: RateCacheEntry = { rates, timestamp: Date.now() };
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // localStorage may be unavailable (private browsing, storage quota)
    }
  }
}
