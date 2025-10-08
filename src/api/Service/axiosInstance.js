import axios from "axios";
import { getEncryptedItem } from "../../lib/encryption";
import { useAuthStore } from "../../store/store";

// Determine API base URL: prefer env, fallback by hostname
const envBaseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || null;
const hostname = typeof window !== "undefined" ? window.location.hostname : "";

let apiUrl = envBaseUrl;
if (!apiUrl) {
    // apiUrl = "https://sns-square-landing-backend.onrender.com/api/v1/"; // default
    apiUrl = "http://localhost:3000/api/v1/"; // default
    if (hostname === "snssquare.com" || hostname === "www.snssquare.com") {
        apiUrl = "https://api.snssquare.com/api/v1/";
    } else if (hostname === "staging.snssquare.com") {
        apiUrl = "https://staging-api.snssquare.com/api/v1/";
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
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Use the store's forceLogout method
      const { forceLogout } = useAuthStore.getState();
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;