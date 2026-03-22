import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { mcpApi } from "../api/mcpApi";
import type { ApiCluster } from "../api/mcpApi";
import type { AiClient } from "./aiClientsSlice";

const USER_ID = "15295";

export interface PowerUp {
  id: string;
  name: string;
  description: string;
}

export interface Cluster extends ApiCluster {
  client: string;
  clientColor: string;
  powerUps: PowerUp[];
}

interface ClustersState {
  clusters: Cluster[];
  activeClusterId: string | null;
  loading: boolean;
  error: string | null;
  selectedClientByClusterId: Record<string, AiClient>;
}

let clusterCounter = 1;

const initialState: ClustersState = {
  clusters: [],
  activeClusterId: null,
  loading: false,
  error: null,
  selectedClientByClusterId: {},
};

export const fetchClusters = createAsyncThunk(
  "clusters/fetchClusters",
  async (_, { rejectWithValue }) => {
    try {
      const res = await mcpApi.getClusters(USER_ID);
      console.log(res.data.data, "res.data.data");
      return res.data.data as ApiCluster[];
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const createCluster = createAsyncThunk(
  "clusters/createCluster",
  async (payload: { client: string; clientColor: string }, { rejectWithValue }) => {
    try {
      const res = await mcpApi.createCluster(USER_ID, "");
      return { ...payload, apiCluster: res.data.data as ApiCluster };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const clustersSlice = createSlice({
  name: "clusters",
  initialState,
  reducers: {
    setActiveCluster(state, action: PayloadAction<string>) {
      state.activeClusterId = action.payload;
    },
    updateClusterClient(
      state,
      action: PayloadAction<{ clusterId: string; client: string; clientColor: string }>
    ) {
      const cluster = state.clusters.find((c) => c._id === action.payload.clusterId);
      if (cluster) {
        cluster.client = action.payload.client;
        cluster.clientColor = action.payload.clientColor;
      }
    },
    addPowerUp(
      state,
      action: PayloadAction<{ clusterId: string; powerUp: PowerUp }>
    ) {
      const cluster = state.clusters.find((c) => c._id === action.payload.clusterId);
      if (cluster) {
        cluster.powerUps.push(action.payload.powerUp);
      }
    },
    setClusterSelectedClient(
      state,
      action: PayloadAction<{ clusterId: string; client: AiClient }>
    ) {
      state.selectedClientByClusterId[action.payload.clusterId] = action.payload.client;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClusters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClusters.fulfilled, (state, action) => {
        state.loading = false;
        state.clusters = action.payload.map((c, i) => ({
          ...c,
          name: c.name || `Cluster ${i + 1}`,
          client: "Claude",
          clientColor: "#D97757",
          powerUps: [],
        }));
        clusterCounter = action.payload.length + 1;
        if (state.clusters.length > 0 && !state.activeClusterId) {
          state.activeClusterId = state.clusters[0]._id;
        }
      })
      .addCase(fetchClusters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCluster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCluster.fulfilled, (state, action) => {
        state.loading = false;
        const apiCluster = action.payload.apiCluster;
        const newCluster: Cluster = {
          ...apiCluster,
          client: action.payload.client,
          clientColor: action.payload.clientColor,
          powerUps: [],
        };
        state.clusters.push(newCluster);
        state.activeClusterId = apiCluster._id;
      })
      .addCase(createCluster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const newId = `cluster-${clusterCounter++}`;
        const newCluster: Cluster = {
          _id: newId,
          userId: "",
          orgId: "",
          name: `Cluster ${state.clusters.length + 1}`,
          url: "",
          isAuthenticationEnabled: false,
          createdAt: new Date().toISOString(),
          __v: 0,
          client: action.meta.arg.client,
          clientColor: action.meta.arg.clientColor,
          powerUps: [],
        };
        state.clusters.push(newCluster);
        state.activeClusterId = newId;
      });
  },
});

export const { setActiveCluster, updateClusterClient, addPowerUp, setClusterSelectedClient, clearError } =
  clustersSlice.actions;

export default clustersSlice.reducer;
