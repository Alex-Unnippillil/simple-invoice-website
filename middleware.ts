import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getFlags } from './lib/flags';

/**
 * Middleware to protect tenant and admin routes and inject feature flags.
 * Users must have an auth token cookie to access these paths.
 * Unauthenticated users are redirected to /login.
 * Feature flags are added to the request headers as a JSON string under
 * `x-feature-flags`.
 */
export async function middleware(request: NextRequest) {
  const flags = await getFlags();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-feature-flags', JSON.stringify(flags));

  const { pathname } = request.nextUrl;

  const requiresAuth = pathname.startsWith('/tenant') || pathname.startsWith('/admin');

  if (requiresAuth) {
    const token = request.cookies.get('token');

    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/tenant/:path*', '/admin/:path*'],
};
