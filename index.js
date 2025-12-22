import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactFormRoutes from "./routes/contactFormRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";

dotenv.config();

const app = express();

// CORS middleware
const FRONTEND_URL = "https://www.thetechharvest.com/";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
// Routes
app.use("/newsLetter", newsletterRoutes);
app.use("/contact", contactFormRoutes);

//Admin only
app.use("/admin", adminRoutes);
app.use("/blogs", blogRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "The TechHarvest Solution Backend is Running",
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database connection
connectDB();

export default app;