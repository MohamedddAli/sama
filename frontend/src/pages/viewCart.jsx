"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import axios from "axios";
import { useCart } from "../context/cartContext";
import Header from "../components/header";

const ViewCart = () => {
  const navigate = useNavigate();
  const { cart, setCart, sessionId } = useCart();
  const [updating, setUpdating] = useState({});
  const [removing, setRemoving] = useState({});
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${api}/cart/${sessionId}`);
        setCart(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch cart:", error);
      }
    };

    if (sessionId) {
      fetchCart();
    }
  }, [sessionId]);

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      setUpdating((prev) => ({ ...prev, [productId]: true }));

      if (newQuantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const response = await axios.patch(`${api}/cart/update`, {
        sessionId,
        productId,
        quantity: newQuantity,
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setRemoving((prev) => ({ ...prev, [productId]: true }));
      const response = await axios.delete(`${api}/cart/remove`, {
        params: { sessionId, productId },
      });

      // After deletion, refetch the updated cart
      const updatedCart = await axios.get(`${api}/cart/${sessionId}`);
      setCart(updatedCart.data);
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setRemoving((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const calculateItemTotal = (item) => {
    const product = item?.productId;
    if (!product || typeof product.price !== "number") return 0;

    const price =
      product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;
    return price * (item.quantity || 0);
  };

  const calculateSubtotal = () => {
    return (
      cart?.items?.reduce((total, item) => {
        return total + calculateItemTotal(item);
      }, 0) || 0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal(); // No tax, no shipping fees
  };

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {itemCount > 0
              ? `${itemCount} item${itemCount > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {!cart?.items || cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiShoppingCart size={64} className="text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart?.items?.map((item) => {
                    const product = item?.productId; // holds the value of product
                    if (!product) return null;

                    const discountedPrice =
                      product.discount > 0
                        ? product.price -
                          (product.price * product.discount) / 100
                        : product.price;

                    return (
                      <div key={product._id} className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={
                                product.images?.[0] ||
                                "/placeholder.svg?height=120&width=120"
                              }
                              alt={product.name || "Product"}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  {product.name || "Unknown Product"}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {product.category?.name || "Uncategorized"}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-lg font-semibold text-gray-900">
                                    ${discountedPrice?.toFixed(2) || "0.00"}
                                  </span>
                                  {product.discount > 0 && (
                                    <>
                                      <span className="text-sm text-gray-500 line-through">
                                        ${product.price?.toFixed(2) || "0.00"}
                                      </span>
                                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                        <FiTag size={10} />
                                        {product.discount}% OFF
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Stock Status */}
                                <div className="mb-4">
                                  {product.stock > 0 ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      ✓ In Stock ({product.stock} available)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      ✗ Out of Stock
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Item Total */}
                              <div className="text-right ml-4">
                                <div className="text-lg font-semibold text-gray-900">
                                  ${calculateItemTotal(item).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${discountedPrice?.toFixed(2)} ×{" "}
                                  {item.quantity}
                                </div>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-black">
                                  Quantity:
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        product._id,
                                        (item.quantity || 1) - 1
                                      )
                                    }
                                    disabled={
                                      updating[product._id] ||
                                      item.quantity <= 1
                                    }
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-full transition-colors"
                                  >
                                    <FiMinus size={14} />
                                  </button>

                                  <span className="text-lg text-black font-medium w-12 text-center">
                                    {updating[product._id]
                                      ? "..."
                                      : item.quantity || 0}
                                  </span>

                                  <button
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        product._id,
                                        (item.quantity || 0) + 1
                                      )
                                    }
                                    disabled={
                                      updating[product._id] ||
                                      item.quantity >= product.stock
                                    }
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-full transition-colors"
                                  >
                                    <FiPlus size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(product._id)}
                                disabled={removing[product._id]}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 disabled:text-red-400 transition-colors"
                              >
                                {removing[product._id] ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FiTrash2 size={16} />
                                )}
                                <span className="text-sm font-medium">
                                  {removing[product._id]
                                    ? "Removing..."
                                    : "Remove"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-medium">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FiTruck size={16} className="text-green-500" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCart;
