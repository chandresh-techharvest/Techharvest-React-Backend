import mongoose from "mongoose";

const newsLetterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    interest: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.model("NewsLetter", newsLetterSchema);
