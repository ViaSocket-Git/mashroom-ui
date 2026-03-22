import { NextResponse } from "next/server";

const AI_CLIENTS_URL = "https://flow.sokt.io/func/scriTg56Y2oZ";

export async function GET() {
  const res = await fetch(AI_CLIENTS_URL, { method: "GET" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
