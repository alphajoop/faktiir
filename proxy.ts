import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard'];

// Routes only accessible when NOT authenticated
const AUTH_ONLY_ROUTES = ['/login', '/register', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('faktiir_token')?.value;
  const isAuthenticated = !!token;

  // 1. Protect dashboard routes — redirect to login if no cookie
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth routes — redirect to dashboard if already logged in
  const isAuthRoute = AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image  (Next.js internals)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public assets (files with extension)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$).*)',
  ],
};
