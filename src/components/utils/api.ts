import axios from "axios";

// Remove local interface declarations; use global augmentation in a .d.ts file

// ✅ Use import.meta.env for Vite
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: BASE_URL, // ✅ Fixed environment variable usage
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Fix: Do not use useAuthStore() inside a non-component file
const getToken = () => localStorage.getItem("token");

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["x-auth-token"] = token; // ✅ Use x-auth-token instead
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
