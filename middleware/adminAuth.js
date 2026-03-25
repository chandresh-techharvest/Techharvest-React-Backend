import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No Authorization header at all
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    // Covers both TokenExpiredError and JsonWebTokenError
    return res.status(401).json({
      success: false,
      message: "Session Expired. Please Login Again!",
    });
  }
};

export default adminAuth;