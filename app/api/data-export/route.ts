import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '../../../authOptions';
import { demoUser, toCSV } from '@/lib/data';

export async function GET(req: NextRequest) {
  const session = await getServerSession(buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
