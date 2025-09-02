import { NextResponse } from 'next/server';
import csv from 'csv-parser';
import { z } from 'zod';
import { Readable } from 'stream';
import { db, Invoice } from '../../../lib/fakeDb';

const InvoiceSchema = z.object({
  invoiceId: z.string(),
  amount: z.coerce.number(),
  dueDate: z.string(),
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const readable = Readable.from(WebStreamToNodeStream(file.stream()));
  const parser = readable.pipe(csv());

  db.begin();
  try {
    for await (const row of parser) {
      const parsed = InvoiceSchema.parse(row);
      db.insert(parsed as Invoice);
    }
    db.commit();
    return NextResponse.json({ success: true, rows: db.getAll().length });
  } catch (err: any) {
    db.rollback();
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

function WebStreamToNodeStream(stream: ReadableStream<Uint8Array>): AsyncIterable<Buffer> {
  const reader = stream.getReader();
  return {
    async next() {
      const { value, done } = await reader.read();
      if (done) return { value: undefined, done: true };
      return { value: Buffer.from(value), done: false };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
