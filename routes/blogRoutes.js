import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/adminController.js";

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
router.get("/:id", getBlogById);

// Admin Protected
router.post("/create",upload.single("image"), adminAuth, createBlog);
router.put("/update/:id",upload.single("image"), adminAuth, updateBlog);
router.delete("/delete/:id", adminAuth, deleteBlog);


export default router;
