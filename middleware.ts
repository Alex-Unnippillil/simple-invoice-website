import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'),
  prefix: 'mw',
});

export default async function middleware(req: NextRequest) {
  const identifier = req.headers.get('x-user-id') ?? req.ip ?? 'anonymous';
  const { success, remaining } = await ratelimit.limit(identifier);
  if (!success) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }
  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
