import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["bug", "idea", "experience", "other"],
      default: "experience",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

export default FeedbackModel;
