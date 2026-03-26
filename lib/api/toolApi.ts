import axiosInstance from "./axiosInstance";
import type { Tool } from "../features/toolsSlice";

const TOOL_API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tool`;
const MCP_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;

export interface ApiTool {
  _id: string;
  name: string;
  flowId: string;
  description: string;
  mcpServerId: string;
  status?: string;
  serviceIcons?: string[];
  inputParameters?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface ApiToolsResponse {
  data: ApiTool[];
}

export interface McpToolPayload {
  flowId: string;
  payload: Record<string, unknown>;
  desc: string;
  status: string;
  title: string;
  mcpServerId: string;
  serviceIcons?: string[];
}

interface ToolApiResponse {
  data: Tool;
}

export const toolApi = {
  getTools: (mcpServerId: string) =>
    axiosInstance.get<ApiToolsResponse>(`${MCP_URL}/tools/${mcpServerId}`),

  callTool: (data: McpToolPayload) =>
    axiosInstance.post<ToolApiResponse>(TOOL_API_URL, data),

  deleteTool: (flowId: string) =>
    axiosInstance.delete(`${TOOL_API_URL}/${flowId}`),
};
