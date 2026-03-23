import axiosInstance from "./axiosInstance";

const TOOL_API_URL = "https://flow-api.viasocket.com/mcp/tool";

export interface McpToolPayload {
  userId: string;
  flowId: string;
  payload: Record<string, unknown>;
  desc: string;
  status: string;
  title: string;
  mcpServerId: string;
}

export const toolApi = {
  callTool: (data: McpToolPayload) =>
    axiosInstance.post(TOOL_API_URL, data),
};
