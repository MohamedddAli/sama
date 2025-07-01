"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/header";

import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import {
  MdBathtub, // Bathroom Vanities
  MdShower, // Smart Shower, Shower Cabinet
  MdWc, // Toilet
} from "react-icons/md";

import {
  GiFlowerPot, // Indian Porcelain
  GiWaterDrop, // Kitchen Sink
  GiJewelCrown, // Accessories
} from "react-icons/gi";

import { Droplet, Square } from "lucide-react";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category slideshow state
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [categoriesPerSlide, setCategoriesPerSlide] = useState(6);

  // Product slideshow state
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [productsPerSlide, setProductsPerSlide] = useState(4);

  // Add this state after the existing state declarations (around line 25)
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track current image for each product

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 10,
    minutes: 56,
    seconds: 4,
  });

  // API base URL
  const api = import.meta.env.VITE_API_BASE_URL;

  // Icon mapping for categories (fallback icons)
  const iconMap = {
    "Indian Porcelain": GiFlowerPot,
    "Bathroom Vanities": MdBathtub,
    Accessories: GiJewelCrown,
    "Kitchen Faucets": Droplet,
    "Kitchen Sink": GiWaterDrop,
    "Decor Faucets": Droplet,
    "Shower Cabinet": MdShower,
    "Smart Shower": MdShower,
    "Freestand Faucets": Droplet,
    Mirrors: Square,
    Toilet: MdWc,
  };

  const colorMap = [
    "bg-blue-100",
    "bg-purple-100",
    "bg-green-100",
    "bg-orange-100",
    "bg-red-100",
    "bg-cyan-100",
    "bg-indigo-100",
    "bg-pink-100",
    "bg-yellow-100",
    "bg-gray-100",
    "bg-teal-100",
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Dynamic timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCategoriesPerSlide(2);
        setProductsPerSlide(1);
      } else if (width < 768) {
        setCategoriesPerSlide(3);
        setProductsPerSlide(2);
      } else if (width < 1024) {
        setCategoriesPerSlide(4);
        setProductsPerSlide(3);
      } else {
        setCategoriesPerSlide(6);
        setProductsPerSlide(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch categories and featured products in parallel
      const [categoriesResponse, productsResponse] = await Promise.all([
        axios.get(`${api}/category`),
        axios.get(`${api}/product`),
      ]);

      setCategories(categoriesResponse.data);

      // Filter featured products
      const featured = productsResponse.data.filter(
        (product) => product.isFeatured && !product.archived
      );
      setFeaturedProducts(featured);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = (price, discount) => {
    if (discount > 0) {
      return (price - (price * discount) / 100).toFixed(2);
    }
    return price.toFixed(2);
  };

  // Category slideshow functions
  const nextCategorySlide = () => {
    const maxSlide = Math.ceil(categories.length / categoriesPerSlide) - 1;
    setCurrentCategorySlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevCategorySlide = () => {
    const maxSlide = Math.ceil(categories.length / categoriesPerSlide) - 1;
    setCurrentCategorySlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  // Product slideshow functions
  const nextProductSlide = () => {
    const maxSlide = Math.ceil(featuredProducts.length / productsPerSlide) - 1;
    setCurrentProductSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevProductSlide = () => {
    const maxSlide = Math.ceil(featuredProducts.length / productsPerSlide) - 1;
    setCurrentProductSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
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

  // Get visible categories for current slide
  const getVisibleCategories = () => {
    const startIndex = currentCategorySlide * categoriesPerSlide;
    return categories.slice(startIndex, startIndex + categoriesPerSlide);
  };

  // Get visible products for current slide
  const getVisibleProducts = () => {
    const startIndex = currentProductSlide * productsPerSlide;
    return featuredProducts.slice(startIndex, startIndex + productsPerSlide);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-600 font-medium">
                  Premium Quality
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Transform Your
                <br />
                Bathroom & Kitchen
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product"
                  alt="Premium Bathroom Suite"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  From 1500 EGP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Browse by Category
              </h2>
            </div>
            {categories.length > categoriesPerSlide && (
              <div className="flex gap-2">
                <button
                  onClick={prevCategorySlide}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={nextCategorySlide}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentCategorySlide * 100}%)`,
              }}
            >
              {Array.from({
                length: Math.ceil(categories.length / categoriesPerSlide),
              }).map((_, slideIndex) => {
                // Create a continuous array by repeating categories to fill empty spaces
                const getCategoriesForSlide = (slideIndex) => {
                  const startIndex = slideIndex * categoriesPerSlide;
                  const categoriesForSlide = [];

                  for (let i = 0; i < categoriesPerSlide; i++) {
                    const categoryIndex = (startIndex + i) % categories.length;
                    categoriesForSlide.push(categories[categoryIndex]);
                  }

                  return categoriesForSlide;
                };

                const slideCategories = getCategoriesForSlide(slideIndex);

                return (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div
                      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${categoriesPerSlide} gap-6`}
                    >
                      {slideCategories.map((category, index) => {
                        const IconComponent =
                          iconMap[category.name] || GiFlowerPot;
                        const colorClass = colorMap[index % colorMap.length];

                        return (
                          <div
                            key={`${category._id}-${slideIndex}-${index}`}
                            className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer group"
                          >
                            <div className="relative mb-4">
                              {category.image ? (
                                <img
                                  src={category.image || "/placeholder.svg"}
                                  alt={category.name}
                                  className="w-20 h-20 object-cover rounded-lg mx-auto group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-20 h-20 ${colorClass} rounded-lg flex items-center justify-center mx-auto ${
                                  category.image ? "hidden" : "flex"
                                }`}
                              >
                                <IconComponent
                                  size={32}
                                  className="text-gray-700"
                                />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {category.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhance Your Experience Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-600 font-medium">Special Offer</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Upgrade Your
                <br />
                Home Experience
              </h2>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.days.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
                Shop Sale Items!
              </button>
            </div>
            <div className="relative">
              <img
                src="https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product"
                alt="Featured Product"
                className="w-full max-w-md mx-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>
            {featuredProducts.length > productsPerSlide && (
              <div className="flex gap-2">
                <button
                  onClick={prevProductSlide}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={nextProductSlide}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {featuredProducts.length > 0 ? (
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentProductSlide * 100}%)`,
                }}
              >
                {Array.from({
                  length: Math.ceil(featuredProducts.length / productsPerSlide),
                }).map((_, slideIndex) => {
                  // Create a continuous array by repeating products to fill empty spaces
                  const getProductsForSlide = (slideIndex) => {
                    const startIndex = slideIndex * productsPerSlide;
                    const productsForSlide = [];

                    for (let i = 0; i < productsPerSlide; i++) {
                      const productIndex =
                        (startIndex + i) % featuredProducts.length;
                      productsForSlide.push(featuredProducts[productIndex]);
                    }

                    return productsForSlide;
                  };

                  const slideProducts = getProductsForSlide(slideIndex);

                  return (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${productsPerSlide} gap-6`}
                      >
                        {slideProducts.map((product, index) => {
                          const finalPrice = calculateFinalPrice(
                            product.price,
                            product.discount || 0
                          );

                          return (
                            <div
                              key={`${product._id}-${slideIndex}-${index}`}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow group"
                            >
                              <div className="relative mb-4 group">
                                {product.images && product.images.length > 0 ? (
                                  <>
                                    {/* Main Image */}
                                    <img
                                      src={
                                        product.images[
                                          currentImageIndex[product._id] || 0
                                        ] ||
                                        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Product"
                                      }
                                      alt={`${product.name} - Image ${
                                        (currentImageIndex[product._id] || 0) +
                                        1
                                      }`}
                                      className="w-full h-48 object-cover rounded-lg transition-opacity duration-300"
                                      onError={(e) => {
                                        e.target.src =
                                          "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Product";
                                      }}
                                    />

                                    {/* Image Counter */}
                                    {product.images.length > 1 && (
                                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                        {(currentImageIndex[product._id] || 0) +
                                          1}{" "}
                                        / {product.images.length}
                                      </div>
                                    )}

                                    {/* Navigation Arrows - Only show if more than 1 image */}
                                    {product.images.length > 1 && (
                                      <>
                                        <button
                                          onClick={() =>
                                            prevProductImage(
                                              product._id,
                                              product.images.length
                                            )
                                          }
                                          className="absolute left-2 bottom-2 p-1 text-white-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-300"
                                        >
                                          <FiChevronLeft size={16} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            nextProductImage(
                                              product._id,
                                              product.images.length
                                            )
                                          }
                                          className="absolute right-2 bottom-2 p-1 text-white-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-300"
                                        >
                                          <FiChevronRight size={16} />
                                        </button>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <img
                                    src="https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Product"
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
                              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {product.category?.name || "Uncategorized"}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {finalPrice} EGP
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
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No featured products available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/shop">
              <button className="px-8 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
