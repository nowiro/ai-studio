import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Reusable search input for the shop shell + standalone pages.
 *
 * Emits `submit(query)` on Enter, on the magnifier click, or on clear.
 * Outline appearance + dynamic subscript sizing keeps it compact in the
 * sticky header without breaking the row height when validation fires.
 */
@Component({
  selector: 'ais-shop-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <form
      (ngSubmit)="onSubmit()"
      class="w-full"
      role="search"
    >
      <mat-form-field
        class="w-full"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>{{ placeholder() }}</mat-label>
        <input
          [formControl]="query"
          [attr.aria-label]="placeholder()"
          matInput
          inputmode="search"
          data-testid="search-input"
        />
        @if (query.value.length > 0) {
          <button
            (click)="clear()"
            matIconButton
            matSuffix
            type="button"
            aria-label="Wyczyść wyszukiwanie"
            data-testid="search-clear"
          >
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
            >
              close
            </span>
          </button>
        }
        <button
          matIconButton
          matSuffix
          type="submit"
          aria-label="Szukaj"
          data-testid="search-submit"
        >
          <span
            class="material-symbols-outlined"
            aria-hidden="true"
          >
            search
          </span>
        </button>
      </mat-form-field>
    </form>
  `,
})
export class SearchBarComponent {
  readonly placeholder = input<string>('Szukaj produktów…');
  readonly querySubmit = output<string>();

  protected readonly query = new FormControl('', { nonNullable: true });

  protected onSubmit(): void {
    const value = this.query.value.trim();
    if (value.length > 0) this.querySubmit.emit(value);
  }

  protected clear(): void {
    this.query.setValue('');
    this.querySubmit.emit('');
  }
}
