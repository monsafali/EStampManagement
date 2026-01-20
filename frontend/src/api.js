import axios from "axios";

export const API_BASE_URL = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const googleAuth = (code) => API_BASE_URL.get(`/api/auth/google?code=${code}`);
