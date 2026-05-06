import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings");

  const isAuthRoute =
    pathname === "/sign-in" ||
    pathname === "/sign-up";

  if (isProtectedRoute || isAuthRoute) {
    try {
      const response = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
        }
      );

      const session = await response.json().catch(() => null);

      if (isProtectedRoute && !session) {
        const url = new URL("/sign-in", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }

      if (isAuthRoute && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
