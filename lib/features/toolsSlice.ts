import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { integrationsApi } from "../api/integrationsApi";
import { toolApi } from "../api/toolApi";

export interface Tool {
  name: string;
  mcpServerId: string;
  flowId: string;
  description: string;
  inputParameters: unknown[];
  createdAt: string;
  updatedAt: string;
  serviceIcons: string[];
}

interface IntegrationFlow {
  id: string;
  title: string;
  description: string;
  status: string;
  mcpToolJson?: { inputSchema?: { properties?: Record<string, unknown> } };
  serviceIcons?: string[];
}

interface ToolsState {
  byMcpServerId: Record<string, Tool[]>;
  loadingFor: Record<string, boolean>;
}

const initialState: ToolsState = {
  byMcpServerId: {},
  loadingFor: {},
};

export const fetchTools = createAsyncThunk(
  "tools/fetchTools",
  async ({ mcpServerId }: { mcpServerId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { clusters: { embedTokenByClusterId: Record<string, string> } };
      const embedToken = state.clusters.embedTokenByClusterId[mcpServerId] ?? "";

      const [toolsRes, integrationsRes] = await Promise.all([
        toolApi.getTools(mcpServerId),
        integrationsApi.getIntegrations(embedToken),
      ]);

      const flows: IntegrationFlow[] = integrationsRes.data?.data?.flows ?? [];
      const iconsByFlowId: Record<string, string[]> = {};
      flows.forEach((f) => { iconsByFlowId[f.id] = f.serviceIcons ?? []; });

      const tools: Tool[] = (toolsRes.data?.data ?? [])
        .map((t) => ({
          name: t.name,
          mcpServerId,
          flowId: t.flowId,
          description: t.description ?? "",
          inputParameters: t.inputParameters ?? [],
          createdAt: t.createdAt ?? "",
          updatedAt: t.updatedAt ?? "",
          serviceIcons: iconsByFlowId[t.flowId] ?? t.serviceIcons ?? [],
        }));

      return { mcpServerId, tools };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    upsertTool(state, action: PayloadAction<Tool>) {
      const tool = action.payload;
      const list = state.byMcpServerId[tool.mcpServerId] ?? [];
      const idx = list.findIndex((t) => t.flowId === tool.flowId);
      if (idx !== -1) {
        list[idx] = tool;
      } else {
        list.push(tool);
      }
      state.byMcpServerId[tool.mcpServerId] = list;
    },
    removeTool(state, action: PayloadAction<{ mcpServerId: string; toolId: string }>) {
      const { mcpServerId, toolId } = action.payload;
      const list = state.byMcpServerId[mcpServerId];
      if (list) {
        state.byMcpServerId[mcpServerId] = list.filter((t) => t.flowId !== toolId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTools.pending, (state, action) => {
        state.loadingFor[action.meta.arg.mcpServerId] = true;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        const { mcpServerId, tools } = action.payload;
        state.byMcpServerId[mcpServerId] = tools;
        state.loadingFor[mcpServerId] = false;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loadingFor[action.meta.arg.mcpServerId] = false;
      });
  },
});

export const { upsertTool, removeTool } = toolsSlice.actions;
export default toolsSlice.reducer;
