import { NextRequest, NextResponse } from "next/server";

const TOOL_API_URL = "https://flow-api.viasocket.com/mcp/tool";
const PROXY_AUTH_TOKEN =
  "SnBzMWVrWkhHNHBnOXp2TVgwc1pHa01Dd1dSQWprMjBKVk0ySzJGMFN0RVlBQm9YRURrTjRDc2MycE4xYXduaE50cnBCaExXbFFwQnBQMzExNVlEVnUxQUlQT2phWEhLREoxckptMTloSytESHFCdktQL2s5NityNndrMXJhcStaaFRDNks2U2FqUHFOenA4MFhZeFZDWThHaGt1RTF6Y3dhSUY4TDVHOWNQT2IzU2NuY3JaazJZSDkrYWN1RG5I";

const COMMON_HEADERS = {
  "accept": "application/json, text/plain, */*",
  "content-type": "application/json",
  "proxy_auth_token": PROXY_AUTH_TOKEN,
  "origin": "https://flow.viasocket.com",
  "referer": "https://flow.viasocket.com/",
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(TOOL_API_URL, {
    method: "POST",
    headers: COMMON_HEADERS,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
