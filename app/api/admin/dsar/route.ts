import { NextRequest, NextResponse } from 'next/server';
import { demoUser } from '@/lib/data';

// Simple admin endpoint to satisfy DSAR by returning all data for a user.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') ?? String(demoUser.id);
  // In a real app we'd look up by userId; here we return the demo user.
  const user = demoUser;
  return new NextResponse(JSON.stringify(user, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="dsar-${userId}.json"`
    }
  });
}
