import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

// GET ALL BLOGS (Public)
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
    });
  }
};

// GET BLOG BY SLUG (Public)
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ url: slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      success: true,
      blog,
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
    });
  }
};

// GET FEATURED BLOG (Public)
export const getFeaturedBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ featured: true });

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

