import { auth } from '@/auth';
// export { auth as middleware } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_ROUTES, PUBLIC_ROUTES, ROOT } from './lib/routes';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();
  const isAuthenticated = !!session?.user;
  console.log('🚨 - isAuthenticated', isAuthenticated);

  const isPublicRoute =
    (PUBLIC_ROUTES.every((route) => nextUrl.pathname.startsWith(route)) ||
      nextUrl.pathname === ROOT) &&
    !PROTECTED_ROUTES.every((route) => nextUrl.pathname.startsWith(route));
  console.log('🚨 - isPublicRoute', isPublicRoute);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
