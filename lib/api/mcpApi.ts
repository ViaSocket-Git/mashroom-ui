import axiosInstance from "./axiosInstance";

const MCP_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/mcp`;

export interface ApiCluster {
  _id: string;
  userId: string;
  orgId: string;
  name: string;
  url: string;
  projectId: string;
  isAuthenticationEnabled: boolean;
  createdAt: string;
  __v: number;
  client?: string;
}

export interface ApiClusterListResponse {
  data: ApiCluster[];
}

export interface ApiClusterResponse {
  data: ApiCluster;
}

export const mcpApi = {
  getClusters: (userId: string) =>
    axiosInstance.get<ApiClusterListResponse>(`${MCP_URL}`),

  createCluster: (userId: string, name: string, client: string) =>
    axiosInstance.post<ApiClusterResponse>(MCP_URL, { userId, name, client }),

  updateCluster: (mcpServerId: string, name: string, client: string) =>
    axiosInstance.put<ApiClusterResponse>(`${MCP_URL}/${mcpServerId}`, { name, client }),

  deleteCluster: (mcpServerId: string, name: string, client: string) =>
    axiosInstance.delete(`${MCP_URL}/${mcpServerId}`, { data: { name, client } }),

  generateToken: (clusterId: string) =>
    axiosInstance.post<{ token: string }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/generate-token`,
      { cluster_id: clusterId }
    ),
};
