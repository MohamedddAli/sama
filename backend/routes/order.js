import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";

const router = express.Router();

router.post("/", createOrder); // Create
router.get("/", getAllOrders); // Read all
router.get("/:id", getOrderById); // Read one
router.put("/:id", updateOrder); // Update
router.delete("/:id", deleteOrder); // Delete

export default router;
