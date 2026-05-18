import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component for the Tetris app. All gameplay lives in
 * `@ai-studio/game-tetris-ui`'s `TetrisHostComponent`, lazy-loaded via
 * the router config in `app.routes.ts`.
 */
@Component({
  selector: 'ais-root',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-screen' },
  template: `
    <router-outlet />
  `,
})
export class AppComponent {}
