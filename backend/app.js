// app.js
import express from "express";
import cors from "cors";
// Import routes
import productRouter from "./routes/product.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/product", productRouter);

export default app;
