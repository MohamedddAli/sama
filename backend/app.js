// app.js
import express from "express";
import cors from "cors";
// Import routes
import productRouter from "./routes/product.js";
import categoryRouter from "./routes/category.js";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://sama-int.vercel.app", // only allow your frontend to access the backend
    credentials: true, // if using cookies or auth headers
  })
);

// Routes
app.use("/product", productRouter);
app.use("/category", categoryRouter);

export default app;
