import api from "../api/axios";

export const fetchMe = async () => {
  return await api.get("/api/auth/me");
};

export const signup = async (payload) => {
  return await api.post("/api/auth/signup", payload);
};

export const login = async (payload) => {
  return await api.post("/api/auth/login", payload);
};

export const logout = async () => {
  return await api.post("/api/auth/logout");
};

export const updateProfile = async (formData) => {
  return await api.put("/api/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserLocation = async (payload) => {
  return await api.put("/api/auth/update-location", payload);
};

export const submitFeedback = async (payload) => {
  return await api.post("/api/auth/feedback", payload);
};
