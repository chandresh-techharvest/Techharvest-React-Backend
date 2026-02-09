import dotenv from "dotenv";
import CaseStudies from "../models/CaseStudy.js";
import slugify from "slugify";
import { put } from "@vercel/blob";

dotenv.config();

// GET ALL Case Studies (Public)
export const getCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudies.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      caseStudy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Case Studies",
    });
  }
};

// GET CASE STUDY BY SLUG (Public)
export const getCaseStudyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const caseStudy = await CaseStudies.findOne({ url: slug });
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case Study not found",
      });
    }
    res.status(200).json({
      success: true,
      caseStudy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Case Study",
    });
  }
};

// GET FEATURED CASE STUDY (Public)
export const getFeaturedCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudies.findOne({ featured: true });

    res.status(200).json({
      success: true,
      caseStudy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE Case Study (Admin Only)
export const createCaseStudy = async (req, res) => {
  try {
    const {
      client,
      title,
      industry,
      domain,
      description,
      challenge,
      solution,
      result,
      tech,
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      const blob = await put(
        `CaseStudies/${Date.now()}-${req.file.originalname}`,
        req.file.buffer,
        { access: "public" }
      );
      imageUrl = blob.url;
    }
    const techArray =
      typeof tech === "string" ? JSON.parse(tech || "[]") : tech || [];

    // ✅ Generate clean slug
    let baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    // ✅ Ensure unique slug
    while (await CaseStudies.findOne({ url: slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const caseStudy = await CaseStudies.create({
      client,
      title,
      industry,
      domain,
      description,
      challenge,
      solution,
      result,
      tech: techArray,
      image: imageUrl,
      url: slug,
    });

    res.status(201).json({
      success: true,
      message: "Case Study created successfully",
      caseStudy,
    });
  } catch (err) {
    console.error("create case study error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating case study",
      error: err.message,
    });
  }
};

// GET ALL CASE STUDIES (Public)
export const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudies.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      caseStudies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Case Studies",
    });
  }
};

// GET Case Study BY ID (Public)
export const getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudies.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case Study not found",
      });
    }
    res.status(200).json({
      success: true,
      caseStudy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Case Study",
    });
  }
};

// UPDATE CASE STUDY BY SLUG (Admin Only)
export const updateCaseStudyBySlug = async (req, res) => {
  try {
    const { client, title, industry, domain, description, challenge, solution, result, tech } = req.body;
    const techArray =
      typeof tech === "string" ? JSON.parse(tech || "[]") : tech || [];

    // Find case study by slug
    const caseStudy = await CaseStudies.findOne({ url: req.params.slug });
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case Study not found",
      });
    }

    // Prepare update
    const oldTitle = caseStudy.title;
    caseStudy.title = title;
    caseStudy.client = client;
    caseStudy.industry = industry;
    caseStudy.domain = domain;
    caseStudy.description = description;
    caseStudy.challenge = challenge;
    caseStudy.solution = solution;
    caseStudy.result = result;
    caseStudy.tech = techArray;

    // handle image update
    if (req.file) {
      const blob = await put(
        `CaseStudies/${Date.now()}-${req.file.originalname}`,
        req.file.buffer,
        { access: "public" }
      );
      caseStudy.image = blob.url;
    }

    // Handle title change → regenerate slug
    if (title && title !== oldTitle) {
      let baseSlug = slugify(title, { lower: true, strict: true, trim: true });
      let newSlug = baseSlug;
      let count = 1;

      while (await CaseStudies.findOne({ url: newSlug, _id: { $ne: caseStudy._id } })) {
        newSlug = `${baseSlug}-${count++}`;
      }
      caseStudy.url = newSlug;
    }
    await caseStudy.save();
    res.status(200).json({
      success: true,
      message: "Case Study updated successfully",
      caseStudy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating case study",
      error: err.message,
    });
  }
};

// DELETE CASE STUDIES (Admin Only)
export const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudies.findByIdAndDelete(req.params.id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case Study not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Case Study deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting case study",
      error: err.message,
    });
  }
};

// SET FEATURED Case Study (Admin Only)
export const setFeaturedCaseStudy = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1️⃣ Remove previous featured CaseStudy
    await CaseStudies.updateMany({ featured: true }, { $set: { featured: false } });

    // 2️⃣ Set new featured CaseStudy
    const caseStudy = await CaseStudies.findOneAndUpdate(
      { url: slug },
      { featured: true },
      { new: true }
    );

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "case study not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Case Study set as featured successfully",
      caseStudy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
