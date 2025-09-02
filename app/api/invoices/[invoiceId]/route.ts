import { NextResponse } from 'next/server';
import { invoices } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const id = Number(params.invoiceId);
  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
  return NextResponse.json(invoice);
}
