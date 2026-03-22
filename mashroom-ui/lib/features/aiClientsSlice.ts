import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

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
      const res = await axiosInstance.get("/ai-clients");
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
        state.clients = action.payload;
      })
      .addCase(fetchAiClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default aiClientsSlice.reducer;
