"use client";

import { useState } from "react";
import axios from "axios";
import { FiUpload, FiTag, FiImage, FiCheck, FiX } from "react-icons/fi";
const api = import.meta.env.VITE_API_BASE_URL;

const AddCategoryForm = () => {
  const [category, setCategory] = useState({
    name: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!category.name.trim()) newErrors.name = "Category name is required";
    if (!category.image.trim()) newErrors.image = "Image URL is required";

    // Basic URL validation for image
    if (category.image && !isValidUrl(category.image)) {
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
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
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
      await axios.post(`${api}/category`, category);
      setSubmitStatus("success");
      setSubmitMessage("Category added successfully!");

      // Reset form
      setCategory({
        name: "",
        image: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setSubmitMessage(
        err.response?.data?.message ||
          "Failed to add category. Please try again."
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

  return (
    <div className="max-w-2xl mx-auto">
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
        {/* Category Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Category Information
            </h3>
          </div>

          <div className="space-y-6">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Bathroom Vanities, Kitchen Faucets"
                  value={category.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <FiTag
                  className="absolute right-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Choose a clear, descriptive name for your category
              </p>
            </div>

            {/* Category Image URL */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Image URL *
              </label>
              <div className="relative">
                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/category-image.jpg"
                  value={category.image}
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
              <p className="mt-1 text-xs text-gray-500">
                This image will be displayed on the category cards and
                navigation
              </p>

              {/* Image Preview */}
              {category.image && isValidUrl(category.image) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Image Preview:
                  </p>
                  <div className="flex items-center gap-4">
                    {/* Small preview */}
                    <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    {/* Category card preview */}
                    <div className="flex-1 max-w-xs">
                      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden">
                          <img
                            src={category.image || "/placeholder.svg"}
                            alt="Category icon"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.name || "Category Name"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Preview of category card
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Guidelines */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-blue-900">
              Category Guidelines
            </h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                Use clear, descriptive names that customers will easily
                understand
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                Choose high-quality images that represent the category well
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                Recommended image size: 400x400px or larger for best quality
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                Avoid creating duplicate categories with similar names
              </span>
            </li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setCategory({
                name: "",
                image: "",
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
                Adding Category...
              </>
            ) : (
              <>
                <FiUpload size={18} />
                Add Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;
