/**
 * Step 4 — Consents. The consent list itself is rebuilt by {@link WizardFormFactory}
 * whenever country / survey trigger fields change; this component is purely presentational.
 *
 * Bulk actions: grant all, clear all, grant optional only, invert selection.
 */
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { asArray, CONSENTS_CATALOG, WizardFormFactory } from '@ai-studio/individual-wizard-data';
import { ConsentRowComponent } from '@ai-studio/individual-wizard-ui';

@Component({
  selector: 'ais-step-consents',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConsentRowComponent, MatButtonModule, MatIconModule, MatTooltipModule, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .step-header__icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }

      .step-header__title {
        font: var(--mat-sys-title-large);
        margin: 0;
        line-height: 1.2;
      }

      .step-header__subtitle {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0.125rem 0 0;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
        background: var(--mat-sys-surface-container-low);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-medium);
      }

      .toolbar__meta {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }

      .toolbar__count {
        font-weight: 600;
        color: var(--mat-sys-primary);
      }

      .toolbar__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .empty {
        padding: 1.5rem;
        text-align: center;
        background: var(--mat-sys-surface-container-low);
        border: 1px dashed var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-medium);
        color: var(--mat-sys-on-surface-variant);
        font: var(--mat-sys-body-medium);
      }
    `,
  ],
  template: `
    <div class="step-header">
      <span class="step-header__icon"><mat-icon>verified_user</mat-icon></span>
      <div>
        <h2 class="step-header__title">Zgody i sprzeciwy</h2>
        <p class="step-header__subtitle">
          Lista zależna od kraju i ankiety. Zgody RODO są wymagane dla UE; CCPA dla USA.
        </p>
      </div>
    </div>

    <section [formGroup]="formGroup()">
      <div class="toolbar">
        <div class="toolbar__meta">
          Zaznaczono
          <span class="toolbar__count">{{ grantedCount() }}</span>
          z {{ totalCount() }}
          @if (requiredCount() > 0) {
            · wymaganych:
            <span class="toolbar__count">{{ requiredGrantedCount() }}/{{ requiredCount() }}</span>
          }
        </div>
        <div class="toolbar__actions">
          <button
            (click)="grantAll()"
            mat-stroked-button
            type="button"
            data-testid="consents-grant-all"
            matTooltip="Zaznacz wszystkie zgody (wymagane i opcjonalne)"
          >
            <mat-icon>done_all</mat-icon>
            Wszystkie
          </button>
          <button
            (click)="grantOptional()"
            mat-stroked-button
            type="button"
            data-testid="consents-grant-optional"
            matTooltip="Zaznacz tylko zgody nie-wymagane"
          >
            <mat-icon>checklist</mat-icon>
            Opcjonalne
          </button>
          <button
            (click)="invert()"
            mat-stroked-button
            type="button"
            data-testid="consents-invert"
            matTooltip="Odwróć każde zaznaczenie"
          >
            <mat-icon>swap_horiz</mat-icon>
            Odwróć
          </button>
          <button
            (click)="clearAll()"
            mat-stroked-button
            type="button"
            data-testid="consents-clear-all"
            matTooltip="Wyczyść wszystkie zaznaczenia"
          >
            <mat-icon>cancel</mat-icon>
            Wyczyść
          </button>
        </div>
      </div>

      <div formArrayName="items">
        @for (item of items.controls; track item.get('key')?.value) {
          <ais-consent-row
            [formGroup]="asFormGroup(item)"
            [description]="describe(asFormGroup(item).get('key')?.value)"
          />
        } @empty {
          <div
            class="empty"
            data-testid="consents-empty"
          >
            <mat-icon>info</mat-icon>
            Wypełnij wcześniejsze kroki — lista zgód dostosuje się do podanego kraju i danych ankiety.
          </div>
        }
      </div>
    </section>
  `,
})
export class StepConsentsComponent implements OnInit {
  private readonly factory = inject(WizardFormFactory);
  private readonly destroyRef = inject(DestroyRef);
  readonly formGroup = input.required<FormGroup>();

  /**
   * Counters live in writable signals updated from a `valueChanges` subscription.
   * `computed()` over the FormArray reference doesn't track mutations (push/remove change
   * the same array identity), so we re-derive imperatively whenever the form ticks.
   */
  protected readonly totalCount = signal(0);
  protected readonly grantedCount = signal(0);
  protected readonly requiredCount = signal(0);
  protected readonly requiredGrantedCount = signal(0);

  protected get items(): FormArray {
    return asArray(this.formGroup(), 'items');
  }

  ngOnInit(): void {
    const items = this.items;
    items.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.recountConsents());
    this.recountConsents();
  }

  private recountConsents(): void {
    const controls = this.items.controls;
    let total = 0;
    let granted = 0;
    let required = 0;
    let requiredGranted = 0;
    for (const c of controls) {
      total++;
      const isGranted = c.get('granted')?.value === true;
      const isRequired = c.get('required')?.value === true;
      if (isGranted) granted++;
      if (isRequired) required++;
      if (isRequired && isGranted) requiredGranted++;
    }
    this.totalCount.set(total);
    this.grantedCount.set(granted);
    this.requiredCount.set(required);
    this.requiredGrantedCount.set(requiredGranted);
  }

  protected asFormGroup(control: unknown): FormGroup {
    if (!(control instanceof FormGroup)) {
      throw new Error('Expected FormGroup in consents items FormArray.');
    }
    return control;
  }

  protected describe(key: unknown): string {
    if (typeof key !== 'string') return '';
    return CONSENTS_CATALOG.find((c) => c.key === key)?.description ?? '';
  }

  protected grantAll(): void {
    this.factory.grantAllConsents(this.rootRef());
  }
  protected clearAll(): void {
    this.factory.clearAllConsents(this.rootRef());
  }
  protected grantOptional(): void {
    this.factory.grantOptionalConsents(this.rootRef());
  }
  protected invert(): void {
    this.factory.invertConsents(this.rootRef());
  }

  private rootRef(): FormGroup {
    const root = this.formGroup().parent;
    if (!(root instanceof FormGroup)) throw new Error('Consents group has no parent FormGroup.');
    return root;
  }
}
