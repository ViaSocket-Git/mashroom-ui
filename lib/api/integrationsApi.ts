import axiosInstance from "./axiosInstance";

const INTEGRATIONS_BASE = "https://flow-api.viasocket.com/projects";

export const integrationsApi = {
  getIntegrations: (projectId: string, embedToken: string) =>
    axiosInstance.get(`${INTEGRATIONS_BASE}/${projectId}/integrations`, {
      headers: { authorization: embedToken },
    }),
};
