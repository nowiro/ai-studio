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
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { createGame, type GameApi, type PongScore, type PongStatus, type Side } from '@ai-studio/game-pong';
import { GameOverOverlayComponent, MenuOverlayComponent, ScoreDisplayComponent } from '@ai-studio/game-pong-ui';

@Component({
  selector: 'ais-pong-host',
  standalone: true,
  imports: [ScoreDisplayComponent, MenuOverlayComponent, GameOverOverlayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full min-h-screen relative bg-surface' },
  template: `
    <div class="absolute top-6 left-1/2 z-10 -translate-x-1/2">
      <ais-score-display [score]="score()" />
    </div>

    <div
      class="absolute inset-0 grid place-items-center"
      #canvas
      data-testid="game-canvas"
    ></div>

    @if (status() === 'idle') {
      <ais-menu-overlay
        [muted]="muted()"
        (startGame)="onStart()"
        (muteChange)="onMute($event)"
      />
    }

    @if (status() === 'paused') {
      <div
        class="absolute inset-0 grid place-items-center bg-surface/70"
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
  `,
})
export class PongHostComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLDivElement>>('canvas');

  protected readonly score = signal<PongScore>({ player: 0, cpu: 0 });
  protected readonly status = signal<PongStatus>('idle');
  protected readonly winner = signal<Side | null>(null);
  protected readonly muted = signal<boolean>(false);

  private api?: GameApi;

  ngAfterViewInit(): void {
    this.api = createGame(this.canvas().nativeElement);

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
    }
  }

  protected onStart(): void {
    this.api?.start();
  }

  protected onPlayAgain(): void {
    this.api?.start();
  }

  protected onMute(muted: boolean): void {
    this.muted.set(muted);
    this.api?.mute(muted);
  }
}
