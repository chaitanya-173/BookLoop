import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const token = bearerToken || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    return res.status(401).json({
      message: error.message,
    });
  }
};
