/**
 * Idle/paused menu overlay. Shown when status is "idle" or "paused".
 * Emits `start` and `resume`; host wires those to `TetrisState`.
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TetrisHighScoreStore, type TetrisStatus } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="inset-0 backdrop-blur-sm absolute flex items-center justify-center bg-scrim/80 text-center text-on-surface"
      data-testid="tetris-menu"
    >
      <div class="gap-5 p-6 max-w-md rounded-2xl flex flex-col items-center border border-outline-variant bg-surface">
        <h2 class="text-3xl font-bold tracking-wide">
          {{ status() === 'paused' ? 'Pauza' : 'Tetris' }}
        </h2>

        @if (best().score > 0 && status() !== 'paused') {
          <p
            class="gap-1 text-sm flex flex-col items-center text-on-surface"
            data-testid="tetris-menu-best"
          >
            <span>
              Najlepszy wynik:
              <span class="font-bold tabular-nums">{{ best().score }}</span>
            </span>
            <span class="text-xs text-on-surface-variant">{{ best().lines }} linii · poziom {{ best().level }}</span>
          </p>
        }

        <p class="text-sm leading-relaxed text-on-surface">
          Ruch:
          <kbd class="kbd">←</kbd>
          /
          <kbd class="kbd">→</kbd>
          · miękki spad:
          <kbd class="kbd">↓</kbd>
          · obrót:
          <kbd class="kbd">↑</kbd>
          /
          <kbd class="kbd">Z</kbd>
          · twardy spad:
          <kbd class="kbd">Spacja</kbd>
          · hold:
          <kbd class="kbd">Shift</kbd>
          /
          <kbd class="kbd">C</kbd>
          · pauza:
          <kbd class="kbd">P</kbd>
          /
          <kbd class="kbd">Esc</kbd>
          .
        </p>

        @if (status() === 'paused') {
          <button
            (click)="resumeRequested.emit()"
            matButton="filled"
            data-testid="tetris-resume"
          >
            Wznów
          </button>
        } @else {
          <button
            (click)="startRequested.emit()"
            matButton="filled"
            data-testid="tetris-start"
          >
            Start
          </button>
        }

        <button
          (click)="settingsRequested.emit()"
          matIconButton
          aria-label="Ustawienia"
          data-testid="tetris-open-settings"
        >
          <mat-icon>settings</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .kbd {
        display: inline-block;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
        font: var(--mat-sys-label-small);
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
      }
    `,
  ],
})
export class TetrisMenuOverlayComponent {
  readonly status = input.required<TetrisStatus>();
  /** Renamed to avoid the angular-eslint `no-output-native` rule (collides with `start`/`resume` DOM events). */
  readonly startRequested = output<void>();
  readonly resumeRequested = output<void>();
  readonly settingsRequested = output<void>();

  private readonly highScore = inject(TetrisHighScoreStore);
  protected readonly best = computed(() => this.highScore.best());
}
