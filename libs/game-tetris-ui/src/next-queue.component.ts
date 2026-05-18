/**
 * Next-queue preview: shows the upcoming `previewCount` pieces as small
 * 4×4 grids. Pure SVG (no canvas) to keep render simple and stylable.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { shapeCells, type TetrominoKind } from '@ai-studio/game-tetris';

import { PIECE_COLOURS } from './palette.js';

interface CellRender {
  readonly x: number;
  readonly y: number;
  readonly fill: string;
}

interface PieceRender {
  readonly kind: TetrominoKind;
  readonly cells: readonly CellRender[];
}

@Component({
  selector: 'ais-tetris-next-queue',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block text-on-surface select-none' },
  template: `
    <div
      class="gap-3 flex flex-col"
      data-testid="tetris-next-queue"
    >
      <span class="text-sm tracking-wider uppercase opacity-60">Next</span>
      @for (piece of rendered(); track piece.kind + $index) {
        <svg
          [attr.data-testid]="'tetris-next-' + $index"
          [attr.aria-label]="'next piece ' + piece.kind"
          class="w-14 h-14 bg-black/30 rounded block"
          viewBox="0 0 4 4"
        >
          @for (cell of piece.cells; track $index) {
            <rect
              [attr.x]="cell.x"
              [attr.y]="cell.y"
              [attr.fill]="cell.fill"
              width="1"
              height="1"
            />
          }
        </svg>
      }
    </div>
  `,
})
export class TetrisNextQueueComponent {
  readonly queue = input.required<readonly TetrominoKind[]>();

  protected readonly rendered = computed<readonly PieceRender[]>(() =>
    this.queue().map((kind) => ({
      kind,
      cells: shapeCells(kind, 0).map((c) => ({ x: c.x, y: c.y, fill: PIECE_COLOURS[kind] })),
    })),
  );
}
