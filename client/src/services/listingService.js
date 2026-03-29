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