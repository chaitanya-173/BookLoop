import { Router } from "express";
import { signup, login, logout, getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = Router();

// ---------------- SIGNUP VALIDATION ----------------
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

// ---------------- LOGIN VALIDATION ----------------
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

export default router;
