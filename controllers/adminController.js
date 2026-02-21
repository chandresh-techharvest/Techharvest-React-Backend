import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ContactForm from "../models/ContactForm.js";
import Blog from "../models/Blog.js";
import slugify from "slugify";
import { put } from "@vercel/blob";
import NewsLetter from "../models/Newsletter.js";

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

  const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

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

// ----------------FETCH NEWSLETTERS ENTRIES ------------------

export const getNewsLetters = async (req, res) => {
  try {
    const newsletters = await NewsLetter.find().sort();
    return res.status(200).json({
      success: true,
      newsletters,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching newsletters",
    });
  }
};

// CREATE BLOG (Admin Only)
export const createBlog = async (req, res) => {
  try {
    const { title, description, category, tag, reviewedBy, authorName, authorDesignation, authorDescription, 
      authorProfile, metaTitle, metaDescription, metaTag, focusKeyword, ogTitle, ogDescription } = req.body;

    let imageUrl = null;
    let ogImageUrl = null;

if (req.files?.image?.[0]) {
  const file = req.files.image[0];

  const blob = await put(
    `blogs/${Date.now()}-${file.originalname}`,
    file.buffer,
    { access: "public" }
  );

  imageUrl = blob.url;
}

if (req.files?.ogImage?.[0]) {
  const file = req.files.ogImage[0];

  const blob = await put(
    `blogs/og/${Date.now()}-${file.originalname}`,
    file.buffer,
    { access: "public" }
  );

  ogImageUrl = blob.url;
}

    const tagsArray =
      typeof tag === "string" ? JSON.parse(tag || "[]") : tag || [];

    const metaTagArray =
      typeof metaTag === "string" ? JSON.parse(metaTag || "[]") : metaTag || [];
    
    const focusKeywordArray =
      typeof focusKeyword === "string" ? JSON.parse(focusKeyword || "[]") : focusKeyword || [];

    // ✅ Generate clean slug
    let baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    // ✅ Ensure unique slug
    while (await Blog.findOne({ url: slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const blog = await Blog.create({
      title,
      description,
      category,
      tag: tagsArray,
      reviewedBy,
      authorName, 
      authorDesignation, 
      authorDescription, 
      authorProfile, 
      metaTitle, 
      metaDescription,
      metaTag : metaTagArray, 
      focusKeyword: focusKeywordArray, 
      ogTitle, 
      ogDescription,
      ogImage: ogImageUrl,
      image: imageUrl,
      url: slug,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    console.error("create blog error:", err);
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
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

// UPDATE BLOG BY SLUG (Admin Only)
export const updateBlogBySlug = async (req, res) => {
  try {
    const { title, description, category, tag, reviewedBy, authorName, authorDesignation, authorDescription, 
      authorProfile, metaTitle, metaDescription, metaTag, focusKeyword, ogTitle, ogDescription } = req.body;
    const tagsArray =
      typeof tag === "string" ? JSON.parse(tag || "[]") : tag || [];

    const metaTagArray =
      typeof metaTag === "string" ? JSON.parse(metaTag || "[]") : metaTag || [];
      
    const focusKeywordArray =
      typeof focusKeyword === "string" ? JSON.parse(focusKeyword || "[]") : focusKeyword || [];

    // Find blog by slug
    const blog = await Blog.findOne({ url: req.params.slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Prepare update
    const oldTitle = blog.title;
    blog.title = title;
    blog.description = description;
    blog.category = category;
    blog.tag = tagsArray;
    blog.reviewedBy = reviewedBy;
    blog.authorName = authorName;
    blog.authorDesignation = authorDesignation;
    blog.authorDescription = authorDescription;
    blog.authorProfile = authorProfile;
    blog.metaTitle = metaTitle;
    blog.metaDescription = metaDescription;
    blog.metaTag = metaTagArray;
    blog.focusKeyword = focusKeywordArray;
    blog.ogTitle = ogTitle;
    blog.ogDescription = ogDescription;

    // handle blob image update
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];

      const blob = await put(
        `blogs/${Date.now()}-${file.originalname}`,
        file.buffer,
        { access: "public" }
      );
      blog.image = blob.url;
    }

    // handle og image update
    if (req.files?.ogImage?.[0]) {
      const file = req.files.ogImage[0];

      const blob = await put(
        `blogs/og/${Date.now()}-${file.originalname}`,
        file.buffer,
        { access: "public" }
      );
      blog.ogImage = blob.url;
    }

    // Handle title change → regenerate slug
    if (title && title !== oldTitle) {
      let baseSlug = slugify(title, { lower: true, strict: true, trim: true });
      let newSlug = baseSlug;
      let count = 1;

      while (await Blog.findOne({ url: newSlug, _id: { $ne: blog._id } })) {
        newSlug = `${baseSlug}-${count++}`;
      }
      blog.url = newSlug;
    }
    await blog.save();
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

// SET FEATURED BLOG (Admin Only)
export const setFeaturedBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1️⃣ Remove previous featured blog
    await Blog.updateMany({ featured: true }, { $set: { featured: false } });

    // 2️⃣ Set new featured blog
    const blog = await Blog.findOneAndUpdate(
      { url: slug },
      { featured: true },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog set as featured successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
