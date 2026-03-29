import api from "../api/axios";

/**
 * Fetch current user
 */
export const fetchMe = async () => {
  return await api.get("/api/auth/me");
};

/**
 * Signup
 */
export const signup = async (payload) => {
  return await api.post("/api/auth/signup", payload);
};

/**
 * Login
 */
export const login = async (payload) => {
  return await api.post("/api/auth/login", payload);
};

/**
 * Logout
 */
export const logout = async () => {
  return await api.post("/api/auth/logout");
};