import axios from "axios";
import { getFromCookies, removeCookie } from "@/lib/utils/cookies";

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      removeCookie("proxy_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
