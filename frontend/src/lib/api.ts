import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== "false";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("tt_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
