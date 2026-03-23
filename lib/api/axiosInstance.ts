import axios from "axios";
import { getFromCookies } from "@/lib/utils/cookies";

const INTEGRATIONS_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1NTkzIiwicHJvamVjdF9pZCI6InByb2o5TGZRdjRUNyIsInVzZXJfaWQiOiI2MTg5MCIsImlhdCI6MTc3NDAxMDI3M30.rhl0-Hfq5k9SAH3Zali9qdNl7s-EWKvxkVsL3Xaq5Qs";

const axiosInstance = axios.create({
  headers: {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const url = config.url ?? "";
  if (url.includes("integrations")) {
    config.headers["authorization"] = INTEGRATIONS_AUTH_TOKEN;
  } else {
    const token = getFromCookies("proxy_token");
    if (token) config.headers["proxy_auth_token"] = token;
  }
  return config;
});

export default axiosInstance;
