import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ContactForm from "../models/ContactForm.js";
import Blog from "../models/Blog.js";
import path from "path";

dotenv.config();

// Predefined credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ---------------- LOGIN ADMIN -------------------

export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
};

// ----------- ADMIN LOGOUT ------------

export const adminLogout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

// ---------------- FETCH CONTACT ENTRIES -------------------

export const getContacts = async (req, res) => {
  try {
    const data = await ContactForm.find().sort();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE BLOG (Admin Only)
export const createBlog = async (req, res) => {
  try {
    const { title, description, author, designation, category, features, publishedDate } = new Blog(req.body);
    const image = req.file ? req.file.filename : null;
    
    const blog = await Blog.create({
      title,
      description,
      author,
      designation,
      category,
      features,
      publishedDate,
      image,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: err.message,
    });
  }
};

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

// GET BLOG BY ID (Public)
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
    });
  }
};

// UPDATE BLOG (Admin Only)
export const updateBlog = async (req, res) => {
  try {
    const { title, description, author, designation, category, features } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateData = { title, description, author, designation, category, features };
    if (image) updateData.image = image;
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: err.message,
    });
  }
};   

// DELETE BLOG (Admin Only)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: err.message,
    });
  }
};

