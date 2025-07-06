"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/adminLayout";
import axios from "axios";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiEdit3,
  FiPrinter,
  FiDownload,
  FiClock,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";

const ViewOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const api = import.meta.env.VITE_API_BASE_URL;
  const statusOptions = ["pending", "processing", "completed", "cancelled"];

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/order/${id}`);
      setOrder(response.data);
      setNewStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setActionStatus("error");
      setActionMessage("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) {
      setEditingStatus(false);
      return;
    }

    try {
      setUpdating(true);
      await axios.patch(`${api}/order/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      setEditingStatus(false);
      setActionStatus("success");
      setActionMessage(`Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      setActionStatus("error");
      setActionMessage("Failed to update order status. Please try again.");
      setNewStatus(order.status); // Reset to original status
    } finally {
      setUpdating(false);
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
        return <FiClock size={16} />;
      case "processing":
        return <FiPackage size={16} />;
      case "completed":
        return <FiCheck size={16} />;
      case "cancelled":
        return <FiX size={16} />;
      default:
        return <FiClock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Export order details");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <AdminLayout currentPage="view-orders">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FiAlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-600 mb-4">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/admin/view-orders")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <FiArrowLeft size={18} />
              Back to Orders
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="view-orders">
      <div className="min-h-screen min-w-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/admin/view-orders")}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiArrowLeft size={18} />
                  <span className="hidden sm:inline">Back to Orders</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-gray-600">
                    Order placed on {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchOrderDetails}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiRefreshCw size={18} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiPrinter size={18} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Status
                  </h2>
                  <button
                    onClick={() => setEditingStatus(!editingStatus)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiEdit3 size={14} />
                    Edit
                  </button>
                </div>

                {editingStatus ? (
                  <div className="flex items-center gap-3">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {updating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiSave size={16} />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingStatus(false);
                        setNewStatus(order.status);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.productId?.images &&
                        item.productId.images.length > 0 ? (
                          <img
                            src={item.productId.images[0] || "/placeholder.svg"}
                            alt={item.productId?.name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "/placeholder.svg?height=64&width=64";
                            }}
                          />
                        ) : (
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.productId?.name || "Product Name"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.productId?.category?.name || "Uncategorized"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Product ID: {item.productId?.productId || "N/A"}
                        </p>
                      </div>

                      {/* Quantity and Price */}
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                        <p className="font-semibold text-gray-900">
                          ${calculateItemTotal(item.price, item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiUser className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerInfo.firstName}{" "}
                        {order.customerInfo.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Customer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiMail className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerInfo.email}
                      </p>
                      <p className="text-sm text-gray-600">Email</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiPhone className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerInfo.phone}
                      </p>
                      <p className="text-sm text-gray-600">Phone</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {order.customerInfo.deliveryMethod === "delivery" ? (
                      <FiTruck className="text-gray-400" size={18} />
                    ) : (
                      <FiMapPin className="text-gray-400" size={18} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerInfo.deliveryMethod
                          .charAt(0)
                          .toUpperCase() +
                          order.customerInfo.deliveryMethod.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">Delivery Method</p>
                    </div>
                  </div>

                  {order.customerInfo.deliveryMethod === "delivery" && (
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">
                          Delivery Address
                        </p>
                        <div className="text-sm text-gray-600 mt-1">
                          {order.customerInfo.address && (
                            <p>{order.customerInfo.address}</p>
                          )}
                          {order.customerInfo.city && (
                            <p>{order.customerInfo.city}</p>
                          )}
                          <p>{order.customerInfo.country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">Order Date</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiPackage className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">Items</p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiDollarSign className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewOrderDetails;
