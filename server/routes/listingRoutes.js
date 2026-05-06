import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  deleteListing,
  updateListing,
  toggleWishlist,
  getWishlist,
  toggleListingStatus,
} from "../controllers/listingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// router.post("/", protect, createListing); // TEMP
router.post("/", protect, upload.array("images", 5), createListing); // Create listing
router.get("/", getListings); // Get all listings
router.get("/wishlist/all", protect, getWishlist); // Get wishlist
router.post("/wishlist/:id", protect, toggleWishlist); // Add/remove wishlist
router.get("/:id", getListingById); // Get single listing
router.delete("/:id", protect, deleteListing); // Delete listing
router.put("/:id", protect, upload.array("images", 5), updateListing); // Edit listing
router.patch("/:id/status", protect, toggleListingStatus); // Sold/available

export default router;
