import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { mcpApi } from "../api/mcpApi";
import type { ApiCluster } from "../api/mcpApi";
import type { AiClient } from "./aiClientsSlice";
import { getFromCookies } from "../utils/cookies"; 

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
  embedTokenByClusterId: Record<string, string>;
  userId: string | null;
  userName: string;
  userEmail: string;
}

let clusterCounter = 1;

const initialState: ClustersState = {
  clusters: [],
  activeClusterId: null,
  loading: false,
  error: null,
  selectedClientByClusterId: {},
  embedTokenByClusterId: {},
  userId: null,
  userName: "",
  userEmail: "",
};

export const fetchCurrentUser = createAsyncThunk(
  "clusters/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromCookies("proxy_token") ?? "dUd1V25UazNIWk5nRStLaFhVbnYrZnRMQng3SVZtcG52ajNKTlVDNkFLZXVTVEpwVDc0dm5YeVJXSXlaU3cxeFJveHRkTUtSWERoWWJJMWpRNi9oRzdLRzB4azlVWVY4TWlPWTZWUnVuQVVKOEtPWjVEcC82SE5SNkN6a2tLaTdjQnEvQndpOFJHOE5TZTJwdUdpNzlrTStqYU05b01BMkdRNEtjdndiUmJkWnhYZGM4VG9qdVZ1cU1CQ0dQdG1N";
      const res = await fetch("https://routes.msg91.com/api/c/getDetails?exclude_role_ids=20", {
        headers: { "accept": "application/json, text/plain, */*", "proxy_auth_token": token },
      });
      const data = await res.json();
      const user = data?.data?.[0];
      if (!user?.id) return rejectWithValue("User not found");
      return { userId: String(user.id), userName: user.name ?? "", userEmail: user.email ?? "" };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const fetchClusters = createAsyncThunk(
  "clusters/fetchClusters",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { clusters: ClustersState; aiClients: { clients: AiClient[] } };
      const userId = state.clusters.userId ?? "";
      const res = await mcpApi.getClusters(userId);
      return { clusters: res.data.data as ApiCluster[], aiClients: state.aiClients.clients };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const fetchEmbedToken = createAsyncThunk(
  "clusters/fetchEmbedToken",
  async (clusterId: string, { rejectWithValue }) => {
    try {
      const res = await mcpApi.generateToken(clusterId);
      return { clusterId, token: res.data.token };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const createCluster = createAsyncThunk(
  "clusters/createCluster",
  async (payload: { client: string; clientColor: string; selectedClient: AiClient }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { clusters: ClustersState };
      const userId = state.clusters.userId ?? "";
      const res = await mcpApi.createCluster(userId, "", payload.client);
      return { ...payload, apiCluster: res.data.data as ApiCluster };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const updateClusterOnServer = createAsyncThunk(
  "clusters/updateClusterOnServer",
  async (payload: { mcpServerId: string; name: string; client: string }, { rejectWithValue }) => {
    try {
      const res = await mcpApi.updateCluster(payload.mcpServerId, payload.name, payload.client);
      return res.data.data as ApiCluster;
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
        const { clusters, aiClients } = action.payload;
        state.clusters = clusters.map((c, i) => {
          const clientTitle = c.client ?? "";
          const selectedClient = aiClients.find(
            (a) => a.title.toLowerCase() === clientTitle.toLowerCase()
          ) ?? null;
          return {
            id: c._id,
            name: c.name || `Cluster ${i + 1}`,
            userId: c.userId,
            orgId: c.orgId,
            url: c.url,
            isAuthenticationEnabled: c.isAuthenticationEnabled,
            createdAt: c.createdAt,
            client: clientTitle || "Claude",
            clientColor: "#D97757",
            projectId: c.projectId ?? "",
            powerUps: [],
            selectedClient,
          };
        });
        clusterCounter = clusters.length + 1;
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
      .addCase(fetchEmbedToken.fulfilled, (state, action) => {
        state.embedTokenByClusterId[action.payload.clusterId] = action.payload.token;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.userEmail = action.payload.userEmail;
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
