/**
 * Bridges Phaser ↔ Angular. Mounts the canvas, subscribes `GameApi` events,
 * and exposes the score / status / winner via `signal()`s consumed by HUD.
 * @see .ai/rules/games.md § 3 Bridge
 */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import {
  createGame,
  type GameApi,
  paddleSpeedMultiplier,
  type PongScore,
  PongSettingsStore,
  type PongStatus,
  type Side,
} from '@ai-studio/game-pong';
import {
  GameOverOverlayComponent,
  MenuOverlayComponent,
  ScoreDisplayComponent,
  SettingsOverlayComponent,
} from '@ai-studio/game-pong-ui';

@Component({
  selector: 'ais-pong-host',
  standalone: true,
  imports: [ScoreDisplayComponent, MenuOverlayComponent, GameOverOverlayComponent, SettingsOverlayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full min-h-screen relative bg-surface' },
  template: `
    <div class="top-6 absolute left-1/2 z-10 -translate-x-1/2">
      <ais-score-display [score]="score()" />
    </div>

    <div
      class="inset-0 absolute grid touch-none place-items-center"
      #canvas
      data-testid="game-canvas"
    ></div>

    @if (status() === 'idle' && !settingsOpen()) {
      <ais-menu-overlay
        [muted]="muted()"
        (startGame)="onStart()"
        (muteChange)="onMute($event)"
        (openSettings)="settingsOpen.set(true)"
      />
    }

    @if (status() === 'paused') {
      <div
        class="inset-0 absolute grid place-items-center bg-surface/70"
        data-testid="paused"
      >
        <p class="text-3xl font-bold tracking-wide">PAUSED</p>
      </div>
    }

    @if (status() === 'over' && winner() !== null) {
      <ais-game-over-overlay
        [winner]="winner()!"
        [score]="score()"
        (playAgain)="onPlayAgain()"
      />
    }

    @if (settingsOpen()) {
      <ais-pong-settings (closeRequested)="settingsOpen.set(false)" />
    }
  `,
})
export class PongHostComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLDivElement>>('canvas');
  private readonly settingsStore = inject(PongSettingsStore);

  protected readonly score = signal<PongScore>({ player: 0, cpu: 0 });
  protected readonly status = signal<PongStatus>('idle');
  protected readonly winner = signal<Side | null>(null);
  protected readonly muted = signal<boolean>(false);
  protected readonly settingsOpen = signal<boolean>(false);

  private api?: GameApi;

  constructor() {
    // Push every settings change into the live game once it boots. Reads the
    // signal so the effect re-runs on any update from the settings overlay.
    effect(() => {
      const current = this.settingsStore.settings();
      if (!this.api) return;
      this.api.setVolume(current.volume);
      this.api.setPlayerSpeedMultiplier(paddleSpeedMultiplier(current.paddleSpeed));
      this.muted.set(current.volume === 0);
    });
  }

  ngAfterViewInit(): void {
    this.api = createGame(this.canvas().nativeElement);

    // Apply the persisted settings once the api is up.
    const initial = this.settingsStore.settings();
    this.api.setVolume(initial.volume);
    this.api.setPlayerSpeedMultiplier(paddleSpeedMultiplier(initial.paddleSpeed));
    this.muted.set(initial.volume === 0);

    const unsubscribe = this.api.subscribe((event) => {
      switch (event.type) {
        case 'score': {
          this.score.set(event.score);
          break;
        }
        case 'started':
        case 'resumed': {
          this.status.set('playing');
          this.winner.set(null);
          break;
        }
        case 'paused': {
          this.status.set('paused');
          break;
        }
        case 'reset': {
          this.status.set('idle');
          this.score.set({ player: 0, cpu: 0 });
          this.winner.set(null);
          break;
        }
        case 'game-over': {
          this.status.set('over');
          this.winner.set(event.winner);
          break;
        }
        default: {
          break;
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      unsubscribe();
      this.api?.destroy();
    });
  }

  @HostListener('window:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'm' || event.key === 'M') {
      this.onMute(!this.muted());
    } else if (event.key === 'Escape' && this.settingsOpen()) {
      this.settingsOpen.set(false);
    }
  }

  protected onStart(): void {
    this.api?.start();
  }

  protected onPlayAgain(): void {
    this.api?.start();
  }

  protected onMute(muted: boolean): void {
    // Mute keystroke flips between 0 and the last-known volume. We treat it
    // as a quick toggle by setting volume to 0 / 0.7 (default) since we don't
    // track "last non-zero" — power users will use the slider.
    this.settingsStore.setVolume(muted ? 0 : 0.7);
  }
}
