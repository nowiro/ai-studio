/**
 * Tetris host component — owns the canvas, the `TetrisState` instance, the
 * requestAnimationFrame loop, and the keyboard input. Bridges the logic lib
 * to Angular via signals so child HUD components stay pure.
 *
 * Layout: a 2-column grid; left = playfield canvas, right = hold + next
 * queue + score panel. Overlays (menu / game-over) sit absolutely above
 * the canvas.
 */
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import {
  type ActivePiece,
  type BoardSnapshot,
  DEFAULT_TETRIS_CONFIG,
  type PlayerMove,
  shapeCells,
  type TetrisConfig,
  type TetrisScore,
  TetrisSettingsStore,
  TetrisState,
  type TetrisStatus,
  type TetrominoKind,
} from '@ai-studio/game-tetris';

import { TetrisGameOverComponent } from './game-over-overlay.component.js';
import { TetrisHoldSlotComponent } from './hold-slot.component.js';
import { TetrisMenuOverlayComponent } from './menu-overlay.component.js';
import { TetrisNextQueueComponent } from './next-queue.component.js';
import { BLOCK_OUTLINE, GHOST_FILL, GHOST_OUTLINE, PIECE_COLOURS } from './palette.js';
import { TetrisScoreComponent } from './score-display.component.js';
import { TetrisSettingsOverlayComponent } from './settings-overlay.component.js';
import { detectGesture, gestureToMove, type TouchPoint } from './touch-gestures.js';

/** Pixels per cell — the canvas is `cols·CELL × rows·CELL`. */
const CELL = 30;

@Component({
  selector: 'ais-tetris-host',
  standalone: true,
  imports: [
    TetrisGameOverComponent,
    TetrisHoldSlotComponent,
    TetrisMenuOverlayComponent,
    TetrisNextQueueComponent,
    TetrisScoreComponent,
    TetrisSettingsOverlayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full h-full' },
  template: `
    <div
      class="gap-6 p-6 flex min-h-screen flex-col items-center justify-center bg-surface-container-highest text-on-surface"
    >
      <h1 class="text-2xl font-bold tracking-widest opacity-80">TETRIS</h1>
      <div class="gap-6 flex items-start">
        <div class="gap-6 flex flex-col">
          <ais-tetris-hold-slot [held]="held()" />
          <ais-tetris-score [score]="score()" />
        </div>

        <div
          (touchstart)="onTouchStart($event)"
          (touchend)="onTouchEnd($event)"
          class="relative touch-none"
          data-testid="tetris-board-wrapper"
        >
          <canvas
            [attr.width]="config.cols * CELL_PX"
            [attr.height]="config.rows * CELL_PX"
            class="rounded shadow-xl block"
            #board
            data-testid="tetris-board"
            tabindex="0"
            aria-label="Tetris playfield"
          ></canvas>
          @if (status() === 'over') {
            <ais-tetris-game-over
              [score]="score()"
              (restart)="onStart()"
            />
          } @else if ((status() === 'idle' || status() === 'paused') && !settingsOpen()) {
            <ais-tetris-menu
              [status]="status()"
              (startRequested)="onStart()"
              (resumeRequested)="onResume()"
              (settingsRequested)="settingsOpen.set(true)"
            />
          }

          @if (settingsOpen()) {
            <ais-tetris-settings (closeRequested)="settingsOpen.set(false)" />
          }
        </div>

        <ais-tetris-next-queue [queue]="nextQueue()" />
      </div>

      <p class="text-xs opacity-70">
        ←/→ move · ↓ soft-drop · ↑/Z rotate · Space hard-drop · Shift/C hold · P/Esc pause
      </p>
      <p
        class="md:hidden text-xs opacity-70"
        data-testid="tetris-touch-hint"
      >
        Mobile: machnij ← / → / ↓ klockiem · machnij ↑ — twardy spad · tap — obrót.
      </p>
    </div>
  `,
})
export class TetrisHostComponent implements AfterViewInit {
  protected readonly CELL_PX = CELL;
  protected readonly config: TetrisConfig = DEFAULT_TETRIS_CONFIG;

  private readonly boardRef = viewChild.required<ElementRef<HTMLCanvasElement>>('board');
  private readonly destroyRef = inject(DestroyRef);
  private readonly settingsStore = inject(TetrisSettingsStore);
  private readonly state = new TetrisState(this.config);

  protected readonly settingsOpen = signal<boolean>(false);

  // Snapshots driven by `TetrisState.subscribe`. The render loop reads these
  // straight off the state every frame (cheaper than diffing event-by-event).
  protected readonly status = signal<TetrisStatus>('idle');
  protected readonly score = signal<TetrisScore>(this.state.getScore());
  protected readonly held = signal<TetrominoKind | null>(null);
  protected readonly nextQueue = signal<readonly TetrominoKind[]>(this.state.getNextQueue());

  // Combined "anything visual changed" signal — handy for OnPush template re-runs.
  protected readonly any = computed(() => [this.status(), this.score(), this.held(), this.nextQueue()] as const);

  private rafId = 0;
  private lastTimeMs = 0;

  ngAfterViewInit(): void {
    const unsubscribe = this.state.subscribe((event) => {
      switch (event.type) {
        case 'piece-spawned':
          this.nextQueue.set(event.next);
          break;
        case 'piece-locked':
        case 'piece-moved':
        case 'lines-cleared':
        case 'reset':
          break;
        case 'started':
        case 'resumed':
        case 'paused':
        case 'game-over':
          this.status.set(this.state.getStatus());
          break;
        case 'score-changed':
        case 'level-up':
          this.score.set(this.state.getScore());
          break;
        case 'hold':
          this.held.set(event.held);
          break;
      }
    });
    this.destroyRef.onDestroy(() => unsubscribe());

    this.lastTimeMs = performance.now();
    this.scheduleFrame();
  }

  @HostListener('window:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (this.settingsOpen()) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.settingsOpen.set(false);
      }
      return;
    }
    if (this.status() !== 'playing') {
      // Allow Enter / P / Escape to start/resume.
      if (event.key === 'Enter') {
        event.preventDefault();
        this.onStart();
      } else if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
        event.preventDefault();
        if (this.status() === 'paused') this.onResume();
      }
      return;
    }
    const move = KEY_TO_MOVE[event.key];
    if (move) {
      event.preventDefault();
      this.state.input(move);
      // Score/held are updated via subscribe(); pull a fresh score in case the
      // input emitted a soft/hard-drop bonus.
      this.score.set(this.state.getScore());
      return;
    }
    if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
      event.preventDefault();
      this.state.pause();
    }
  }

  protected onStart(): void {
    this.state.start();
    this.score.set(this.state.getScore());
    this.held.set(this.state.getHeld());
    this.nextQueue.set(this.state.getNextQueue());
    this.boardRef().nativeElement.focus();
  }

  protected onResume(): void {
    this.state.resume();
  }

  // ── touch input (mobile) ───────────────────────────────────────────────
  // Touch handlers translate single-finger gestures into discrete tetris
  // moves. Two-finger gestures are ignored so users can pinch-zoom the
  // browser without affecting gameplay.

  private touchStart?: TouchPoint;

  protected onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) {
      this.touchStart = undefined;
      return;
    }
    const t = event.touches[0];
    if (!t) return;
    this.touchStart = { x: t.clientX, y: t.clientY, t: performance.now() };
    // `touch-none` on the wrapper kills native scroll/zoom on the board, but
    // some browsers still need a preventDefault on touchstart to lock in the
    // gesture stream.
    event.preventDefault();
  }

  protected onTouchEnd(event: TouchEvent): void {
    if (!this.touchStart) return;
    const t = event.changedTouches[0];
    if (!t) {
      this.touchStart = undefined;
      return;
    }
    const end: TouchPoint = { x: t.clientX, y: t.clientY, t: performance.now() };
    const gesture = detectGesture(this.touchStart, end);
    this.touchStart = undefined;
    if (!gesture) return;
    if (this.settingsOpen()) return;
    if (this.status() === 'idle') {
      // Start the game on the first deliberate touch so mobile users don't
      // need a hardware keyboard to leave the menu.
      this.onStart();
      event.preventDefault();
      return;
    }
    if (this.status() !== 'playing') return;
    this.state.input(gestureToMove(gesture));
    this.score.set(this.state.getScore());
    event.preventDefault();
  }

  // ── render loop ────────────────────────────────────────────────────────

  private scheduleFrame(): void {
    this.rafId = requestAnimationFrame((now) => {
      const dt = Math.min(100, now - this.lastTimeMs); // clamp to avoid huge jumps after tab-switch
      this.lastTimeMs = now;
      this.state.tick(dt);
      this.drawBoard();
      this.scheduleFrame();
    });
    this.destroyRef.onDestroy(() => cancelAnimationFrame(this.rafId));
  }

  private drawBoard(): void {
    const canvas = this.boardRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1f3a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawGrid(ctx);
    this.drawLockedCells(ctx, this.state.getBoard());
    if (this.settingsStore.settings().showGhost) {
      this.drawGhost(ctx);
    }
    this.drawActivePiece(ctx, this.state.getActivePiece());
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= this.config.cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, this.config.rows * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= this.config.rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(this.config.cols * CELL, y * CELL);
      ctx.stroke();
    }
  }

  private drawLockedCells(ctx: CanvasRenderingContext2D, board: BoardSnapshot): void {
    for (let y = 0; y < board.length; y++) {
      const row = board[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === 0 || !cell) continue;
        this.drawBlock(ctx, x, y, PIECE_COLOURS[cell]);
      }
    }
  }

  private drawGhost(ctx: CanvasRenderingContext2D): void {
    const ghost = this.state.getGhostCells();
    for (const cell of ghost) {
      if (cell.y < 0) continue;
      ctx.fillStyle = GHOST_FILL;
      ctx.fillRect(cell.x * CELL, cell.y * CELL, CELL, CELL);
      ctx.strokeStyle = GHOST_OUTLINE;
      ctx.lineWidth = 1;
      ctx.strokeRect(cell.x * CELL + 0.5, cell.y * CELL + 0.5, CELL - 1, CELL - 1);
    }
  }

  private drawActivePiece(ctx: CanvasRenderingContext2D, piece: ActivePiece | null): void {
    if (!piece) return;
    const cells = shapeCells(piece.kind, piece.rotation);
    for (const cell of cells) {
      const x = piece.position.x + cell.x;
      const y = piece.position.y + cell.y;
      if (y < 0) continue;
      this.drawBlock(ctx, x, y, PIECE_COLOURS[piece.kind]);
    }
  }

  private drawBlock(ctx: CanvasRenderingContext2D, cx: number, cy: number, fill: string): void {
    ctx.fillStyle = fill;
    ctx.fillRect(cx * CELL, cy * CELL, CELL, CELL);
    ctx.strokeStyle = BLOCK_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx * CELL + 0.5, cy * CELL + 0.5, CELL - 1, CELL - 1);
  }
}

const KEY_TO_MOVE: Readonly<Record<string, PlayerMove>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'soft-drop',
  ArrowUp: 'rotate-cw',
  z: 'rotate-ccw',
  Z: 'rotate-ccw',
  x: 'rotate-cw',
  X: 'rotate-cw',
  ' ': 'hard-drop',
  Shift: 'hold',
  c: 'hold',
  C: 'hold',
};
