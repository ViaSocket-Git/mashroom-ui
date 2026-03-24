import axios from "axios";
import { getFromCookies } from "@/lib/utils/cookies";

const axiosInstance = axios.create({
  headers: {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const url = config.url ?? "";
  if (!url.includes("integrations")) {
    const token = getFromCookies("proxy_token");
    if (token) config.headers["proxy_auth_token"] = token;
  }
  return config;
});

export default axiosInstance;
