import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  price: z.number()
});

const invoiceSchema = z.object({
  client: z.string(),
  taxRate: z.number(),
  lineItems: z.array(lineItemSchema)
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
  }

  const { lineItems, taxRate } = parsed.data;
  const subTotal = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subTotal * taxRate / 100;
  const total = subTotal + tax;

  return NextResponse.json({ subTotal, tax, total });
}
