import { PDFDocument, StandardFonts } from 'pdf-lib';

export interface StatementTotals {
  openingBalance: number;
  charges: number;
  payments: number;
  adjustments: number;
  closingBalance: number;
}

/**
 * Build a PDF summarizing a tenant's statement.
 * The PDF contains rows for opening balance, charges, payments,
 * adjustments and closing balance.
 */
export async function buildStatementPdf(totals: StatementTotals): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 350;
  page.drawText('Statement Summary', { x: 50, y, size: 18, font });
  y -= 40;

  const rows: Array<[string, number]> = [
    ['Opening Balance', totals.openingBalance],
    ['Charges', totals.charges],
    ['Payments', totals.payments],
    ['Adjustments', totals.adjustments],
    ['Closing Balance', totals.closingBalance],
  ];

  rows.forEach(([label, value]) => {
    page.drawText(label, { x: 50, y, size: 12, font });
    page.drawText(value.toFixed(2), { x: 300, y, size: 12, font });
    y -= 20;
  });

  const bytes = await pdfDoc.save();
  return bytes;
}
