/**
 * In-game settings overlay for Tetris. Reads / writes `TetrisSettingsStore`
 * and emits `close` so the host can dismiss it. Volume is wired into the
 * store for future audio support; ghost-piece toggle is applied live by the
 * host on every frame.
 */
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

import { TetrisHighScoreStore, TetrisSettingsStore } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-settings',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSlideToggleModule, MatSliderModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 grid place-items-center bg-scrim/80 backdrop-blur-sm z-20' },
  template: `
    <section
      class="gap-6 p-6 max-w-sm rounded-2xl shadow-xl flex w-[min(90vw,24rem)] flex-col border border-outline-variant bg-surface text-on-surface"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tetris-settings-title"
      data-testid="tetris-settings"
    >
      <header class="gap-2 flex items-center justify-between">
        <h2
          id="tetris-settings-title"
          class="text-xl font-bold"
        >
          Ustawienia
        </h2>
        <button
          (click)="closeRequested.emit()"
          matIconButton
          aria-label="Zamknij ustawienia"
          data-testid="tetris-settings-close"
        >
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <div class="gap-3 flex flex-col">
        <label
          class="text-sm font-medium"
          for="tetris-volume"
        >
          Głośność
          <span class="ml-1 text-on-surface-variant tabular-nums">{{ volumePercent() }}%</span>
        </label>
        <mat-slider
          [min]="0"
          [max]="100"
          [step]="5"
          discrete
        >
          <input
            id="tetris-volume"
            [value]="volumePercent()"
            (valueChange)="onVolumeChange($event)"
            matSliderThumb
            data-testid="tetris-settings-volume"
          />
        </mat-slider>
      </div>

      <div class="gap-3 flex items-center justify-between">
        <span class="text-sm font-medium">Pokazuj duch klocka</span>
        <mat-slide-toggle
          [checked]="showGhost()"
          (change)="onShowGhostChange($event.checked)"
          aria-label="Pokazuj duch klocka"
          data-testid="tetris-settings-ghost"
        />
      </div>

      <footer class="gap-2 flex flex-col">
        <button
          [disabled]="best().score === 0"
          (click)="onResetBest()"
          matButton="outlined"
          data-testid="tetris-settings-reset-best"
        >
          <mat-icon>restart_alt</mat-icon>
          Resetuj najlepszy wynik
          @if (best().score > 0) {
            <span class="ml-1 text-on-surface-variant tabular-nums">({{ best().score }})</span>
          }
        </button>

        <button
          (click)="onResetAll()"
          matButton
          data-testid="tetris-settings-reset"
        >
          Przywróć domyślne
        </button>
      </footer>
    </section>
  `,
})
export class TetrisSettingsOverlayComponent {
  /** Renamed from `close` to avoid the `no-output-native` rule. */
  readonly closeRequested = output<void>();

  private readonly settings = inject(TetrisSettingsStore);
  private readonly highScore = inject(TetrisHighScoreStore);

  protected readonly best = computed(() => this.highScore.best());
  protected readonly volumePercent = computed(() => Math.round(this.settings.settings().volume * 100));
  protected readonly showGhost = computed(() => this.settings.settings().showGhost);

  protected onVolumeChange(percent: number): void {
    this.settings.setVolume(percent / 100);
  }

  protected onShowGhostChange(checked: boolean): void {
    this.settings.setShowGhost(checked);
  }

  protected onResetBest(): void {
    this.highScore.reset();
  }

  protected onResetAll(): void {
    this.settings.reset();
  }
}
