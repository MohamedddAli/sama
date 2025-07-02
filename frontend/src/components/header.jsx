"use client";

import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPlus,
  FiMinus,
  FiTrash2,
} from "react-icons/fi";
import axios from "axios";
import { useCart } from "../context/cartContext"; // Adjust the import path as needed

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  const baseLink = "px-3 py-2 rounded-md font-medium text-gray-700 transition";
  const activeLink = "text-blue-700 font-semibold underline";
  const mobileBaseLink =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-700 transition";
  const mobileActiveLink = "text-blue-700 font-semibold bg-blue-50";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  const api = import.meta.env.VITE_API_BASE_URL;
  const { cart, setCart, sessionId } = useCart();

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
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
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${api}/cart/remove`, {
        data: { sessionId, productId },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const calculateTotal = () => {
    return (
      cart?.items?.reduce((total, item) => {
        const product = item?.productId;
        if (!product || typeof product.price !== "number") return total;

        const price =
          product.discount > 0
            ? product.price - (product.price * product.discount) / 100
            : product.price;
        return total + price * (item.quantity || 0);
      }, 0) || 0
    );
  };

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SI</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Sama International
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              Sama
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Shopping Cart */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={toggleCart}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
              >
                <FiShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Shopping Cart
                      </h3>
                      <button
                        onClick={closeCart}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {!cart?.items || cart.items.length === 0 ? (
                      <div className="p-6 text-center">
                        <FiShoppingCart
                          size={48}
                          className="text-gray-300 mx-auto mb-4"
                        />
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <button
                          onClick={() => {
                            closeCart();
                            window.location.href = "/shop";
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        {cart?.items?.map((item) => {
                          const product = item?.productId;
                          if (!product || !product._id) return null;

                          const discountedPrice =
                            product.discount > 0
                              ? product.price -
                                (product.price * product.discount) / 100
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
                                  {product || "Unknown Product"}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-semibold text-gray-900">
                                    ${discountedPrice?.toFixed(2) || "0.00"}
                                  </span>
                                  {product.discount > 0 && (
                                    <span className="text-xs text-gray-500 line-through">
                                      ${product.price?.toFixed(2) || "0.00"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      product._id,
                                      (item.quantity || 1) - 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                                >
                                  <FiMinus size={12} />
                                </button>

                                <span className="text-sm font-medium w-8 text-center">
                                  {item.quantity || 0}
                                </span>

                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      product._id,
                                      (item.quantity || 0) + 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                                >
                                  <FiPlus size={12} />
                                </button>

                                <button
                                  onClick={() => removeFromCart(product._id)}
                                  className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {cart?.items && cart.items.length > 0 && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          Total:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          closeCart();
                          window.location.href = "/view-cart";
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                      >
                        View Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white relative z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Shop
              </NavLink>
              <NavLink
                to="/categories"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/contact-us"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        )}

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
