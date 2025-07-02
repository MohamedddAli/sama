"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiX,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // UI states
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track current image for each product

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [
    products,
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
    sortOrder,
    showDiscountedOnly,
    showInStockOnly,
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${api}/product`),
        axios.get(`${api}/category`),
      ]);

      // Filter out archived products
      const activeProducts = productsResponse.data.filter(
        (product) => !product.archived
      );
      setProducts(activeProducts);
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category._id === selectedCategory
      );
    }

    // Price range filter
    if (priceRange.min !== "") {
      filtered = filtered.filter((product) => {
        const finalPrice = getDiscountedPrice(product.price, product.discount);
        return finalPrice >= Number.parseFloat(priceRange.min);
      });
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter((product) => {
        const finalPrice = getDiscountedPrice(product.price, product.discount);
        return finalPrice <= Number.parseFloat(priceRange.max);
      });
    }

    // Discount filter
    if (showDiscountedOnly) {
      filtered = filtered.filter((product) => product.discount > 0);
    }

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = getDiscountedPrice(a.price, a.discount);
          bValue = getDiscountedPrice(b.price, b.discount);
          break;
        case "discount":
          aValue = a.discount || 0;
          bValue = b.discount || 0;
          break;
        case "stock":
          aValue = a.stock || 0;
          bValue = b.stock || 0;
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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getDiscountedPrice = (price, discount) => {
    return price - price * (discount / 100);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setSortOrder("asc");
    setShowDiscountedOnly(false);
    setShowInStockOnly(false);
  };

  // Product image navigation functions
  const nextProductImage = (productId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const prevProductImage = (productId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: prev[productId] > 0 ? prev[productId] - 1 : totalImages - 1,
    }));
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiFilter size={16} />
                Filters
              </button>

              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {viewMode === "grid" ? (
                  <FiList size={16} />
                ) : (
                  <FiGrid size={16} />
                )}
                {viewMode === "grid" ? "List" : "Grid"}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="" className="text-gray-500">
                      Select category
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                        className="text-black"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="name" className="text-black">
                        Name
                      </option>
                      <option value="price" className="text-black">
                        Price
                      </option>
                      <option value="discount" className="text-black">
                        Discount
                      </option>
                      <option value="stock" className="text-black">
                        Stock
                      </option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="asc" className="text-black">
                        ↑ Ascending
                      </option>
                      <option value="desc" className="text-black">
                        ↓ Descending
                      </option>
                    </select>
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Filters
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showDiscountedOnly}
                        onChange={(e) =>
                          setShowDiscountedOnly(e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-black">
                        On Sale Only
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showInStockOnly}
                        onChange={(e) => setShowInStockOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-black">
                        In Stock Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FiX size={16} />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-black">
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black text-lg mb-4">
              No products found matching your criteria
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters to see all products
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {currentProducts.map((product) => {
              const finalPrice = getDiscountedPrice(
                product.price,
                product.discount
              );

              if (viewMode === "list") {
                return (
                  <Link to={`/product/${product._id}`} key={product._id}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0 group">
                          {product.images && product.images.length > 0 ? (
                            <>
                              <img
                                src={
                                  product.images[
                                    currentImageIndex[product._id] || 0
                                  ] || "/placeholder.svg"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg";
                                }}
                              />

                              {/* Image Counter */}
                              {product.images.length > 1 && (
                                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                  {(currentImageIndex[product._id] || 0) + 1} /{" "}
                                  {product.images.length}
                                </div>
                              )}

                              {/* Navigation Arrows */}
                              {product.images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      prevProductImage(
                                        product._id,
                                        product.images.length
                                      );
                                    }}
                                    className="absolute left-1 bottom-1 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-300"
                                  >
                                    <FiChevronLeft size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      nextProductImage(
                                        product._id,
                                        product.images.length
                                      );
                                    }}
                                    className="absolute right-1 bottom-1 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-300"
                                  >
                                    <FiChevronRight size={16} />
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <img
                              src="/placeholder.svg"
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex flex-col gap-1">
                              {product.isFeatured && (
                                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                  <FiStar size={12} />
                                  Featured
                                </span>
                              )}
                              {product.discount > 0 && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  {product.discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {product.category?.name || "Uncategorized"}
                          </p>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-gray-900">
                                {finalPrice.toFixed(2)} EGP
                              </span>
                              {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  {product.price.toFixed(2)} EGP
                                </span>
                              )}
                            </div>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                product.stock > 10
                                  ? "bg-green-100 text-green-800"
                                  : product.stock > 0
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              // Grid view
              return (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow group">
                    <div className="relative mb-4 group">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={
                              product.images[
                                currentImageIndex[product._id] || 0
                              ] || "/placeholder.svg"
                            }
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />

                          {/* Image Counter */}
                          {product.images.length > 1 && (
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              {(currentImageIndex[product._id] || 0) + 1} /{" "}
                              {product.images.length}
                            </div>
                          )}

                          {/* Navigation Arrows */}
                          {product.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  prevProductImage(
                                    product._id,
                                    product.images.length
                                  );
                                }}
                                className="absolute left-2 bottom-2 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-300"
                              >
                                <FiChevronLeft size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  nextProductImage(
                                    product._id,
                                    product.images.length
                                  );
                                }}
                                className="absolute right-2 bottom-2 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-300"
                              >
                                <FiChevronRight size={16} />
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}

                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.isFeatured && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <FiStar size={12} />
                            Featured
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.category?.name || "Uncategorized"}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {finalPrice.toFixed(2)} EGP
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.toFixed(2)} EGP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === pageNumber
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
