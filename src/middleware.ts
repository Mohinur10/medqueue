import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Centralized Role Access Map
// Easily scalable: map specific URL paths to allowed roles
const roleAccessMap: Record<string, string[]> = {
  '/admin': ['super_admin'],
  '/director': ['clinic_director'],
  '/doctor': ['doctor'],
  '/patient': ['patient']
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Identify if the requested path requires protection
  const protectedPrefix = Object.keys(roleAccessMap).find(prefix => pathname.startsWith(prefix));
  
  if (!protectedPrefix) {
    // Allow public or unprotected routes
    return NextResponse.next();
  }

  // 2. Extract JWT token from the HTTP-Only cookie
  const token = req.cookies.get('mq_token')?.value;

  if (!token) {
    // Unauthenticated -> send to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // 3. Verify JWT signature using the Edge-compatible 'jose' library
    // Fallback secret ensures development mode works identically to backend
    const secret = new TextEncoder().encode(
      process.env.JWT_ACCESS_SECRET || 'your-super-secure-access-secret-key-change-me'
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    // 4. Extract user role and authorize using the Access Map
    const userRole = payload.role as string;
    const allowedRoles = roleAccessMap[protectedPrefix];
    
    if (!allowedRoles.includes(userRole)) {
      // Authenticated, but lacking permissions for this specific area
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Fully authorized -> allow request to proceed
    return NextResponse.next();
  } catch (error) {
    // Token is expired, malformed, or invalid
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Config blocks Next.js from running middleware on static assets & API routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/director/:path*',
    '/doctor/:path*',
    '/patient/:path*'
  ]
};
