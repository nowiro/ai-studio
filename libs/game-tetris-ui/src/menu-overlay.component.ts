/**
 * Idle/paused menu overlay. Shown when status is "idle" or "paused".
 * Emits `start` and `resume`; host wires those to `TetrisState`.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import type { TetrisStatus } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-menu',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="inset-0 bg-black/70 text-white absolute flex items-center justify-center text-center"
      data-testid="tetris-menu"
    >
      <div class="gap-4 max-w-sm px-6 flex flex-col items-center">
        <h2 class="text-3xl font-bold tracking-wide">
          {{ status() === 'paused' ? 'Paused' : 'Tetris' }}
        </h2>
        <p class="text-sm leading-relaxed opacity-70">
          Move with
          <kbd>←</kbd>
          /
          <kbd>→</kbd>
          , soft-drop
          <kbd>↓</kbd>
          , rotate
          <kbd>↑</kbd>
          /
          <kbd>Z</kbd>
          , hard-drop
          <kbd>Space</kbd>
          , hold
          <kbd>Shift</kbd>
          /
          <kbd>C</kbd>
          , pause
          <kbd>P</kbd>
          /
          <kbd>Esc</kbd>
          .
        </p>
        @if (status() === 'paused') {
          <button
            (click)="resumeRequested.emit()"
            mat-flat-button
            color="primary"
            data-testid="tetris-resume"
          >
            Resume
          </button>
        } @else {
          <button
            (click)="startRequested.emit()"
            mat-flat-button
            color="primary"
            data-testid="tetris-start"
          >
            Start
          </button>
        }
      </div>
    </div>
  `,
})
export class TetrisMenuOverlayComponent {
  readonly status = input.required<TetrisStatus>();
  /** Renamed to avoid the angular-eslint `no-output-native` rule (collides with `start`/`resume` DOM events). */
  readonly startRequested = output<void>();
  readonly resumeRequested = output<void>();
}
