import axiosInstance from "./axiosInstance";

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;

export interface ApiSkill {
  _id: string;
  orgId: string;
  createdBy?: string;
  name: string;
  description: string;
  /** Only present on single-skill fetches — the list endpoint omits it. */
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillPayload {
  name: string;
  description: string;
  content: string;
}

interface ApiSkillListResponse {
  data: ApiSkill[];
}

interface ApiSkillResponse {
  data: ApiSkill;
}

export const skillApi = {
  getSkills: () => axiosInstance.get<ApiSkillListResponse>(`${API_URL}/skill`),

  getSkill: (skillId: string) =>
    axiosInstance.get<ApiSkillResponse>(`${API_URL}/skill/${skillId}`),

  createSkill: (data: SkillPayload) =>
    axiosInstance.post<ApiSkillResponse>(`${API_URL}/skill`, data),

  updateSkill: (skillId: string, data: Partial<SkillPayload>) =>
    axiosInstance.put<ApiSkillResponse>(`${API_URL}/skill/${skillId}`, data),

  deleteSkill: (skillId: string) =>
    axiosInstance.delete(`${API_URL}/skill/${skillId}`),

  // Returns the instructions an MCP client receives when it calls this skill.
  runSkill: (skillId: string) =>
    axiosInstance.post<{ data: SkillPayload }>(`${API_URL}/skill/${skillId}/run`),

  getSkillsByMcpId: (mcpServerId: string) =>
    axiosInstance.get<ApiSkillListResponse>(`${API_URL}/skills/${mcpServerId}`),

  connectSkill: (mcpServerId: string, skillId: string) =>
    axiosInstance.post(`${API_URL}/mcp/${mcpServerId}/skill/${skillId}`),

  disconnectSkill: (mcpServerId: string, skillId: string) =>
    axiosInstance.delete(`${API_URL}/mcp/${mcpServerId}/skill/${skillId}`),
};
