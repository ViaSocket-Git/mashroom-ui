import axiosInstance from "./axiosInstance";

export interface ApiCluster {
  _id: string;
  userId: string;
  orgId: string;
  name: string;
  url: string;
  isAuthenticationEnabled: boolean;
  createdAt: string;
  __v: number;
}

export interface ApiClusterListResponse {
  data: ApiCluster[];
}

export interface ApiClusterResponse {
  data: ApiCluster;
}

export const mcpApi = {
  getClusters: (userId: string) =>
    axiosInstance.get<ApiClusterListResponse>(`/mcp?userId=${userId}`),

  createCluster: (userId: string, name: string) =>
    axiosInstance.post<ApiClusterResponse>("/mcp", { userId, name }),
};
