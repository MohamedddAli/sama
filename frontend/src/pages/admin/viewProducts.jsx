"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../components/adminLayout";
import axios from "axios";
import {
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiArchive,
  FiEye,
  FiPackage,
  FiStar,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiHome,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showArchived, setShowArchived] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track current image for each product

  const api = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter and sort products
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || product.category._id === selectedCategory;
      const matchesArchiveFilter = showArchived
        ? product.archived
        : !product.archived;

      return matchesSearch && matchesCategory && matchesArchiveFilter;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "stock":
          aValue = a.stock || 0;
          bValue = b.stock || 0;
          break;
        case "category":
          aValue = a.category.name.toLowerCase();
          bValue = b.category.name.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder, showArchived]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/product`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setActionStatus("error");
      setActionMessage("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${api}/product/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      setActionStatus("success");
      setActionMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      setActionStatus("error");
      setActionMessage("Failed to delete product. Please try again.");
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setActionStatus(null);
      setActionMessage("");
    }, 3000);
  };

  const handleArchive = async (productId, currentArchiveStatus) => {
    const action = currentArchiveStatus ? "unarchive" : "archive";

    try {
      await axios.patch(`${api}/product/${productId}`, {
        archived: !currentArchiveStatus,
      });

      setProducts(
        products.map((product) =>
          product._id === productId
            ? { ...product, archived: !currentArchiveStatus }
            : product
        )
      );

      setActionStatus("success");
      setActionMessage(`Product ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      setActionStatus("error");
      setActionMessage(`Failed to ${action} product. Please try again.`);
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setActionStatus(null);
      setActionMessage("");
    }, 3000);
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", color: "text-red-600 bg-red-100" };
    if (stock <= 10)
      return { text: "Low Stock", color: "text-orange-600 bg-orange-100" };
    return { text: "In Stock", color: "text-green-600 bg-green-100" };
  };

  const calculateFinalPrice = (price, discount) => {
    if (discount > 0) {
      return (price - (price * discount) / 100).toFixed(2);
    }
    return price.toFixed(2);
  };

  const nextImage = (productId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (productId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: prev[productId] > 0 ? prev[productId] - 1 : totalImages - 1,
    }));
  };

  const handleViewProduct = (productId) => {
    console.log("View product:", productId);
    // Add your view product logic here
  };

  const handleEditProduct = (productId) => {
    console.log("Edit product:", productId);
    // Add your edit product logic here
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="view-products">
      <div className="min-h-screen min-w-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Product Management
                </h1>
                <p className="text-gray-600">
                  Manage your product inventory and settings
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiRefreshCw size={18} />
                  Refresh
                </button>
                <button
                  onClick={() => navigate("/admin/add-product")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus size={18} />
                  Add Product
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

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="category">Sort by Category</option>
              </select>

              {/* Sort Order & Archive Toggle */}
              <div className="flex gap-2">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    showArchived
                      ? "bg-orange-100 border-orange-300 text-orange-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showArchived ? "Archived" : "Active"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiPackage size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter((p) => !p.archived).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      products.filter((p) => !p.archived && (p.stock || 0) > 0)
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiAlertTriangle size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      products.filter(
                        (p) =>
                          !p.archived &&
                          (p.stock || 0) > 0 &&
                          (p.stock || 0) <= 10
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiArchive size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter((p) => p.archived).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FiPackage size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first product"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock || 0);
                const finalPrice = calculateFinalPrice(
                  product.price,
                  product.discount || 0
                );

                return (
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                      product.archived ? "opacity-75" : ""
                    }`}
                  >
                    {/* Product Image Slideshow */}
                    <div className="relative h-48 bg-gray-100 group">
                      {product.images && product.images.length > 0 ? (
                        <>
                          {/* Main Image */}
                          <img
                            src={
                              product.images[
                                currentImageIndex[product._id] || 0
                              ] || "/placeholder.svg?height=200&width=200"
                            }
                            alt={`${product.name} - Image ${
                              (currentImageIndex[product._id] || 0) + 1
                            }`}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            onError={(e) => {
                              e.target.src =
                                "/placeholder.svg?height=200&width=200";
                            }}
                          />

                          {/* Image Counter */}
                          {product.images.length > 1 && (
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              {(currentImageIndex[product._id] || 0) + 1} /{" "}
                              {product.images.length}
                            </div>
                          )}

                          {/* Navigation Arrows - Only show if more than 1 image */}
                          {product.images.length > 1 && (
                            <>
                              <button
                                onClick={() =>
                                  prevImage(product._id, product.images.length)
                                }
                                className="absolute left-2 bottom-2 w-8 h-8 bg-white bg-opacity-90 text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                              >
                                <FiChevronLeft size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  nextImage(product._id, product.images.length)
                                }
                                className="absolute right-2 bottom-2 w-8 h-8 bg-white bg-opacity-90 text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                              >
                                <FiChevronRight size={16} />
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <img
                          src="/placeholder.svg?height=200&width=200"
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Existing badges - Updated positioning */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.isFeatured && (
                          <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <FiStar size={12} />
                            Featured
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      {product.archived && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
                            Archived
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
                          {product.name}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2">
                          #{product.productId}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {product.category?.name || "Uncategorized"}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          ${finalPrice}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                        >
                          {stockStatus.text} ({product.stock || 0})
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 overflow-x-auto pb-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product._id);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
                          title="View Details"
                        >
                          <FiEye size={12} />
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product._id);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap flex-shrink-0"
                          title="Edit Product"
                        >
                          <FiEdit3 size={12} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(product._id, product.archived);
                          }}
                          className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded transition-colors whitespace-nowrap flex-shrink-0 ${
                            product.archived
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                          title={
                            product.archived
                              ? "Restore Product"
                              : "Archive Product"
                          }
                        >
                          <FiArchive size={12} />
                          {product.archived ? "Restore" : "Archive"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product._id);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors whitespace-nowrap flex-shrink-0"
                          title="Delete Product"
                        >
                          <FiTrash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewProducts;
