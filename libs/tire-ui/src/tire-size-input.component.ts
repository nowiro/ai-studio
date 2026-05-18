import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/** Three numeric inputs for tire size: width / profile / diameter. */
@Component({
  selector: 'ais-tire-size-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div
      class="gap-2 flex items-end"
      data-testid="tire-size-input"
    >
      <mat-form-field
        class="w-24"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Szerokość</mat-label>
        <input
          [ngModel]="width()"
          (ngModelChange)="onWidth($event)"
          matInput
          type="number"
          inputmode="numeric"
          min="135"
          max="335"
          step="5"
          data-testid="tire-size-width"
        />
      </mat-form-field>
      <span class="pb-3 text-on-surface-variant select-none">/</span>
      <mat-form-field
        class="w-24"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Profil</mat-label>
        <input
          [ngModel]="profile()"
          (ngModelChange)="onProfile($event)"
          matInput
          type="number"
          inputmode="numeric"
          min="25"
          max="80"
          step="5"
          data-testid="tire-size-profile"
        />
      </mat-form-field>
      <span class="pb-3 text-on-surface-variant select-none">R</span>
      <mat-form-field
        class="w-24"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Średnica</mat-label>
        <input
          [ngModel]="diameter()"
          (ngModelChange)="onDiameter($event)"
          matInput
          type="number"
          inputmode="numeric"
          min="13"
          max="22"
          step="1"
          data-testid="tire-size-diameter"
        />
      </mat-form-field>
    </div>
  `,
})
export class TireSizeInputComponent {
  readonly width = input<number | null>(null);
  readonly profile = input<number | null>(null);
  readonly diameter = input<number | null>(null);

  readonly widthChange = output<number | null>();
  readonly profileChange = output<number | null>();
  readonly diameterChange = output<number | null>();

  protected readonly currentLabel = computed(
    () => `${this.width() ?? '?'}/${this.profile() ?? '?'} R${this.diameter() ?? '?'}`,
  );

  protected onWidth(value: unknown): void {
    this.widthChange.emit(toFiniteOrNull(value));
  }

  protected onProfile(value: unknown): void {
    this.profileChange.emit(toFiniteOrNull(value));
  }

  protected onDiameter(value: unknown): void {
    this.diameterChange.emit(toFiniteOrNull(value));
  }
}

function toFiniteOrNull(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
