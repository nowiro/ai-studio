import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GRADE_VALUES, GradesService, type GradeValue, RosterService, SessionService } from '@ai-studio/journal-data';

@Component({
  selector: 'ais-grade-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <section
      class="p-4 max-w-2xl gap-3 mx-auto flex flex-col"
      data-testid="grade-editor"
    >
      <h1 class="m-0 text-2xl font-semibold">Wystaw ocenę</h1>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Uczeń</mat-label>
        <mat-select
          [value]="studentId()"
          (valueChange)="studentId.set($event)"
          data-testid="editor-student"
        >
          @for (student of roster.students(); track student.id) {
            <mat-option [value]="student.id">{{ student.firstName }} {{ student.lastName }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Przedmiot</mat-label>
        <mat-select
          [value]="subjectId()"
          (valueChange)="subjectId.set($event)"
          data-testid="editor-subject"
        >
          @for (subject of roster.subjects(); track subject.id) {
            <mat-option [value]="subject.id">{{ subject.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Wartość (1–6)</mat-label>
        <mat-select
          [value]="value()"
          (valueChange)="value.set($event)"
          data-testid="editor-value"
        >
          @for (v of gradeValues; track v) {
            <mat-option [value]="v">{{ v }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Waga (0.5–3.0)</mat-label>
        <input
          [ngModel]="weight()"
          (ngModelChange)="weight.set($event)"
          matInput
          type="number"
          min="0.5"
          max="3"
          step="0.5"
          data-testid="editor-weight"
        />
      </mat-form-field>
      <button
        [disabled]="!canSave()"
        (click)="save()"
        matButton="filled"
        type="button"
        data-testid="editor-save"
      >
        Zapisz ocenę
      </button>
      @if (lastSavedId(); as id) {
        <p
          class="m-0 text-sm text-on-surface-variant"
          data-testid="editor-saved"
        >
          Zapisano ocenę {{ id }}.
        </p>
      }
    </section>
  `,
})
export class GradeEditorComponent {
  protected readonly roster = inject(RosterService);
  private readonly grades = inject(GradesService);
  private readonly session = inject(SessionService);

  protected readonly gradeValues = GRADE_VALUES;
  protected readonly studentId = signal<string | null>(null);
  protected readonly subjectId = signal<string | null>(null);
  protected readonly value = signal<GradeValue>(5);
  protected readonly weight = signal<number>(1);
  protected readonly lastSavedId = signal<string | null>(null);

  protected readonly canSave = computed(
    () => this.studentId() !== null && this.subjectId() !== null && this.weight() > 0,
  );

  protected save(): void {
    const studentId = this.studentId();
    const subjectId = this.subjectId();
    if (!studentId || !subjectId) {
      return;
    }
    const teacher = this.session.currentMember();
    const grade = this.grades.add({
      studentId,
      subjectId,
      termId: this.session.currentTerm(),
      value: this.value(),
      weight: this.weight(),
      comment: '',
      issuedAt: this.session.today,
      teacherId: teacher?.id ?? 'teacher-1',
    });
    this.lastSavedId.set(grade.id);
  }
}
