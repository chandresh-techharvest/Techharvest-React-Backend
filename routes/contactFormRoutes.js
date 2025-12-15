import express from "express";
import Contact from "../models/ContactForm.js";
import verifyCaptcha from "../utiils/reCaptcha.js";


const router = express.Router();

// POST — Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      service,
      budget,
      message,
      newsletter,
      token,
    } = req.body;
    // console.log("Token:",token)

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyCaptcha(token); 
    if (!isHuman) {
      return res
        .status(400)
        .json({ message: "reCAPTCHA verification failed. Please try again." });
    }

    // Save form data to MongoDB
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      company,
      service,
      budget,
      message,
      newsletter,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
});

// // GET — Retrieve all messages (for admin)
// router.get("/messages", async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ date: -1 });
//     res.json(contacts);
//   } catch (error) {
//     console.error("Fetch Messages Error:", error);
//     res.status(500).json({ message: "Failed to fetch messages" });
//   }
// });

export default router;
