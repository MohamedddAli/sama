"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/adminLayout";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiCalendar,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiFilter,
  FiPlay,
  FiCheckCircle,
} from "react-icons/fi";

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [deleting, setDeleting] = useState({});

  const api = import.meta.env.VITE_API_BASE_URL;

  // Message status options
  const statusOptions = [
    {
      value: "unresolved",
      label: "Unresolved",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: FiX,
      buttonColor: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      value: "in-progress",
      label: "In Progress",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FiPlay,
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    {
      value: "resolved",
      label: "Resolved",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FiCheckCircle,
      buttonColor: "bg-green-600 hover:bg-green-700 text-white",
    },
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/message`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setActionStatus("error");
      setActionMessage("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.emailAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredMessages(filtered);
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [messageId]: true }));
      await axios.patch(`${api}/message/${messageId}/status`, {
        status: newStatus,
      });

      // Update local state
      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? { ...message, status: newStatus }
            : message
        )
      );

      setActionStatus("success");
      setActionMessage("Message status updated successfully!");
    } catch (error) {
      console.error("Error updating message status:", error);
      setActionStatus("error");
      setActionMessage("Failed to update message status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const deleteMessage = async (messageId, senderName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the message from "${senderName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleting((prev) => ({ ...prev, [messageId]: true }));
      await axios.delete(`${api}/message/${messageId}`);

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
      setActionStatus("success");
      setActionMessage("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      setActionStatus("error");
      setActionMessage("Failed to delete message. Please try again.");
    } finally {
      setDeleting((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const getStatusInfo = (status) => {
    return (
      statusOptions.find((option) => option.value === status) ||
      statusOptions[0]
    );
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

  const getStatusCounts = () => {
    const counts = {
      all: messages.length,
      unresolved: messages.filter((m) => m.status === "unresolved").length,
      "in-progress": messages.filter((m) => m.status === "in-progress").length,
      resolved: messages.filter((m) => m.status === "resolved").length,
    };
    return counts;
  };

  // Clear status messages after 3 seconds
  useEffect(() => {
    if (actionStatus) {
      const timer = setTimeout(() => {
        setActionStatus(null);
        setActionMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  if (loading) {
    return (
      <AdminLayout currentPage="messages">
        <div className="min-w-screen w-full overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading messages...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <AdminLayout currentPage="messages">
      <div className="min-w-screen w-full overflow-hidden">
        {/* Header */}
        <div className="mb-8 px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">
                Message Management
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Manage customer messages and inquiries
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={fetchMessages}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm lg:text-base"
              >
                <FiRefreshCw size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {actionStatus && (
          <div className="mb-6 px-4 lg:px-6">
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                actionStatus === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {actionStatus === "success" ? (
                <FiCheck size={20} className="text-green-600 flex-shrink-0" />
              ) : (
                <FiX size={20} className="text-red-600 flex-shrink-0" />
              )}
              <span className="font-medium text-sm lg:text-base break-words">
                {actionMessage}
              </span>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 px-4 lg:px-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              {/* Search */}
              <div className="relative w-full sm:flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" size={16} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value="unresolved">
                    Unresolved ({statusCounts.unresolved})
                  </option>
                  <option value="in-progress">
                    In Progress ({statusCounts["in-progress"]})
                  </option>
                  <option value="resolved">
                    Resolved ({statusCounts.resolved})
                  </option>
                </select>
              </div>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statusOptions.map((status) => {
                const count = statusCounts[status.value];
                const IconComponent = status.icon;
                return (
                  <div
                    key={status.value}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className={`p-3 rounded-lg ${status.color} border`}>
                        <IconComponent size={20} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">{status.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="px-4 lg:px-6">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12 text-center">
              <FiMail size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages found
              </h3>
              <p className="text-gray-600 mb-4 text-sm lg:text-base">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "No messages have been received yet"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMessages.map((message) => {
                      const statusInfo = getStatusInfo(message.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr
                          key={message._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 lg:px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiUser size={16} className="text-blue-600" />
                              </div>
                              <div className="ml-4 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {message.fullName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                  <FiMail size={12} />
                                  <span className="truncate">
                                    {message.emailAddress}
                                  </span>
                                </div>
                                {message.phoneNumber && (
                                  <div className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                    <FiPhone size={12} />
                                    <span className="truncate">
                                      {message.phoneNumber}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {message.subject}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {message.message}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                            >
                              <StatusIcon size={12} />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center gap-1">
                              <FiCalendar size={12} />
                              <span className="truncate">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {/* View Button */}
                              <button
                                onClick={() => viewMessage(message)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                                title="View Message"
                              >
                                <FiEye size={12} />
                                <span className="hidden sm:inline">View</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() =>
                                  deleteMessage(message._id, message.fullName)
                                }
                                disabled={deleting[message._id]}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed"
                                title="Delete Message"
                              >
                                {deleting[message._id] ? (
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FiTrash2 size={12} />
                                )}
                                <span className="hidden sm:inline">
                                  {deleting[message._id]
                                    ? "Deleting..."
                                    : "Delete"}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Message Detail Modal */}
        {showMessageModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 truncate pr-4">
                    Message Details
                  </h2>
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedMessage(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-6">
                <div className="space-y-6">
                  {/* Sender Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Sender Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Full Name
                        </label>
                        <p className="text-gray-900">
                          {selectedMessage.fullName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email Address
                        </label>
                        <p className="text-gray-900 break-all">
                          {selectedMessage.emailAddress}
                        </p>
                      </div>
                      {selectedMessage.phoneNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Phone Number
                          </label>
                          <p className="text-gray-900">
                            {selectedMessage.phoneNumber}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Date Received
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Message</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-3">
                        <label className="text-sm font-medium text-gray-500">
                          Subject
                        </label>
                        <p className="text-gray-900 font-medium">
                          {selectedMessage.subject}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Message
                        </label>
                        <p className="text-gray-900 whitespace-pre-wrap mt-1">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Status & Actions
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {(() => {
                        const statusInfo = getStatusInfo(
                          selectedMessage.status
                        );
                        const StatusIcon = statusInfo.icon;
                        return (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${statusInfo.color}`}
                          >
                            <StatusIcon size={16} />
                            {statusInfo.label}
                          </span>
                        );
                      })()}

                      <div className="flex gap-2">
                        {statusOptions.map((status) => {
                          if (status.value === selectedMessage.status)
                            return null;
                          const StatusIcon = status.icon;
                          return (
                            <button
                              key={status.value}
                              onClick={() => {
                                updateMessageStatus(
                                  selectedMessage._id,
                                  status.value
                                );
                                setSelectedMessage((prev) => ({
                                  ...prev,
                                  status: status.value,
                                }));
                              }}
                              disabled={updatingStatus[selectedMessage._id]}
                              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${status.buttonColor}`}
                            >
                              {updatingStatus[selectedMessage._id] ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <StatusIcon size={14} />
                              )}
                              Mark as {status.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageMessages;
