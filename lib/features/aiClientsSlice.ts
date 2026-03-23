import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const AI_CLIENTS_URL = "https://flow.sokt.io/func/scriTg56Y2oZ";

export interface AiClient {
  id: string;
  title: string;
  link: string;
  icon: string;
  configType: string;
  popular?: boolean;
  className?: string;
}

interface AiClientsState {
  clients: AiClient[];
  loading: boolean;
  error: string | null;
}

const initialState: AiClientsState = {
  clients: [],
  loading: false,
  error: null,
};

export const fetchAiClients = createAsyncThunk(
  "aiClients/fetchAiClients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(AI_CLIENTS_URL);
      return (res.data?.result ?? []) as AiClient[];
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const aiClientsSlice = createSlice({
  name: "aiClients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiClients.fulfilled, (state, action) => {
        state.loading = false;
        const TITLE_TO_DOMAIN: Record<string, string> = {
          "Claude": "claude.ai",
          "ChatGPT": "chatgpt.com",
          "Cursor": "cursor.com",
          "Amazon Quick Suite MCP Server": "aws.com",
          "Anthropic API": "anthropic.com",
          "OpenAI API": "openai.com",
          "Gemini CLI": "gemini.google.com",
          "Julius AI": "julius.ai",
          "Manus": "manus.im",
          "Mistral AI": "mistral.ai",
          "Python": "python.org",
          "TypeScript": "typescriptlang.org",
          "Vapi": "vapi.ai",
          "Visual Studio Code": "code.visualstudio.com",
          "Warp": "warp.dev",
          "Windsurf": "windsurf.com",
          "Zed": "zed.dev",
          "Ravenala": "ravenala.ai",
          "Toolhouse": "toolhouse.ai",
          "other": "other.com"
        };
        state.clients = action.payload.map((client) => {
          const domain = TITLE_TO_DOMAIN[client.title];
          if (domain) return { ...client, icon: `https://thingsofbrand.com/api/icon/${domain}` };
          try {
            const urlDomain = new URL(client.link).hostname.replace(/^www\./, "");
            return { ...client, icon: `https://thingsofbrand.com/api/icon/${urlDomain}` };
          } catch {
            return client;
          }
        });
      })
      .addCase(fetchAiClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default aiClientsSlice.reducer;
