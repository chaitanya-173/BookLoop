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
    } catch {
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
        err?.response?.data?.message || err.message || "Signup error",
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

  const toggleWishlistItem = (listingId) => {
    if (!user) return;

    const exists = user.wishlist?.some(
      (item) => (item._id || item).toString() === listingId,
    );

    let updatedWishlist;

    if (exists) {
      updatedWishlist = user.wishlist.filter(
        (item) => (item._id || item).toString() !== listingId,
      );
    } else {
      updatedWishlist = [...(user.wishlist || []), listingId];
    }

    setUser({
      ...user,
      wishlist: updatedWishlist,
    });
  };

  const isInWishlist = (listingId) => {
    return user?.wishlist?.some(
      (item) => (item._id || item).toString() === listingId,
    );
  };

  const logout = async () => {
    try {
      const res = await logoutService();
      setUser(null);
      toast.success(res.data?.message || "Logged out");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
  user,
  loadingUser,
  signup,
  login,
  logout,
  fetchMe,
  toggleWishlistItem,
  isInWishlist,
}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
