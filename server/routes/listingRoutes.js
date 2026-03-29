import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  deleteListing,
} from "../controllers/listingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Create listing
router.post("/", protect, upload.array("images", 5), createListing);
// router.post("/", protect, createListing); // TEMP

// Get all listings
router.get("/", getListings);

// Get single listing
router.get("/:id", getListingById);

// Delete listing
router.delete("/:id", protect, deleteListing);

export default router;
