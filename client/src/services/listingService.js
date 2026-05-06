import api from "../api/axios";

// Create listing (with images)
export const createListing = async (formData) => {
  return await api.post("/api/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all listings
export const getListings = async () => {
  return await api.get("/api/listings");
};

// Get single listing
export const getListingById = async (id) => {
  return await api.get(`/api/listings/${id}`);
};

// Delete listing
export const deleteListing = async (id) => {
  return await api.delete(`/api/listings/${id}`);
};

// Toggle wishlist
export const toggleWishlist = async (id) => {
  return await api.post(`/api/listings/wishlist/${id}`);
};

// Get wishlist
export const getWishlist = async () => {
  return await api.get("/api/listings/wishlist/all");
};

// Update listing
export const updateListing = async (id, formData) => {
  return await api.put(`/api/listings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Toggle sold / available
export const toggleListingStatus = async (id) => {
  return await api.patch(`/api/listings/${id}/status`);
};