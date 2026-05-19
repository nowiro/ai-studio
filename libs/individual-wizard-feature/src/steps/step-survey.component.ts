/**
 * Step 3 — Survey. Demonstrates 3–5 levels of conditional nesting:
 *
 *   educationLevel
 *     └── higherEducation        (when level ∈ {higher, phd})
 *           └── specialisation   (when field === 'IT')
 *                 └── thesis     (when level === 'phd' && branch ∈ {data, security})
 *                       └── keywords[]
 *
 *   employment.status
 *     └── employment.details     (when status ∈ {employed, self-employed})
 *           └── contracts[]
 *
 * Conditional add/remove is owned by {@link WizardFormFactory}; this component only
 * reads the form's current shape via `asOptionalGroup` and renders.
 *
 * Visual cue: each nesting level uses a distinct accent color on the left rail so the
 * depth of conditional branching is obvious at a glance.
 */
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  asArray,
  asGroup,
  asOptionalGroup,
  CONTRACT_TYPES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  IT_BRANCHES,
  LANGUAGE_CODES,
  LANGUAGE_LEVELS,
  STUDY_FIELDS,
  WizardFormFactory,
} from '@ai-studio/individual-wizard-data';
import { FormErrorComponent } from '@ai-studio/individual-wizard-ui';

const ERRORS: Record<string, string> = {
  required: 'Pole jest wymagane.',
  maxlength: 'Wartość jest zbyt długa.',
  min: 'Wartość musi być większa lub równa 0.',
};

@Component({
  selector: 'ais-step-survey',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormErrorComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
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

      .stack {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .section {
        background: var(--mat-sys-surface-container-low);
        border-radius: var(--mat-sys-corner-medium);
        padding: 1.25rem;
        border: 1px solid var(--mat-sys-outline-variant);
      }

      .section__title {
        font: var(--mat-sys-title-medium);
        margin: 0 0 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .section__title mat-icon {
        color: var(--mat-sys-primary);
      }

      /* Color-coded nesting levels: each deeper level shifts the accent. */
      .nest {
        margin-top: 1rem;
        padding: 1rem 1rem 1rem 1.25rem;
        border-radius: var(--mat-sys-corner-medium);
        border-left: 4px solid;
      }

      .nest--l2 {
        border-color: var(--mat-sys-primary);
        background: color-mix(in srgb, var(--mat-sys-primary) 6%, var(--mat-sys-surface));
      }

      .nest--l3 {
        border-color: var(--mat-sys-secondary);
        background: color-mix(in srgb, var(--mat-sys-secondary) 6%, var(--mat-sys-surface));
      }

      .nest--l4 {
        border-color: var(--mat-sys-tertiary);
        background: color-mix(in srgb, var(--mat-sys-tertiary) 8%, var(--mat-sys-surface));
      }

      .nest__title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font: var(--mat-sys-title-small);
        margin: 0 0 0.75rem;
      }

      .nest__level-chip {
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        background: var(--mat-sys-surface);
        color: var(--mat-sys-on-surface-variant);
      }

      .field-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 1rem;
      }

      .col-12 {
        grid-column: span 12 / span 12;
      }

      @media (min-width: 768px) {
        .col-md-4 {
          grid-column: span 4 / span 4;
        }
        .col-md-5 {
          grid-column: span 5 / span 5;
        }
        .col-md-6 {
          grid-column: span 6 / span 6;
        }
      }

      .row {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .row__grow {
        flex: 1 1 auto;
      }

      .row__remove {
        flex: 0 0 auto;
        margin-top: 0.25rem;
      }

      mat-form-field {
        width: 100%;
      }

      .list-actions {
        margin-top: 0.5rem;
      }

      .keywords-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      @media (min-width: 768px) {
        .keywords-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .keyword-row {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }
    `,
  ],
  template: `
    <div class="step-header">
      <span class="step-header__icon"><mat-icon>quiz</mat-icon></span>
      <div>
        <h2 class="step-header__title">Ankieta</h2>
        <p class="step-header__subtitle">Zagnieżdżone sekcje warunkowe (do 5 poziomów w głąb).</p>
      </div>
    </div>

    <section
      [formGroup]="formGroup()"
      class="stack"
    >
      <div class="section">
        <h3 class="section__title">
          <mat-icon>school</mat-icon>
          Wykształcenie
        </h3>

        <mat-form-field
          appearance="outline"
          subscriptSizing="dynamic"
        >
          <mat-label>Poziom</mat-label>
          <mat-select
            formControlName="educationLevel"
            data-testid="survey-education-level"
          >
            @for (lvl of educationLevels; track lvl.value) {
              <mat-option [value]="lvl.value">{{ lvl.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (higherEducation(); as higher) {
          <div
            [formGroup]="higher"
            class="nest nest--l2"
          >
            <h4 class="nest__title">
              <mat-icon>menu_book</mat-icon>
              Studia wyższe
              <span class="nest__level-chip">poziom 2</span>
            </h4>

            <div class="field-grid">
              <mat-form-field
                class="col-md-6 col-12"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Uczelnia</mat-label>
                <input
                  matInput
                  formControlName="university"
                  data-testid="survey-university"
                />
                <ais-form-error
                  [control]="higher.get('university')"
                  [messages]="errorMessages"
                />
              </mat-form-field>

              <mat-form-field
                class="col-md-6 col-12"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Kierunek</mat-label>
                <mat-select
                  formControlName="field"
                  data-testid="survey-field"
                >
                  @for (f of studyFields; track f.value) {
                    <mat-option [value]="f.value">{{ f.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            @if (specialisation(); as spec) {
              <div
                [formGroup]="spec"
                class="nest nest--l3"
              >
                <h4 class="nest__title">
                  <mat-icon>code</mat-icon>
                  Specjalizacja IT
                  <span class="nest__level-chip">poziom 3</span>
                </h4>

                <mat-form-field
                  appearance="outline"
                  subscriptSizing="dynamic"
                >
                  <mat-label>Branża</mat-label>
                  <mat-select
                    formControlName="branch"
                    data-testid="survey-branch"
                  >
                    @for (b of itBranches; track b.value) {
                      <mat-option [value]="b.value">{{ b.label }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                @if (thesis(); as thesisGroup) {
                  <div
                    [formGroup]="thesisGroup"
                    class="nest nest--l4"
                  >
                    <h4 class="nest__title">
                      <mat-icon>science</mat-icon>
                      Praca doktorska
                      <span class="nest__level-chip">poziom 4</span>
                    </h4>

                    <mat-form-field
                      appearance="outline"
                      subscriptSizing="dynamic"
                    >
                      <mat-label>Temat</mat-label>
                      <input
                        matInput
                        formControlName="topic"
                        data-testid="survey-thesis-topic"
                      />
                      <ais-form-error
                        [control]="thesisGroup.get('topic')"
                        [messages]="errorMessages"
                      />
                    </mat-form-field>

                    <div formArrayName="keywords">
                      <h5
                        class="nest__title"
                        style="margin-top:1rem;"
                      >
                        <mat-icon>label</mat-icon>
                        Słowa kluczowe
                        <span class="nest__level-chip">poziom 5 · FormArray</span>
                      </h5>
                      <div class="keywords-grid">
                        @for (kw of keywords().controls; track $index) {
                          <div class="keyword-row">
                            <mat-form-field
                              class="row__grow"
                              appearance="outline"
                              subscriptSizing="dynamic"
                            >
                              <mat-label>Słowo {{ $index + 1 }}</mat-label>
                              <input
                                [formControlName]="$index"
                                [attr.data-testid]="'survey-keyword-' + $index"
                                matInput
                              />
                              <ais-form-error
                                [control]="kw"
                                [messages]="errorMessages"
                              />
                            </mat-form-field>
                            @if (keywords().length > 1) {
                              <button
                                [attr.data-testid]="'survey-keyword-remove-' + $index"
                                (click)="removeKeyword($index)"
                                class="row__remove"
                                mat-icon-button
                                type="button"
                                aria-label="Usuń słowo kluczowe"
                              >
                                <mat-icon>close</mat-icon>
                              </button>
                            }
                          </div>
                        }
                      </div>
                      <button
                        [disabled]="keywords().length >= 10"
                        (click)="addKeyword()"
                        class="list-actions"
                        mat-stroked-button
                        type="button"
                        data-testid="survey-keyword-add"
                      >
                        <mat-icon>add</mat-icon>
                        Dodaj słowo kluczowe ({{ keywords().length }}/10)
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <div
        class="section"
        formGroupName="employment"
      >
        <h3 class="section__title">
          <mat-icon>work</mat-icon>
          Zatrudnienie
        </h3>

        <mat-form-field
          appearance="outline"
          subscriptSizing="dynamic"
        >
          <mat-label>Status</mat-label>
          <mat-select
            formControlName="status"
            data-testid="survey-employment-status"
          >
            @for (s of employmentStatuses; track s.value) {
              <mat-option [value]="s.value">{{ s.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (employmentDetails(); as details) {
          <div
            [formGroup]="details"
            class="nest nest--l2"
          >
            <h4 class="nest__title">
              <mat-icon>business</mat-icon>
              Szczegóły zatrudnienia
              <span class="nest__level-chip">poziom 2</span>
            </h4>

            <div class="field-grid">
              <mat-form-field
                class="col-md-6 col-12"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Firma</mat-label>
                <input
                  matInput
                  formControlName="companyName"
                  data-testid="survey-company-name"
                />
                <ais-form-error
                  [control]="details.get('companyName')"
                  [messages]="errorMessages"
                />
              </mat-form-field>
              <mat-form-field
                class="col-md-6 col-12"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Stanowisko</mat-label>
                <input
                  matInput
                  formControlName="position"
                  data-testid="survey-position"
                />
                <ais-form-error
                  [control]="details.get('position')"
                  [messages]="errorMessages"
                />
              </mat-form-field>
            </div>

            <div
              style="margin-top:1rem;"
              formArrayName="contracts"
            >
              <h5 class="nest__title">
                <mat-icon>description</mat-icon>
                Kontrakty
                <span class="nest__level-chip">FormArray</span>
              </h5>
              @for (ctr of contracts().controls; track $index) {
                <div
                  [formGroupName]="$index"
                  class="field-grid"
                >
                  <mat-form-field
                    class="col-md-4 col-12"
                    appearance="outline"
                    subscriptSizing="dynamic"
                  >
                    <mat-label>Rodzaj</mat-label>
                    <mat-select
                      [attr.data-testid]="'survey-contract-type-' + $index"
                      formControlName="type"
                    >
                      @for (t of contractTypes; track t.value) {
                        <mat-option [value]="t.value">{{ t.label }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field
                    class="col-md-4 col-12"
                    appearance="outline"
                    subscriptSizing="dynamic"
                  >
                    <mat-label>Od kiedy</mat-label>
                    <input
                      [matDatepicker]="ctrDate"
                      [attr.data-testid]="'survey-contract-since-' + $index"
                      matInput
                      formControlName="since"
                    />
                    <mat-datepicker-toggle
                      [for]="ctrDate"
                      matIconSuffix
                    />
                    <mat-datepicker #ctrDate />
                  </mat-form-field>
                  <mat-form-field
                    class="col-md-4 col-12"
                    appearance="outline"
                    subscriptSizing="dynamic"
                  >
                    <mat-label>Brutto / mies. (PLN)</mat-label>
                    <input
                      [attr.data-testid]="'survey-contract-gross-' + $index"
                      matInput
                      type="number"
                      formControlName="grossMonthly"
                    />
                    <ais-form-error
                      [control]="ctr.get('grossMonthly')"
                      [messages]="errorMessages"
                    />
                  </mat-form-field>
                  @if (contracts().length > 1) {
                    <div
                      class="col-12"
                      style="text-align:right;"
                    >
                      <button
                        [attr.data-testid]="'survey-contract-remove-' + $index"
                        (click)="removeContract($index)"
                        mat-icon-button
                        type="button"
                        aria-label="Usuń kontrakt"
                      >
                        <mat-icon>delete_outline</mat-icon>
                      </button>
                    </div>
                  }
                </div>
              }
              <button
                (click)="addContract()"
                class="list-actions"
                mat-stroked-button
                type="button"
                data-testid="survey-contract-add"
              >
                <mat-icon>add</mat-icon>
                Dodaj kontrakt
              </button>
            </div>
          </div>
        }
      </div>

      <div class="section">
        <h3 class="section__title">
          <mat-icon>translate</mat-icon>
          Języki obce
        </h3>

        <div formArrayName="languages">
          @for (lang of languages().controls; track $index) {
            <div
              [formGroupName]="$index"
              class="row"
            >
              <mat-form-field
                class="row__grow"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Język</mat-label>
                <mat-select
                  [attr.data-testid]="'survey-language-' + $index"
                  formControlName="code"
                >
                  @for (l of languageCodes; track l.value) {
                    <mat-option [value]="l.value">{{ l.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field
                class="row__grow"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Poziom</mat-label>
                <mat-select
                  [attr.data-testid]="'survey-language-level-' + $index"
                  formControlName="level"
                >
                  @for (lv of languageLevels; track lv.value) {
                    <mat-option [value]="lv.value">{{ lv.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              @if (languages().length > 1) {
                <button
                  [attr.data-testid]="'survey-language-remove-' + $index"
                  (click)="removeLanguage($index)"
                  class="row__remove"
                  mat-icon-button
                  type="button"
                  aria-label="Usuń język"
                >
                  <mat-icon>close</mat-icon>
                </button>
              }
            </div>
          }
        </div>
        <button
          (click)="addLanguage()"
          class="list-actions"
          mat-stroked-button
          type="button"
          data-testid="survey-language-add"
        >
          <mat-icon>add</mat-icon>
          Dodaj język
        </button>
      </div>
    </section>
  `,
})
export class StepSurveyComponent {
  private readonly factory = inject(WizardFormFactory);
  readonly formGroup = input.required<FormGroup>();

  protected readonly educationLevels = EDUCATION_LEVELS;
  protected readonly studyFields = STUDY_FIELDS;
  protected readonly itBranches = IT_BRANCHES;
  protected readonly employmentStatuses = EMPLOYMENT_STATUSES;
  protected readonly contractTypes = CONTRACT_TYPES;
  protected readonly languageCodes = LANGUAGE_CODES;
  protected readonly languageLevels = LANGUAGE_LEVELS;
  protected readonly errorMessages = ERRORS;

  protected higherEducation(): FormGroup | null {
    return asOptionalGroup(this.formGroup(), 'higherEducation');
  }

  protected specialisation(): FormGroup | null {
    const higher = this.higherEducation();
    return higher === null ? null : asOptionalGroup(higher, 'specialisation');
  }

  protected thesis(): FormGroup | null {
    const spec = this.specialisation();
    return spec === null ? null : asOptionalGroup(spec, 'thesis');
  }

  protected keywords(): FormArray<FormControl<string>> {
    const thesisGroup = this.thesis();
    if (thesisGroup === null) return new FormArray<FormControl<string>>([]);
    return asArray(thesisGroup, 'keywords') as FormArray<FormControl<string>>;
  }

  protected employmentDetails(): FormGroup | null {
    return asOptionalGroup(asGroup(this.formGroup(), 'employment'), 'details');
  }

  protected contracts(): FormArray {
    const details = this.employmentDetails();
    if (details === null) return new FormArray<FormGroup>([]);
    return asArray(details, 'contracts');
  }

  protected languages(): FormArray {
    return asArray(this.formGroup(), 'languages');
  }

  protected addKeyword(): void {
    this.factory.addKeyword(this.rootRef());
  }
  protected removeKeyword(index: number): void {
    this.factory.removeKeyword(this.rootRef(), index);
  }
  protected addContract(): void {
    this.factory.addContract(this.rootRef());
  }
  protected removeContract(index: number): void {
    this.factory.removeContract(this.rootRef(), index);
  }
  protected addLanguage(): void {
    this.factory.addLanguage(this.rootRef());
  }
  protected removeLanguage(index: number): void {
    this.factory.removeLanguage(this.rootRef(), index);
  }

  private rootRef(): FormGroup {
    const root = this.formGroup().parent;
    if (!(root instanceof FormGroup)) throw new Error('Survey group has no parent FormGroup.');
    return root;
  }
}
