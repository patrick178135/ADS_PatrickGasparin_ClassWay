// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/public") || pathname === "/login") {
    return NextResponse.next();
  }

  const protectedPaths = ["/dashboard", "/usuarios", "/viagens", "/onibus"];
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/usuarios/:path*", "/viagens/:path*", "/onibus/:path*"],
};
