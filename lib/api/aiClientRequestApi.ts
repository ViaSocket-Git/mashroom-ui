const AI_CLIENT_REQUEST_URL = "https://flow.sokt.io/func/scriu9vmqXqr";

export interface AiClientRequestPayload {
  aiClientName: string;
  description: string;
  originalSearch: string;
  timestamp: string;
}

export async function submitAiClientRequest(payload: AiClientRequestPayload): Promise<boolean> {
  try {
    const response = await fetch(AI_CLIENT_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
