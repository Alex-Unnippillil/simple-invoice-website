import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: 'Sensitive info accessible after step-up.' });
}
