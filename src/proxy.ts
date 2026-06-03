import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/constants/storage";

const publicPaths = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    publicPaths.some((p) =>
      pathname.startsWith(p)
    ) || pathname.startsWith("/api");

  const isAuthenticated =
    request.cookies.has(AUTH_COOKIE);

  if (!isAuthenticated && !isPublic) {
    const login = new URL(
      "/login",
      request.url
    );

    login.searchParams.set(
      "from",
      pathname
    );

    return NextResponse.redirect(login);
  }

  if (
    isAuthenticated &&
    pathname === "/login"
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};