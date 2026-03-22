import { NextRequest, NextResponse } from "next/server";

const INTEGRATIONS_BASE = "https://flow-api.viasocket.com/projects";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1NTkzIiwicHJvamVjdF9pZCI6InByb2o5TGZRdjRUNyIsInVzZXJfaWQiOiI2MTg5MCIsImlhdCI6MTc3NDAxMDI3M30.rhl0-Hfq5k9SAH3Zali9qdNl7s-EWKvxkVsL3Xaq5Qs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const res = await fetch(`${INTEGRATIONS_BASE}/${projectId}/integrations`, {
    method: "GET",
    headers: {
      "accept": "*/*",
      "authorization": AUTH_TOKEN,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
