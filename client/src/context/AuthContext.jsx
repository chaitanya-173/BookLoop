import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  fetchMe as fetchMeService,
  signup as signupService,
  login as loginService,
  logout as logoutService,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchMe = async () => {
    try {
      setLoadingUser(true);
      const res = await fetchMeService();
      if (res.data?.success) setUser(res.data.data || res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const signup = async (payload) => {
    try {
      const res = await signupService(payload);
      if (res.data?.success) {
        setUser(res.data.data);
        toast.success(res.data.message || "Signup successful");
        return { ok: true };
      }
      toast.error(res.data?.message || "Signup failed");
      return { ok: false };
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Signup error"
      );
      return { ok: false };
    }
  };

  const login = async (payload) => {
    try {
      const res = await loginService(payload);
      if (res.data?.success) {
        setUser(res.data.data);
        toast.success(res.data.message || "Login successful");
        return { ok: true };
      }
      toast.error(res.data?.message || "Login failed");
      return { ok: false };
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Login error");
      return { ok: false };
    }
  };

  const logout = async () => {
    try {
      const res = await logoutService();
      setUser(null);
      toast.success(res.data?.message || "Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loadingUser, signup, login, logout, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);