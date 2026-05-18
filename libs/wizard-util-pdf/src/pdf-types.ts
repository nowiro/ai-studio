/**
 * Generic PDF report payload — domain-agnostic, owned by the PDF utility.
 *
 * The feature library converts its own domain models into these shapes,
 * which keeps `wizard-util-pdf` free of dependencies on `wizard-data`
 * (module-boundary rule: util → util only).
 */

export interface PdfReport {
  readonly title: string;
  readonly subtitle?: string;
  /** Top-of-page metadata (timestamp, author, etc.). */
  readonly meta?: PdfMetaRow[];
  /** Vertically stacked, label/value definition lists. */
  readonly sections?: PdfSection[];
  /** Tabular data — rendered through `jspdf-autotable`. */
  readonly tables?: PdfTable[];
}

export interface PdfMetaRow {
  readonly label: string;
  readonly value: string;
}

export interface PdfSection {
  readonly title: string;
  readonly rows: PdfDefinitionRow[];
}

export interface PdfDefinitionRow {
  readonly label: string;
  readonly value: string;
}

export interface PdfTable {
  readonly title: string;
  readonly head: readonly string[];
  readonly body: readonly (readonly string[])[];
}
