import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const tokenData = request.cookies.get("token");
  const url = request.nextUrl;

  if (!tokenData && url.pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    tokenData &&
    (url.pathname === "/sign-in" || url.pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up","/add/:*","/all/:*"], 
};
