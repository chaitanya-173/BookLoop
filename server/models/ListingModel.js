import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["sell", "donate"],
    },

    price: {
      type: Number,
      default: 0,
    },

    condition: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String, // base64 string
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ListingModel = mongoose.model("Listing", listingSchema);

export default ListingModel;