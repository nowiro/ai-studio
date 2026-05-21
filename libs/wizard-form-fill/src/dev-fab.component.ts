/**
 * Floating, draggable dev-tools panel. Anchored to the right edge of the viewport,
 * can be dragged vertically (CDK DragDrop on a dedicated grip strip — separate from
 * the clickable toggle so the button's `click` event isn't swallowed by the drag
 * handler) and flipped to the left side with a single click.
 *
 * Exposes three actions:
 *  - "Tylko wymagane"   — fills only `Validators.required` leaves
 *  - "Wszystkie pola"   — fills every visible leaf
 *  - "Maksymalne zagnieżdżenia" — runs the Strategy's expand hook then fills all
 *
 * All three delegate to {@link FormFillerService}, which only touches controls
 * currently in the form tree (disabled and out-of-tree controls are skipped).
 * The walker is wizard-agnostic — see `form-fill-strategy.ts` for the contract.
 */
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormFillerService } from './form-filler.service.js';

type Side = 'right' | 'left';

@Component({
  selector: 'ais-dev-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, MatButtonModule, MatIconModule, MatTooltipModule],
  host: {
    class: 'block',
    '[class.side-right]': "side() === 'right'",
    '[class.side-left]': "side() === 'left'",
  },
  styles: [
    `
      :host {
        position: fixed;
        top: 35%;
        z-index: 9999;
        pointer-events: none;
      }

      :host(.side-right) {
        right: 0;
      }
      :host(.side-left) {
        left: 0;
      }

      .panel {
        pointer-events: auto;
        background: var(--mat-sys-surface);
        color: var(--mat-sys-on-surface);
        border: 1px solid var(--mat-sys-outline-variant);
        box-shadow: var(--mat-sys-level3);
        border-radius: var(--mat-sys-corner-large);
        padding: 0.375rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.375rem;
        min-width: 3rem;
        max-width: 17rem;
        transition: max-width 200ms ease;
      }

      :host(.side-right) .panel {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 0;
      }
      :host(.side-left) .panel {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: 0;
      }

      .grip {
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        color: var(--mat-sys-on-surface-variant);
        opacity: 0.7;
        border-radius: 9999px;
        user-select: none;
      }

      .grip:hover {
        opacity: 1;
        background: var(--mat-sys-surface-container-low);
      }

      .grip:active {
        cursor: grabbing;
      }

      .grip mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
        transform: rotate(90deg);
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.625rem;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        border: none;
        border-radius: var(--mat-sys-corner-small);
        cursor: pointer;
        font: var(--mat-sys-label-large);
        font-weight: 600;
        text-align: left;
        width: 100%;
      }

      .toggle:hover {
        filter: brightness(0.95);
      }

      .toggle:focus-visible {
        outline: 2px solid var(--mat-sys-primary);
        outline-offset: 2px;
      }

      .toggle mat-icon {
        font-size: 1.125rem;
        width: 1.125rem;
        height: 1.125rem;
      }

      .toggle__label {
        flex: 1 1 auto;
      }

      .flip-btn {
        align-self: flex-end;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .actions button {
        justify-content: flex-start;
      }

      .meta {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        padding: 0.125rem 0.5rem;
        line-height: 1.3;
        margin: 0;
      }
    `,
  ],
  template: `
    <div
      class="panel"
      cdkDrag
      cdkDragLockAxis="y"
      cdkDragBoundary="body"
      data-testid="dev-fab"
    >
      <div
        class="grip"
        cdkDragHandle
        aria-label="Przeciągnij pionowo"
        data-testid="dev-fab-grip"
      >
        <mat-icon>drag_indicator</mat-icon>
      </div>

      <button
        [attr.aria-expanded]="expanded()"
        (click)="toggle()"
        class="toggle"
        type="button"
        aria-label="Otwórz panel narzędzi deweloperskich"
        data-testid="dev-fab-toggle"
      >
        <mat-icon>{{ expanded() ? 'expand_more' : 'auto_fix_high' }}</mat-icon>
        @if (expanded()) {
          <span class="toggle__label">Dev tools</span>
        }
      </button>

      @if (expanded()) {
        <button
          [matTooltip]="side() === 'right' ? 'Przenieś na lewo' : 'Przenieś na prawo'"
          (click)="flipSide()"
          class="flip-btn"
          mat-icon-button
          type="button"
          aria-label="Zmień stronę"
          data-testid="dev-fab-flip"
        >
          <mat-icon style="font-size:1rem; width:1rem; height:1rem;">
            {{ side() === 'right' ? 'chevron_left' : 'chevron_right' }}
          </mat-icon>
        </button>

        <div class="actions">
          <button
            (click)="fillRequired()"
            mat-flat-button
            color="primary"
            type="button"
            data-testid="dev-fill-required"
          >
            <mat-icon>edit_note</mat-icon>
            Tylko wymagane
          </button>
          <button
            (click)="fillAll()"
            mat-stroked-button
            type="button"
            data-testid="dev-fill-all"
          >
            <mat-icon>auto_awesome</mat-icon>
            Wszystkie pola
          </button>
          <button
            (click)="fillFullDemo()"
            mat-stroked-button
            type="button"
            data-testid="dev-fill-full-demo"
            matTooltip="Wymusza maksymalne zagnieżdżenia: dodatkowe wiersze i wszystkie sekcje warunkowe"
          >
            <mat-icon>account_tree</mat-icon>
            Maksymalne zagnieżdżenia
          </button>
        </div>
        <p class="meta">
          Wypełnia tylko widoczne pola we wszystkich krokach.
          @if (lastAction() !== null) {
            <br />
            Ostatnio:
            <strong>{{ lastAction() }}</strong>
          }
        </p>
      }
    </div>
  `,
})
export class DevFabComponent {
  private readonly filler = inject(FormFillerService);

  readonly rootForm = input.required<FormGroup>();

  protected readonly expanded = signal(false);
  protected readonly side = signal<Side>('right');
  protected readonly lastAction = signal<string | null>(null);

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }

  protected flipSide(): void {
    this.side.update((s) => (s === 'right' ? 'left' : 'right'));
  }

  protected fillRequired(): void {
    this.filler.fillRequired(this.rootForm());
    this.lastAction.set('Wypełniono wymagane');
  }

  protected fillAll(): void {
    this.filler.fillAll(this.rootForm());
    this.lastAction.set('Wypełniono wszystkie');
  }

  protected fillFullDemo(): void {
    this.filler.fillFullDemo(this.rootForm());
    this.lastAction.set('Wypełniono z maks. zagnieżdżeniami');
  }
}
