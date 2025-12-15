import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  designation: { type: String },
  category: { type: String, required: true },
  features: { type: String },
  publishedDate: { type: Date, default: Date.now },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blog", blogSchema);
