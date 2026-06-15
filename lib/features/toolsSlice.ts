import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toolApi } from "../api/toolApi";

interface ToolsState {
  countByMcpServerId: Record<string, number>;
  publishedCountByMcpServerId: Record<string, number>;
  loadingFor: Record<string, boolean>;
}

const initialState: ToolsState = {
  countByMcpServerId: {},
  publishedCountByMcpServerId: {},
  loadingFor: {},
};

export const fetchTools = createAsyncThunk(
  "tools/fetchTools",
  async ({ mcpServerId }: { mcpServerId: string }, { rejectWithValue }) => {
    try {
      const toolsRes = await toolApi.getTools(mcpServerId);
      const list = toolsRes.data?.data ?? [];
      const count = list.length;
      const publishedCount = list.filter((t) => (t.status ?? "").toLowerCase() !== "draft").length;
      return { mcpServerId, count, publishedCount };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTools.pending, (state, action) => {
        state.loadingFor[action.meta.arg.mcpServerId] = true;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        const { mcpServerId, count, publishedCount } = action.payload;
        state.countByMcpServerId[mcpServerId] = count;
        state.publishedCountByMcpServerId[mcpServerId] = publishedCount;
        state.loadingFor[mcpServerId] = false;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loadingFor[action.meta.arg.mcpServerId] = false;
      });
  },
});

export default toolsSlice.reducer;
