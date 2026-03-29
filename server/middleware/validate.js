import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];

    return errorResponse(res, {
      field: firstError.path,
      message: firstError.msg
    }, 422);
  }

  next();
};