import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  designation: { type: String },
  category: { type: String, required: true },
  tag: { type: [String], default: [] }, 
  image: { type: String , default: null},
  url: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
    featured: {
      type: Boolean,
      default: false,
    },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blog", blogSchema);
