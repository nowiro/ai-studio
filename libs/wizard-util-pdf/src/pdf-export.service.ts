/**
 * PDF export service — renders a {@link PdfReport} into a downloadable PDF via jsPDF.
 *
 * Note on Polish diacritics: jsPDF's built-in Helvetica covers Latin-1 only and may render
 * ąęłńóśźż as boxes. For production swap in a custom font (Noto Sans / Roboto) via
 * `doc.addFileToVFS(...)` + `doc.addFont(...)`. The demo accepts this trade-off for the sake
 * of zero font-asset overhead.
 */
import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { PdfReport } from './pdf-types.js';

const PAGE_MARGIN = 14;
const LINE_HEIGHT = 6;
const COLOR_PRIMARY: [number, number, number] = [33, 33, 33];
const COLOR_MUTED: [number, number, number] = [120, 120, 120];

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  /** Builds the PDF and triggers a browser download under `filename`. */
  download(report: PdfReport, filename: string): void {
    const doc = this.build(report);
    doc.save(filename);
  }

  /** Builds the PDF and returns it as a Blob (useful for previews/upload). */
  toBlob(report: PdfReport): Blob {
    return this.build(report).output('blob');
  }

  private build(report: PdfReport): jsPDF {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = PAGE_MARGIN;

    y = this.renderHeader(doc, report, y);
    y = this.renderMeta(doc, report.meta ?? [], y);
    y = this.renderSections(doc, report.sections ?? [], y);
    this.renderTables(doc, report.tables ?? [], y);

    return doc;
  }

  private renderHeader(doc: jsPDF, report: PdfReport, startY: number): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(report.title, PAGE_MARGIN, startY);
    let y = startY + 8;
    if (report.subtitle !== undefined && report.subtitle !== '') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...COLOR_MUTED);
      doc.text(report.subtitle, PAGE_MARGIN, y);
      y += LINE_HEIGHT;
    }
    return y + 2;
  }

  private renderMeta(doc: jsPDF, meta: readonly { label: string; value: string }[], startY: number): number {
    if (meta.length === 0) return startY;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_MUTED);
    let y = startY;
    for (const row of meta) {
      doc.text(`${row.label}: ${row.value}`, PAGE_MARGIN, y);
      y += LINE_HEIGHT - 1;
    }
    return y + 2;
  }

  private renderSections(
    doc: jsPDF,
    sections: readonly { title: string; rows: readonly { label: string; value: string }[] }[],
    startY: number,
  ): number {
    let y = startY;
    for (const section of sections) {
      y = this.ensureSpace(doc, y, LINE_HEIGHT * (section.rows.length + 2));

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text(section.title, PAGE_MARGIN, y);
      y += LINE_HEIGHT;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      for (const row of section.rows) {
        const label = `${row.label}:`;
        doc.setTextColor(...COLOR_MUTED);
        doc.text(label, PAGE_MARGIN, y);
        doc.setTextColor(...COLOR_PRIMARY);
        doc.text(row.value, PAGE_MARGIN + 55, y);
        y += LINE_HEIGHT - 1;
      }
      y += 3;
    }
    return y;
  }

  private renderTables(
    doc: jsPDF,
    tables: readonly { title: string; head: readonly string[]; body: readonly (readonly string[])[] }[],
    startY: number,
  ): void {
    let y = startY;
    for (const table of tables) {
      y = this.ensureSpace(doc, y, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text(table.title, PAGE_MARGIN, y);
      y += 3;
      autoTable(doc, {
        head: [table.head as string[]],
        body: table.body.map((row) => row as string[]),
        startY: y,
        margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [55, 65, 81], textColor: 255, fontStyle: 'bold' },
      });
      const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
      y = finalY + 6;
    }
  }

  /** If `requiredHeight` would overflow the page, adds a new page and returns the new top. */
  private ensureSpace(doc: jsPDF, currentY: number, requiredHeight: number): number {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (currentY + requiredHeight > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      return PAGE_MARGIN;
    }
    return currentY;
  }
}
