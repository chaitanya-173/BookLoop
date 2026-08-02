import bcrypt from "bcrypt";
import FeedbackModel from "../models/FeedbackModel.js";
import UserModel from "../models/UserModel.js";
import { generateToken } from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check username
    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists)
      return errorResponse(res, "Username already taken", 400);

    // Check email
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) return errorResponse(res, "Email already registered", 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Signup successful", {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email OR username

    // Find user by email or username
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+password")
      .populate("wishlist");

    if (!user) return errorResponse(res, "Invalid credentials", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid credentials", 400);

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Login successful", {
      token,
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      wishlist: user.wishlist, 
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return successResponse(res, "Logged out");
};

export const getCurrentUser = async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate("wishlist");
  return successResponse(res, "User fetched", user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, username, phone, address, latitude, longitude } = req.body;

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const normalizedUsername = username?.trim().toLowerCase();

    if (normalizedUsername && normalizedUsername !== user.username) {
      const usernameExists = await UserModel.findOne({
        username: normalizedUsername,
        _id: { $ne: user._id },
      });

      if (usernameExists) {
        return errorResponse(res, "Username already taken", 400);
      }
    }

    user.name = name?.trim() || user.name;
    user.username = normalizedUsername || user.username;
    user.phone = phone?.trim() || "";

    user.location = {
      address: address?.trim() || user.location.address,
      latitude: latitude !== undefined ? Number(latitude) : user.location.latitude,
      longitude:
        longitude !== undefined ? Number(longitude) : user.location.longitude,
    };

    if (req.file) {
      user.profileImage = req.file.buffer.toString("base64");
    }

    await user.save();

    const updatedUser = await UserModel.findById(user._id).populate("wishlist");

    return successResponse(res, "Profile updated successfully", updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { address, latitude, longitude } = req.body;

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.location = {
      address: address || user.location.address,
      latitude: latitude !== undefined ? latitude : user.location.latitude,
      longitude: longitude !== undefined ? longitude : user.location.longitude,
    };

    await user.save();

    return successResponse(res, "Location updated successfully", user.location);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { category = "experience", message } = req.body;

    const feedback = await FeedbackModel.create({
      user: req.user._id,
      category,
      message,
    });

    return successResponse(res, "Feedback submitted successfully", feedback);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
