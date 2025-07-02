import Order from "../models/order.js";

// CREATE
// helper function to generate a unique order number
const generateOrderNumber = () => {
  const prefix = "SI"; // e.g., Sama International
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${prefix}-${timestamp}-${random}`;
};

export const createOrder = async (req, res) => {
  try {
    const orderNumber = generateOrderNumber();

    const order = new Order({
      ...req.body,
      orderNumber,
    });

    await order.save();

    res.status(201).json({
      message: "✅ Order placed successfully",
      orderNumber: order.orderNumber,
      orderId: order._id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder)
      return res.status(404).json({ error: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
