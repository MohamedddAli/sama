"use client";

import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { MdDashboard, MdCategory } from "react-icons/md";

const adminLayout = ({ children, currentPage = "dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: MdDashboard,
      current: currentPage === "dashboard",
    },
    {
      name: "Products",
      href: "/admin/products",
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
      name: "Categories",
      href: "/admin/categories",
      icon: MdCategory,
      current: currentPage === "categories",
    },
    {
      name: "Add Category",
      href: "/admin/add-category",
      icon: MdCategory,
      current: currentPage === "add-category",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: FiShoppingBag,
      current: currentPage === "orders",
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: FiUsers,
      current: currentPage === "customers",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: FiUsers,
      current: currentPage === "analytics",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: FiSettings,
      current: currentPage === "settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent size={18} />
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent size={18} />
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FiHome size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default adminLayout;
