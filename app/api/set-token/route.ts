export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("proxy_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
  });
  return response;
}
