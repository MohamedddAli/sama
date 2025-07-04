"use client";

import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiUser,
  FiPlus,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiHome,
  FiTrendingUp,
  FiDollarSign,
  FiEye,
  FiMessageSquare,
} from "react-icons/fi";
import { MdDashboard, MdCategory, MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const adminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/product`);
      setProducts(response.data);
      console.log("Products fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setActionStatus("error");
      setActionMessage("Failed to load products. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      change: "N/A",
      changeType: "positive",
      icon: FiPackage,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: "856",
      change: "+8%",
      changeType: "positive",
      icon: FiShoppingBag,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+15%",
      changeType: "positive",
      icon: FiDollarSign,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Users",
      value: "2,345",
      change: "+5%",
      changeType: "positive",
      icon: FiUsers,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Add new products to your inventory",
      icon: FiPlus,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      action: "add-product",
    },
    {
      title: "View Products",
      description: "Manage your product catalog",
      icon: FiEye,
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      action: "view-products",
    },
    {
      title: "View Orders",
      description: "Track and manage customer orders",
      icon: FiShoppingBag,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      action: "view-orders",
    },
    {
      title: "Manage Categories",
      description: "Manage product categories",
      icon: MdCategory,
      color: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
      action: "manage-categories",
    },

    {
      title: "Analytics",
      description: "View sales and performance reports",
      icon: FiUser,
      color: "bg-pink-600",
      hoverColor: "hover:bg-pink-700",
      action: "analytics",
    },
    {
      title: "Inventory",
      description: "Track stock levels and inventory",
      icon: MdInventory,
      color: "bg-teal-600",
      hoverColor: "hover:bg-teal-700",
      action: "inventory",
    },
    {
      title: "Messages",
      description: "Manage customer messages",
      icon: FiMessageSquare,
      color: "bg-teal-600",
      hoverColor: "hover:bg-teal-700",
      action: "manage-messages",
    },
  ];

  const recentActivities = [
    { action: "New order #1234", time: "2 minutes ago", type: "order" },
    {
      action: "Product 'Smart Shower' updated",
      time: "15 minutes ago",
      type: "product",
    },
    { action: "New user registered", time: "1 hour ago", type: "user" },
    {
      action: "Category 'Mirrors' created",
      time: "2 hours ago",
      type: "category",
    },
    { action: "Order #1230 shipped", time: "3 hours ago", type: "order" },
  ];

  const handleActionClick = (action) => {
    // Here you would typically use React Router to navigate
    // For now, we'll just update the active section
    setActiveSection(action);
    console.log(`Navigating to: ${action}`);

    // Example of how you might handle routing:
    navigate(`/admin/${action}`);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SI</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Admin</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <FiHome size={18} />
                Store
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Mohamed!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <IconComponent size={24} className={stat.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action.action)}
                  className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                >
                  <div
                    className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-lg flex items-center justify-center mb-4 transition-colors`}
                  >
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "order"
                        ? "bg-blue-100"
                        : activity.type === "product"
                        ? "bg-green-100"
                        : activity.type === "user"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {activity.type === "order" && (
                      <FiShoppingBag size={16} className="text-blue-600" />
                    )}
                    {activity.type === "product" && (
                      <FiPackage size={16} className="text-green-600" />
                    )}
                    {activity.type === "user" && (
                      <FiUser size={16} className="text-purple-600" />
                    )}
                    {activity.type === "category" && (
                      <MdCategory size={16} className="text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all activities
            </button>
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Quick Overview
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiTrendingUp className="text-blue-600" size={20} />
                  <span className="font-medium text-gray-900">Sales Today</span>
                </div>
                <span className="text-lg font-bold text-blue-600">$2,345</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiShoppingBag className="text-green-600" size={20} />
                  <span className="font-medium text-gray-900">
                    Orders Today
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">23</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-orange-600" size={20} />
                  <span className="font-medium text-gray-900">
                    Low Stock Items
                  </span>
                </div>
                <span className="text-lg font-bold text-orange-600">5</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiUsers className="text-purple-600" size={20} />
                  <span className="font-medium text-gray-900">
                    New Customers
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600">12</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default adminDashboard;
