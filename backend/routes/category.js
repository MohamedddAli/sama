import express from "express";

const router = express.Router();
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

// Get all categories
router.get("/", getCategories);

// Get a single category by ID
router.get("/:id", getCategoryById);

// Create a new category
router.post("/", createCategory);

// Update a category
router.put("/:id", updateCategory);

// Delete a category
router.delete("/:id", deleteCategory);

export default router;
