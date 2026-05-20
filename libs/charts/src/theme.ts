/**
 * Material 3 → chart theme bridge. Reads the `--mat-sys-*` CSS variables
 * that `mat.theme()` writes onto `<html>` and produces a stable, plain
 * {@link ChartTheme} snapshot.
 *
 * This is the ONLY file that talks to the host page's design tokens.
 * Swapping the chart backend later means rewriting `chart-host` and the
 * wrappers — this file stays unchanged because it deals in plain shapes.
 */
import { Injectable } from '@angular/core';

import type { ChartTheme } from './types.js';

/**
 * Tokens we sample from `--mat-sys-*`. Ordered so that the palette is
 * pleasant when used sequentially for multi-series charts (primary first,
 * then tertiary, then secondary, … — high contrast progression).
 */
const PALETTE_TOKENS = [
  '--mat-sys-primary',
  '--mat-sys-tertiary',
  '--mat-sys-secondary',
  '--mat-sys-error',
  '--mat-sys-primary-container',
  '--mat-sys-tertiary-container',
] as const;

const FALLBACK_PALETTE = ['#4f46e5', '#0ea5e9', '#a855f7', '#ef4444', '#22c55e', '#f59e0b'];

@Injectable({ providedIn: 'root' })
export class ChartThemeBridge {
  /**
   * Read the current Material 3 tokens off the host page. Returns sane
   * fallbacks when the page hasn't been themed (SSR, test envs, etc.).
   */
  snapshot(host?: HTMLElement): ChartTheme {
    const target = host ?? (typeof document === 'undefined' ? null : document.documentElement);
    const colorScheme = this.readVar(target, 'color-scheme') || 'light';
    const mode: ChartTheme['mode'] = colorScheme.includes('dark') ? 'dark' : 'light';

    const palette = PALETTE_TOKENS.map((token, index) => {
      const value = this.readVar(target, token);
      return value || FALLBACK_PALETTE[index] || '#888888';
    });

    return {
      mode,
      palette,
      background: this.readVar(target, '--mat-sys-surface') || (mode === 'dark' ? '#1a1a1a' : '#ffffff'),
      foreground: this.readVar(target, '--mat-sys-on-surface') || (mode === 'dark' ? '#e4e4e4' : '#1f2937'),
      muted: this.readVar(target, '--mat-sys-on-surface-variant') || (mode === 'dark' ? '#9ca3af' : '#6b7280'),
      grid: this.readVar(target, '--mat-sys-outline-variant') || (mode === 'dark' ? '#3a3a3a' : '#e5e7eb'),
      fontFamily: this.readVar(target, '--mat-sys-body-medium-font') || 'Roboto, system-ui, sans-serif',
    };
  }

  private readVar(target: Element | null, name: string): string {
    if (!target || typeof getComputedStyle !== 'function') return '';
    try {
      const propertyName = name.startsWith('--') ? name : `--${name}`;
      return getComputedStyle(target).getPropertyValue(propertyName).trim();
    } catch {
      return '';
    }
  }
}
