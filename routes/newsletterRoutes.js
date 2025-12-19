import express from "express";
import Newsletter from "../models/Newsletter.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// POST - Add a new subscriber
router.post("/subscribe", async (req, res) => {
  try {
    const { name, email, interest } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    // Check for duplicate email
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed!" });
    }

    const newSubscriber = new Newsletter({ name, email, interest });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

export default router;
