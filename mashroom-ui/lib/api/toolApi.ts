import axiosInstance from "./axiosInstance";

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
    axiosInstance.post("/mcp/tool", data),
};
