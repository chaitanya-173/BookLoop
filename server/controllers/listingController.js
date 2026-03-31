import ListingModel from "../models/ListingModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// CREATE LISTING
export const createListing = async (req, res) => {
  try {
    const { title, category, type, price, condition, author, description } =
      req.body;

    // Convert images to base64
    const images = req.files?.map((file) => file.buffer.toString("base64")) || [];

    // AFTER (TEMP)
    // const images = ["test-image"];

    const listing = await ListingModel.create({
      title,
      category,
      type,
      price,
      condition,
      author,
      description,
      images,
      user: req.user?._id,
    });

    return successResponse(res, "Listing created successfully", listing);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET ALL LISTINGS
export const getListings = async (req, res) => {
  try {
    const listings = await ListingModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "name");

    return successResponse(res, "Listings fetched", listings);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET SINGLE LISTING
export const getListingById = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!listing) {
      return errorResponse(res, "Listing not found", 404);
    }

    return successResponse(res, "Listing fetched", listing);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// DELETE LISTING
export const deleteListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);

    if (!listing) {
      return errorResponse(res, "Listing not found", 404);
    }

    // Owner check
    if (listing.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Unauthorized", 403);
    }

    await listing.deleteOne();

    return successResponse(res, "Listing deleted");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
