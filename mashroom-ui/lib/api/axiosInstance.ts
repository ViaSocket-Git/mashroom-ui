import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
  },
});

export default axiosInstance;
