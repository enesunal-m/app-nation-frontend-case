import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // If the path is login/register and there's a token, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all paths except for:
  // - API routes (/api/*)
  // - Static files (_next/static/*, favicon.ico, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};