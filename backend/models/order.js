// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    customerInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String }, // optional if pickup
      city: { type: String }, // optional if pickup
      deliveryMethod: {
        type: String,
        enum: ["pickup", "delivery"],
        required: true,
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // price *after* discount
      },
    ],
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    // Optional: sessionId to track anonymous users
    // sessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
