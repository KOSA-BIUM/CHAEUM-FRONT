import axios from "axios";
// ★ 토큰 저장은 http.js에 위임
import { getAccessToken } from "@/lib/http";

// Base URL from Vite env (e.g., http://localhost:3000)
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  withCredentials: true, // if you use cookies/sessions, keep true; else set false
  timeout: 15000,
});

// Request interceptor: attach Authorization header when token exists
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: basic error normalization and 401 handling
api.interceptors.response.use(
  res => res,
  error => {
    const status = error?.response?.status;
    if (status === 401) {
      // Unauthorized: optionally clear token and redirect to /signin
      // clearToken()
      // location.href = '/signin'
    }
    // Normalize error shape
    return Promise.reject({
      message: error?.response?.data?.message || error.message || "Request failed",
      status,
      data: error?.response?.data,
    });
  },
);

export default api;
