import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { createBlog, getBlogById, updateBlogBySlug, deleteBlog, setFeaturedBlog } from "../controllers/adminController.js";
import { getBlogs, getBlogBySlug, getFeaturedBlog, } from "../controllers/blogController.js";

const router = express.Router();
import multer from "multer";
import path from "path";

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Public Routes
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/featured", getFeaturedBlog);

// Get Blog by ID
router.get("/id/:id", getBlogById);

// Admin Protected
router.post("/create",upload.single("image"), adminAuth, createBlog);
router.put("/slug/:slug", upload.single("image"), adminAuth, updateBlogBySlug);
router.delete("/delete/:id", adminAuth, deleteBlog);

router.put("/featured/:slug", adminAuth, setFeaturedBlog);


export default router;
