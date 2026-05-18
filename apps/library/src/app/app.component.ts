import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '@ai-studio/library-data';
import { RoleAllowDirective } from '@ai-studio/shared-app-shell';

@Component({
  selector: 'ais-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatToolbarModule, RoleAllowDirective, RouterLink, RouterLinkActive, RouterOutlet],
  host: { class: 'block min-h-screen' },
  template: `
    <mat-toolbar
      class="top-0 gap-2 !sticky z-10"
      color="primary"
    >
      <a
        [routerLink]="['/']"
        class="gap-2 flex items-center text-inherit no-underline"
      >
        <span class="material-symbols-outlined">menu_book</span>
        <span class="font-semibold">Biblioteka</span>
      </a>
      <nav class="gap-1 ms-4 flex items-center">
        <a
          [routerLinkActiveOptions]="{ exact: true }"
          matButton
          routerLink="/"
          routerLinkActive="!font-semibold"
          data-testid="nav-catalogue"
        >
          Katalog
        </a>
        <a
          matButton
          routerLink="/account"
          routerLinkActive="!font-semibold"
          data-testid="nav-account"
        >
          Moje konto
        </a>
        <a
          *aisRoleAllow="librarianOnly"
          matButton
          routerLink="/librarian"
          routerLinkActive="!font-semibold"
          data-testid="nav-librarian"
        >
          Panel bibliotekarza
        </a>
      </nav>
      <span class="flex-1"></span>
      @if (auth.currentMember(); as member) {
        <span
          class="text-sm"
          data-testid="header-user"
        >
          {{ member.firstName }} {{ member.lastName }}
        </span>
      } @else {
        <span
          class="text-sm opacity-75"
          data-testid="header-anonymous"
        >
          Niezalogowany
        </span>
      }
    </mat-toolbar>
    <main class="min-h-[calc(100vh-4rem)]">
      <router-outlet />
    </main>
    <footer class="text-sm py-4 border-t border-outline-variant text-center text-on-surface-variant">
      AI Studio · Demo biblioteki · {{ currentYear }}
    </footer>
  `,
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly librarianOnly = ['librarian'] as const;
}
