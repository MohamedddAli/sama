"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../components/adminLayout";
import axios from "axios";
import {
  FiSearch,
  FiEye,
  FiPackage,
  FiClock,
  FiCheck,
  FiX,
  FiTruck,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateRange, setDateRange] = useState("");
  const [actionStatus, setActionStatus] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(12);

  const api = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const statusOptions = ["pending", "processing", "completed", "cancelled"];
  const deliveryMethods = ["pickup", "delivery"];

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and sort orders
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerInfo.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm);

      const matchesStatus =
        selectedStatus === "" || order.status === selectedStatus;

      const matchesDeliveryMethod =
        selectedDeliveryMethod === "" ||
        order.customerInfo.deliveryMethod === selectedDeliveryMethod;

      const matchesDateRange = () => {
        if (!dateRange) return true;
        const orderDate = new Date(order.createdAt);
        const today = new Date();

        switch (dateRange) {
          case "today":
            return orderDate.toDateString() === today.toDateString();
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case "month":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            return orderDate >= monthAgo;
          default:
            return true;
        }
      };

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDeliveryMethod &&
        matchesDateRange()
      );
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "orderNumber":
          aValue = a.orderNumber.toLowerCase();
          bValue = b.orderNumber.toLowerCase();
          break;
        case "customerName":
          aValue =
            `${a.customerInfo.firstName} ${a.customerInfo.lastName}`.toLowerCase();
          bValue =
            `${b.customerInfo.firstName} ${b.customerInfo.lastName}`.toLowerCase();
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [
    orders,
    searchTerm,
    selectedStatus,
    selectedDeliveryMethod,
    sortBy,
    sortOrder,
    dateRange,
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/order`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setActionStatus("error");
      setActionMessage("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`${api}/order/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setActionStatus("success");
      setActionMessage(`Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      setActionStatus("error");
      setActionMessage("Failed to update order status. Please try again.");
    }

    setTimeout(() => {
      setActionStatus(null);
      setActionMessage("");
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock size={14} />;
      case "processing":
        return <FiPackage size={14} />;
      case "completed":
        return <FiCheck size={14} />;
      case "cancelled":
        return <FiX size={14} />;
      default:
        return <FiClock size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    return stats;
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/view-orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <AdminLayout currentPage="view-orders">
      <div className="min-h-screen min-w-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order Management
                </h1>
                <p className="text-gray-600">
                  Track and manage customer orders
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchOrders}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiRefreshCw size={18} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FiDownload size={18} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {actionStatus && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                actionStatus === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {actionStatus === "success" ? (
                <FiCheck size={20} className="text-green-600" />
              ) : (
                <FiX size={20} className="text-red-600" />
              )}
              <span className="font-medium">{actionMessage}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiPackage size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FiClock size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiPackage size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Processing</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.processing}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiX size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.cancelled}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              {/* Delivery Method Filter */}
              <select
                value={selectedDeliveryMethod}
                onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Methods</option>
                {deliveryMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>

              {/* Date Range Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>

              {/* Sort Options */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                >
                  <option value="createdAt">Date</option>
                  <option value="orderNumber">Order #</option>
                  <option value="customerName">Customer</option>
                  <option value="totalAmount">Amount</option>
                  <option value="status">Status</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {currentOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FiPackage size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {searchTerm ||
                selectedStatus ||
                selectedDeliveryMethod ||
                dateRange
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once customers start placing them"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {currentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {order.customerInfo.deliveryMethod ===
                              "delivery" ? (
                                <FiTruck size={12} />
                              ) : (
                                <FiMapPin size={12} />
                              )}
                              {order.customerInfo.deliveryMethod
                                .charAt(0)
                                .toUpperCase() +
                                order.customerInfo.deliveryMethod.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          {/* Customer Info */}
                          <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <FiUser size={14} />
                              <span className="font-medium">Customer</span>
                            </div>
                            <p className="text-gray-900">
                              {order.customerInfo.firstName}{" "}
                              {order.customerInfo.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <FiMail size={12} />
                              <span className="truncate">
                                {order.customerInfo.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <FiPhone size={12} />
                              <span>{order.customerInfo.phone}</span>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <FiCalendar size={14} />
                              <span className="font-medium">Order Date</span>
                            </div>
                            <p className="text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <FiPackage size={12} />
                              <span>{order.items.length} item(s)</span>
                            </div>
                          </div>

                          {/* Amount */}
                          <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <FiDollarSign size={14} />
                              <span className="font-medium">Total Amount</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Address for delivery orders */}
                        {order.customerInfo.deliveryMethod === "delivery" &&
                          order.customerInfo.address && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <FiMapPin size={14} />
                                <span className="font-medium text-sm">
                                  Delivery Address
                                </span>
                              </div>
                              <p className="text-sm text-gray-900">
                                {order.customerInfo.address},{" "}
                                {order.customerInfo.city},{" "}
                                {order.customerInfo.country}
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <FiEye size={16} />
                          <span className="sm:hidden lg:inline">
                            View Details
                          </span>
                          <span className="hidden sm:inline lg:hidden">
                            View
                          </span>
                        </button>

                        {/* Status Update Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstOrder + 1} to{" "}
                    {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                    {filteredOrders.length} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewOrders;
