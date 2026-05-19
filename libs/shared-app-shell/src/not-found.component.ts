/**
 * Generic 404 fallback used by both `pong-game` and `individual-wizard`
 * (and any future app). Renders a centred "404 — strona niedostępna" message.
 * Uses Tailwind utilities and Material design tokens so it picks up each app's
 * theme automatically.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ais-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid place-items-center min-h-screen' },
  template: `
    <div
      class="text-center"
      data-testid="not-found"
    >
      <h1 class="mb-4 text-6xl font-bold">404</h1>
      <p class="text-on-surface-variant">Ta strona jest niedostępna.</p>
    </div>
  `,
})
export class NotFoundComponent {}
