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
    const token = request.cookies.get('token');

    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  // Assign experiment variant if one is not already set.
  const response = NextResponse.next();
  const experimentCookie = request.cookies.get('experiment-variant');

  if (!experimentCookie) {
    const variant = Math.random() < 0.5 ? 'control' : 'test';
    response.cookies.set('experiment-variant', variant, { path: '/' });
  }

  return response;
}

export const config = {
  matcher: ['/:path*'],
};

