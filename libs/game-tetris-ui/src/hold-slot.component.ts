/**
 * Hold slot: shows the kind currently held (or empty). Reads `signal<TetrominoKind | null>()`.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { shapeCells, type TetrominoKind } from '@ai-studio/game-tetris';

import { PIECE_COLOURS } from './palette.js';

@Component({
  selector: 'ais-tetris-hold-slot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block text-on-surface select-none' },
  template: `
    <div
      class="gap-2 flex flex-col"
      data-testid="tetris-hold-slot"
    >
      <span class="text-sm tracking-wider uppercase opacity-60">Hold</span>
      <svg
        [attr.aria-label]="held() ? 'held piece ' + held() : 'no piece held'"
        class="w-14 h-14 bg-black/30 rounded block"
        viewBox="0 0 4 4"
      >
        @for (cell of cells(); track $index) {
          <rect
            [attr.x]="cell.x"
            [attr.y]="cell.y"
            [attr.fill]="cell.fill"
            width="1"
            height="1"
          />
        }
      </svg>
    </div>
  `,
})
export class TetrisHoldSlotComponent {
  readonly held = input.required<TetrominoKind | null>();

  protected readonly cells = computed(() => {
    const kind = this.held();
    if (!kind) return [];
    return shapeCells(kind, 0).map((c) => ({ x: c.x, y: c.y, fill: PIECE_COLOURS[kind] }));
  });
}
