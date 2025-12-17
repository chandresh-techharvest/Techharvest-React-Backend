import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbconfig.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactFormRoutes from "./routes/contactFormRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173",
             "https://www.thetechharvest.com"
          ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serv

// Routes
app.use("/newsletter", newsletterRoutes);
app.use("/contact", contactFormRoutes);

//Admin only
app.use("/admin", adminRoutes);
app.use("/blogs", blogRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("The TechHarvest Solution Backend is Running...");
});

export default app;