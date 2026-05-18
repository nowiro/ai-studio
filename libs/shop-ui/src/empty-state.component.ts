import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

/** Generic "no results" panel reused by every shop's catalogue page. */
@Component({
  selector: 'ais-shop-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  template: `
    <div
      [attr.data-testid]="testId()"
      class="gap-3 py-16 flex flex-col items-center text-center text-on-surface-variant"
    >
      <span class="material-symbols-outlined text-5xl">{{ icon() }}</span>
      <p class="m-0">{{ message() }}</p>
      @if (actionLabel(); as label) {
        <button
          [attr.data-testid]="testId() + '-action'"
          (click)="action.emit()"
          matButton="filled"
          type="button"
        >
          {{ label }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  readonly message = input.required<string>();
  readonly icon = input<string>('search_off');
  readonly actionLabel = input<string | null>(null);
  readonly testId = input<string>('empty-state');

  readonly action = output<void>();
}
