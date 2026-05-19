/**
 * Pre-game menu overlay. Emits `start` and `mute` events handled by the host.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-1, AC-2, AC-9
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
      <p class="max-w-xs text-center text-on-surface-variant">
        First to 5 wins. W/S or ↑/↓ to move. Esc to pause. M to mute.
      </p>
      <button
        (click)="startGame.emit()"
        mat-flat-button
        color="primary"
        data-testid="start-game"
      >
        START
      </button>
      <button
        [attr.aria-label]="muted() ? 'Unmute' : 'Mute'"
        (click)="muteChange.emit(!muted())"
        mat-icon-button
        data-testid="mute-toggle"
      >
        <mat-icon>{{ muted() ? 'volume_off' : 'volume_up' }}</mat-icon>
      </button>
    </div>
  `,
})
export class MenuOverlayComponent {
  readonly muted = input<boolean>(false);
  readonly startGame = output<void>();
  readonly muteChange = output<boolean>();
}
