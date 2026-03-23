import axiosInstance from "./axiosInstance";

const INTEGRATIONS_BASE = "https://flow-api.viasocket.com/projects";

export const integrationsApi = {
  getIntegrations: (projectId: string) =>
    axiosInstance.get(`${INTEGRATIONS_BASE}/${projectId}/integrations`),
};
