import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      address: {
        type: String,
        trim: true,
        default: "",
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    profileImage: {
      type: String,
      default: "",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
