import mongoose from "mongoose";
import dotenv from "dotenv";

let isConnected = false;
dotenv.config();

function connectDB() {
  if (isConnected) return;

  console.log("🔄 Connecting to MongoDB...");
  console.log("Mongo URI:", !!process.env.MONGO_URI);

  mongoose
  .connect(process.env.MONGO_URI, 
    {
      dbName:"THReact",
    }
  )
  .then((conn) => {
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  })
  .catch((err) => {
      console.error("MongoDB Connection Error:", err.message);
    });
}

export default connectDB;