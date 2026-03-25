import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const proxyToken = request.cookies.get("proxy_token")?.value;
  if (!proxyToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("previous_url");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.well-known/).*)"],
};
