import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/sensitive')) {
    const mfa = req.cookies.get('mfa');
    if (!mfa || mfa.value !== 'true') {
      return NextResponse.json({ error: 'Step-up required' }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/sensitive/:path*'],
};
