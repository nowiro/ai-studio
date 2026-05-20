import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SearchBarComponent } from './search-bar.component.js';

export interface ShopNavLink {
  readonly label: string;
  readonly routerLink: string | readonly (string | number)[];
}

export interface ShopFooterLink {
  readonly label: string;
  readonly url: string;
}

export interface ShopFooterSection {
  readonly title: string;
  readonly links: readonly ShopFooterLink[];
}

/**
 * Top-level shop chrome — sticky brand toolbar, mobile burger drawer,
 * desktop nav, optional search slot, cart badge, columnar footer.
 *
 * Each shop demo composes this as `<ais-shop-shell>` and projects its
 * own page content via the default `<ng-content>`; optional breadcrumbs
 * go into the `[breadcrumbs]` slot above `<main>`.
 *
 * Responsive contract:
 *   - mobile (default): burger button visible, desktop nav hidden, search
 *     collapses out of the header (open it on the catalogue page instead)
 *   - `md:` (≥ 768px): desktop nav visible, burger hidden, search slot
 *     renders inline in the toolbar
 *
 * A11y contract: skip-to-content link as first focusable element, semantic
 * `<header> / <nav> / <main> / <footer>` landmarks, every icon-only button
 * carries an `aria-label`, breadcrumbs slot keeps `aria-current="page"`
 * semantics from `<ais-shop-breadcrumbs>`.
 */
@Component({
  selector: 'ais-shop-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    SearchBarComponent,
  ],
  host: { class: 'block min-h-screen' },
  template: `
    <a
      class="focus:translate-y-0 px-4 py-2 left-2 top-2 absolute z-50 -translate-y-full rounded-md bg-primary text-on-primary transition-transform focus:outline-none focus-visible:outline focus-visible:outline-2"
      href="#main-content"
      data-testid="skip-to-content"
    >
      Przejdź do treści
    </a>

    <mat-sidenav-container class="min-h-screen">
      <mat-sidenav
        [opened]="mobileNavOpen()"
        (closedStart)="mobileNavOpen.set(false)"
        class="w-72"
        #mobileNav
        mode="over"
      >
        <nav
          class="gap-1 p-4 flex flex-col"
          aria-label="Nawigacja mobilna"
          data-testid="mobile-nav"
        >
          @for (link of navLinks(); track link.label) {
            <a
              [routerLink]="link.routerLink"
              (click)="closeMobileNav()"
              class="!justify-start"
              matButton
              data-testid="mobile-nav-link"
            >
              {{ link.label }}
            </a>
          }
        </nav>
      </mat-sidenav>

      <mat-sidenav-content>
        <header>
          <mat-toolbar
            class="gap-2 top-0 !sticky z-10"
            color="primary"
          >
            <button
              (click)="openMobileNav()"
              class="md:!hidden"
              matIconButton
              type="button"
              aria-label="Otwórz menu"
              data-testid="header-burger"
            >
              <span
                class="material-symbols-outlined"
                aria-hidden="true"
              >
                menu
              </span>
            </button>

            <a
              [routerLink]="['/']"
              class="gap-2 flex items-center text-inherit no-underline"
              data-testid="header-brand"
            >
              <span
                class="material-symbols-outlined"
                aria-hidden="true"
              >
                {{ brandIcon() }}
              </span>
              <span class="font-semibold whitespace-nowrap">{{ brandLabel() }}</span>
            </a>

            <nav
              class="gap-1 ml-4 md:flex hidden"
              aria-label="Nawigacja główna"
              data-testid="desktop-nav"
            >
              @for (link of navLinks(); track link.label) {
                <a
                  [routerLink]="link.routerLink"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="text-inherit"
                  routerLinkActive="!bg-primary-container !text-on-primary-container"
                  matButton
                  data-testid="desktop-nav-link"
                >
                  {{ link.label }}
                </a>
              }
            </nav>

            <span class="flex-1"></span>

            @if (showSearch()) {
              <div class="max-w-sm md:block hidden flex-1">
                <ais-shop-search-bar (querySubmit)="searchSubmit.emit($event)" />
              </div>
            }

            <button
              (click)="cartOpenClick.emit()"
              matIconButton
              type="button"
              aria-label="Otwórz koszyk"
              data-testid="header-cart-button"
            >
              <span
                [matBadge]="cartBadge()"
                class="material-symbols-outlined"
                matBadgeColor="accent"
                matBadgeSize="small"
                aria-hidden="true"
              >
                shopping_cart
              </span>
            </button>
          </mat-toolbar>

          <ng-content select="[breadcrumbs]" />
        </header>

        <main
          id="main-content"
          class="min-h-[calc(100vh-4rem)]"
          tabindex="-1"
        >
          <ng-content />
        </main>

        <footer
          class="mt-12 border-t border-outline-variant text-on-surface-variant"
          data-testid="shop-footer"
        >
          @if (footerSections().length > 0) {
            <div class="gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-4 max-w-7xl mx-auto grid grid-cols-1">
              @for (section of footerSections(); track section.title) {
                <section>
                  <h3 class="text-sm font-semibold mb-2 text-on-surface">{{ section.title }}</h3>
                  <ul class="gap-1 flex flex-col">
                    @for (link of section.links; track link.label) {
                      <li>
                        <a
                          [href]="link.url"
                          class="text-sm hover:text-primary hover:underline"
                        >
                          {{ link.label }}
                        </a>
                      </li>
                    }
                  </ul>
                </section>
              }
            </div>
          }
          <div class="text-xs px-4 py-4 border-t border-outline-variant text-center">
            {{ footerNote() }} · {{ currentYear }}
          </div>
        </footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class ShopShellComponent {
  readonly brandLabel = input.required<string>();
  readonly brandIcon = input.required<string>();
  readonly navLinks = input<readonly ShopNavLink[]>([]);
  readonly cartCount = input<number>(0);
  readonly showSearch = input<boolean>(false);
  readonly footerSections = input<readonly ShopFooterSection[]>([]);
  readonly footerNote = input.required<string>();

  readonly cartOpenClick = output<void>();
  readonly searchSubmit = output<string>();

  protected readonly mobileNavOpen = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  /** mat-badge hides itself when the bound value is `null` — convert 0 → null. */
  protected cartBadge(): number | null {
    const count = this.cartCount();
    return count > 0 ? count : null;
  }

  protected openMobileNav(): void {
    this.mobileNavOpen.set(true);
  }

  protected closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}
