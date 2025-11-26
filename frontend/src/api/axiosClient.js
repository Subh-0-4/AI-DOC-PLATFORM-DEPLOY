// axiosClient.js — version that defaults to LOCALHOST
import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-doc-platform-backend-deploy.onrender.com",
  // If REACT_APP_API_URL is missing → use local backend
  // This is why Vercel kept calling http://127.0.0.1:8000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
