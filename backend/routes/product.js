// routes/productRouter.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "../controllers/product.js";
import { getProductsByCategory } from "../controllers/product.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/featured", getFeaturedProducts);
export default router;
