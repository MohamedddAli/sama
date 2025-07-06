// routes/cartRoutes.js
import express from "express";
import {
  initCart,
  addItemToCart,
  getCart,
  clearCart,
  removeItemFromCart,
} from "../controllers/cart.js";

const router = express.Router();

router.post("/init", initCart);
router.post("/add", addItemToCart);
router.get("/:sessionId", getCart);
router.post("/clear", clearCart); // POST /api/cart/clear
router.delete("/remove", removeItemFromCart); // POST /api/cart/remove

export default router;
