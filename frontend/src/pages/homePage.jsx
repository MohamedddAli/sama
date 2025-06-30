import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import { Link } from "react-router-dom";

const homePage = () => {
  const [categories, setCategories] = useState([]);
  const api = import.meta.env.VITE_API_BASE_URL;

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

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-sky-50 text-sky-900">
      <Header />

      {/* Hero Section */}
      <section className="flex-grow px-4 py-10 bg-sky-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">
            Welcome to Sama International
          </h1>
          <p className="text-lg text-sky-800">
            Discover high-quality bathroom products including sinks, toilets,
            and more — built for elegance, comfort, and durability.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 py-12 bg-white border-t border-sky-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Shop by Category
          </h2>

          {categories.length === 0 ? (
            <p className="text-center text-gray-600">No categories found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  to={`/category/${cat._id}`}
                  key={cat._id}
                  className="block"
                >
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 shadow hover:shadow-md transition cursor-pointer text-center">
                    <h3 className="text-lg font-semibold text-sky-800 mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-600">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default homePage;
