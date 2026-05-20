/**
 * Pre-game menu overlay. Emits `start`, `mute`, and `openSettings` events
 * handled by the host.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-1, AC-2, AC-9
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PongHighScoreStore } from '@ai-studio/game-pong';

@Component({
  selector: 'ais-menu-overlay',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 grid place-items-center bg-surface/85 backdrop-blur-sm' },
  template: `
    <div class="gap-6 p-8 flex flex-col items-center">
      <h1
        class="text-5xl font-bold tracking-wide"
        data-testid="menu-title"
      >
        PONG
      </h1>

      @if (best() > 0) {
        <p
          class="gap-2 text-sm flex items-center text-on-surface"
          data-testid="menu-best"
        >
          <mat-icon
            class="!h-4 !w-4 !text-base"
            aria-hidden="true"
          >
            emoji_events
          </mat-icon>
          Najlepszy wynik:
          <span class="font-bold tabular-nums">{{ best() }}</span>
        </p>
      }

      <p class="max-w-xs text-sm leading-relaxed text-center text-on-surface">
        Pierwszy do 5 wygrywa.
        <kbd class="rounded px-1.5 py-0.5 text-xs bg-surface-container-high">W</kbd>
        /
        <kbd class="rounded px-1.5 py-0.5 text-xs bg-surface-container-high">S</kbd>
        lub strzałki ↑/↓ — ruch.
        <kbd class="rounded px-1.5 py-0.5 text-xs bg-surface-container-high">Esc</kbd>
        — pauza.
        <kbd class="rounded px-1.5 py-0.5 text-xs bg-surface-container-high">M</kbd>
        — wycisz.
      </p>

      <p
        class="md:hidden text-xs text-on-surface-variant"
        data-testid="menu-touch-hint"
      >
        Na ekranie dotykowym: dotknij górnej / dolnej połowy ekranu, żeby przesunąć paletkę.
      </p>

      <button
        (click)="startGame.emit()"
        matButton="filled"
        data-testid="start-game"
      >
        START
      </button>

      <div class="gap-2 flex items-center">
        <button
          [attr.aria-label]="muted() ? 'Włącz dźwięk' : 'Wycisz'"
          (click)="muteChange.emit(!muted())"
          matIconButton
          data-testid="mute-toggle"
        >
          <mat-icon>{{ muted() ? 'volume_off' : 'volume_up' }}</mat-icon>
        </button>

        <button
          (click)="openSettings.emit()"
          matIconButton
          aria-label="Ustawienia"
          data-testid="open-settings"
        >
          <mat-icon>settings</mat-icon>
        </button>
      </div>
    </div>
  `,
})
export class MenuOverlayComponent {
  readonly muted = input<boolean>(false);
  readonly startGame = output<void>();
  readonly muteChange = output<boolean>();
  readonly openSettings = output<void>();

  private readonly highScore = inject(PongHighScoreStore);
  protected readonly best = computed(() => this.highScore.best());
}
