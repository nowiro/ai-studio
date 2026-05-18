/**
 * Renders a single consent row — checkbox + label + description chip for required consents.
 * Takes the consent FormGroup as input so the parent's FormArray binding stays intact.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ais-consent-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule, MatIconModule, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 0.5rem;
      }

      .row {
        background: var(--mat-sys-surface);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-medium);
        padding: 0.875rem 1rem;
        transition: border-color 150ms ease;
      }

      .row:hover {
        border-color: var(--mat-sys-outline);
      }

      .row--required {
        border-left: 4px solid var(--mat-sys-error);
      }

      .row__head {
        display: flex;
        align-items: flex-start;
        gap: 0.625rem;
      }

      .row__label {
        font: var(--mat-sys-body-medium);
        font-weight: 500;
        line-height: 1.35;
      }

      .row__badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: 0.5rem;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
        font: var(--mat-sys-label-small);
        font-weight: 600;
      }

      .row__description {
        margin: 0.375rem 0 0 2.25rem;
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        line-height: 1.5;
      }
    `,
  ],
  template: `
    <div
      [formGroup]="formGroup()"
      [class.row--required]="required()"
      class="row"
    >
      <div class="row__head">
        <mat-checkbox
          [attr.data-testid]="'consent-' + key()"
          [color]="required() ? 'warn' : 'primary'"
          formControlName="granted"
        >
          <span class="row__label">{{ label() }}</span>
          @if (required()) {
            <span
              class="row__badge"
              data-testid="consent-required-chip"
            >
              <mat-icon style="font-size:0.875rem; width:0.875rem; height:0.875rem;">priority_high</mat-icon>
              wymagane
            </span>
          }
        </mat-checkbox>
      </div>
      @if (description() !== '') {
        <p class="row__description">{{ description() }}</p>
      }
    </div>
  `,
})
export class ConsentRowComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly description = input<string>('');

  protected readonly key = computed(() => (this.formGroup().get('key')?.value as string) ?? '');
  protected readonly label = computed(() => (this.formGroup().get('label')?.value as string) ?? '');
  protected readonly required = computed(() => this.formGroup().get('required')?.value === true);
}
