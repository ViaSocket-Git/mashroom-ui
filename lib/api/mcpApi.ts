import axiosInstance from "./axiosInstance";

const MCP_URL = "https://flow-api.viasocket.com/mcp/mcp";

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
}

export interface ApiClusterListResponse {
  data: ApiCluster[];
}

export interface ApiClusterResponse {
  data: ApiCluster;
}

export const mcpApi = {
  getClusters: (userId: string) =>
    axiosInstance.get<ApiClusterListResponse>(`${MCP_URL}?userId=${userId}`),

  createCluster: (userId: string, name: string) =>
    axiosInstance.post<ApiClusterResponse>(MCP_URL, { userId, name }),
};
