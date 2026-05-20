/**
 * In-game settings overlay for Pong. Reads / writes `PongSettingsStore`
 * directly and emits `close` so the host can dismiss it. The host is
 * responsible for applying the volume + paddle speed to the live `GameApi`
 * via an `effect()` watching `store.settings()`.
 */
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { PongHighScoreStore, type PongPaddleSpeed, PongSettingsStore } from '@ai-studio/game-pong';

@Component({
  selector: 'ais-pong-settings',
  standalone: true,
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, MatSliderModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 grid place-items-center bg-surface/85 backdrop-blur-sm z-20' },
  template: `
    <section
      class="gap-6 p-6 max-w-sm rounded-2xl shadow-xl flex w-[min(90vw,24rem)] flex-col border border-outline-variant bg-surface text-on-surface"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pong-settings-title"
      data-testid="pong-settings"
    >
      <header class="gap-2 flex items-center justify-between">
        <h2
          id="pong-settings-title"
          class="text-xl font-bold"
        >
          Ustawienia
        </h2>
        <button
          (click)="closeRequested.emit()"
          matIconButton
          aria-label="Zamknij ustawienia"
          data-testid="pong-settings-close"
        >
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <div class="gap-3 flex flex-col">
        <label
          class="text-sm font-medium"
          for="pong-volume"
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
            id="pong-volume"
            [value]="volumePercent()"
            (valueChange)="onVolumeChange($event)"
            matSliderThumb
            data-testid="pong-settings-volume"
          />
        </mat-slider>
      </div>

      <div class="gap-3 flex flex-col">
        <span class="text-sm font-medium">Prędkość paletki gracza</span>
        <mat-button-toggle-group
          [value]="paddleSpeed()"
          (change)="onPaddleSpeedChange($event.value)"
          hideSingleSelectionIndicator
          aria-label="Prędkość paletki"
          data-testid="pong-settings-paddle-speed"
        >
          <mat-button-toggle value="slow">Wolno</mat-button-toggle>
          <mat-button-toggle value="normal">Normalnie</mat-button-toggle>
          <mat-button-toggle value="fast">Szybko</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <footer class="gap-2 flex flex-col">
        <button
          [disabled]="best() === 0"
          (click)="onResetBest()"
          matButton="outlined"
          data-testid="pong-settings-reset-best"
        >
          <mat-icon>restart_alt</mat-icon>
          Resetuj najlepszy wynik
          @if (best() > 0) {
            <span class="ml-1 text-on-surface-variant tabular-nums">({{ best() }})</span>
          }
        </button>

        <button
          (click)="onResetAll()"
          matButton
          data-testid="pong-settings-reset"
        >
          Przywróć domyślne
        </button>
      </footer>
    </section>
  `,
})
export class SettingsOverlayComponent {
  /** Renamed from `close` to avoid the `no-output-native` rule. */
  readonly closeRequested = output<void>();

  private readonly settings = inject(PongSettingsStore);
  private readonly highScore = inject(PongHighScoreStore);

  protected readonly best = computed(() => this.highScore.best());
  protected readonly volumePercent = computed(() => Math.round(this.settings.settings().volume * 100));
  protected readonly paddleSpeed = computed(() => this.settings.settings().paddleSpeed);

  protected onVolumeChange(percent: number): void {
    this.settings.setVolume(percent / 100);
  }

  protected onPaddleSpeedChange(preset: PongPaddleSpeed): void {
    this.settings.setPaddleSpeed(preset);
  }

  protected onResetBest(): void {
    this.highScore.reset();
  }

  protected onResetAll(): void {
    this.settings.reset();
  }
}
