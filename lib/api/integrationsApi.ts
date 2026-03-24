import axiosInstance from "./axiosInstance";

const INTEGRATIONS_BASE = "https://flow-api.viasocket.com/projects";

export const integrationsApi = {
  getIntegrations: (embedToken: string) =>
    axiosInstance.get(`${INTEGRATIONS_BASE}/projXzlaXL3n/integrations`, {
      headers: { authorization: embedToken },
    }),
};
