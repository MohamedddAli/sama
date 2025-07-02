"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/adminLayout";
import AddCategoryForm from "../../components/addCategoryForm";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiImage,
  FiTag,
  FiMoreVertical,
} from "react-icons/fi";

const manageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setActionStatus("error");
      setActionMessage("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${api}/category/${categoryId}`);
      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
      setActionStatus("success");
      setActionMessage("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      setActionStatus("error");
      setActionMessage("Failed to delete category. Please try again.");
    }
    // Clear status after 3 seconds
    setTimeout(() => {
      setActionStatus(null);
      setActionMessage("");
    }, 3000);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleFormSuccess = (newCategory, isEdit = false) => {
    if (isEdit) {
      setCategories(
        categories.map((cat) =>
          cat._id === newCategory._id ? newCategory : cat
        )
      );
      setActionStatus("success");
      setActionMessage("Category updated successfully!");
    } else {
      setCategories([...categories, newCategory]);
      setActionStatus("success");
      setActionMessage("Category added successfully!");
    }
    setShowAddForm(false);
    setEditingCategory(null);
    // Clear status after 3 seconds
    setTimeout(() => {
      setActionStatus(null);
      setActionMessage("");
    }, 3000);
  };

  const toggleDropdown = (categoryId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <AdminLayout currentPage="categories">
        <div className="w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading categories...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="categories">
      <div className="w-full min-w-screen overflow-hidden">
        {/* Header */}
        <div className="mb-8 px-4 max-w-7xl lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">
                Category Management
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Manage your product categories and organization
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={fetchCategories}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm lg:text-base"
              >
                <FiRefreshCw size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingCategory(null);
                }}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
              >
                <FiPlus size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="hidden sm:inline">Add Category</span>
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

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 truncate pr-4">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCategory(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-6">
                <AddCategoryForm
                  editingCategory={editingCategory}
                  onSuccess={handleFormSuccess}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingCategory(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className="mb-8 px-4 lg:px-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 lg:gap-6 text-xs lg:text-sm text-gray-600 flex-shrink-0 max-w-xs">
                <span className="whitespace-nowrap">
                  Total: {categories.length}
                </span>
                <span className="whitespace-nowrap">
                  Showing: {filteredCategories.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid Container */}
        <div className=" flex ">
          <div className="px-4 lg:px-6">
            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12 text-center">
                <FiTag size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 mb-4 text-sm lg:text-base">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Start by adding your first category"}
                </p>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingCategory(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                >
                  <FiPlus size={18} />
                  Add Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 w-full">
                {filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group w-full min-w-[250px]"
                  >
                    {/* Category Image */}
                    <div className="relative h-32 bg-gray-100">
                      {category.image ? (
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full bg-gray-200 flex items-center justify-center ${
                          category.image ? "hidden" : "flex"
                        }`}
                      >
                        <FiImage size={32} className="text-gray-400" />
                      </div>

                      {/* Actions Dropdown */}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(category._id);
                          }}
                          className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiMoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen[category._id] && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(category);
                                  closeAllDropdowns();
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                              >
                                <FiEdit3 size={14} />
                                Edit Category
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(category._id, category.name);
                                  closeAllDropdowns();
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 size={14} />
                                Delete Category
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-center text-sm lg:text-base truncate">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span className="truncate">
                          ID: {category._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default manageCategories;
