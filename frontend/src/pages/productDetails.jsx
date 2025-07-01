"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const api = import.meta.env.VITE_API_BASE_URL;

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${api}/product/${id}`);
        setProduct(res.data);

        // Fetch similar products from the same category
        const relatedRes = await axios.get(
          `${api}/product/category/${res.data.category._id}`
        );
        setRelated(relatedRes.data.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );

  const discountedPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  // Add to cart function
  const addToCart = async () => {
    try {
      await axios.post(`${api}/cart/add`, {
        productId: product._id,
        quantity: Number(quantity),
      });
      alert("🛒 Added to cart!");
    } catch (err) {
      console.error("❌ Failed to add to cart", err);
      alert("❌ Failed to add to cart");
    }
  };

  // Buy now function
  const buyNow = async () => {
    try {
      await axios.post(`${api}/cart/add`, {
        productId: product._id,
        quantity: Number(quantity),
      });
      navigate("/checkout");
    } catch (err) {
      console.error("❌ Failed to process purchase", err);
      alert("❌ Failed to process purchase");
    }
  };

  // Image navigation functions
  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Slideshow navigation for similar products
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(related.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Images */}
            <div className="p-6 lg:p-8 lg:border-r border-gray-100">
              {/* Main Product Image */}
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative group">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[selectedImage]
                      : "/placeholder.svg?height=500&width=500"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation Arrows - Only show if multiple images and on hover */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter - Only show if multiple images */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Dots Indicator - Alternative to thumbnails for many images */}
              {product.images && product.images.length > 6 && (
                <div className="flex justify-center mt-2 space-x-1">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImage ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Product Details */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Product Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Product ID */}
              <div className="text-sm text-gray-500 mb-4">
                Product ID: {product.productId}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                {product.discount > 0 ? (
                  <>
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Selection */}
              <div className="mb-8">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-900 mb-3"
                >
                  Quantity
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-lg text-white rounded-md transition-colors disabled:opacity-50"
                    disabled={product.stock === 0}
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(
                          product.stock,
                          Math.max(1, Number(e.target.value))
                        )
                      )
                    }
                    className="w-16 h-10 text-center border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={true}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-lg text-white rounded-md transition-colors disabled:opacity-50"
                    disabled={product.stock === 0}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button
                  onClick={buyNow}
                  disabled={product.stock === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="w-full border-2 border-gray-900 bg-white text-white hover:bg-gray-900 hover:text-white disabled:border-gray-400 disabled:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Slideshow */}
        {related.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Similar Products
            </h2>

            <div className="relative">
              {/* Navigation Arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md border"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md border"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Products Slideshow */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {related
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((item) => (
                            <div
                              key={item._id}
                              className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
                              onClick={() => navigate(`/product/${item._id}`)}
                            >
                              <div className="aspect-square bg-white overflow-hidden">
                                <img
                                  src={
                                    item.images && item.images.length > 0
                                      ? item.images[0]
                                      : "/placeholder.svg?height=200&width=200"
                                  }
                                  alt={item.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                                  {item.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-bold text-gray-900">
                                      $
                                      {item.discount > 0
                                        ? (
                                            item.price -
                                            item.price * (item.discount / 100)
                                          ).toFixed(2)
                                        : item.price.toFixed(2)}
                                    </p>
                                    {item.discount > 0 && (
                                      <p className="text-sm text-gray-500 line-through">
                                        ${item.price.toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                  {item.stock > 0 ? (
                                    <span className="text-xs text-green-600 font-medium">
                                      In Stock
                                    </span>
                                  ) : (
                                    <span className="text-xs text-red-600 font-medium">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Indicators */}
              {totalSlides > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
