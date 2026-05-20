/**
 * Per-user Pong settings — volume, paddle speed preset. Signal-based,
 * localStorage-backed so preferences survive reload; falls back to an
 * in-memory value when localStorage is unavailable (SSR, private mode).
 */
import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'ais.pong.settings.v1';

/** Symbolic paddle speed presets — translated to a multiplier by {@link paddleSpeedMultiplier}. */
export type PongPaddleSpeed = 'slow' | 'normal' | 'fast';

export interface PongSettings {
  /** Audio volume 0..1. `0` means muted. */
  readonly volume: number;
  /** Player paddle speed preset. */
  readonly paddleSpeed: PongPaddleSpeed;
}

const DEFAULT_SETTINGS: PongSettings = { volume: 0.7, paddleSpeed: 'normal' };

const PADDLE_MULTIPLIERS: Readonly<Record<PongPaddleSpeed, number>> = {
  slow: 0.7,
  normal: 1,
  fast: 1.3,
};

/** Map a preset to the runtime multiplier applied on top of `PongConfig.paddleSpeed`. */
export function paddleSpeedMultiplier(preset: PongPaddleSpeed): number {
  return PADDLE_MULTIPLIERS[preset];
}

@Injectable({ providedIn: 'root' })
export class PongSettingsStore {
  private readonly state = signal<PongSettings>(this.readFromStorage());

  /** Current settings — read-only signal. */
  readonly settings = this.state.asReadonly();

  /** Replace the volume. Clamped to `[0, 1]`. */
  setVolume(volume: number): void {
    const clamped = clamp01(volume);
    this.update({ volume: clamped });
  }

  /** Replace the paddle speed preset. */
  setPaddleSpeed(preset: PongPaddleSpeed): void {
    this.update({ paddleSpeed: preset });
  }

  /** Reset settings back to defaults. */
  reset(): void {
    this.state.set(DEFAULT_SETTINGS);
    this.writeToStorage(DEFAULT_SETTINGS);
  }

  private update(patch: Partial<PongSettings>): void {
    const next = { ...this.state(), ...patch };
    this.state.set(next);
    this.writeToStorage(next);
  }

  private readFromStorage(): PongSettings {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<PongSettings>;
      return {
        volume: clamp01(typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_SETTINGS.volume),
        paddleSpeed: isPaddleSpeed(parsed.paddleSpeed) ? parsed.paddleSpeed : DEFAULT_SETTINGS.paddleSpeed,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  private writeToStorage(value: PongSettings): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Quota / private mode — swallow; in-memory state already holds the value.
    }
  }
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function isPaddleSpeed(value: unknown): value is PongPaddleSpeed {
  return value === 'slow' || value === 'normal' || value === 'fast';
}
