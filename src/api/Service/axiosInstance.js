import axios from "axios";
import { getEncryptedItem } from "../../lib/encryption";

// Determine API base URL: prefer env, fallback by hostname
const envBaseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || null;
const hostname = typeof window !== "undefined" ? window.location.hostname : "";

let apiUrl = envBaseUrl;
if (!apiUrl) {
  if (hostname === "localhost") {
    apiUrl = "http://localhost:3000/api/v1/";
  } else if (hostname === "staging.startzyai.com") {
    apiUrl = "https://apistage.startzyai.com/api/routes";
  } else {
    apiUrl = "https://api.startzyai.com/api/routes";
  }
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? getEncryptedItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;