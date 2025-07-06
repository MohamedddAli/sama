"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiTruck,
  FiPackage,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import axios from "axios";
import { useCart } from "../context/cartContext";
import Header from "../components/header";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart, sessionId } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "Egypt",
    address: "",
    city: "",
    deliveryMethod: "delivery", // "delivery" or "pickup"
  });

  const [formErrors, setFormErrors] = useState({});
  const api = import.meta.env.VITE_API_BASE_URL;

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      navigate("/shop");
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-$$$$]{10,}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.deliveryMethod === "delivery") {
      if (!formData.address.trim()) {
        errors.address = "Address is required for delivery";
      }
      if (!formData.city.trim()) {
        errors.city = "City is required for delivery";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  const calculateTotal = () => {
    return (
      cart?.items?.reduce((total, item) => {
        return total + calculateItemTotal(item);
      }, 0) || 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    console.log("Submitting order with data:", formData);
    console.log("Cart items:", cart.items);
    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          country: formData.country,
          address:
            formData.deliveryMethod === "delivery"
              ? formData.address.trim()
              : "",
          city:
            formData.deliveryMethod === "delivery" ? formData.city.trim() : "",
          deliveryMethod: formData.deliveryMethod,
        },
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price:
            item.productId.discount > 0
              ? item.productId.price -
                (item.productId.price * item.productId.discount) / 100
              : item.productId.price,
        })),
        totalAmount: calculateTotal(),
      };

      // Submit order
      const response = await axios.post(`${api}/order`, orderData);

      // Clear cart after successful order
      setCart({ items: [] });

      // Set success state
      setOrderSuccess(true);
      setOrderNumber(response.data.orderNumber || response.data._id || "N/A");
    } catch (error) {
      console.error("Error creating order:", error);
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  // Success page
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck size={32} className="text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your order. We've received your order and will
              process it shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order Number
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Amount
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Delivery Method
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formData.deliveryMethod === "delivery"
                      ? "Home Delivery"
                      : "Branch Pickup"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formData.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">
                📧 A confirmation email has been sent to{" "}
                <strong>{formData.email}</strong> with your order details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/shop")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiUser className="text-blue-600" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Customer Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.firstName
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.lastName
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.phone ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="+20 123 456 7890"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiMapPin className="text-blue-600" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Location Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Address{" "}
                      {formData.deliveryMethod === "delivery" ? "*" : ""}
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                        formErrors.address
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder={
                        formData.deliveryMethod === "delivery"
                          ? "Enter your full address"
                          : "Optional - Enter your address"
                      }
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City {formData.deliveryMethod === "delivery" ? "*" : ""}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.city ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder={
                        formData.deliveryMethod === "delivery"
                          ? "Enter your city"
                          : "Optional - Enter your city"
                      }
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiTruck className="text-blue-600" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delivery Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.deliveryMethod === "delivery"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={formData.deliveryMethod === "delivery"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <FiTruck
                        size={24}
                        className={
                          formData.deliveryMethod === "delivery"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          Home Delivery
                        </div>
                        <div className="text-sm text-gray-500">
                          FREE - Delivered to your address
                        </div>
                      </div>
                    </div>
                    {formData.deliveryMethod === "delivery" && (
                      <div className="absolute top-2 right-2">
                        <FiCheck className="text-blue-600" size={20} />
                      </div>
                    )}
                  </label>

                  <label
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.deliveryMethod === "pickup"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === "pickup"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <FiPackage
                        size={24}
                        className={
                          formData.deliveryMethod === "pickup"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          Branch Pickup
                        </div>
                        <div className="text-sm text-gray-500">
                          FREE - Collect from our showroom
                        </div>
                      </div>
                    </div>
                    {formData.deliveryMethod === "pickup" && (
                      <div className="absolute top-2 right-2">
                        <FiCheck className="text-blue-600" size={20} />
                      </div>
                    )}
                  </label>
                </div>

                {/* Branch pickup info */}
                {formData.deliveryMethod === "pickup" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-blue-600 mt-1" size={20} />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">
                            Pickup Location
                          </h4>
                          <p className="text-blue-800 text-sm mb-2">
                            المنطقة الصناعية - التجمع الخامس - 31/2
                            <br />
                            New Cairo, Egypt
                          </p>
                          <p className="text-blue-700 text-sm">
                            <strong>Hours:</strong> Saturday - Thursday, 10AM -
                            8PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-green-900">
                        Cash On Delivery (COD)
                      </div>
                      <div className="text-sm text-green-700">
                        Pay when you receive your order
                      </div>
                    </div>
                    <div className="ml-auto">
                      <FiCheck className="text-green-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Note:</strong> Payment will be collected upon
                    delivery or pickup. Please have the exact amount ready.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <FiShoppingCart className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart?.items?.map((item) => {
                  const product = item?.productId;
                  if (!product || !product._id) return null;

                  const discountedPrice =
                    product.discount > 0
                      ? product.price - (product.price * product.discount) / 100
                      : product.price;

                  return (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={
                          product.images?.[0] ||
                          "/placeholder.svg?height=60&width=60"
                        }
                        alt={product.name || "Product"}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.name || "Unknown Product"}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${calculateItemTotal(item).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* View Cart Button */}
              <button
                onClick={() => navigate("/view-cart")}
                className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                View Cart
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
      </div>
    </div>
  );
};

export default Checkout;
