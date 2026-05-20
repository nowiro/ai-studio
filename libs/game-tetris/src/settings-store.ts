/**
 * Per-user Tetris settings — volume + ghost-piece visibility. Signal-based,
 * localStorage-backed; in-memory fallback when storage is unavailable.
 */
import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'ais.tetris.settings.v1';

export interface TetrisSettings {
  /** Audio volume 0..1. Reserved for a future audio engine (currently no SFX). */
  readonly volume: number;
  /** Whether to draw the ghost piece preview at the bottom of the playfield. */
  readonly showGhost: boolean;
}

const DEFAULT_SETTINGS: TetrisSettings = { volume: 0.7, showGhost: true };

@Injectable({ providedIn: 'root' })
export class TetrisSettingsStore {
  private readonly state = signal<TetrisSettings>(this.readFromStorage());

  readonly settings = this.state.asReadonly();

  setVolume(volume: number): void {
    this.update({ volume: clamp01(volume) });
  }

  setShowGhost(showGhost: boolean): void {
    this.update({ showGhost });
  }

  reset(): void {
    this.state.set(DEFAULT_SETTINGS);
    this.writeToStorage(DEFAULT_SETTINGS);
  }

  private update(patch: Partial<TetrisSettings>): void {
    const next = { ...this.state(), ...patch };
    this.state.set(next);
    this.writeToStorage(next);
  }

  private readFromStorage(): TetrisSettings {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<TetrisSettings>;
      return {
        volume: clamp01(typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_SETTINGS.volume),
        showGhost: typeof parsed.showGhost === 'boolean' ? parsed.showGhost : DEFAULT_SETTINGS.showGhost,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  private writeToStorage(value: TetrisSettings): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Quota / private mode — in-memory state already holds the value.
    }
  }
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
