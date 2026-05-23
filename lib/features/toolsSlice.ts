import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toolApi } from "../api/toolApi";

interface ToolsState {
  countByMcpServerId: Record<string, number>;
  loadingFor: Record<string, boolean>;
}

const initialState: ToolsState = {
  countByMcpServerId: {},
  loadingFor: {},
};

export const fetchTools = createAsyncThunk(
  "tools/fetchTools",
  async ({ mcpServerId }: { mcpServerId: string }, { rejectWithValue }) => {
    try {
      const toolsRes = await toolApi.getTools(mcpServerId);
      const count = (toolsRes.data?.data ?? []).length;
      return { mcpServerId, count };
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
        const { mcpServerId, count } = action.payload;
        state.countByMcpServerId[mcpServerId] = count;
        state.loadingFor[mcpServerId] = false;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loadingFor[action.meta.arg.mcpServerId] = false;
      });
  },
});

export default toolsSlice.reducer;
