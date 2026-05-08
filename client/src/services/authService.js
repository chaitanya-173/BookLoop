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

/**
 * Update current user's profile
 */
export const updateProfile = async (formData) => {
  return await api.put("/api/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Update current user's saved location
 */
export const updateUserLocation = async (payload) => {
  return await api.put("/api/auth/update-location", payload);
};

/**
 * Submit user feedback
 */
export const submitFeedback = async (payload) => {
  return await api.post("/api/auth/feedback", payload);
};
