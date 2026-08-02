import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isMaintenanceHost } from './config/maintenance';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Check if this domain is configured for maintenance mode
  if (isMaintenanceHost(hostname)) {
    // Exemptions:
    // - The `/coming-soon` page itself (to avoid infinite rewrites)
    // - Internal NextJS assets (`/_next/`)
    // - API routes (`/api/`)
    // - Static files containing extensions (e.g. `/favicon.ico`, `/logo.svg`)
    const isExempt =
      pathname === '/coming-soon' ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.includes('.') ||
      pathname.startsWith('/static/');

    if (!isExempt) {
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

// Run middleware on all paths except standard static assets and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
