"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  MdKitchen, // Kitchen Faucets
  MdBathtub, // Bathroom Vanities
  MdShower, // Smart Shower, Shower Cabinet
  MdTapAndPlay, // Decor Faucets, Freestand Faucets
  MdWc, // Toilet
} from "react-icons/md";
import {
  GiFlowerPot, // Indian Porcelain
  GiWaterDrop, // Kitchen Sink
  GiJewelCrown, // Accessories
} from "react-icons/gi";
import { Droplet, Square } from "lucide-react";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { name: "Indian Porcelain", icon: GiFlowerPot, color: "bg-blue-100" },
    { name: "Bathroom Vanities", icon: MdBathtub, color: "bg-purple-100" },
    { name: "Accessories", icon: GiJewelCrown, color: "bg-green-100" },
    { name: "Kitchen Faucets", icon: Droplet, color: "bg-orange-100" },
    { name: "Kitchen Sink", icon: GiWaterDrop, color: "bg-red-100" },
    { name: "Decor Faucets", icon: Droplet, color: "bg-cyan-100" },
    { name: "Shower Cabinet", icon: MdShower, color: "bg-indigo-100" },
    { name: "Smart Shower", icon: MdShower, color: "bg-pink-100" },
    { name: "Freestand Faucets", icon: Droplet, color: "bg-yellow-100" },
    { name: "Mirrors", icon: Square, color: "bg-gray-100" },
    { name: "Toilet", icon: MdWc, color: "bg-teal-100" },
  ];

  const products = [
    {
      id: 1,
      name: "Premium Bathroom Vanity Set",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.5,
      reviews: 88,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "25% OFF",
    },
    {
      id: 2,
      name: "Modern Kitchen Faucet",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.0,
      reviews: 75,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "28% OFF",
    },
    {
      id: 3,
      name: "Smart Shower System",
      price: 599.99,
      originalPrice: 799.99,
      rating: 4.5,
      reviews: 65,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "25% OFF",
    },
    {
      id: 4,
      name: "Designer Mirror Collection",
      price: 189.99,
      originalPrice: 249.99,
      rating: 4.5,
      reviews: 145,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "24% OFF",
    },
    {
      id: 5,
      name: "Luxury Kitchen Sink",
      price: 349.99,
      originalPrice: 449.99,
      rating: 4.0,
      reviews: 88,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "22% OFF",
    },
    {
      id: 6,
      name: "Indian Porcelain Tiles",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.5,
      reviews: 75,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "25% OFF",
    },
    {
      id: 7,
      name: "Bathroom Accessories Set",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.0,
      reviews: 65,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "20% OFF",
    },
    {
      id: 8,
      name: "Premium Toilet Suite",
      price: 449.99,
      originalPrice: 599.99,
      rating: 4.5,
      reviews: 145,
      image:
        "https://dummyimage.com/400x400/f3f4f6/9ca3af&text=Featured+Product",
      discount: "25% OFF",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));
  };

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
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(4.8)}
                  </div>
                  <span className="text-sm text-gray-600">(4.8)</span>
                </div>
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
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FiChevronLeft size={16} />
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                  >
                    <IconComponent size={24} className="text-gray-700" />
                  </div>
                  <p className="text-xs font-medium text-gray-900">
                    {category.name}
                  </p>
                </div>
              );
            })}
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
                  <div className="text-2xl font-bold text-gray-900">15</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">56</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">04</div>
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

      {/* Explore our Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FiChevronLeft size={16} />
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow group"
              >
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {product.discount}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="px-8 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
