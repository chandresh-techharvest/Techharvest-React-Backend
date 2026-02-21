import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactFormRoutes from "./routes/contactFormRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";
import caseStudiesRoutes from "./routes/caseStudiesRoutes.js";

dotenv.config();

const app = express();

// CORS middleware
// const FRONTEND_URL = "http://localhost:5173";
const FRONTEND_URL = "https://www.thetechharvest.com";

app.use(cors({
  origin: [FRONTEND_URL],
  credentials: true,
}));

app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/newsLetter", newsletterRoutes);
app.use("/contact", contactFormRoutes);

//Admin only
app.use("/admin", adminRoutes);
app.use("/blogs", blogRoutes);
app.use("/caseStudies", caseStudiesRoutes);

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

// export default app;
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});