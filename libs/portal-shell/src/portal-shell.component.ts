/**
 * Portal shell — top toolbar + responsive sidenav listing every remote
 * + router-outlet for the currently selected remote.
 *
 * The shell is the only component that imports
 * `@angular/material/sidenav` in the portal scope; sub-apps mounted via
 * the {@link RemoteHostComponent} keep their own Material runtime inside
 * their Web Component bundle.
 *
 * @packageDocumentation
 */
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { PORTAL_REMOTES } from './portal-nav.js';

@Component({
  selector: 'ais-portal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  host: { class: 'block h-screen' },
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
      mat-sidenav-container {
        height: 100%;
      }
      mat-sidenav {
        width: 18rem;
        background: var(--mat-sys-surface-container-low);
        border-right: 1px solid var(--mat-sys-outline-variant);
      }
      .topbar {
        background: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        box-shadow: var(--mat-sys-level1);
        gap: 1rem;
      }
      .topbar__brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
      .topbar__spacer {
        flex: 1;
      }
      .nav-header {
        padding: 1rem 1.25rem 0.5rem;
        font: var(--mat-sys-label-medium);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
      .nav-list a {
        padding: 0.5rem 1.25rem;
      }
      .nav-list a.active {
        background: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
      }
      .nav-tagline {
        font-size: 0.75rem;
        opacity: 0.7;
        margin-top: 0.125rem;
      }
      main {
        padding: 1rem;
        background: var(--mat-sys-surface-container);
        min-height: calc(100vh - 64px);
      }
      @media (min-width: 1024px) {
        main {
          padding: 1.5rem;
        }
      }
    `,
  ],
  template: `
    <mat-toolbar class="topbar">
      <button
        (click)="sidenav()?.toggle()"
        matIconButton
        aria-label="Toggle navigation"
        data-testid="portal-toggle-nav"
      >
        <mat-icon>menu</mat-icon>
      </button>
      <span class="topbar__brand">
        <mat-icon>hub</mat-icon>
        AI Studio · Portal
      </span>
      <span class="topbar__spacer"></span>
      <button
        (click)="cartOpen.update((v) => !v)"
        matIconButton
        aria-label="Toggle cart drawer"
        data-testid="portal-toggle-cart"
      >
        <mat-icon>shopping_cart</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav
        [opened]="true"
        #sn
        mode="side"
        data-testid="portal-sidenav"
      >
        <h2 class="nav-header">Aplikacje</h2>
        <mat-nav-list class="nav-list">
          @for (remote of remotes; track remote.slug) {
            <a
              [routerLink]="['/portal', remote.slug]"
              [routerLinkActive]="'active'"
              [attr.data-testid]="'portal-nav-' + remote.slug"
              mat-list-item
            >
              <mat-icon matListItemIcon>{{ remote.icon }}</mat-icon>
              <span matListItemTitle>{{ remote.label }}</span>
              <span
                class="nav-tagline"
                matListItemLine
              >
                {{ remote.tagline }}
              </span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <main data-testid="portal-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class PortalShellComponent {
  protected readonly remotes = PORTAL_REMOTES;
  protected readonly sidenav = viewChild<MatSidenav>('sn');
  protected readonly cartOpen = signal(false);
}
