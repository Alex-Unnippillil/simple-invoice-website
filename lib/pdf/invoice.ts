import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface LineItem {
  description: string;
  amount: number;
}

export interface LandlordInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  /**
   * Optional PNG logo for the landlord encoded as a Uint8Array. The logo
   * will be rendered at the top of the document if provided.
   */
  logo?: Uint8Array;
}

export interface TenantInfo {
  name: string;
  address: string;
}

export interface InvoiceData {
  landlord: LandlordInfo;
  tenant: TenantInfo;
  invoiceNumber: string;
  invoiceDate: string;
  items: LineItem[];
}

/**
 * Generates a PDF invoice including a logo, landlord contact details and a
 * table of line items.
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  let cursorY = height - 50;

  // Render logo when available
  if (data.landlord.logo) {
    try {
      const logoImage = await pdfDoc.embedPng(data.landlord.logo);
      const scaled = logoImage.scale(0.5);
      page.drawImage(logoImage, {
        x: 40,
        y: cursorY - scaled.height,
        width: scaled.width,
        height: scaled.height,
      });
      cursorY -= scaled.height + 20;
    } catch (err) {
      // Logo is optional; swallow errors so invoice still generates
    }
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Landlord contact information
  page.drawText(data.landlord.name, { x: 40, y: cursorY, size: 12, font });
  cursorY -= 14;
  page.drawText(data.landlord.address, { x: 40, y: cursorY, size: 10, font });
  cursorY -= 12;
  if (data.landlord.phone) {
    page.drawText(data.landlord.phone, { x: 40, y: cursorY, size: 10, font });
    cursorY -= 12;
  }
  if (data.landlord.email) {
    page.drawText(data.landlord.email, { x: 40, y: cursorY, size: 10, font });
    cursorY -= 12;
  }

  // Tenant information and invoice meta
  page.drawText(`Bill To: ${data.tenant.name}`, { x: width - 220, y: height - 80, size: 10, font });
  page.drawText(data.tenant.address, { x: width - 220, y: height - 94, size: 10, font });
  page.drawText(`Invoice #: ${data.invoiceNumber}`, { x: width - 220, y: height - 122, size: 10, font });
  page.drawText(`Date: ${data.invoiceDate}`, { x: width - 220, y: height - 136, size: 10, font });

  // Line items header
  cursorY -= 40;
  page.drawText('Description', { x: 40, y: cursorY, size: 12, font });
  page.drawText('Amount', { x: width - 120, y: cursorY, size: 12, font });
  cursorY -= 16;

  let total = 0;
  data.items.forEach((item) => {
    page.drawText(item.description, { x: 40, y: cursorY, size: 10, font });
    const amount = `$${item.amount.toFixed(2)}`;
    page.drawText(amount, { x: width - 120, y: cursorY, size: 10, font });
    cursorY -= 14;
    total += item.amount;
  });

  // Total row
  cursorY -= 10;
  page.drawLine({
    start: { x: width - 160, y: cursorY + 8 },
    end: { x: width - 40, y: cursorY + 8 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText('Total', { x: width - 160, y: cursorY - 4, size: 12, font });
  page.drawText(`$${total.toFixed(2)}`, { x: width - 80, y: cursorY - 4, size: 12, font });

  return pdfDoc.save();
}
