import axios from "axios";
import config from "../config/config.js";

const API = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Request Interceptor
// ==============================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor
// ==============================

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizer");
      localStorage.removeItem("admin");
      localStorage.removeItem("username");
      localStorage.removeItem("accountType");
      localStorage.removeItem("isLoggedIn");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;