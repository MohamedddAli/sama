// controllers/product/productController.js
import Product from "../models/product.js";
import Category from "../models/category.js";
import mongoose from "mongoose";

// CREATE a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create product", error: err.message });
  }
};

// READ all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

// READ one product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving product", error: err.message });
  }
};

// UPDATE product by ID
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update product", error: err.message });
  }
};

// DELETE product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};

// GET products by category ID
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const products = await Product.find({ category: categoryId });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products by category",
      error: err.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).populate(
      "category"
    );
    res.status(200).json(featuredProducts);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch featured products",
        error: err.message,
      });
  }
};
