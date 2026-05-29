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
    const colorScheme = this.readRaw(target, 'color-scheme') || 'light';
    const mode: ChartTheme['mode'] = colorScheme.includes('dark') ? 'dark' : 'light';

    const palette = PALETTE_TOKENS.map((token, index) => {
      return this.readColor(target, token) || FALLBACK_PALETTE[index] || '#888888';
    });

    return {
      mode,
      palette,
      background: this.readColor(target, '--mat-sys-surface') || (mode === 'dark' ? '#1a1a1a' : '#ffffff'),
      foreground: this.readColor(target, '--mat-sys-on-surface') || (mode === 'dark' ? '#e4e4e4' : '#1f2937'),
      muted: this.readColor(target, '--mat-sys-on-surface-variant') || (mode === 'dark' ? '#9ca3af' : '#6b7280'),
      grid: this.readColor(target, '--mat-sys-outline-variant') || (mode === 'dark' ? '#3a3a3a' : '#e5e7eb'),
      fontFamily: this.readRaw(target, '--mat-sys-body-medium-font') || 'Roboto, system-ui, sans-serif',
    };
  }

  /** Raw computed value of a CSS property or custom property (no resolution). */
  private readRaw(target: Element | null, name: string): string {
    if (!target || typeof getComputedStyle !== 'function') return '';
    try {
      return getComputedStyle(target).getPropertyValue(name).trim();
    } catch {
      return '';
    }
  }

  /**
   * Resolve a colour token to a concrete `rgb(...)` string that a canvas
   * renderer (ECharts) can parse.
   *
   * Angular Material 3 emits system colours as `light-dark(#light, #dark)`.
   * `getComputedStyle(...).getPropertyValue('--mat-sys-primary')` returns that
   * `light-dark(...)` string verbatim — custom properties are not resolved —
   * and ECharts then can't read it, so every series falls back to black.
   *
   * We resolve it the only reliable way: assign the token to a real `color`
   * property on a hidden probe mounted inside the themed subtree, then read
   * back the computed colour. That collapses `var()` chains and picks the
   * `light-dark()` branch matching the host's `color-scheme`.
   *
   * Returns `''` when the token is undefined so callers fall back to their
   * defaults (keeps the "6 palette colours even with no tokens" contract).
   */
  private readColor(target: Element | null, name: string): string {
    const raw = this.readRaw(target, name);
    if (!raw) return '';
    if (typeof document === 'undefined') return raw;

    const mount = target instanceof HTMLElement ? target : document.body;
    if (!mount) return raw;

    const probe = document.createElement('span');
    probe.style.display = 'none';
    probe.style.color = `var(${name})`;
    mount.appendChild(probe);
    try {
      return getComputedStyle(probe).color.trim() || raw;
    } catch {
      return raw;
    } finally {
      probe.remove();
    }
  }
}
