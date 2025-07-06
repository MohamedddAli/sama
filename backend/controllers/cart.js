// controllers/cartController.js
import Cart from "../models/cart.js";

export const initCart = async (req, res) => {
  const { sessionId } = req.body;

  try {
    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({ sessionId });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize cart" });
  }
};

export const addItemToCart = async (req, res) => {
  const { sessionId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Optional: update totalPrice
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
};

export const getCart = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const cart = await Cart.findOne({ sessionId }).populate({
      path: "items.productId",
      populate: {
        path: "category", // the field inside Product you want to populate
        model: "Category", // must match the name of your Category model
      },
    });

    res.json(cart || {});
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
};

export const clearCart = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0; // optional, if you’re using totalPrice
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { sessionId, productId } = req.query;

  try {
    const cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item" });
  }
};
