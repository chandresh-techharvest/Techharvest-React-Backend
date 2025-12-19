import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { createBlog, getBlogById, updateBlogBySlug, deleteBlog, setFeaturedBlog } from "../controllers/adminController.js";
import { getBlogs, getBlogBySlug, getFeaturedBlog, } from "../controllers/blogController.js";

const router = express.Router();
import { upload } from '../middleware/upload.js'

// Public Routes
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/featured", getFeaturedBlog);

// Get Blog by ID
router.get("/id/:id", getBlogById);

// Admin Protected
router.post("/create", adminAuth, upload.single("image"), createBlog);
router.put("/slug/:slug", adminAuth, upload.single("image"), updateBlogBySlug);
router.delete("/delete/:id", adminAuth, deleteBlog);

router.put("/featured/:slug", adminAuth, setFeaturedBlog);


export default router;
