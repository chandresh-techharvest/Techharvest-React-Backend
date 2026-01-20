import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { getCaseStudy, getCaseStudyBySlug, getFeaturedCaseStudy, createCaseStudy, getCaseStudyById, updateCaseStudyBySlug, deleteCaseStudy, setFeaturedCaseStudy } from "../controllers/caseStudiesController.js";

const router = express.Router();
import { upload } from '../middleware/upload.js'

// Public Routes
router.get("/", getCaseStudy);
router.get("/slug/:slug", getCaseStudyBySlug);
router.get("/featured", getFeaturedCaseStudy);

// Get Blog by ID
router.get("/id/:id", getCaseStudyById);

// Admin Protected
router.post("/create", adminAuth, upload.single("image"), createCaseStudy);
router.put("/slug/:slug", adminAuth, upload.single("image"), updateCaseStudyBySlug);
router.delete("/delete/:id", adminAuth, deleteCaseStudy);
router.put("/featured/:slug", adminAuth, setFeaturedCaseStudy);

export default router;