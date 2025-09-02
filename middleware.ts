import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect tenant and admin routes.
 * Users must have an auth token cookie to access these paths.
 * Unauthenticated users are redirected to /login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = pathname.startsWith('/tenant') || pathname.startsWith('/admin');

  if (requiresAuth) {
    const sessionToken =
      request.cookies.get('next-auth.session-token') ??
      request.cookies.get('__Secure-next-auth.session-token');

    if (!sessionToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tenant/:path*', '/admin/:path*'],
};

