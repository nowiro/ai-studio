/**
 * Portal landing — shown at `/portal` (no remote selected). Renders a
 * grid of cards, one per remote, that pre-load the WC bundle on hover and
 * route into the remote on click.
 *
 * @packageDocumentation
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { PORTAL_REMOTES } from './portal-nav.js';

@Component({
  selector: 'ais-portal-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterLink],
  host: { class: 'block' },
  styles: [
    `
      .header {
        margin-bottom: 1.5rem;
      }
      .header__eyebrow {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mat-sys-primary);
        margin: 0 0 0.25rem;
      }
      .header__title {
        font: var(--mat-sys-headline-medium);
        margin: 0 0 0.5rem;
      }
      .header__lead {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
        max-width: 64ch;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.25rem;
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-large);
        border: 1px solid var(--mat-sys-outline-variant);
        text-decoration: none;
        color: inherit;
        transition:
          box-shadow 150ms ease,
          transform 150ms ease;
      }
      .card:hover,
      .card:focus-visible {
        box-shadow: var(--mat-sys-level2);
        transform: translateY(-2px);
        outline: none;
      }
      .card__head {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .card__icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }
      .card__title {
        font: var(--mat-sys-title-medium);
        margin: 0;
      }
      .card__tagline {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
      .card__cta {
        margin-top: auto;
        padding-top: 0.5rem;
        font: var(--mat-sys-label-large);
        font-weight: 600;
        color: var(--mat-sys-primary);
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
    `,
  ],
  template: `
    <header
      class="header"
      data-testid="portal-landing"
    >
      <p class="header__eyebrow">Portal · AI Studio</p>
      <h1 class="header__title">Wszystkie aplikacje pod jednym dachem</h1>
      <p class="header__lead">
        Kliknij dowolną aplikację — wczyta się jako Web Component pobierany leniwie z
        <code>dist/apps/&lt;slug&gt;-element/</code>
        . Najpierw zbuduj wszystkie bundle:
        <code>pnpm nx run-many -t build-element</code>
        .
      </p>
    </header>

    <div class="grid">
      @for (remote of remotes; track remote.slug) {
        <a
          [routerLink]="['/portal', remote.slug]"
          [attr.data-testid]="'landing-card-' + remote.slug"
          class="card"
        >
          <div class="card__head">
            <span class="card__icon">
              <mat-icon>{{ remote.icon }}</mat-icon>
            </span>
            <h2 class="card__title">{{ remote.label }}</h2>
          </div>
          <p class="card__tagline">{{ remote.tagline }}</p>
          <span class="card__cta">
            Otwórz
            <mat-icon>arrow_forward</mat-icon>
          </span>
        </a>
      }
    </div>
  `,
})
export class PortalLandingComponent {
  protected readonly remotes = PORTAL_REMOTES;
}
