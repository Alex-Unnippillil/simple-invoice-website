import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

let invoices = [{ id: 1, customer: 'Alice', amount: 100 }];

export async function GET() {
  return NextResponse.json(invoices);
}

export async function POST(req) {
  const invoice = await req.json();
  invoices.push(invoice);
  revalidateTag('invoices');
  return NextResponse.json({ ok: true });
}
