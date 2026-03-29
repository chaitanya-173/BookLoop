import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // IMPORTANT for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
