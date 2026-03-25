import axiosInstance from "./axiosInstance";

const TOOL_API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tool`;

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
  data: McpToolPayload;
}

export const toolApi = {
  callTool: (data: McpToolPayload) =>
    axiosInstance.post<ToolApiResponse>(TOOL_API_URL, data),
};
