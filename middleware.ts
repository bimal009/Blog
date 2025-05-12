// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Recommended over jsonwebtoken for Edge Runtime

// Paths that don't require authentication
const publicPaths = ['/login', '/register', '/api/login', '/api/register', '/', '/about'];

export async function middleware(request: NextRequest) {
  // Check if the path is public or should be protected
  const path = request.nextUrl.pathname;
  const isPublicPath = publicPaths.some(pp => path.startsWith(pp));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from cookie or auth header
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

  // If no token present, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    // Using jose's jwtVerify which works in Edge Runtime
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key');
    await jwtVerify(token, secret);
    
    // If token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which paths should be matched by the middleware
export const config = {
  matcher: [
    // Match all paths except public paths, static files, next internals, and api endpoints that need to be public
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};