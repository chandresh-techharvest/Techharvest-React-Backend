import express from "express";
import { adminLogin, getContacts, getNewsLetters, adminLogout } from "../controllers/adminController.js";

import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Login Route
router.post("/login", adminLogin);

// Protected Route
router.get("/contacts", adminAuth, getContacts);
router.get("/newsLetters", adminAuth, getNewsLetters);
router.post("/logout", adminAuth, adminLogout);

export default router;
