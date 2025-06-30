// app.js
import express from "express";
import cors from "cors";
// Import routes
import productRouter from "./routes/product.js";
import categoryRouter from "./routes/category.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();
const app = express();

// Set up port and MongoDB URI
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

//-------------------------------------------------------------------------------------------------

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/product", productRouter);
app.use("/category", categoryRouter);

export default app;
