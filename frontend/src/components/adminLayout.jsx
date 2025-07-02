"use client";

import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
} from "react-icons/fi";
import { MdDashboard, MdCategory } from "react-icons/md";
import { Link } from "react-router-dom";

const AdminLayout = ({ children, currentPage = "dashboard" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: MdDashboard,
      current: currentPage === "dashboard",
    },
    {
      name: "Products",
      href: "/admin/view-products",
      icon: FiPackage,
      current: currentPage === "products",
    },
    {
      name: "Add Product",
      href: "/admin/add-product",
      icon: FiPackage,
      current: currentPage === "add-product",
    },
    {
      name: "Manage Categories",
      href: "/admin/manage-categories",
      icon: MdCategory,
      current: currentPage === "categories",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: FiShoppingBag,
      current: currentPage === "orders",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: FiUsers,
      current: currentPage === "analytics",
    },
    {
      name: "Messages",
      href: "/admin/manage-messages",
      icon: FiMessageSquare,
      current: currentPage === "messages",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Horizontal Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Admin Panel
              </span>
              <span className="text-lg font-bold text-gray-900 sm:hidden">
                Admin
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent size={16} />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      item.current
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="flex-1">
        <div className="py-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
