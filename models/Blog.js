import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tag: { type: [String], default: [] }, 
  reviewedBy: {type: String, required: true},
  authorName: { type: String, required: true },
  authorDesignation: { type: String },
  authorDescription : {type: String },
  authorProfile: {type: String}, 
  metaTitle: {type: String, required: true}, 
  metaDescription: {type: String, required: true},
  metaTag: { type: [String], default: [] }, 
  focusKeyword: { type: [String], default: [] }, 
  ogTitle: {type: String },
  ogDescription: { type: String },
  ogImage: { type: String , default: null},
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