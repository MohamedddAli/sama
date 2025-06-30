"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUpload,
  FiDollarSign,
  FiTag,
  FiImage,
  FiStar,
  FiCheck,
  FiX,
  FiPackage,
} from "react-icons/fi";

const AddProductForm = () => {
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    price: "",
    discount: 0,
    description: "",
    image: "",
    category: "",
    stock: "",
    isFeatured: false,
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const api = import.meta.env.VITE_API_BASE_URL;

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${api}/category`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!product.productId.trim())
      newErrors.productId = "Product ID is required";
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.price || product.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (product.discount < 0 || product.discount > 100)
      newErrors.discount = "Discount must be between 0-100%";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!product.image.trim()) newErrors.image = "Image URL is required";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.stock || product.stock < 0)
      newErrors.stock = "Stock must be 0 or greater";

    // Basic URL validation for image
    if (product.image && !isValidUrl(product.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "discount" || name === "stock"
          ? Number(value)
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post(`${api}/product`, product);
      setSubmitStatus("success");
      setSubmitMessage("Product added successfully!");

      // Reset form
      setProduct({
        productId: "",
        name: "",
        price: "",
        discount: 0,
        description: "",
        image: "",
        category: "",
        stock: "",
        isFeatured: false,
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setSubmitMessage(
        err.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage("");
      }, 5000);
    }
  };

  const calculateFinalPrice = () => {
    if (product.price && product.discount) {
      return (product.price - (product.price * product.discount) / 100).toFixed(
        2
      );
    }
    return product.price;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Status Message */}
      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            submitStatus === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {submitStatus === "success" ? (
            <FiCheck size={20} className="text-green-600" />
          ) : (
            <FiX size={20} className="text-red-600" />
          )}
          <span className="font-medium">{submitMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product ID */}
            <div>
              <label
                htmlFor="productId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product ID *
              </label>
              <div className="relative">
                <input
                  id="productId"
                  name="productId"
                  type="text"
                  placeholder="e.g., PROD-001"
                  value={product.productId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                    errors.productId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <FiTag
                  className="absolute right-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Premium Bathroom Vanity"
                value={product.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 ${
                  errors.category
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="" disabled className="text-gray-500">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="text-gray-900"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Featured Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Product
              </label>
              <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={product.isFeatured}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="isFeatured"
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <FiStar
                    size={16}
                    className={
                      product.isFeatured ? "text-yellow-500" : "text-gray-400"
                    }
                  />
                  Mark as featured product
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Featured products will be highlighted on the homepage
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pricing Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price *
              </label>
              <div className="relative">
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={product.price}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                    errors.price
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <FiDollarSign
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Discount (%)
              </label>
              <input
                id="discount"
                name="discount"
                type="number"
                placeholder="0"
                value={product.discount}
                onChange={handleChange}
                disabled={isSubmitting}
                min="0"
                max="100"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                  errors.discount
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.discount && (
                <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Stock Quantity *
              </label>
              <div className="relative">
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={product.stock}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                    errors.stock
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <FiPackage
                  className="absolute right-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {product.stock === 0
                  ? "Out of stock"
                  : product.stock > 0 && product.stock <= 10
                  ? "Low stock"
                  : "In stock"}
              </p>
            </div>

            {/* Final Price Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Price
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-gray-400" size={18} />
                  <span className="text-lg font-semibold text-gray-900">
                    {calculateFinalPrice() || "0.00"}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Product Details
            </h3>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your product features, benefits, and specifications..."
                value={product.description}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                  errors.description
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {product.description.length}/500 characters
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Image URL *
              </label>
              <div className="relative">
                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  value={product.image}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                    errors.image
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <FiImage
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}

              {/* Image Preview */}
              {product.image && isValidUrl(product.image) && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Image Preview:
                  </p>
                  <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setProduct({
                productId: "",
                name: "",
                price: "",
                discount: 0,
                description: "",
                image: "",
                category: "",
                stock: "",
                isFeatured: false,
              });
              setErrors({});
            }}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Product...
              </>
            ) : (
              <>
                <FiUpload size={18} />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
