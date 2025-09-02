import { NextRequest, NextResponse } from 'next/server';
import { demoUser, toCSV } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') ?? 'json';

  if (format === 'csv') {
    const csv = toCSV(demoUser.invoices);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="data.csv"'
      }
    });
  }

  return NextResponse.json(demoUser);
}
