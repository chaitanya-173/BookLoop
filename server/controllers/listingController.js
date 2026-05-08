import ListingModel from "../models/ListingModel.js";
import UserModel from "../models/UserModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// CREATE LISTING
export const createListing = async (req, res) => {
  try {
    const { title, category, type, price, condition, author, description } =
      req.body;

    const images =
      req.files?.map((file) => file.buffer.toString("base64")) || [];

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
// export const getListings = async (req, res) => {
//   try {
//     const listings = await ListingModel.find()
//       .sort({ createdAt: -1 })
//       .populate("user", "name");

//     return successResponse(res, "Listings fetched", listings);
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

export const getListings = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const listings = await ListingModel.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name phone location");

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
      "name email phone location profileImage",
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

    if (listing.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Unauthorized", 403);
    }

    await listing.deleteOne();

    // Remove from all wishlists
    await UserModel.updateMany({}, { $pull: { wishlist: listing._id } });

    return successResponse(res, "Listing deleted");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// UPDATE LISTING
export const updateListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);

    if (!listing) {
      return errorResponse(res, "Listing not found", 404);
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Unauthorized", 403);
    }

    const { title, category, type, price, condition, author, description } =
      req.body;

    listing.title = title || listing.title;
    listing.category = category || listing.category;
    listing.type = type || listing.type;
    listing.price = price ?? listing.price;
    listing.condition = condition || listing.condition;
    listing.author = author || listing.author;
    listing.description = description || listing.description;

    // Replace images only if new uploaded
    if (req.files?.length > 0) {
      const newImages = req.files.map((file) => file.buffer.toString("base64"));

      listing.images = [...listing.images, ...newImages].slice(0, 5);
    }

    await listing.save();

    return successResponse(res, "Listing updated successfully", listing);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// TOGGLE WISHLIST
export const toggleWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    const listingId = req.params.id;

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const exists = user.wishlist.includes(listingId);

    if (exists) {
      user.wishlist.pull(listingId);

      await user.save();

      return successResponse(res, "Removed from wishlist");
    } else {
      user.wishlist.push(listingId);

      await user.save();

      return successResponse(res, "Added to wishlist");
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "wishlist",
      populate: {
        path: "user",
        select: "name phone location",
      },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "Wishlist fetched successfully", user.wishlist);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// TOGGLE SOLD / AVAILABLE
export const toggleListingStatus = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);

    if (!listing) {
      return errorResponse(res, "Listing not found", 404);
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Unauthorized", 403);
    }

    listing.status = listing.status === "available" ? "sold" : "available";

    await listing.save();

    return successResponse(res, `Listing marked as ${listing.status}`, listing);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
