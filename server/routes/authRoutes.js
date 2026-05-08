import { Router } from "express";
import {
  signup,
  login,
  logout,
  getCurrentUser,
  submitFeedback,
  updateProfile,
  updateUserLocation,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters long")
      .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores")
      .toLowerCase(),

    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Enter a valid email")
      .toLowerCase(),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
      .matches(/[A-Za-z]/).withMessage("Password must contain at least one letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
  ],
  validate,
  signup
);

router.post(
  "/login",
  [
    body("identifier")
      .trim()
      .notEmpty().withMessage("Email or username is required"),

    body("password")
      .notEmpty().withMessage("Password is required")
  ],
  validate,
  login
);

router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  [
    body("name")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters long")
      .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores")
      .toLowerCase(),

    body("phone")
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[0-9]{10}$/).withMessage("Enter a valid 10-digit phone number"),

    body("address")
      .trim()
      .notEmpty().withMessage("Location address is required"),

    body("latitude")
      .optional({ checkFalsy: true })
      .isFloat({ min: -90, max: 90 }).withMessage("Enter a valid latitude"),

    body("longitude")
      .optional({ checkFalsy: true })
      .isFloat({ min: -180, max: 180 }).withMessage("Enter a valid longitude"),
  ],
  validate,
  updateProfile,
);
router.post(
  "/feedback",
  protect,
  [
    body("category")
      .optional()
      .isIn(["bug", "idea", "experience", "other"]).withMessage("Invalid feedback category"),

    body("message")
      .trim()
      .notEmpty().withMessage("Feedback message is required")
      .isLength({ min: 5, max: 1000 }).withMessage("Feedback must be 5-1000 characters"),
  ],
  validate,
  submitFeedback,
);
router.put("/update-location", protect, updateUserLocation);

export default router;
