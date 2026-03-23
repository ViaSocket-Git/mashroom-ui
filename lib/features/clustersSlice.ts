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

export interface Cluster {
  id: string;
  name: string;
  userId: string;
  orgId: string;
  url: string;
  isAuthenticationEnabled: boolean;
  createdAt: string;
  client: string;
  clientColor: string;
  projectId: string;
  powerUps: PowerUp[];
  selectedClient: AiClient | null;
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
      return res.data.data as ApiCluster[];
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const createCluster = createAsyncThunk(
  "clusters/createCluster",
  async (payload: { client: string; clientColor: string; selectedClient: AiClient }, { rejectWithValue }) => {
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
      const cluster = state.clusters.find((c) => c.id === action.payload.clusterId);
      if (cluster) {
        cluster.client = action.payload.client;
        cluster.clientColor = action.payload.clientColor;
      }
    },
    addPowerUp(
      state,
      action: PayloadAction<{ clusterId: string; powerUp: PowerUp }>
    ) {
      const cluster = state.clusters.find((c) => c.id === action.payload.clusterId);
      if (cluster) {
        cluster.powerUps.push(action.payload.powerUp);
      }
    },
    setClusterSelectedClient(
      state,
      action: PayloadAction<{ clusterId: string; client: AiClient }>
    ) {
      state.selectedClientByClusterId[action.payload.clusterId] = action.payload.client;
      const cluster = state.clusters.find((c) => c.id === action.payload.clusterId);
      if (cluster) {
        cluster.selectedClient = action.payload.client;
        cluster.client = action.payload.client.title;
      }
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
          id: c._id,
          name: c.name || `Cluster ${i + 1}`,
          userId: c.userId,
          orgId: c.orgId,
          url: c.url,
          isAuthenticationEnabled: c.isAuthenticationEnabled,
          createdAt: c.createdAt,
          client: "Claude",
          clientColor: "#D97757",
          projectId: c.projectId ?? "",
          powerUps: [],
          selectedClient: null,
        }));
        clusterCounter = action.payload.length + 1;
        if (state.clusters.length > 0 && !state.activeClusterId) {
          state.activeClusterId = state.clusters[0].id;
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
        const apiId = action.payload.apiCluster?._id ?? `cluster-${clusterCounter++}`;
        const newCluster: Cluster = {
          id: apiId,
          name: action.payload.apiCluster?.name || `Cluster ${state.clusters.length + 1}`,
          userId: action.payload.apiCluster?.userId ?? "",
          orgId: action.payload.apiCluster?.orgId ?? "",
          url: action.payload.apiCluster?.url ?? "",
          isAuthenticationEnabled: action.payload.apiCluster?.isAuthenticationEnabled ?? false,
          createdAt: action.payload.apiCluster?.createdAt ?? "",
          client: action.payload.client,
          clientColor: action.payload.clientColor,
          projectId: action.payload.apiCluster?.projectId ?? "",
          powerUps: [],
          selectedClient: action.payload.selectedClient,
        };
        state.clusters.push(newCluster);
        state.activeClusterId = apiId;
        state.selectedClientByClusterId[apiId] = action.payload.selectedClient;
      })
      .addCase(createCluster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const newId = `cluster-${clusterCounter++}`;
        const newCluster: Cluster = {
          id: newId,
          name: `Cluster ${state.clusters.length + 1}`,
          userId: "",
          orgId: "",
          url: "",
          isAuthenticationEnabled: false,
          createdAt: "",
          client: action.meta.arg.client,
          clientColor: action.meta.arg.clientColor,
          projectId: "",
          powerUps: [],
          selectedClient: action.meta.arg.selectedClient,
        };
        state.clusters.push(newCluster);
        state.activeClusterId = newId;
      });
  },
});

export const { setActiveCluster, updateClusterClient, addPowerUp, setClusterSelectedClient, clearError } =
  clustersSlice.actions;

export default clustersSlice.reducer;
