import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  prefix: 'rl',
});

export async function GET(req: NextRequest) {
  const identifier = req.headers.get('x-user-id') ?? req.ip ?? 'anonymous';
  const { success, remaining } = await ratelimit.limit(identifier);
  return NextResponse.json({ success, remaining });
}
