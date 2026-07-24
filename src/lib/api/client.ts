import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = window.localStorage.getItem("beacon_access_token");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (error.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
    if (!error.response) return "Cannot connect to the Beacon API. Make sure the backend is running.";
  }
  return fallback;
}
