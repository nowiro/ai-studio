/**
 * Compact two-state language toggle — for apps that ship only two locales
 * (e.g. PL/EN marketing site). Renders the flag of the *next* language plus
 * its short code; the host app decides what happens on click (router push,
 * signal set, persistence …).
 *
 * Multi-language pickers (3+ locales) should use a different presentation —
 * see the union-vault `language-switcher` for an mat-menu-based variant. We
 * keep this lib focused on the toggle case until a second consumer needs
 * the dropdown variant lifted up.
 *
 * Layout: flag on the left, code on the right, `gap: 8px`. The lib uses a
 * scoped `ais-language-toggle__content` wrapper *inside* Material's
 * `.mdc-button__label` so we drive layout without piercing Material
 * encapsulation (no `::ng-deep`).
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ais-language-toggle',
  imports: [MatButtonModule],
  template: `
    <button
      [attr.aria-label]="ariaLabel()"
      (click)="languageToggle.emit()"
      class="ais-language-toggle__button"
      mat-button
      type="button"
    >
      <span class="ais-language-toggle__content">
        <img
          [src]="flagSrc()"
          class="ais-language-toggle__flag"
          alt=""
          aria-hidden="true"
        />
        <span class="ais-language-toggle__label">{{ label() }}</span>
      </span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .ais-language-toggle__button {
      // Keep the size compact — these usually sit next to logos / nav links.
      min-width: 40px;
      padding: 2px 10px;
      border: 1px solid var(--ais-language-toggle-border, #d1d5db);
      border-radius: var(--ais-language-toggle-radius, 4px);
      color: var(--ais-language-toggle-color, #4b5563);
      line-height: 1.8;
    }

    .ais-language-toggle__button:hover {
      color: var(--ais-language-toggle-hover-color, #1a1a2e);
      border-color: var(--ais-language-toggle-hover-border, #9ca3af);
    }

    .ais-language-toggle__content {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .ais-language-toggle__flag {
      // flag-icons 4×3 SVGs — fix the width, let height scale.
      width: 22px;
      height: auto;
      display: block;
      flex: 0 0 auto;
      border-radius: 2px;
    }

    .ais-language-toggle__label {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageToggleComponent {
  /** Flag SVG/PNG path served by the app. Usually points to the *next* language (click to switch to it). */
  readonly flagSrc = input.required<string>();
  /** Short visible code (`'EN'`, `'PL'`, …). */
  readonly label = input.required<string>();
  /** Localised aria-label describing the action ("Switch to English" / "Przełącz na polski"). */
  readonly ariaLabel = input.required<string>();
  /**
   * Emitted when the user clicks. The host app handles the side-effect
   * (route change, signal set, persistence, …).
   *
   * Named `languageToggle` (not the more natural `toggle`) so it does not
   * collide with the standard DOM `toggle` event on `<details>` — angular-eslint
   * `no-output-native` would otherwise flag it.
   */
  readonly languageToggle = output<void>();
}
