import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define routes that require authentication
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/settings');

  // Define auth routes (sign-in, sign-up) to prevent logged-in users from accessing them
  const isAuthRoute = 
    pathname === '/sign-in' || 
    pathname === '/sign-up';

  // If it's a protected route or auth route, we need to check the session
  if (isProtectedRoute || isAuthRoute) {
    // Check session via the BetterAuth API endpoint
    try {
      const response = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      const session = await response.json().catch(() => null);

      if (isProtectedRoute && !session) {
        // Redirect to sign-in if accessing a protected route without a session
        const url = new URL("/sign-in", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }

      if (isAuthRoute && session) {
        // Redirect to dashboard if trying to access auth pages while already logged in
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Middleware session check failed:", error);
      // Fallback: if fetch fails, block access to protected routes
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except Next.js internals, static files, API routes (except auth)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
